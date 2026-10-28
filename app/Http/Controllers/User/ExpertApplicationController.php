<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Mail\ExpertApplicationSubmitted;
use App\Models\ExpertApplication;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ExpertApplicationController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user();

        // Admin / pakar tidak perlu mengajukan lagi
        if ($user && (int) $user->role_id !== 3) {
            return redirect()->route('dashboard');
        }

        $latest = $user?->expertApplications()->latest()->first();

        return Inertia::render('expert-application/create', [
            'isGuest'  => $user === null,
            'latest'   => $latest ? $latest->only(['status', 'rejection_reason']) : null,
            'defaults' => [
                'full_name' => $user?->name ?? '',
                'email'     => $user?->email ?? '',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user && (int) $user->role_id !== 3) {
            return redirect()->route('dashboard');
        }

        if ($user && $user->expertApplications()->where('status', 'pending')->exists()) {
            return back()->withErrors(['general' => 'Pengajuan Anda masih menunggu verifikasi admin.']);
        }

        $rules = [
            'full_name'   => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'bio'         => 'required|string|min:20|max:2000',
            'credential'  => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ];

        if (!$user) {
            // Tamu: akun dibuat sekaligus
            $rules['email']    = 'required|email|max:255|unique:users,email';
            $rules['password'] = ['required', 'confirmed', Password::defaults()];
        }

        $data = $request->validate($rules, [
            'email.unique' => 'Email sudah terdaftar. Silakan masuk terlebih dahulu, lalu ajukan dari akun Anda.',
        ]);

        // Untuk user yang sudah login, email selalu diambil dari akunnya
        $email = $user ? $user->email : $data['email'];

        // Disimpan di disk private (bukan public) karena dokumen sensitif
        $path = $request->file('credential')->store('credentials');

        try {
            [$account, $application] = DB::transaction(function () use ($user, $data, $email, $path) {
                $account = $user;

                if (!$account) {
                    $account = User::create([
                        'name'      => $data['full_name'],
                        'email'     => $email,
                        'password'  => Hash::make($data['password']),
                        'role_id'   => 3,
                        'is_active' => 1,
                    ]);
                }

                $application = ExpertApplication::create([
                    'user_id'         => $account->id,
                    'full_name'       => $data['full_name'],
                    'email'           => $email,
                    'institution'     => $data['institution'],
                    'bio'             => $data['bio'],
                    'credential_path' => $path,
                    'status'          => 'pending',
                ]);

                return [$account, $application];
            });
        } catch (\Throwable $e) {
            Storage::delete($path); // jangan tinggalkan file yatim
            throw $e;
        }

        // Email konfirmasi "pengajuan diterima". Gagal kirim tidak membatalkan pengajuan.
        try {
            Mail::to($email)->send(new ExpertApplicationSubmitted($application));
        } catch (\Throwable $e) {
            Log::error('Gagal kirim email konfirmasi pengajuan pakar: ' . $e->getMessage());
        }

        if (!$user) {
            // Kirim email verifikasi akun, lalu login otomatis
            try {
                event(new Registered($account));
            } catch (\Throwable $e) {
                Log::error('Gagal kirim email verifikasi akun: ' . $e->getMessage());
            }

            Auth::login($account);
            $request->session()->regenerate();

            return redirect()->route('verification.notice')
                ->with('success', 'Pengajuan terkirim. Verifikasi email Anda, lalu tunggu hasil review admin.');
        }

        return back()->with('success', 'Pengajuan terkirim. Kami akan mengabari lewat email setelah diverifikasi admin.');
    }
}