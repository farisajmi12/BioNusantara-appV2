import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Kategori sesuai data SpeciesSeeder
const categories = [
    { value: 'reptil', label: 'Reptil' },
    { value: 'mamalia', label: 'Mamalia' },
    { value: 'burung', label: 'Burung' },
    { value: 'amfibi', label: 'Amfibi' },
];

const validValues = categories.map((c) => c.value);

const labelOf = (value: string) =>
    categories.find((c) => c.value === value)?.label ??
    (value ? value.charAt(0).toUpperCase() + value.slice(1) : '');

// Kirim filter ke server. Parameter kosong tidak ikut dikirim agar URL tetap bersih.
const sendFilters = (search: string, category: string) => {
    const params: Record<string, string> = {};
    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;

    router.get('/admin/spesies', params, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
};

export default function SpeciesIndex({ species, filters }: any) {
    // Abaikan kategori lama (misalnya ?category=plankton) yang sudah tidak ada
    const initialCategory = validValues.includes(filters?.category) ? filters.category : '';

    const [search, setSearch] = useState<string>(filters?.search || '');
    const [category, setCategory] = useState<string>(initialCategory);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Saat halaman pertama dibuka: jika URL membawa kategori lama, bersihkan dari server.
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (filters?.category && !validValues.includes(filters.category)) {
                sendFilters(search, '');
            }
            return;
        }

        // Tunda sebentar saat mengetik agar tidak mengirim request di setiap huruf
        const timer = setTimeout(() => sendFilters(search, category), 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, category]);

    const list: any[] = species ?? [];

    return (
        <DashboardLayout breadcrumbs={[{ title: 'Manajemen Spesies', href: '/admin/spesies' }]}>
            <Head title="Manajemen Spesies" />

            <div className="rounded-xl border border-sidebar-border bg-white p-4 dark:bg-neutral-900">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Cari nama ilmiah atau lokal..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-sidebar-border text-sm dark:bg-neutral-800"
                        />
                    </div>

                    {/* Filter Kategori */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setCategory('')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all border ${
                                category === ''
                                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900'
                                    : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800'
                            }`}
                        >
                            Semua
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all border ${
                                    category === cat.value
                                        ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900'
                                        : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Spesies */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {list.length > 0 ? (
                        list.map((s: any) => (
                            <div
                                key={s.id}
                                className="p-4 border rounded-xl border-sidebar-border hover:shadow-sm transition-all dark:border-neutral-800"
                            >
                                <p className="text-[10px] uppercase font-bold text-green-600 mb-1">
                                    {labelOf(s.category)}
                                </p>
                                <h4 className="font-bold italic text-neutral-800 dark:text-neutral-200">
                                    {s.scientific_name}
                                </h4>
                                <p className="text-sm text-neutral-500">
                                    {s.common_name || 'Tidak ada nama lokal'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-neutral-400 italic">
                            Spesies tidak ditemukan...
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
