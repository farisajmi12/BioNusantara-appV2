import DashboardLayout from '@/layouts/dashboard-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';

type Observation = {
    id: number;
    status: 'draft' | 'pending' | 'rejected' | string;
    category?: string | null;
    species_name_ai?: string | null;
    latitude: string;
    longitude: string;
    created_at: string;
    photos?: { file_path: string }[];
    species?: { scientific_name: string } | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Riwayat Observasi', href: '/user/observasi/riwayat' },
];

const statusLabel: Record<string, string> = {
    draft: 'Draft',
    pending: 'Terkirim',
    rejected: 'Ditolak',
};

const statusClass: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    pending: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
};

export default function UserObservationHistory({
    observations,
}: {
    observations: Observation[];
}) {
    const handleDelete = (id: number) => {
        if (
            confirm(
                'Yakin ingin menghapus draf ini? Data yang dihapus tidak bisa dikembalikan.',
            )
        ) {
            router.delete(`/user/observasi/${id}`);
        }
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Observasi" />

            <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                <h1 className="text-xl font-semibold">Riwayat Observasi</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Menampilkan observasi status <strong>Draft</strong>,{' '}
                    <strong>Terkirim</strong>, dan <strong>Ditolak</strong>.
                    (Data yang Tervalidasi akan pindah ke menu Kontribusi).
                </p>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-180 text-left text-sm">
                        <thead>
                            <tr className="border-b border-sidebar-border/60 text-neutral-500">
                                <th className="px-3 py-3 font-medium">ID</th>
                                <th className="px-3 py-3 font-medium">Foto</th>
                                <th className="px-3 py-3 font-medium">
                                    Informasi Objek
                                </th>
                                <th className="px-3 py-3 font-medium">
                                    Koordinat
                                </th>
                                <th className="px-3 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-3 py-3 text-right font-medium">
                                    Aksi / Keterangan
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {observations.length === 0 ? (
                                <tr>
                                    <td
                                        className="px-3 py-6 text-center text-neutral-400"
                                        colSpan={6}
                                    >
                                        Belum ada data riwayat observasi.
                                    </td>
                                </tr>
                            ) : (
                                observations.map((observation) => (
                                    <tr
                                        key={observation.id}
                                        className="border-b border-sidebar-border/40"
                                    >
                                        <td className="px-3 py-3">
                                            #{observation.id}
                                        </td>

                                        <td className="px-3 py-3">
                                            {observation.photos &&
                                            observation.photos.length > 0 ? (
                                                <img
                                                    src={`/storage/${observation.photos[0].file_path}`}
                                                    alt="Foto Observasi"
                                                    className="h-12 w-12 rounded-md border object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs text-neutral-400">
                                                    Tanpa Foto
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-3 py-3">
                                            <span className="text-xs font-bold text-neutral-500 uppercase">
                                                {/* PERBAIKAN: Rapikan tampilan Kategori Auto */}
                                                Kategori:{' '}
                                                {observation.category === 'auto'
                                                    ? observation.status ===
                                                      'draft'
                                                        ? 'Auto Detect' // Draft = belum diproses AI, wajar masih 'auto'
                                                        : 'Mendeteksi...' // Pending = sedang/sudah diproses AI
                                                    : observation.category
                                                      ? observation.category
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        observation.category.slice(
                                                            1,
                                                        )
                                                      : '-'}
                                            </span>
                                            <br />
                                            {observation.status === 'draft' ? (
                                                <span className="font-medium text-neutral-400 italic">
                                                    Belum dianalisis AI
                                                </span>
                                            ) : (
                                                <span className="font-semibold text-blue-600">
                                                    Prediksi AI:{' '}
                                                    <em className="text-blue-800">
                                                        {observation.species_name_ai?.replace(
                                                            /_/g,
                                                            ' ',
                                                        ) || 'Tidak Dikenali'}
                                                    </em>
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-3 py-3">
                                            {observation.latitude},{' '}
                                            {observation.longitude}
                                        </td>
                                        <td className="px-3 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[observation.status] ?? 'bg-neutral-100 text-neutral-700'}`}
                                            >
                                                {statusLabel[
                                                    observation.status
                                                ] ?? observation.status}
                                            </span>
                                        </td>

                                        {/* 🚨 PERBAIKAN: STRUKTUR TOMBOL ACTION 🚨 */}
                                        <td className="px-3 py-3 text-right">
                                            {observation.status === 'draft' && (
                                                <div className="flex justify-end gap-2">
                                                    {/* Link Inertia murni tanpa dibungkus button */}
                                                    <Link
                                                        href={`/user/observasi/${observation.id}/edit`}
                                                        className="flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-200"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />{' '}
                                                        Edit
                                                    </Link>

                                                    {/* Button standar (bukan Link) untuk hapus */}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                observation.id,
                                                            )
                                                        }
                                                        className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-200"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />{' '}
                                                        Hapus
                                                    </button>
                                                </div>
                                            )}
                                            {observation.status ===
                                                'pending' && (
                                                <span className="text-xs font-medium text-amber-600 italic">
                                                    ⏳ Menunggu Verifikasi
                                                    Expert
                                                </span>
                                            )}
                                            {observation.status ===
                                                'rejected' && (
                                                <span className="text-xs font-medium text-red-600 italic">
                                                    ❌ Ditolak oleh Expert
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
