import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    Camera,
    CheckCircle,
    Clock3,
    History,
    Layers,
    TrendingUp,
} from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import type { BreadcrumbItem } from '@/types';

interface DashboardProps {
    user_stats: {
        my_total_uploads: number;
        my_verified: number;
        my_rejected: number;
        my_pending: number;
    };
    monthly_uploads: Array<{
        month: string;
        total: number;
    }>;
    category_breakdown: Array<{
        category: string;
        total: number;
    }>;
    my_recent_uploads: Array<{
        id: number;
        status: string;
        created_at: string;
        species?: {
            scientific_name?: string;
            category?: string;
        };
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard({
    user_stats,
    monthly_uploads,
    category_breakdown,
    my_recent_uploads,
}: DashboardProps) {
    const totalUploads = user_stats.my_total_uploads || 1;

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="User Dashboard" />

            <div className="flex flex-col gap-8 p-6">
                <div className="flex flex-col gap-1">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <Camera className="h-6 w-6 text-blue-600" /> Dashboard
                        User
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Pantau progres kontribusi observasi kamu secara
                        real-time.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard
                        icon={<History className="text-blue-500" />}
                        label="Total Kontribusi"
                        value={user_stats.my_total_uploads}
                        description="Semua upload"
                    />
                    <StatCard
                        icon={<CheckCircle className="text-green-500" />}
                        label="Terverifikasi"
                        value={user_stats.my_verified}
                        description="Sudah disetujui"
                    />
                    <StatCard
                        icon={<AlertCircle className="text-red-500" />}
                        label="Ditolak"
                        value={user_stats.my_rejected}
                        description="Perlu perbaikan"
                    />
                    <StatCard
                        icon={<Clock3 className="text-amber-500" />}
                        label="Menunggu"
                        value={user_stats.my_pending}
                        description="Menunggu review"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-sidebar-border bg-white p-8 shadow-sm dark:bg-neutral-900">
                        <div className="mb-6 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                            <h3 className="font-bold">Tren Upload 6 Bulan</h3>
                        </div>
                        <div className="flex h-48 items-end justify-between gap-2">
                            {monthly_uploads.map((item) => (
                                <div
                                    key={item.month}
                                    className="group flex flex-1 flex-col items-center gap-2"
                                >
                                    <div className="relative flex h-full w-full items-end">
                                        <div
                                            className="w-full rounded-t-lg bg-indigo-100 transition-colors duration-300 group-hover:bg-indigo-500 dark:bg-indigo-900/30"
                                            style={{
                                                height: `${Math.max((item.total / totalUploads) * 100, 8)}%`,
                                            }}
                                        />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                                            {item.total}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold tracking-wide text-neutral-400 uppercase">
                                        {item.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-sidebar-border bg-white p-8 shadow-sm dark:bg-neutral-900">
                        <div className="mb-6 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-emerald-600" />
                            <h3 className="font-bold">Distribusi Kategori</h3>
                        </div>
                        <div className="space-y-5">
                            {category_breakdown.length > 0 ? (
                                category_breakdown.map((item) => {
                                    const percentage = Math.round(
                                        (item.total / totalUploads) * 100,
                                    );

                                    return (
                                        <div
                                            key={item.category}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-neutral-600 uppercase dark:text-neutral-300">
                                                    {item.category}
                                                </span>
                                                <span className="font-bold">
                                                    {item.total} ({percentage}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                <div
                                                    className="h-full rounded-full bg-emerald-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-neutral-500 italic">
                                    Belum ada data kategori dari observasi kamu.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-sidebar-border/70 bg-neutral-50/60 p-8 dark:border-sidebar-border dark:bg-neutral-800/20">
                    <div className="mb-6 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 font-bold">
                            <BarChart3 className="h-5 w-5 text-sky-600" />
                            Aktivitas Upload Terbaru
                        </h4>
                        <Link
                            href="/user/observasi/riwayat"
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Lihat semua
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {my_recent_uploads.length > 0 ? (
                            my_recent_uploads.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-white p-4 dark:bg-neutral-900"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {item.species?.scientific_name ||
                                                'Spesies belum teridentifikasi'}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {item.species?.category ||
                                                'Tanpa kategori'}{' '}
                                            •{' '}
                                            {new Date(
                                                item.created_at,
                                            ).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-800 dark:text-neutral-200">
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-neutral-500 italic">
                                Belum ada upload observasi.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ icon, label, value, description }: any) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-sidebar-border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-neutral-900">
            <div className="relative z-10 flex flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 transition-transform group-hover:scale-110 dark:bg-neutral-800">
                    {icon}
                </div>
                <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                    {label}
                </p>
                <h3 className="mt-1 text-4xl leading-none font-black tracking-tighter">
                    {value || 0}
                </h3>
                <p className="mt-2 text-[11px] font-medium text-neutral-400">
                    {description}
                </p>
            </div>
        </div>
    );
}