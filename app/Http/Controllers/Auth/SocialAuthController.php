<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * Mengarahkan pengguna ke halaman login Google.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Menangkap balasan dari Google setelah pengguna login.
     */
    public function handleGoogleCallback()
    {
        try {
            // Mendapatkan data pengguna dari Google
            $googleUser = Socialite::driver('google')->user();

            // Cek apakah pengguna dengan email ini sudah ada di database
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Jika belum ada, buat akun baru secara otomatis
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => bcrypt(Str::random(16)), // Password acak karena login via Google
                    'role_id' => 3, // Asumsikan ID 3 adalah untuk Citizen Scientist/Pengguna Umum
                    'is_active' => 1,
                    'google_id' => $googleUser->getId(),
                    'auth_provider' => 'google',
                ]);
                
                // Menandai bahwa email sudah terverifikasi otomatis (karena dari Google)
                $user->markEmailAsVerified();
            } else {
                // Jika email sudah terdaftar sebelumnya tapi belum sinkron dengan Google ID
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'auth_provider' => 'google'
                    ]);
                }
            }

            // Login otomatis ke dalam sistem
            Auth::login($user, true);

            // Arahkan ke dashboard React/Inertia
            return redirect()->intended('/dashboard');

        } catch (\Exception $e) {
            // Jika terjadi error, kembalikan ke halaman login dengan pesan error
            return redirect('/login')->withErrors(['oauth' => 'Terjadi kesalahan saat login dengan Google: ' . $e->getMessage()]);
        }
    }
}