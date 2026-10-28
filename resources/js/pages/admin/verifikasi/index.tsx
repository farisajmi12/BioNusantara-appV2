import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';

interface Application {
    id: number;
    full_name: string;
    email: string;
    institution: string | null;
    bio: string | null;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    applications: {
        data: Application[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: { search?: string; status?: string };
}

function StatusBadge({ status }: { status: Application['status'] }) {
    if (status === 'approved') {
        return (
            <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-green-700">
                Disetujui
            </span>
        );
    }
    if (status === 'rejected') {
        return (
            <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-red-700">
                Ditolak
            </span>
        );
    }
    return (
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-700">
            Menunggu
        </span>
    );
}

export default function Index({ applications, filters }: Props) {
    const page = usePage<any>();
    const flashSuccess: string | undefined = page.props.flash?.success;
    const generalError: string | undefined = page.props.errors?.general;

    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/verifikasi-ahli',
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    const handleVerify = (id: number, newStatus: 'approved' | 'rejected') => {
        let rejection_reason: string | null = null;

        if (newStatus === 'rejected') {
            rejection_reason = prompt('Alasan penolakan (akan dikirim ke email pemohon):');
            if (!rejection_reason || !rejection_reason.trim()) return;
        } else if (
            !confirm('Setujui pengajuan ini? Pemohon akan menjadi Pakar dan menerima email.')
        ) {
            return;
        }

        router.patch(
            `/admin/verifikasi-ahli/${id}`,
            { status: newStatus, rejection_reason },
            { preserveScroll: true },
        );
    };

    return (
        <DashboardLayout
            breadcrumbs={[{ title: 'Verifikasi Ahli', href: '/admin/verifikasi-ahli' }]}
        >
            <Head title="Verifikasi Ahli" />

            <div className="space-y-6 p-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Verifikasi Ahli
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Tinjau pengajuan pakar. Hasil keputusan dikirim ke email pemohon.
                    </p>
                </div>

                {flashSuccess && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flashSuccess}
                    </div>
                )}
                {generalError && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {generalError}
                    </div>
                )}

                <div className="rounded-xl border border-sidebar-border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                    <form onSubmit={handleSearch} className="mb-4 flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, email, atau institusi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-md border border-sidebar-border py-2 pr-4 pl-10 text-sm outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-md border border-sidebar-border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                        >
                            <option value="">Semua status</option>
                            <option value="pending">Menunggu</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                        </select>

                        <Button
                            type="submit"
                            variant="secondary"
                            className="text-[10px] font-bold tracking-widest uppercase"
                        >
                            Cari
                        </Button>
                    </form>

                    <div className="overflow-x-auto rounded-lg border border-sidebar-border dark:border-neutral-800">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-neutral-50 text-[10px] font-black tracking-widest text-neutral-500 uppercase dark:border-neutral-800 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">Institusi</th>
                                    <th className="px-6 py-4">Bio</th>
                                    <th className="px-6 py-4">Kredensial</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {applications.data.length > 0 ? (
                                    applications.data.map((a) => (
                                        <tr
                                            key={a.id}
                                            className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-800 dark:text-neutral-200">
                                                    {a.full_name}
                                                </div>
                                                <div className="text-xs text-neutral-500">
                                                    {a.email}
                                                </div>
                                                <div className="text-[10px] text-neutral-400">
                                                    {new Date(a.created_at).toLocaleDateString('id-ID')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{a.institution ?? '-'}</td>
                                            <td className="max-w-xs px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400">
                                                {a.bio}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={`/admin/verifikasi-ahli/${a.id}/kredensial`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs font-bold text-blue-600 underline"
                                                >
                                                    Lihat
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={a.status} />
                                                {a.status === 'rejected' && a.rejection_reason && (
                                                    <div className="mt-1 max-w-[200px] text-[10px] text-neutral-500">
                                                        {a.rejection_reason}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {a.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleVerify(a.id, 'approved')}
                                                            className="rounded-md bg-green-600 px-3 py-1.5 text-[10px] font-black tracking-widest text-white uppercase transition-colors hover:bg-green-700"
                                                        >
                                                            Terima
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerify(a.id, 'rejected')}
                                                            className="rounded-md bg-red-600 px-3 py-1.5 text-[10px] font-black tracking-widest text-white uppercase transition-colors hover:bg-red-700"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-neutral-400">
                                                <AlertCircle className="mb-2 h-10 w-10 opacity-20" />
                                                <p className="text-sm italic">
                                                    Data pengajuan tidak ditemukan...
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {applications.last_page > 1 && (
                        <div className="mt-4 flex flex-wrap justify-center gap-1">
                            {applications.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded-md border px-3 py-1 text-xs ${
                                            link.active
                                                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                                : 'border-sidebar-border hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="rounded-md border border-transparent px-3 py-1 text-xs text-neutral-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}