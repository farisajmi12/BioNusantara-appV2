import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import type { BreadcrumbItem } from '@/types';
import {
    Shield,
    Leaf,
    Search,
    Bird,
    PawPrint,
    Droplets,
    Footprints,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Validasi Spesies', href: '/expert/validasi' }];

type CategoryStyle = {
    icon: React.ReactNode;
    badge: string;
    border: string;
    header: string;
    label: string;
};

const getCategoryStyles = (category: string): CategoryStyle => {
    const cat = category.toLowerCase().trim();

    if (cat === 'reptil') return {
        icon: <Footprints className="w-4 h-4 text-emerald-600" />,
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        header: 'bg-emerald-50 dark:bg-emerald-900/20',
        label: 'Reptil',
    };

    if (cat === 'mamalia') return {
        icon: <PawPrint className="w-4 h-4 text-amber-700" />,
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        header: 'bg-amber-50 dark:bg-amber-900/20',
        label: 'Mamalia',
    };

    if (cat === 'burung') return {
        icon: <Bird className="w-4 h-4 text-sky-600" />,
        badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        border: 'border-sky-200 dark:border-sky-800',
        header: 'bg-sky-50 dark:bg-sky-900/20',
        label: 'Burung',
    };

    if (cat === 'amfibi') return {
        icon: <Droplets className="w-4 h-4 text-teal-600" />,
        badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
        border: 'border-teal-200 dark:border-teal-800',
        header: 'bg-teal-50 dark:bg-teal-900/20',
        label: 'Amfibi',
    };

    // Kategori lain yang belum terdaftar: tampilkan nama kategorinya apa adanya
    return {
        icon: <Leaf className="w-4 h-4 text-green-600" />,
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
        header: 'bg-green-50 dark:bg-green-900/20',
        label: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Lainnya',
    };
};

// Urutan tampil kategori
const categoryOrder = ['reptil', 'mamalia', 'burung', 'amfibi'];

const categoryRank = (cat: string) => {
    const idx = categoryOrder.indexOf(cat);
    return idx === -1 ? categoryOrder.length : idx;
};

export default function Validasi({ species_references }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const query = searchQuery.toLowerCase();

    const filtered = species_references?.filter((s: any) =>
        (s.scientific_name ?? '').toLowerCase().includes(query) ||
        (s.common_name ?? '').toLowerCase().includes(query) ||
        (s.category ?? '').toLowerCase().includes(query)
    ) ?? [];

    // Kelompokkan per kategori
    const grouped: Record<string, any[]> = {};
    filtered.forEach((s: any) => {
        const cat = (s.category ?? '').toLowerCase().trim();
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(s);
    });

    const sortedCategories = Object.keys(grouped).sort(
        (a, b) => categoryRank(a) - categoryRank(b)
    );

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Validasi Spesies" />
            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Shield className="w-7 h-7 text-green-600" /> Kunci Identifikasi Pakar
                        </h2>
                        <p className="text-sm text-neutral-500">
                            Database referensi taksonomi untuk validasi temuan lapangan.{' '}
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                Total: {species_references?.length ?? 0} spesies
                            </span>
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, nama ilmiah, atau kategori..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-sidebar-border bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-green-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Konten */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-sidebar-border rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/50">
                        <Search className="w-12 h-12 text-neutral-300 mb-4" />
                        <p className="text-neutral-500 font-medium">Spesies tidak ditemukan.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {sortedCategories.map((cat) => {
                            const styles = getCategoryStyles(cat);
                            const speciesList = grouped[cat];
                            return (
                                <div key={cat || 'lainnya'}>
                                    {/* Header Kategori */}
                                    <div className={`flex items-center gap-3 mb-4 px-4 py-3 rounded-xl ${styles.header}`}>
                                        {styles.icon}
                                        <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
                                            {styles.label}
                                        </h3>
                                        <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${styles.badge}`}>
                                            {speciesList.length} spesies
                                        </span>
                                    </div>

                                    {/* Grid Spesies */}
                                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {speciesList.map((s: any, index: number) => (
                                            <div
                                                key={s.id}
                                                className={`flex items-center gap-3 rounded-xl border ${styles.border} bg-white dark:bg-neutral-900 px-4 py-3 hover:shadow-sm transition-all`}
                                            >
                                                {/* Nomor urut */}
                                                <span className="text-xs font-black text-neutral-300 dark:text-neutral-600 w-5 shrink-0">
                                                    {index + 1}
                                                </span>

                                                <div className="flex flex-col min-w-0">
                                                    <span
                                                        className="text-sm font-semibold italic text-neutral-800 dark:text-neutral-100 truncate"
                                                        title={s.scientific_name}
                                                    >
                                                        {s.scientific_name}
                                                    </span>
                                                    {s.common_name && (
                                                        <span
                                                            className="text-xs text-neutral-400 truncate"
                                                            title={s.common_name}
                                                        >
                                                            {s.common_name}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="ml-auto shrink-0">
                                                    {styles.icon}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
