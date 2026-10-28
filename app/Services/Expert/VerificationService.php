<?php

namespace App\Services\Expert;

use App\Models\Observation;
use App\Models\Verification;
use App\Models\ObservationPhoto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class VerificationService
{
    public function processVerification(array $data, int $expertId)
    {
        return DB::transaction(function () use ($data, $expertId) {
            $this->validateVerification($data['observation_id']);

            $observation = Observation::with('photos')->findOrFail($data['observation_id']);

            // ==========================================
            // 🚨 JIKA DITOLAK: HAPUS SEMUA SAMPAI BERSIH
            // ==========================================
            if (!$data['is_valid']) {
                // ✅ Ubah status jadi rejected, JANGAN hapus
                $observation->status = 'rejected';
                $observation->save();

                // Simpan record verifikasi penolakan
                Verification::create([
                    'observation_id' => $data['observation_id'],
                    'expert_id'      => $expertId,
                    'is_valid'       => false,
                    'notes'          => $data['notes'] ?? null,
                ]);

                return true;
            }

            // ==========================================
            // 🚨 JIKA DISETUJUI: SIMPAN DATA
            // ==========================================
            $observation->status = 'verified';
            if (!empty($data['species_id'])) {
                $observation->species_id = $data['species_id'];
            }
            $observation->save();

            // Buat record Verifikasi
            $verification = Verification::create([
                'observation_id' => $data['observation_id'],
                'expert_id' => $expertId,
                'is_valid' => true,
                'notes' => $data['notes'] ?? null,
            ]);

            return true;
        });
    }

    public function updateVerification(int $verificationId, array $data, int $expertId): Verification
    {
        return DB::transaction(function () use ($verificationId, $data, $expertId) {
            $verification = Verification::where('id', $verificationId)
                ->where('expert_id', $expertId)
                ->firstOrFail();

            $oldData = [
                'is_valid' => $verification->is_valid,
                'notes' => $verification->notes,
            ];

            $verification->update([
                'is_valid' => $data['is_valid'] ?? $verification->is_valid,
                'notes' => $data['notes'] ?? $verification->notes,
                'updated_at' => now(),
            ]);

            if (isset($data['is_valid']) && $data['is_valid'] !== $oldData['is_valid']) {
                $observation = Observation::findOrFail($verification->observation_id);
                $observation->status = $data['is_valid'] ? 'verified' : 'rejected';
                $observation->save();
            }

            return $verification;
        });
    }

    public function getPendingObservations(array $filters = [])
    {
        $query = Observation::with(['user', 'photos', 'species'])
            ->where('status', 'pending');

        if (! empty($filters['species_id'])) {
            $query->where('species_id', $filters['species_id']);
        }
        if (! empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (! empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->latest()->get();
    }

    public function getExpertStatistics(int $expertId): array
    {
        $verifications = Verification::where('expert_id', $expertId);

        return [
            'total' => $verifications->count(),
            'verified' => (clone $verifications)->where('is_valid', true)->count(),
            'rejected' => (clone $verifications)->where('is_valid', false)->count(),
            'today' => (clone $verifications)->whereDate('created_at', today())->count(),
            'this_week' => (clone $verifications)->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'this_month' => (clone $verifications)->whereMonth('created_at', now()->month)->count(),
        ];
    }

    private function validateVerification(int $observationId): void
    {
        $observation = Observation::find($observationId);

        if (! $observation) {
            throw ValidationException::withMessages(['observation_id' => 'Observasi tidak ditemukan.']);
        }
        if ($observation->status !== 'pending') {
            throw ValidationException::withMessages(['observation_id' => 'Observasi ini sudah diverifikasi sebelumnya.']);
        }
    }
}
