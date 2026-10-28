import DashboardLayout from '@/layouts/dashboard-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type Observation = {
    id: number;
    latitude: string;
    longitude: string;
    created_at: string;
    species?: {
        scientific_name: string;
    } | null;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kontribusi Saya', href: '/user/kontribusi' }];

export default function UserContributions({ observations }: { observations: Observation[] }) {
    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Kontribusi Saya" />

            <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                <h1 className="text-xl font-semibold">Kontribusi Saya</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Menampilkan observasi yang sudah <strong>berhasil divalidasi</strong>.
                </p>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-170 text-left text-sm">
                        <thead>
                            <tr className="border-b border-sidebar-border/60 text-neutral-500">
                                <th className="px-3 py-3 font-medium">ID</th>
                                <th className="px-3 py-3 font-medium">Spesies</th>
                                <th className="px-3 py-3 font-medium">Koordinat</th>
                                <th className="px-3 py-3 font-medium">Status</th>
                                <th className="px-3 py-3 font-medium">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {observations.length === 0 ? (
                                <tr>
                                    <td className="px-3 py-6 text-neutral-400" colSpan={5}>
                                        Belum ada kontribusi tervalidasi.
                                    </td>
                                </tr>
                            ) : (
                                observations.map((observation) => (
                                    <tr key={observation.id} className="border-b border-sidebar-border/40">
                                        <td className="px-3 py-3">#{observation.id}</td>
                                        <td className="px-3 py-3">
                                            {observation.species?.scientific_name ?? '-'}
                                        </td>
                                        <td className="px-3 py-3">
                                            {observation.latitude}, {observation.longitude}
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                                Tervalidasi
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            {new Date(observation.created_at).toLocaleDateString('id-ID')}
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