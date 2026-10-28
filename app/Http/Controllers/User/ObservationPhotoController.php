<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Observation;
use App\Models\ObservationPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
// Perbaikan import BinaryFileResponse
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse; // Tambahkan ini jika menggunakan Inertia

class ObservationPhotoController extends Controller
{
    /**
     * Gunakan return type 'mixed' atau 'Symfony\Component\HttpFoundation\Response'
     */
    public function download(ObservationPhoto $observationPhoto)
    {
        if (! $this->isOwner($observationPhoto)) {
            abort(403);
        }

        // Pastikan path benar-benar mengarah ke file di storage/app/public
        $filePath = storage_path('app/public/'.$observationPhoto->file_path);

        if (! file_exists($filePath)) {
            abort(404, 'File fisik tidak ditemukan di server.');
        }

        // Menggunakan response download standar Laravel yang lebih kompatibel
        return response()->download($filePath);
    }

    public function store(Request $request, int $observationId): RedirectResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:10240',
        ]);

        $observation = Observation::where('user_id', Auth::id())
            ->where('status', 'pending')
            ->findOrFail($observationId);

        try {
            $path = $request->file('photo')->store('observations', 'public');

            ObservationPhoto::create([
                'observation_id' => $observation->id,
                'file_path' => $path,
                'is_primary' => false, // Pastikan default value ada
            ]);

            return redirect()->back()->with('success', 'Foto berhasil ditambahkan.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal: '.$e->getMessage());
        }
    }

    public function destroy(ObservationPhoto $observationPhoto): RedirectResponse
    {
        if (! $this->isOwner($observationPhoto)) {
            abort(403);
        }

        if (! $this->isPending($observationPhoto)) {
            return redirect()->back()->with('error', 'Data sudah diverifikasi.');
        }

        try {
            // Hapus fisik file
            Storage::disk('public')->delete($observationPhoto->file_path);

            // Hapus record
            $observationPhoto->delete();

            return redirect()->back()->with('success', 'Foto berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus.');
        }
    }

    // --- Helper Methods ---

    private function isOwner(ObservationPhoto $observationPhoto): bool
    {
        // Gunakan optional() untuk menghindari error jika relasi null
        return optional($observationPhoto->observation)->user_id === Auth::id();
    }

    private function isPending(ObservationPhoto $observationPhoto): bool
    {
        return optional($observationPhoto->observation)->status === 'pending';
    }
}
