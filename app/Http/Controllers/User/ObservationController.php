<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Observation;
use App\Models\Species;
use App\Services\User\ObservationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ObservationController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        return Inertia::render('user/observasi', [
            'observations' => Observation::with(['photos', 'species'])
                ->where('user_id', $userId)
                ->latest()
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('user/observasi/buat', [
            'speciesList' => Species::select('id', 'scientific_name', 'category')->get(),
        ]);
    }

    public function history()
    {
        $userId = Auth::id();
        return Inertia::render('user/observasi/riwayat', [
            'observations' => Observation::with(['photos', 'species'])
                ->where('user_id', $userId)
                ->whereIn('status', ['draft', 'pending', 'rejected'])
                ->latest()
                ->get(),
        ]);
    }

    public function contributions()
    {
        $userId = Auth::id();
        return Inertia::render('user/kontribusi', [
            'observations' => Observation::with(['photos', 'species', 'verification'])
                ->where('user_id', $userId)
                ->where('status', 'verified')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request, ObservationService $observationService)
    {
        $request->validate([
            // DIUBAH: domain hewan endemik (sebelumnya: auto,hoya,plankton,kayu)
            'category'         => 'required|in:auto,mamalia,burung,reptil,amfibi',
            'latitude'         => 'required|numeric',
            'longitude'        => 'required|numeric',
            'photo'            => 'required|image|mimes:jpeg,png,jpg|max:10240',
            'notes'            => 'nullable|string',
            'observation_date' => 'nullable|date',
            'status'           => 'required|in:draft,pending',
        ]);

        try {
            $data  = $request->all();
            $photo = $request->file('photo');
            $aiPrediction = null;

            if ($request->status !== 'draft') {
                try {
                    $response = Http::timeout(30)->attach(
                        'image',
                        file_get_contents($photo->getRealPath()),
                        $photo->getClientOriginalName()
                    )->post('http://127.0.0.1:5000/predict', [
                        'category' => $request->category,
                    ]);

                    if ($response->successful()) {
                        $json = $response->json();
                        $pred = $json['prediction'] ?? null;

                        // Rapikan format: "Bubalus_depressicornis" → "Bubalus depressicornis"
                        $aiPrediction          = $pred ? str_replace('_', ' ', $pred) : null;
                        $data['species_name_ai'] = $aiPrediction;

                        // Selalu update kategori dari AI response (tidak hanya saat
                        // 'auto', agar kategori tidak stuck di 'auto')
                        if (!empty($json['category'])) {
                            $data['category'] = $json['category'];
                        }
                    } else {
                        Log::error('API AI Gagal merespon: ' . $response->body());
                    }
                } catch (\Exception $e) {
                    Log::error('Koneksi AI gagal: ' . $e->getMessage());
                    $data['species_name_ai'] = 'Gagal mendeteksi (Server AI Mati)';
                }
            } else {
                // Draft → AI tidak dijalankan, biarkan kategori apa adanya
                $data['species_name_ai'] = null;
            }

            $observationService->store($data, Auth::id());

            if ($request->status === 'draft') {
                $pesan = "Observasi berhasil disimpan sebagai Draft.";
            } else {
                $pesan = $aiPrediction
                    ? "Observasi terkirim! AI mendeteksi sebagai: " . $aiPrediction
                    : "Observasi terkirim, menunggu verifikasi pakar.";
            }

            return redirect('/user/observasi/riwayat')->with('success', $pesan);

        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Gagal menyimpan observasi: ' . $e->getMessage());
        }
    }

    public function show(Observation $observation)
    {
        if (!$this->isOwner($observation)) abort(403, 'Akses ditolak.');
        return Inertia::render('User/Observation/Show', [
            'observation' => $observation->load(['photos', 'species', 'verification']),
        ]);
    }

    public function destroy(Observation $observation, ObservationService $observationService)
    {
        if (!$this->isOwner($observation) || !in_array($observation->status, ['draft', 'pending'])) {
            abort(403, 'Ditolak.');
        }
        try {
            $observationService->delete($observation);
            return redirect()->back()->with('success', 'Data observasi berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus observasi: ' . $e->getMessage());
        }
    }

    public function edit(Observation $observation)
    {
        if (!$this->isOwner($observation) || !in_array($observation->status, ['draft', 'pending'])) {
            abort(403, 'Ditolak.');
        }
        return Inertia::render('user/observasi/edit', [
            'observation' => $observation->load('photos'),
            'speciesList' => Species::select('id', 'scientific_name', 'category')->get(),
        ]);
    }

    public function update(Request $request, Observation $observation, ObservationService $observationService)
    {
        if (!$this->isOwner($observation) || !in_array($observation->status, ['draft', 'pending'])) {
            abort(403, 'Ditolak.');
        }

        $request->validate([
            // DIUBAH: domain hewan endemik (sebelumnya: auto,hoya,plankton,kayu)
            'category'         => 'sometimes|in:auto,mamalia,burung,reptil,amfibi',
            'latitude'         => 'sometimes|required|numeric',
            'longitude'        => 'sometimes|required|numeric',
            'photo'            => 'nullable|image|mimes:jpeg,png,jpg|max:10240',
            'notes'            => 'nullable|string',
            'status'           => 'required|in:draft,pending',
            'observation_date' => 'nullable|date',
        ]);

        try {
            $dataToUpdate = $request->only([
                'category', 'latitude', 'longitude',
                'notes', 'status', 'observation_date',
            ]);

            $kategori     = $request->category ?? $observation->category;
            $fileContents = null;
            $photoName    = 'image.jpg';

            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                $photo        = $request->file('photo');
                $fileContents = file_get_contents($photo->getRealPath());
                $photoName    = $photo->getClientOriginalName();

                // Hapus foto lama & simpan foto baru
                foreach ($observation->photos as $oldPhoto) {
                    $observationService->deletePhoto($oldPhoto);
                }
                $observationService->uploadPhoto($photo, $observation->id);

            } elseif ($request->status === 'pending' && $observation->status === 'draft') {
                // Submit Draft → Pending tanpa foto baru: ambil foto lama dari storage
                $oldPhoto = $observation->photos->first();
                if ($oldPhoto && Storage::disk('public')->exists($oldPhoto->file_path)) {
                    $fileContents = Storage::disk('public')->get($oldPhoto->file_path);
                    $photoName    = basename($oldPhoto->file_path);
                }
            }

            // Jalankan AI hanya saat status dikirim ke pending
            if ($request->status === 'pending' && $fileContents) {
                try {
                    $response = Http::timeout(30)->attach(
                        'image', $fileContents, $photoName
                    )->post('http://127.0.0.1:5000/predict', [
                        'category' => $kategori,
                    ]);

                    if ($response->successful()) {
                        $json = $response->json();
                        $pred = $json['prediction'] ?? null;

                        $dataToUpdate['species_name_ai'] = $pred
                            ? str_replace('_', ' ', $pred)
                            : null;

                        // Selalu update kategori dari AI response (mengganti 'auto'
                        // dengan kategori nyata hasil deteksi AI)
                        if (!empty($json['category'])) {
                            $dataToUpdate['category'] = $json['category'];
                        }
                    } else {
                        Log::error('API AI Gagal merespon saat update: ' . $response->body());
                    }
                } catch (\Exception $e) {
                    Log::error('Koneksi AI gagal saat update: ' . $e->getMessage());
                }
            }

            $observation->update($dataToUpdate);
            return redirect('/user/observasi/riwayat')->with('success', 'Observasi berhasil diperbarui.');

        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Gagal memperbarui: ' . $e->getMessage());
        }
    }

    private function isOwner(Observation $observation): bool
    {
        return $observation->user_id === Auth::id();
    }
}