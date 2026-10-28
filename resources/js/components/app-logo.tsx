import { Link } from '@inertiajs/react';

import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    href?: string;
    subtext?: string;
}

export default function AppLogo({ href = '/', subtext = 'Kembali ke Beranda' }: AppLogoProps) {
    return (
        <Link href={href} className="group flex items-center gap-3">
            <AppLogoIcon className="h-10 w-10 object-contain transition-transform group-hover:scale-[1.02]" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-semibold leading-tight transition-colors group-hover:text-sidebar-primary">
                    BioNusantara
                </span>
                {subtext && (
                    <span className="text-[10px] leading-none text-muted-foreground">{subtext}</span>
                )}
            </div>
        </Link>
    );
}