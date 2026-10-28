import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import DashboardLayout from '@/layouts/dashboard-layout';

interface Props {
    isGuest: boolean;
    latest: { status: 'pending' | 'approved' | 'rejected'; rejection_reason: string | null } | null;
    defaults: { full_name: string; email: string };
}

function ApplicationForm({ isGuest, latest, defaults }: Props) {
    const page = usePage<any>();
    const flashSuccess: string | undefined = page.props.flash?.success;

    const { data, setData, post, processing, errors, reset } = useForm<{
        full_name: string;
        email: string;
        password: string;
        password_confirmation: string;
        institution: string;
        bio: string;
        credential: File | null;
    }>({
        full_name: defaults.full_name,
        email: defaults.email,
        password: '',
        password_confirmation: '',
        institution: '',
        bio: '',
        credential: null,
    });

    const isPending = latest?.status === 'pending';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/ajukan-pakar', {
            forceFormData: true,
            onSuccess: () =>
                reset('institution', 'bio', 'credential', 'password', 'password_confirmation'),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            {flashSuccess && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    {flashSuccess}
                </div>
            )}

            {isPending && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    Pengajuan Anda sedang menunggu verifikasi admin.
                </div>
            )}

            {latest?.status === 'rejected' && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    Pengajuan sebelumnya ditolak. Alasan: {latest.rejection_reason}
                </div>
            )}

            <div className="grid gap-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                    id="full_name"
                    value={data.full_name}
                    onChange={(e) => setData('full_name', e.target.value)}
                />
                <InputError message={errors.full_name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">
                    {isGuest ? 'Email (juga dipakai untuk login)' : 'Email akun (hasil dikirim ke sini)'}
                </Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    readOnly={!isGuest}
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} />
            </div>

            {isGuest && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </div>
                </>
            )}

            <div className="grid gap-2">
                <Label htmlFor="institution">Asal Institusi (Kampus / Lembaga Riset)</Label>
                <Input
                    id="institution"
                    value={data.institution}
                    onChange={(e) => setData('institution', e.target.value)}
                />
                <InputError message={errors.institution} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="bio">Bio / Fokus Kepakaran</Label>
                <textarea
                    id="bio"
                    rows={4}
                    value={data.bio}
                    onChange={(e) => setData('bio', e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent p-2 text-sm"
                />
                <InputError message={errors.bio} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="credential">
                    Kredensial (CV / Sertifikat / Daftar Publikasi), PDF/JPG/PNG maks 5MB
                </Label>
                <Input
                    id="credential"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setData('credential', e.target.files?.[0] ?? null)}
                />
                <InputError message={errors.credential} />
            </div>

            <InputError message={(errors as any).general} />

            <Button type="submit" disabled={processing || isPending} className="w-full">
                Kirim Pengajuan
            </Button>

            {isGuest && (
                <div className="text-center text-sm text-muted-foreground">
                    Sudah punya akun?{' '}
                    <TextLink href="/login">Masuk, lalu ajukan dari akun Anda</TextLink>
                </div>
            )}
        </form>
    );
}

export default function Create(props: Props) {
    if (props.isGuest) {
        return (
            <AuthLayout
                title="Ajukan Diri Sebagai Pakar"
                description="Isi data berikut. Akun Anda dibuat otomatis dan pengajuan diverifikasi admin."
            >
                <Head title="Ajukan Sebagai Pakar" />
                <ApplicationForm {...props} />
            </AuthLayout>
        );
    }

    return (
        <DashboardLayout breadcrumbs={[{ title: 'Pengajuan Pakar', href: '/ajukan-pakar' }]}>
            <Head title="Ajukan Sebagai Pakar" />
            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div>
                    <h2 className="text-2xl font-bold">Ajukan Diri Sebagai Pakar</h2>
                    <p className="text-sm text-neutral-500">
                        Data Anda akan diverifikasi admin. Hasilnya dikirim ke email akun Anda.
                    </p>
                </div>
                <ApplicationForm {...props} />
            </div>
        </DashboardLayout>
    );
}