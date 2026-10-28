<?php

namespace App\Services\Admin;

use App\Mail\ExpertApplicationApproved;
use App\Mail\ExpertApplicationRejected;
use App\Models\ExpertApplication;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class VerificationService
{
    public function getApplications(?string $search = null, ?string $status = null)
    {
        return ExpertApplication::with('user:id,name,email')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($w) use ($search) {
                    $w->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('institution', 'like', "%{$search}%");
                });
            })
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function process(ExpertApplication $application, string $status, ?string $reason = null): void
    {
        DB::transaction(function () use ($application, $status, $reason) {
            $application->update([
                'status'           => $status,
                'rejection_reason' => $status === 'rejected' ? $reason : null,
                'reviewed_at'      => now(),
            ]);

            if ($status === 'approved') {
                $application->user->update([
                    'role_id'            => 2, // expert
                    'expert_verified_at' => now(),
                ]);
            }
        });

        // Email dikirim setelah transaksi sukses; gagal kirim tidak membatalkan keputusan admin.
        try {
            Mail::to($application->email)->send(
                $status === 'approved'
                    ? new ExpertApplicationApproved($application)
                    : new ExpertApplicationRejected($application)
            );
        } catch (\Throwable $e) {
            Log::error('Gagal kirim email hasil verifikasi pakar: ' . $e->getMessage());
        }
    }
}