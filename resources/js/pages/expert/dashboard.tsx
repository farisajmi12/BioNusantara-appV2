import { Head } from '@inertiajs/react';
import {
    Activity,
    BarChart,
    Calendar,
    CheckSquare,
    Clock,
    PieChart,
    TrendingUp,
    XSquare,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Expert Dashboard', href: '/dashboard' }];

// Berapa baris distribusi yang tampil sebelum "Tampilkan semua"
const MAX_VISIBLE_CATEGORIES = 5;
// Tinggi maksimal batang grafik bulanan (px)
const CHART_MAX_BAR_PX = 140;

interface DistributionItem {
    category: string | null;
    total: number;
}

interface TrendPoint {
    label: string;
    total: number;
}

interface ExpertDashboardProps {
    // Data dari Dashboard original
    tasks: {
        pending_count: number;
        verified_count: number;
    };
    recent_pending: unknown[];
    // Data dari Statistik
    statistics: {
        total: number;
        verified: number;
        rejected: number;
        today: number;
    };
    distribution: DistributionItem[];
    monthlyTrend: unknown;
}

/**
 * Menerima beberapa bentuk data bulanan dari controller:
 *   [{ month: '2026-05', total: 3 }, ...]   (key lain: label/bulan, count/value)
 *   { '2026-05': 3, '2026-06': 1 }
 *   [3, 1, 4]
 * Hasilnya selalu array { label, total }. Kalau bentuknya tidak dikenali,
 * hasilnya kosong dan kartu menampilkan pesan "belum ada data".
 */
function normalizeTrend(raw: unknown): TrendPoint[] {
    const toNumber = (value: unknown) => Number(value) || 0;

    if (Array.isArray(raw)) {
        return raw.map((item, index) => {
            if (typeof item === 'number') {
                return { label: `Bulan ${index + 1}`, total: item };
            }
            const row = (item ?? {}) as Record<string, unknown>;
            return {
                label: String(row.month ?? row.label ?? row.bulan ?? `Bulan ${index + 1}`),
                total: toNumber(row.total ?? row.count ?? row.value),
            };
        });
    }

    if (raw && typeof raw === 'object') {
        return Object.entries(raw as Record<string, unknown>).map(([label, value]) => ({
            label,
            total: toNumber(value),
        }));
    }

    return [];
}

function formatMonthLabel(label: string): string {
    const match = /^(\d{4})-(\d{2})/.exec(label);
    if (!match) return label;
    return new Date(Number(match[1]), Number(match[2]) - 1, 1).toLocaleDateString('id-ID', {
        month: 'short',
    });
}

export default function ExpertDashboard({
    tasks,
    statistics,
    distribution,
    monthlyTrend,
}: ExpertDashboardProps) {
    const [showAll, setShowAll] = useState(false);

    // Hanya kategori yang punya verifikasi, diurutkan dari yang terbanyak
    const rows = (distribution ?? [])
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total);
    const visibleRows = showAll ? rows : rows.slice(0, MAX_VISIBLE_CATEGORIES);
    const hiddenCount = rows.length - MAX_VISIBLE_CATEGORIES;

    // 6 bulan terakhir dari data asli
    const trend = normalizeTrend(monthlyTrend).slice(-6);
    const trendMax = Math.max(0, ...trend.map((point) => point.total));

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Expert Dashboard" />

            <div className="flex flex-col gap-8 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <BarChart className="h-6 w-6 text-purple-600" />
                        Dashboard Pakar
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Pantau antrean verifikasi dan ringkasan kontribusi ilmiah Anda.
                    </p>
                </div>

                {/* SECTION 1: Status Utama (YANG TIDAK BOLEH DIHAPUS) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="group relative overflow-hidden rounded-3xl border border-yellow-500/50 bg-yellow-50/5 p-6 shadow-sm transition-all hover:shadow-md dark:bg-yellow-900/10">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-yellow-100 dark:bg-yellow-800/30 w-12 h-12 flex items-center justify-center">
                                <Clock className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-yellow-600/80">Menunggu Verifikasi</p>
                                <h3 className="text-4xl font-black">{tasks.pending_count}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-3xl border border-green-500/50 bg-green-50/5 p-6 shadow-sm transition-all hover:shadow-md dark:bg-green-900/10">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-green-100 dark:bg-green-800/30 w-12 h-12 flex items-center justify-center">
                                <CheckSquare className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-green-600/80">Berhasil Diverifikasi</p>
                                <h3 className="text-4xl font-black">{tasks.verified_count}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Grid Statistik Tambahan */}
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

                {/* SECTION 3: Visualisasi (items-start: tinggi tiap kartu mengikuti isinya) */}
                <div className="grid items-start gap-6 md:grid-cols-2">
                    {/* Distribusi Taksonomi */}
                    <div className="rounded-3xl border border-sidebar-border bg-white p-6 dark:bg-neutral-900 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <PieChart className="w-5 h-5 text-green-600" />
                            <h3 className="font-bold">Distribusi Taksonomi</h3>
                        </div>

                        {rows.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {visibleRows.map((item, i) => (
                                        <div key={`${item.category ?? 'none'}-${i}`} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-tighter">
                                                    {item.category || 'Tanpa kategori'}
                                                </span>
                                                <span className="font-bold">{item.total} Verifikasi</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                <div
                                                    className="h-full rounded-full bg-green-500 transition-all duration-1000"
                                                    style={{
                                                        width: `${Math.min(100, (item.total / (statistics?.total || 1)) * 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {hiddenCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAll((prev) => !prev)}
                                        aria-expanded={showAll}
                                        className="mt-5 text-sm font-semibold text-green-700 underline underline-offset-4 hover:text-green-800 dark:text-green-400"
                                    >
                                        {showAll
                                            ? 'Tampilkan lebih sedikit'
                                            : `Tampilkan semua (${rows.length})`}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-neutral-500 italic">Belum ada data distribusi.</p>
                        )}
                    </div>

                    {/* Kontribusi Bulanan */}
                    <div className="rounded-3xl border border-sidebar-border bg-white p-6 dark:bg-neutral-900 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold">Kontribusi Bulanan</h3>
                        </div>

                        {trend.length > 0 ? (
                            <div className="flex h-48 items-end justify-between gap-2">
                                {trend.map((point, i) => {
                                    const barPx =
                                        trendMax > 0
                                            ? Math.max(4, Math.round((point.total / trendMax) * CHART_MAX_BAR_PX))
                                            : 4;
                                    return (
                                        <div
                                            key={`${point.label}-${i}`}
                                            className="group flex flex-1 flex-col items-center justify-end gap-1"
                                            title={`${point.label}: ${point.total} verifikasi`}
                                        >
                                            <span className="text-[10px] font-bold text-neutral-500">
                                                {point.total}
                                            </span>
                                            <div
                                                className="w-full rounded-t-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-500 transition-colors"
                                                style={{ height: `${barPx}px` }}
                                            />
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase">
                                                {formatMonthLabel(point.label)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500 italic">Belum ada data kontribusi bulanan.</p>
                        )}
                    </div>
                </div>

                {/* SECTION 4: Informasi Tambahan */}
                <div className="relative rounded-3xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-neutral-50/50 dark:bg-neutral-800/20">
                    <h4 className="font-semibold mb-2">Antrean Identifikasi Spesies</h4>
                    <p className="text-sm text-neutral-500">
                        Saat ini terdapat <span className="font-bold text-yellow-600">{tasks.pending_count} data</span> yang memerlukan perhatian Anda.
                        Silahkan cek menu <a href="/expert/verifikasi" className="font-semibold underline">Verifikasi</a> untuk memproses data.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Komponen Reusable StatCard
function StatCard({
    icon,
    label,
    value,
    description,
}: {
    icon: ReactNode;
    label: string;
    value?: number;
    description: string;
}) {
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
