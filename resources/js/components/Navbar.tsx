import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    Home,
    LayoutDashboard,
    LogIn,
    LogOut,
    Map,
    Menu,
    User,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { auth } = usePage().props as any;
    const { url } = usePage();

    const isLoggedIn = !!auth?.user;
    const isPrivateMode = url.startsWith('/dashboard') || url.startsWith('/observasi');

    const isActive = (path: string) => url === path || url.startsWith(`${path}/`);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-3">
                    <img
                        src="/images/logo_bionus.svg"
                        alt="BioNusantara Logo"
                        className="h-10 w-10 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                    <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                        BioNusantara
                    </span>
                </Link>

                {/* ============================== */}
                {/* DESKTOP MENU */}
                {/* ============================== */}
                <div className="ml-auto hidden items-center gap-1 md:flex">
                    {!isPrivateMode ? (
                        <>
                            <Link href="/">
                                <Button variant={isActive('/') ? 'default' : 'ghost'} size="sm" className="gap-2">
                                    <Home className="h-4 w-4" /> Beranda
                                </Button>
                            </Link>
                            <Link href="/jelajah">
                                <Button
                                    variant={isActive('/jelajah') ? 'default' : 'ghost'}
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Map className="h-4 w-4" /> Jelajah
                                </Button>
                            </Link>
                            <div className="mx-2 h-6 w-px bg-border" />
                            
                            {!isLoggedIn ? (
                                // JIKA BELUM LOGIN DI BERANDA
                                <Link href="/login">
                                    <Button
                                        size="sm"
                                        className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                    >
                                        <LogIn className="h-4 w-4" /> Masuk
                                    </Button>
                                </Link>
                            ) : (
                                // JIKA SUDAH LOGIN DI BERANDA (Munculkan Profil & Logout)
                                <div className="flex items-center gap-2">
                                    <div className="mr-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <span>Halo, {auth?.user?.name || 'User'}!</span>
                                    </div>
                                    <Link href="/dashboard">
                                        <Button
                                            size="sm"
                                            className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                        >
                                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleLogout}
                                        // PERBAIKAN WARNA TOMBOL LOGOUT
                                        className="text-red-500 hover:bg-red-600 hover:text-white transition-colors border-transparent hover:border-red-600"
                                        title="Keluar"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        // MENU SAAT BERADA DI DALAM DASHBOARD / PRIVATE MODE
                        <>
                            <Link href="/dashboard">
                                <Button
                                    variant={isActive('/dashboard') ? 'default' : 'ghost'}
                                    size="sm"
                                    className="gap-2"
                                >
                                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                                </Button>
                            </Link>
                            <Link href="/observasi">
                                <Button
                                    variant={isActive('/observasi') ? 'default' : 'ghost'}
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Camera className="h-4 w-4" /> Observasi
                                </Button>
                            </Link>
                            <div className="mx-3 h-6 w-px bg-border" />
                            <div className="mr-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                                    <User className="h-4 w-4" />
                                </div>
                                <span>Halo, {auth?.user?.name || 'User'}!</span>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleLogout}
                                // PERBAIKAN WARNA TOMBOL LOGOUT
                                className="text-red-500 hover:bg-red-600 hover:text-white transition-colors border-transparent hover:border-red-600"
                                title="Keluar"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>

                {/* TOMBOL MENU MOBILE */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto md:hidden"
                    onClick={() => setMobileOpen((prev) => !prev)}
                >
                    {mobileOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* ============================== */}
            {/* MOBILE MENU */}
            {/* ============================== */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t bg-background md:hidden"
                    >
                        <div className="flex flex-col gap-1 p-4">
                            {!isPrivateMode ? (
                                <>
                                    <Link href="/" onClick={() => setMobileOpen(false)}>
                                        <Button
                                            variant={isActive('/') ? 'default' : 'ghost'}
                                            className="w-full justify-start gap-2"
                                        >
                                            <Home className="h-4 w-4" /> Beranda
                                        </Button>
                                    </Link>
                                    <Link href="/jelajah" onClick={() => setMobileOpen(false)}>
                                        <Button
                                            variant={isActive('/jelajah') ? 'default' : 'ghost'}
                                            className="w-full justify-start gap-2"
                                        >
                                            <Map className="h-4 w-4" /> Jelajah
                                        </Button>
                                    </Link>
                                    
                                    <div className="my-2 h-px w-full bg-border" />

                                    {!isLoggedIn ? (
                                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                                            <Button className="mt-2 w-full justify-start gap-2 bg-primary text-primary-foreground">
                                                <LogIn className="h-4 w-4" /> Masuk
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground">
                                                <User className="h-4 w-4 text-primary" />
                                                <span>Halo, {auth?.user?.name || 'User'}!</span>
                                            </div>
                                            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                                                <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground">
                                                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                onClick={handleLogout}
                                                // PERBAIKAN WARNA TOMBOL LOGOUT MOBILE
                                                className="w-full justify-start gap-2 text-red-500 hover:bg-red-600 hover:text-white mt-1 border-transparent hover:border-red-600"
                                            >
                                                <LogOut className="h-4 w-4" /> Keluar
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                                        <Button
                                            variant={isActive('/dashboard') ? 'default' : 'ghost'}
                                            className="w-full justify-start gap-2"
                                        >
                                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/observasi" onClick={() => setMobileOpen(false)}>
                                        <Button
                                            variant={isActive('/observasi') ? 'default' : 'ghost'}
                                            className="w-full justify-start gap-2"
                                        >
                                            <Camera className="h-4 w-4" /> Observasi
                                        </Button>
                                    </Link>
                                    <div className="my-2 h-px w-full bg-border" />
                                    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground">
                                        <User className="h-4 w-4 text-primary" />
                                        <span>Halo, {auth?.user?.name || 'User'}!</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleLogout}
                                        // PERBAIKAN WARNA TOMBOL LOGOUT MOBILE
                                        className="w-full justify-start gap-2 text-red-500 hover:bg-red-600 hover:text-white mt-1 border-transparent hover:border-red-600"
                                    >
                                        <LogOut className="h-4 w-4" /> Keluar
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;