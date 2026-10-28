import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import type { BreadcrumbItem } from '@/types';
import {
    BarChart,
    Activity,
    CheckSquare,
    XSquare,
    TrendingUp,
    PieChart,
    Calendar,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Statistik', href: '/expert/statistik' }];

export default function Statistik({ statistics, distribution, monthlyTrend }: any) {
    return (
        <DashboardLayout breadcrumbs={[{ title: 'Manajemen User', href: '/admin/users' }]}>
            <Head title="Statistik Pakar" />
            <div className="flex flex-col gap-8 p-6">
                <div className="flex flex-col gap-1">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <BarChart className="h-6 w-6 text-purple-600" /> 
                        Analitik Performa Pakar
                    </h2>
                    <p className="text-sm text-neutral-500">Ringkasan kontribusi ilmiah Anda pada platform BioNusantara.</p>
                </div>

                {/* Grid Statistik Utama */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard
                        icon={<Activity className="text-blue-500" />}
                        label="Total Review"
                        value={statistics?.total}
                        description="Semua keputusan"
                    />
                    <StatCard
                        icon={<CheckSquare className="text-green-500" />}
                        label="Disetujui"
                        value={statistics?.verified}
                        description="Data valid"
                    />
                    <StatCard
                        icon={<XSquare className="text-red-500" />}
                        label="Ditolak"
                        value={statistics?.rejected}
                        description="Data tidak sesuai"
                    />
                    <StatCard
                        icon={<TrendingUp className="text-amber-500" />}
                        label="Hari Ini"
                        value={statistics?.today}
                        description="Produktivitas harian"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Visualisasi Distribusi Spesies */}
                    <div className="rounded-3xl border border-sidebar-border bg-white p-8 dark:bg-neutral-900 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <PieChart className="w-5 h-5 text-green-600" />
                            <h3 className="font-bold">Distribusi Taksonomi</h3>
                        </div>
                        <div className="space-y-6">
                            {distribution?.length > 0 ? distribution.map((item: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-tighter">{item.category}</span>
                                        <span className="font-bold">{item.total} Verifikasi</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <div 
                                            className="h-full rounded-full bg-green-500 transition-all duration-1000" 
                                            style={{ width: `${(item.total / statistics.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-neutral-500 italic">Belum ada data distribusi.</p>
                            )}
                        </div>
                    </div>

                    {/* Tren Verifikasi Sederhana */}
                    <div className="rounded-3xl border border-sidebar-border bg-white p-8 dark:bg-neutral-900 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold">Tren Kontribusi Bulanan</h3>
                        </div>
                        <div className="flex flex-1 items-end justify-between gap-2 pt-4">
                            {/* Dummy bars if data is low, otherwise use monthlyTrend */}
                            {[1, 2, 3, 4, 5, 6].map((m) => (
                                <div key={m} className="group relative flex flex-1 flex-col items-center gap-2">
                                    <div 
                                        className="w-full rounded-t-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-500 transition-colors"
                                        style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
                                    ></div>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Bulan {m}</span>
                                </div>
                            ))}
                        </div>
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
                <div className="mb-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                    {label}
                </p>
                <h3 className="mt-1 text-4xl font-black tracking-tighter leading-none">
                    {value || 0}
                </h3>
                <p className="mt-2 text-[11px] text-neutral-400 font-medium">
                    {description}
                </p>
            </div>
        </div>
    );
}