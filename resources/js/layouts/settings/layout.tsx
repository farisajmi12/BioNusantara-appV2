import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, toUrl } from '@/lib/utils'; // Pastikan toUrl di-import
import type { NavItem, BreadcrumbItem } from '@/types';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { show as showTwoFactor } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';

const sidebarNavItems: NavItem[] = [
    { title: 'Profile', href: editProfile() },
    { title: 'Password', href: editPassword() },
    { title: 'Two-Factor Auth', href: showTwoFactor() },
    { title: 'Appearance', href: editAppearance() },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { url } = usePage();

    // Fungsi pengecekan yang menerima string
    const checkActive = (hrefString: string) => url === hrefString || url.startsWith(hrefString);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Settings', href: editProfile() },
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-6">
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                />

                <div className="flex flex-col lg:flex-row lg:space-x-12 mt-8">
                    <aside className="w-full max-w-xl lg:w-48">
                        <nav className="flex flex-col space-y-1" aria-label="Settings">
                            {sidebarNavItems.map((item, index) => (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        // FIX: Pakai toUrl(item.href) supaya tipenya jadi string!
                                        'bg-muted font-semibold': checkActive(toUrl(item.href)),
                                    })}
                                >
                                    <Link href={item.href}>
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="flex-1 md:max-w-2xl">
                        <section className="max-w-xl space-y-12">
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}