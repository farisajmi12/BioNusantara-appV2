import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import type { BreadcrumbItem } from '@/types';
import { FileText, CheckCircle2, XCircle, Search, Calendar, User, Tag, Eye, X, Bot } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Riwayat Verifikasi', href: '/expert/riwayat' }];

export default function Riwayat({ verifications }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    
    // 🚨 STATE UNTUK MODAL DETAIL
    const [selectedDetail, setSelectedDetail] = useState<any>(null);

    const filteredHistory = verifications?.filter((v: any) =>
        v.observation?.species?.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.observation?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Verifikasi" />
            <div className="flex flex-col gap-6 p-6">
                
                {/* Header & Kolom Pencarian */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="flex items-center gap-2 text-2xl font-bold">
                            <FileText className="h-6 w-6 text-neutral-500" /> 
                            Jejak Digital Verifikasi
                        </h2>
                        <p className="text-sm text-neutral-500">Daftar keputusan validasi yang telah Anda berikan.</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Cari riwayat..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-sidebar-border bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* List Kartu Riwayat */}
                <div className="grid gap-3">
                    {filteredHistory?.length > 0 ? (
                        filteredHistory.map((v: any) => (
                            <div
                                key={v.id}
                                className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-sidebar-border bg-white p-4 transition-all hover:border-neutral-300 dark:bg-neutral-900 dark:hover:border-neutral-700 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    {/* 🚨 PERBAIKAN FOTO (Menggunakan /storage/) */}
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 border dark:border-neutral-700">
                                        <img
                                            src={v.observation?.photos?.[0]?.file_path ? `/storage/${v.observation.photos[0].file_path}` : '/placeholder.jpg'}
                                            className="h-full w-full object-cover"
                                            alt="Obs"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold italic text-neutral-800 dark:text-neutral-200">
                                                {v.observation?.species?.scientific_name || 'Spesies Tidak Diketahui'}
                                            </span>
                                            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                                                v.is_valid 
                                                ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                                : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {v.is_valid ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                                                {v.is_valid ? 'Disetujui' : 'Ditolak'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {v.observation?.user?.name}</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(v.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {v.observation?.category || 'Umum'}</span>
                                        </div>
                                        
                                        {v.notes && (
                                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 italic">
                                                " {v.notes} "
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 md:mt-0">
                                    {/* 🚨 TOMBOL DETAIL (Memicu Modal Pop-up) */}
                                    <button 
                                        onClick={() => setSelectedDetail(v)}
                                        className="flex items-center gap-1 rounded-lg border border-sidebar-border px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <Eye className="w-3 h-3"/> Detail
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-sidebar-border rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/50">
                            <FileText className="h-12 w-12 text-neutral-300 dark:text-neutral-700 mb-2" />
                            <p className="text-neutral-500 dark:text-neutral-400 italic">Data riwayat tidak ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* ======================================= */}
                {/* 🚨 MODAL POP-UP DETAIL OBSERVASI        */}
                {/* ======================================= */}
                {selectedDetail && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl dark:border dark:border-neutral-800">
                            <div className="flex h-14 items-center justify-between border-b dark:border-neutral-800 px-6">
                                <h3 className="font-bold flex items-center gap-2 dark:text-white">
                                    <FileText className="w-4 h-4 text-blue-500"/>
                                    Detail Riwayat Verifikasi
                                </h3>
                                <button onClick={() => setSelectedDetail(null)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div className="flex gap-4 items-start">
                                    <img 
                                        src={selectedDetail.observation?.photos?.[0]?.file_path ? `/storage/${selectedDetail.observation.photos[0].file_path}` : '/placeholder.jpg'} 
                                        className="h-32 w-32 rounded-2xl object-cover border dark:border-neutral-800 shadow-sm" 
                                        alt="Detail Observation"
                                    />
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div>
                                            <p className="text-xs font-bold text-neutral-400 uppercase">Status Keputusan</p>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black uppercase mt-1 ${
                                                selectedDetail.is_valid 
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {selectedDetail.is_valid ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                {selectedDetail.is_valid ? 'Telah Disetujui' : 'Ditolak / Dihapus'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg">
                                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold">Tebakan AI Awal</p>
                                                <p className="text-xs font-bold italic text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                                                    <Bot className="w-3 h-3"/> {selectedDetail.observation?.species_name_ai || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg">
                                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold">Spesies Final Pakar</p>
                                                <p className="text-xs font-bold italic text-green-600 dark:text-green-400 mt-0.5">
                                                    {selectedDetail.observation?.species?.scientific_name || 'Tidak Dipilih'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border dark:border-neutral-800 mt-2">
                                    <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2 border-b dark:border-neutral-700 pb-2">Catatan Verifikasi Anda:</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                                        {selectedDetail.notes ? `"${selectedDetail.notes}"` : 'Tidak ada catatan yang dilampirkan.'}
                                    </p>
                                </div>

                                <div className="text-xs text-neutral-400 text-center mt-2">
                                    Diverifikasi pada: {new Date(selectedDetail.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}