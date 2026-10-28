import DashboardLayout from '@/layouts/dashboard-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { 
    BarChart3, 
    Users, 
    Leaf, 
    CheckCircle, 
    Clock, 
    TrendingUp,
    ShieldCheck,
    Activity
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin Dashboard', href: '/dashboard' }];

interface AdminDashboardProps {
    // Data Gabungan
    stats: {
        total_users: number;
        total_observations: number;
        total_species: number;
        pending_verifications: number;
    };
    userStats: {
        total: number;
        admin: number;
        expert: number;
        common_user: number;
    };
    observationStats: {
        verified: number;
        pending: number;
    };
    monthlyGrowth: any[];
    recent_users: any[];
}

export default function AdminDashboard({ 
    stats, 
    userStats, 
    observationStats, 
    monthlyGrowth 
}: AdminDashboardProps) {
    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            <div className="flex flex-col gap-8 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <ShieldCheck className="h-6 w-6 text-indigo-600" /> 
                        Dashboard Admin
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Ringkasan data pengguna, biodiversitas, dan ekosistem BioNusantara.
                    </p>
                </div>

                {/* SECTION 1: Metrik Utama (Besar) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="group relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-indigo-50/5 p-6 shadow-sm transition-all hover:shadow-md dark:bg-indigo-900/10">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-indigo-100 dark:bg-indigo-800/30 w-12 h-12 flex items-center justify-center">
                                <Users className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600/80">Total Pengguna</p>
                                <h3 className="text-4xl font-black tracking-tighter">{stats.total_users}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-50/5 p-6 shadow-sm transition-all hover:shadow-md dark:bg-emerald-900/10">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-emerald-100 dark:bg-emerald-800/30 w-12 h-12 flex items-center justify-center">
                                <Leaf className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">Total Spesies</p>
                                <h3 className="text-4xl font-black tracking-tighter">{stats.total_species}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Grid Statistik Operasional (Kecil) */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard
                        icon={<Activity className="text-blue-500" />}
                        label="Observasi Masuk"
                        value={stats.total_observations}
                        description="Database pusat"
                    />
                    <StatCard
                        icon={<CheckCircle className="text-green-500" />}
                        label="Terverifikasi"
                        value={observationStats?.verified}
                        description="Data valid"
                    />
                    <StatCard
                        icon={<Clock className="text-amber-500" />}
                        label="Menunggu Review"
                        value={observationStats?.pending}
                        description="Antrean pakar"
                    />
                    <StatCard
                        icon={<TrendingUp className="text-purple-500" />}
                        label="Pertumbuhan"
                        value={monthlyGrowth[monthlyGrowth.length - 1]?.total || 0}
                        description="User bulan ini"
                    />
                </div>

                {/* SECTION 3: Visualisasi Data */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Distribusi Role */}
                    <div className="rounded-3xl border border-sidebar-border bg-white p-8 dark:bg-neutral-900 shadow-sm">
                        <div className="flex items-center gap-2 mb-8">
                            <BarChart3 className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold">Distribusi Role Pengguna</h3>
                        </div>
                        <div className="space-y-6">
                            <ProgressBar label="Administrator" value={userStats.admin} max={userStats.total} color="bg-red-500" />
                            <ProgressBar label="Pakar / Ahli" value={userStats.expert} max={userStats.total} color="bg-blue-500" />
                            <ProgressBar label="User Umum" value={userStats.common_user} max={userStats.total} color="bg-green-500" />
                        </div>
                    </div>

                    {/* Grafik Pertumbuhan */}
                    <div className="rounded-3xl border border-sidebar-border bg-white p-8 dark:bg-neutral-900 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-8">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold">Pertumbuhan Registrasi</h3>
                        </div>
                        <div className="flex flex-1 items-end justify-between gap-2 pt-4">
                            {monthlyGrowth.map((data, i) => (
                                <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
                                    <div 
                                        className="w-full rounded-t-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-500 transition-all duration-300"
                                        style={{ height: `${(data.total / (userStats.total || 1)) * 100 + 10}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {data.total} User
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Bln {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Aktivitas Terbaru */}
                <div className="relative rounded-3xl border border-sidebar-border/70 p-8 dark:border-sidebar-border bg-neutral-50/50 dark:bg-neutral-800/20">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold">Aktivitas Sistem Terbaru</h4>
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase">Real-time</span>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-neutral-400 italic">Menunggu data aktivitas dari server...</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Sub-komponen tetap konsisten dengan Dashboard Pakar
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

function ProgressBar({ label, value, max, color }: any) {
    const percentage = Math.round((value / (max || 1)) * 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-neutral-500">{label}</span>
                <span className="text-neutral-900 dark:text-white">{value} ({percentage}%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${color}`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}