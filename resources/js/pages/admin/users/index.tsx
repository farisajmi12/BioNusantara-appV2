import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import {
    Users,
    ShieldAlert,
    Trash2,
    Key,
    Ban,
    CheckCircle,
    AlertCircle,
    Clock // <-- Tambahkan icon Clock untuk status Pending
} from 'lucide-react';
import { useState } from 'react';

export default function UserIndex({ users }: any) {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isResetModal, setIsResetModal] = useState(false);

    const { data, setData, put, processing, reset } = useForm({
        password: '',
    });

    const handleToggleStatus = (id: number) => {
        if (confirm('Ubah status aktif akun ini?')) {
            router.patch(`/admin/users/${id}/toggle`);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus akun ini secara permanen?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const handleChangeRole = (id: number, newRoleId: string) => {
        if (confirm('Ubah role (otoritas) pengguna ini?')) {
            router.patch(`/admin/users/${id}/role`, { role_id: newRoleId }, {
                preserveScroll: true,
                onSuccess: () => alert('Role berhasil diperbarui!'),
            });
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        router.put(
            `/admin/users/${selectedUser.id}/reset-password`,
            { password: data.password },
            {
                onSuccess: () => {
                    setIsResetModal(false);
                    reset();
                    alert('Password berhasil diubah!');
                },
                onError: (errors) => {
                    console.error(errors);
                    alert('Gagal mereset password: ' + JSON.stringify(errors));
                },
            }
        );
    };

    if (!users) {
        return (
            <DashboardLayout breadcrumbs={[{ title: 'Manajemen User', href: '/admin/users' }]}>
                <Head title="Manajemen User" />
                <div className="p-6">
                    <div className="text-center text-red-500">Data users tidak tersedia</div>
                </div>
            </DashboardLayout>
        );
    }

    // === KELOMPOK DATA ===
    const unverifiedUsers = users.data?.filter((u: any) => !u.email_verified_at) || [];
    const staffUsers = users.data?.filter((u: any) => u.email_verified_at && (u.role_id == 1 || u.role_id == 2)) || [];
    const generalUsers = users.data?.filter((u: any) => u.email_verified_at && u.role_id == 3) || [];

    // === FUNGSI RENDER BARIS ===
    const renderRow = (u: any) => (
        <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
            <td className="px-6 py-4">
                <div className="font-bold text-neutral-800 dark:text-neutral-200">
                    {u.name}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                    {u.email}
                    {!u.email_verified_at && (
                        <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-500">
                            <AlertCircle className="h-3 w-3" />
                            BELUM VERIFIKASI
                        </span>
                    )}
                </div>
            </td>

            <td className="px-6 py-4">
                <select
                    value={u.role_id}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                    className="rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-xs font-bold uppercase text-neutral-700 hover:border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-700 dark:text-neutral-300"
                >
                    <option value="1">Admin</option>
                    <option value="2">Expert</option>
                    <option value="3">User</option>
                </select>
            </td>

            <td className="px-6 py-4">
                {/* LOGIKA STATUS DIPERBARUI: Cek verifikasi dulu, baru cek aktif/nonaktif */}
                {!u.email_verified_at ? (
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Clock className="h-3 w-3" /> PENDING
                    </span>
                ) : u.is_active ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                        <CheckCircle className="h-3 w-3" /> AKTIF
                    </span>
                ) : (
                    <span className="flex items-center gap-1 font-bold text-red-500">
                        <ShieldAlert className="h-3 w-3" /> NONAKTIF
                    </span>
                )}
            </td>

            <td className="space-x-2 px-6 py-4 text-right">
                <button
                    onClick={() => handleToggleStatus(u.id)}
                    className={`rounded-lg p-2 transition-colors ${
                        !u.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    }`}
                    title={u.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                >
                    <Ban className="h-4 w-4" />
                </button>

                <button
                    onClick={() => {
                        setSelectedUser(u);
                        setIsResetModal(true);
                    }}
                    className="rounded-lg p-2 text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Reset Password"
                >
                    <Key className="h-4 w-4" />
                </button>

                <button
                    onClick={() => handleDelete(u.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Hapus User"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );

    return (
        <DashboardLayout breadcrumbs={[{ title: 'Manajemen User', href: '/admin/users' }]}>
            <Head title="Manajemen User" />

            <div className="p-6">
                <div className="mb-8 border-b border-neutral-200 pb-4 dark:border-neutral-800">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <Users className="h-6 w-6" /> Manajemen Pengguna
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        Kelola akses dan otoritas seluruh pengguna aplikasi BioNusantara.
                    </p>
                </div>

                {/* =========================================
                    TABEL 1: PENGGUNA TERVERIFIKASI (STAFF & UMUM)
                    ========================================= */}
                <div className="mb-10 overflow-hidden rounded-xl border border-sidebar-border bg-white shadow-sm dark:bg-neutral-900">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 text-[10px] font-black tracking-widest uppercase dark:bg-neutral-800">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50">
                            
                            {/* Staff */}
                            <tr className="bg-neutral-100/80 dark:bg-neutral-800/80">
                                <td colSpan={4} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                                    Admin & Pakar (Staff)
                                </td>
                            </tr>
                            {staffUsers.length > 0 ? (
                                staffUsers.map(renderRow)
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-neutral-500 italic">
                                        Belum ada staff terdaftar.
                                    </td>
                                </tr>
                            )}

                            {/* Pengguna Umum */}
                            <tr className="border-t-2 border-neutral-200 bg-neutral-100/80 dark:border-neutral-700 dark:bg-neutral-800/80">
                                <td colSpan={4} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                                    Pengguna Umum
                                </td>
                            </tr>
                            {generalUsers.length > 0 ? (
                                generalUsers.map(renderRow)
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-neutral-500 italic">
                                        Belum ada pengguna umum terdaftar.
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

                {/* =========================================
                    TABEL 2: PENGGUNA BELUM VERIFIKASI (PENDING)
                    ========================================= */}
                {unverifiedUsers.length > 0 && (
                    <div className="mb-10">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-700 dark:text-neutral-300">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            Menunggu Verifikasi Email
                        </h3>
                        <div className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm dark:border-amber-900/50 dark:bg-neutral-900">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-amber-50 text-[10px] font-black tracking-widest uppercase text-amber-800 dark:bg-amber-900/20 dark:text-amber-500">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/50">
                                    {unverifiedUsers.map(renderRow)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {/* Pagination */}
                {users.links && (
                    <div className="mt-6 flex justify-center gap-2">
                        {users.links.map((link: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-4 py-2 text-sm ${
                                    link.active
                                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                        : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                }`}
                                disabled={!link.url}
                            />
                        ))}
                    </div>
                )}

                {/* MODAL RESET */}
                {isResetModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-neutral-900 shadow-2xl dark:bg-neutral-900 dark:text-white">
                            <h3 className="mb-4 text-xl font-bold">Reset Password: {selectedUser.name}</h3>
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Password Baru"
                                    className="w-full rounded-xl border border-sidebar-border bg-white p-3 dark:bg-neutral-800 dark:text-white"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    minLength={8}
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsResetModal(false)}
                                        className="flex-1 rounded-xl border border-neutral-300 py-3 font-bold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.password}
                                        className="flex-1 rounded-xl bg-neutral-900 py-3 font-bold text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
                                    >
                                        {processing ? 'Memproses...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}