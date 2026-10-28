import { Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    Folder, 
    LayoutGrid, 
    Users, 
    Leaf, 
    Shield, 
    Camera,
    CheckCircle,
    Settings,
    BarChart,
    Map,
    FileText,
    Award
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { UserCheck } from 'lucide-react';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const getMainNavItems = (): NavItem[] => {
        const items: NavItem[] = [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
        ];

        if (!user) return items;

        const roleId = user.role_id; 

        // 1. MENU ADMIN (role_id === 1)
        if (roleId === 1) {
            items.push(
                { title: 'Manajemen User', href: '/admin/users', icon: Users },
                { title: 'Manajemen Spesies', href: '/admin/spesies', icon: Leaf },
                { title: 'Verifikasi Ahli', href: '/admin/verifikasi-ahli', icon: Award },
            );
        } 
        
        // 2. MENU EXPERT (role_id === 2)
        else if (roleId === 2) {
            items.push(
                { title: 'Verifikasi Observasi', href: '/expert/verifikasi', icon: CheckCircle },
                { title: 'Validasi Spesies', href: '/expert/validasi', icon: Shield },
                { title: 'Riwayat Verifikasi', href: '/expert/riwayat', icon: FileText },
            );
        } 
        
        // 3. MENU USER (role_id === 3)
        else {
            items.push(
                { title: 'Buat Observasi', href: '/user/observasi/buat', icon: Camera },
                { title: 'Riwayat Observasi', href: '/user/observasi/riwayat', icon: FileText },
                { title: 'Kontribusi Saya', href: '/user/kontribusi', icon: Award },
                { title: 'Ajukan Jadi Pakar', href: '/ajukan-pakar', icon: UserCheck }
            );
        }

        return items;
    };

    const mainNavItems = getMainNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}