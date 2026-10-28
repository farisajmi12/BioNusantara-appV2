import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        /* Kita bungkus templatenya dengan div gradasi agar nyambung dengan Beranda */
        <div className="min-h-screen w-full bg-lineara-to-b from-[#ecfdf5] via-white to-[#fffbeb]">
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </div>
    );
}