import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import type { BreadcrumbItem } from '@/types';
import { CheckCircle, Clock, Eye, Check, X, Inbox, Bot, Edit3, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/expert/dashboard' },
    { title: 'Verifikasi Observasi', href: '/expert/verifikasi' },
];

export default function Verifications({ pendingObservations, speciesList }: any) {
    const [selectedObs, setSelectedObs] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [observationsList, setObservationsList] = useState(pendingObservations || []);

    useEffect(() => {
        setObservationsList(pendingObservations || []);
    }, [pendingObservations]);

    const [expertSpeciesId, setExpertSpeciesId] = useState("");
    const [expertNotes, setExpertNotes] = useState("");

    // ✅ FIX: case-insensitive filter agar "Plankton" == "plankton"
    const filteredSpeciesList = selectedObs
        ? selectedObs.category === 'auto'
            ? speciesList
            : speciesList.filter(
                  (sp: any) =>
                      sp.category.toLowerCase() === selectedObs.category.toLowerCase(),
              )
        : [];

    const openModal = (obs: any) => {
        setSelectedObs(obs);
        setExpertSpeciesId("");
        setExpertNotes("");
    };

    const submitVerifikasi = (isValid: boolean) => {
        if (!selectedObs) return;

        if (isValid && !expertSpeciesId) {
            alert("Pilih Spesies yang Valid terlebih dahulu jika ingin Menyetujui!");
            return;
        }

        setIsProcessing(true);

        const payload = {
            observation_id: selectedObs.id,
            is_valid: isValid,
            species_id: isValid ? expertSpeciesId : null,
            notes: expertNotes,
        };

        router.post('/expert/verifikasi', payload, {
            preserveScroll: true,
            onSuccess: () => {
                if (!isValid) {
                    setObservationsList((prev: any[]) =>
                        prev.filter((item: any) => item.id !== selectedObs.id),
                    );
                }
                setSelectedObs(null);
                setExpertSpeciesId("");
                setExpertNotes("");
                setIsProcessing(false);
            },
            onError: (errors) => {
                console.error("Error dari server:", errors);
                alert("Terjadi kesalahan. Silakan cek console log browser Anda.");
                setIsProcessing(false);
            },
        });
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Verifikasi Observasi" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-1">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                        Antrean Verifikasi
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Tinjau dan koreksi temuan dari Citizen Scientist.
                    </p>
                </div>

                {observationsList?.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed bg-white dark:bg-neutral-900 p-12 text-center">
                        <Inbox className="mb-4 h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                        <h3 className="text-lg font-bold dark:text-neutral-200">
                            Antrean Verifikasi Kosong
                        </h3>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {observationsList.map((obs: any) => (
                            <div
                                key={obs.id}
                                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                    <img
                                        src={
                                            obs.photos?.[0]?.file_path
                                                ? `/storage/${obs.photos[0].file_path}`
                                                : '/placeholder.jpg'
                                        }
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        alt="Observation Preview"
                                    />
                                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-[10px] font-bold uppercase shadow-sm dark:bg-black/80">
                                        <Clock className="h-3 w-3 text-amber-500" /> {obs.status}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs font-bold uppercase text-neutral-500">
                                        {obs.category === 'auto'
                                            ? '⚠️ Kategori Belum Terdeteksi'
                                            : obs.category
                                              ? obs.category.charAt(0).toUpperCase() +
                                                obs.category.slice(1)
                                              : '-'}
                                    </p>
                                    <h4 className="text-lg font-bold italic leading-tight text-blue-700 dark:text-blue-400">
                                        AI: {obs.species_name_ai || 'Tidak Dikenali'}
                                    </h4>
                                    <button
                                        onClick={() => openModal(obs)}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
                                    >
                                        <Eye className="h-4 w-4" /> Validasi / Koreksi Data
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* MODAL VERIFIKASI EXPERT */}
                {selectedObs && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:border dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex h-14 items-center justify-between border-b px-6 dark:border-neutral-800">
                                <h3 className="font-bold dark:text-white">
                                    Verifikasi & Koreksi Data #{selectedObs.id}
                                </h3>
                                <button
                                    onClick={() => setSelectedObs(null)}
                                    className="text-2xl hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400"
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <div className="p-4">
                                    <img
                                        src={
                                            selectedObs.photos?.[0]?.file_path
                                                ? `/storage/${selectedObs.photos[0].file_path}`
                                                : '/placeholder.jpg'
                                        }
                                        className="h-80 w-full rounded-2xl border object-cover dark:border-neutral-800"
                                        alt="Detail Observation"
                                    />
                                </div>
                                <div className="flex flex-col space-y-4 p-6">

                                    {/* INFO PREDIKSI AI */}
                                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                                        <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                                            <Bot className="h-3 w-3" /> Prediksi Sistem AI (
                                            {selectedObs.category === 'auto'
                                                ? 'Kategori Belum Terdeteksi'
                                                : selectedObs.category
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  selectedObs.category.slice(1)}
                                            )
                                        </p>
                                        <h2 className="mt-1 text-lg font-black italic text-neutral-800 dark:text-neutral-200">
                                            {selectedObs.species_name_ai || 'Tidak Dikenali'}
                                        </h2>
                                    </div>

                                    {/* DROPDOWN SPESIES */}
                                    <div>
                                        <label className="mb-1 flex items-center gap-1 text-sm font-bold text-green-700 dark:text-green-500">
                                            <Edit3 className="h-4 w-4" /> Penetapan Spesies Final
                                            (Oleh Pakar)
                                        </label>

                                        {/* Hint kalau kategori masih auto */}
                                        {selectedObs.category === 'auto' && (
                                            <p className="mb-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                                                ⚠️ Kategori observasi ini belum terdeteksi oleh AI.
                                                Semua spesies ditampilkan — silakan pilih yang paling sesuai.
                                            </p>
                                        )}

                                        {filteredSpeciesList.length === 0 ? (
                                            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                                ⚠️ Belum ada spesies terdaftar untuk kategori{' '}
                                                <strong>{selectedObs.category}</strong> di database.
                                            </div>
                                        ) : (
                                            <select
                                                className="w-full rounded-md border bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                                                value={expertSpeciesId}
                                                onChange={(e) => setExpertSpeciesId(e.target.value)}
                                            >
                                                <option value="">-- Pilih Spesies yang Benar --</option>
                                                {/* Kalau auto, grouping per kategori */}
                                                {selectedObs.category === 'auto' ? (
                                                    ['hoya', 'plankton', 'kayu'].map((cat) => {
                                                        const grouped = filteredSpeciesList.filter(
                                                            (sp: any) =>
                                                                sp.category.toLowerCase() === cat,
                                                        );
                                                        if (grouped.length === 0) return null;
                                                        return (
                                                            <optgroup
                                                                key={cat}
                                                                label={
                                                                    cat.charAt(0).toUpperCase() +
                                                                    cat.slice(1)
                                                                }
                                                            >
                                                                {grouped.map((sp: any) => (
                                                                    <option key={sp.id} value={sp.id}>
                                                                        {sp.scientific_name}
                                                                    </option>
                                                                ))}
                                                            </optgroup>
                                                        );
                                                    })
                                                ) : (
                                                    filteredSpeciesList.map((sp: any) => (
                                                        <option key={sp.id} value={sp.id}>
                                                            {sp.scientific_name}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                        )}
                                    </div>

                                    {/* CATATAN PAKAR */}
                                    <div>
                                        <label className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                                            Catatan Pakar (Opsional)
                                        </label>
                                        <textarea
                                            className="mt-1 w-full rounded-md border bg-white p-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                                            rows={2}
                                            placeholder="Berikan alasan koreksi atau penolakan..."
                                            value={expertNotes}
                                            onChange={(e) => setExpertNotes(e.target.value)}
                                        ></textarea>
                                    </div>

                                    {/* TOMBOL AKSI */}
                                    <div className="mt-auto flex gap-3 border-t pt-4 dark:border-neutral-800">
                                        <button
                                            type="button"
                                            onClick={() => submitVerifikasi(false)}
                                            disabled={isProcessing}
                                            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-red-200 py-2.5 font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-500 dark:hover:bg-red-900/20"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <X className="h-4 w-4" />
                                            )}{' '}
                                            Tolak & Hapus
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => submitVerifikasi(true)}
                                            disabled={isProcessing || !expertSpeciesId}
                                            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-green-600 py-2.5 font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}{' '}
                                            Validasi & Setuju
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
