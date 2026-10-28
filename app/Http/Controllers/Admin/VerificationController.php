<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExpertApplication;
use App\Services\Admin\VerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function __construct(protected VerificationService $service) {}

    public function index(Request $request)
    {
        return Inertia::render('admin/verifikasi/index', [
            'applications' => $this->service->getApplications($request->search, $request->status),
            'filters'      => $request->only(['search', 'status']),
        ]);
    }

    public function verify(Request $request, ExpertApplication $application)
    {
        $data = $request->validate([
            'status'           => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:1000',
        ]);

        if ($application->status !== 'pending') {
            return back()->withErrors(['general' => 'Pengajuan ini sudah diproses sebelumnya.']);
        }

        $this->service->process($application, $data['status'], $data['rejection_reason'] ?? null);

        return back()->with('success', $data['status'] === 'approved'
            ? 'Pakar disetujui dan email pemberitahuan dikirim.'
            : 'Pengajuan ditolak dan email pemberitahuan dikirim.');
    }

    public function downloadCredential(ExpertApplication $application)
    {
        abort_unless(
            $application->credential_path && Storage::exists($application->credential_path),
            404
        );

        return Storage::download($application->credential_path);
    }
}