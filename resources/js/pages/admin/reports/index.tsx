import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { 
    BarChart3, 
    Users, 
    Leaf, 
    CheckCircle, 
    Clock, 
    TrendingUp,
} from 'lucide-react';

interface Props {
    userStats: any;
    speciesCount: number;
    observationStats: any;
    monthlyGrowth: any[];
}

export default function Reports({ userStats, speciesCount, observationStats, monthlyGrowth }: Props) {
    return (
        <DashboardLayout breadcrumbs={[{ title: 'Laporan & Statistik', href: '/admin/laporan' }]}>
            <Head title="Laporan Statistik" />

            <div className="p-4 space-y-6">
                {/* Header Section sesuai style SpeciesIndex */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Laporan BioNusantara
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Ringkasan data pengguna, spesies, dan aktivitas observasi.
                    </p>
                </div>

                {/* Stat Cards Section - Menggunakan border style yang sama dengan SpeciesIndex */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Total Pengguna" 
                        value={userStats.total} 
                        description={`${userStats.expert} Ahli Terdaftar`}
                        icon={<Users className="h-4 w-4 text-blue-600" />}
                    />
                    <StatCard 
                        title="Total Spesies" 
                        value={speciesCount} 
                        description="Data Biodiversitas"
                        icon={<Leaf className="h-4 w-4 text-green-600" />}
                    />
                    <StatCard 
                        title="Observasi Selesai" 
                        value={observationStats.verified} 
                        description="Terverifikasi"
                        icon={<CheckCircle className="h-4 w-4 text-emerald-600" />}
                    />
                    <StatCard 
                        title="Menunggu Review" 
                        value={observationStats.pending} 
                        description="Observasi baru"
                        icon={<Clock className="h-4 w-4 text-amber-600" />}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Detail User Per Role */}
                    <div className="rounded-xl border border-sidebar-border bg-white p-6 dark:bg-neutral-900 dark:border-neutral-800">
                        <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                            <BarChart3 className="h-3.5 w-3.5" /> Distribusi Role Pengguna
                        </h3>
                        <div className="space-y-5">
                            <ProgressBar label="Admin" value={userStats.admin} max={userStats.total} color="bg-red-500" />
                            <ProgressBar label="Expert/Ahli" value={userStats.expert} max={userStats.total} color="bg-blue-500" />
                            <ProgressBar label="User Umum" value={userStats.common_user} max={userStats.total} color="bg-green-500" />
                        </div>
                    </div>

                    {/* Monthly Growth Info */}
                    <div className="rounded-xl border border-sidebar-border bg-white p-6 dark:bg-neutral-900 dark:border-neutral-800">
                        <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                            <TrendingUp className="h-3.5 w-3.5" /> Pertumbuhan Bulanan
                        </h3>
                        <div className="flex h-40 items-end justify-between gap-2 border-b border-l border-neutral-100 dark:border-neutral-800 p-2">
                            {monthlyGrowth.map((data, i) => (
                                <div 
                                    key={i} 
                                    className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 dark:bg-indigo-400/10 dark:hover:bg-indigo-400/20 rounded-t-sm relative group transition-all"
                                    style={{ height: `${(data.total / (userStats.total || 1)) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {data.total} User
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-tighter text-neutral-400">Statistik Pendaftaran User</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, value, description, icon }: any) {
    return (
        <div className="rounded-xl border border-sidebar-border bg-white p-5 dark:bg-neutral-900 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{title}</p>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</h3>
                <p className="text-[10px] font-medium text-neutral-400 mt-1 uppercase tracking-tight">{description}</p>
            </div>
        </div>
    );
}

function ProgressBar({ label, value, max, color }: any) {
    const percentage = Math.round((value / (max || 1)) * 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
                <span className="text-neutral-900 dark:text-white">{value} ({percentage}%)</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${color}`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}