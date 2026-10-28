<?php

namespace App\Services\User;

use App\Models\Observation;
use App\Models\ObservationPhoto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ObservationService
{
    /**
     * Simpan observasi beserta foto utamanya.
     */
    public function store(array $data, int $userId): Observation
    {
        return DB::transaction(function () use ($data, $userId) {
            $observation = Observation::create([
                'user_id' => $userId,
                // PERBAIKAN: Menambahkan field yang sebelumnya terlupakan & field AI
                ...Arr::only($data, [
                    'category',
                    'species_id',
                    'latitude',
                    'longitude',
                    'notes',
                    'observation_date',
                    'species_name_ai', // Menyimpan hasil tebakan AI
                    'ai_confidence',
                    'status',
                ]),
            ]);

            if (($data['photo'] ?? null) instanceof UploadedFile) {
                $this->uploadPhoto($data['photo'], $observation->id, true);
            }

            return $observation;
        });
    }

    /**
     * Upload file foto untuk observasi.
     */
    public function uploadPhoto(UploadedFile $file, int $observationId, bool $isPrimary = true): ObservationPhoto
    {
        $filePath = $file->store('observations', 'public');

        return ObservationPhoto::create([
            'observation_id' => $observationId,
            'file_path' => $filePath,
            'is_primary' => $isPrimary,
        ]);
    }

    /**
     * Hapus satu foto observasi + file fisik storage.
     */
    public function deletePhoto(ObservationPhoto $photo): bool
    {
        if ($photo->file_path) {
            Storage::disk('public')->delete($photo->file_path);
        }

        return (bool) $photo->delete();
    }

    /**
     * Hapus observasi beserta semua foto/folder yang terkait.
     */
    public function delete(Observation $observation): bool
    {
        return DB::transaction(function () use ($observation) {
            $observation->loadMissing('photos');

            foreach ($observation->photos as $photo) {
                $this->deletePhoto($photo);
            }

            return (bool) $observation->delete();
        });
    }
}