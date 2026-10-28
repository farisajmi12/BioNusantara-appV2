import { Link } from '@inertiajs/react';
import {
    AnimatePresence,
    animate,
    motion,
    useInView,
    useReducedMotion,
} from 'framer-motion';
import {
    ArrowRight,
    Binoculars,
    Bird,
    Camera,
    CheckCircle,
    Leaf,
    Map,
    MapPin,
    Microscope,
    PawPrint,
    Search,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

// Foto latar hero (taruh file di public/images/hero/)
const heroImages = [
    '/images/hero/hero-1.jpg',
    '/images/hero/hero-2.jpg',
    '/images/hero/hero-3.jpg',
    '/images/hero/hero-4.jpg',
];

const SLIDE_INTERVAL = 6000; // milidetik per foto

/* ---------- Satwa endemik (dikirim dari WelcomeController) ---------- */

type SpeciesItem = {
    id: number;
    name: string;
    scientific: string;
    category: string;
    photo: string;
};

/* ---------- Peta mini Indonesia (SVG sederhana) ---------- */

type LonLat = [number, number];

const MAP_W = 960;
const MAP_H = 360;
const LON_MIN = 94;
const LON_MAX = 142;
const LAT_MAX = 7.5;
const LAT_MIN = -10.5;
const SCALE = 20; // piksel per derajat (48 derajat x 18 derajat = 960 x 360)

const sx = (lon: number) => (lon - LON_MIN) * SCALE;
const sy = (lat: number) => (LAT_MAX - lat) * SCALE;

const toPath = (pts: LonLat[]) =>
    pts
        .map(
            ([lon, lat], i) =>
                `${i === 0 ? 'M' : 'L'}${sx(lon).toFixed(1)} ${sy(lat).toFixed(1)}`,
        )
        .join(' ') + ' Z';

const landmasses: { name: string; points: LonLat[] }[] = [
    {
        name: 'Sumatera',
        points: [
            [95.3, 5.5],
            [97.5, 5.2],
            [98.8, 3.7],
            [100.4, 2.1],
            [102.2, 1.0],
            [103.8, -0.9],
            [104.8, -2.0],
            [106.0, -3.2],
            [106.0, -5.8],
            [104.6, -5.9],
            [102.3, -4.0],
            [100.4, -1.0],
            [98.7, 1.6],
            [97.1, 3.3],
        ],
    },
    {
        name: 'Jawa',
        points: [
            [105.2, -6.8],
            [106.8, -6.0],
            [110.5, -6.5],
            [112.8, -6.9],
            [114.5, -7.7],
            [114.4, -8.7],
            [111.0, -8.3],
            [107.5, -7.8],
            [105.5, -7.0],
        ],
    },
    {
        name: 'Kalimantan',
        points: [
            [109.0, 1.5],
            [109.7, 2.0],
            [111.3, 2.9],
            [113.0, 3.2],
            [115.2, 5.0],
            [116.8, 6.9],
            [117.7, 6.2],
            [119.2, 5.3],
            [118.0, 4.2],
            [117.5, 2.5],
            [118.9, 1.0],
            [117.6, 0.0],
            [117.5, -0.8],
            [116.2, -2.5],
            [116.0, -3.8],
            [114.6, -4.0],
            [113.0, -3.3],
            [111.5, -3.3],
            [110.2, -3.0],
            [110.0, -1.5],
            [109.0, -0.5],
            [108.9, 0.8],
        ],
    },
    {
        name: 'Sulawesi',
        points: [
            [119.7, 0.5],
            [120.3, 1.2],
            [122.8, 1.0],
            [124.8, 1.6],
            [125.2, 1.3],
            [123.9, 0.6],
            [121.9, 0.3],
            [121.3, -0.4],
            [122.3, -0.8],
            [123.3, -0.9],
            [122.0, -1.7],
            [121.6, -2.4],
            [122.6, -3.3],
            [122.4, -4.8],
            [121.6, -4.5],
            [121.0, -3.7],
            [121.2, -2.8],
            [120.4, -2.9],
            [120.5, -5.0],
            [119.7, -5.6],
            [119.4, -4.0],
            [118.9, -3.0],
            [119.5, -1.0],
            [119.8, -0.2],
        ],
    },
    {
        name: 'Papua',
        points: [
            [130.9, -0.9],
            [132.6, -0.3],
            [134.1, -0.9],
            [134.2, -2.9],
            [136.5, -2.2],
            [138.7, -1.8],
            [141.0, -2.6],
            [141.0, -9.1],
            [139.8, -8.1],
            [138.2, -8.3],
            [137.8, -7.0],
            [135.4, -4.5],
            [134.0, -3.9],
            [133.0, -3.6],
            [132.0, -2.8],
            [131.2, -1.8],
        ],
    },
    {
        name: 'Halmahera',
        points: [
            [127.4, 2.0],
            [128.2, 1.5],
            [128.0, 0.2],
            [128.4, -0.7],
            [127.8, -0.5],
            [127.6, 0.5],
            [127.3, 1.3],
        ],
    },
];

const smallIslands: { lon: number; lat: number; rx: number; ry: number }[] = [
    { lon: 115.2, lat: -8.4, rx: 0.35, ry: 0.2 }, // Bali
    { lon: 116.4, lat: -8.55, rx: 0.4, ry: 0.3 }, // Lombok
    { lon: 117.4, lat: -8.65, rx: 0.9, ry: 0.35 }, // Sumbawa
    { lon: 121.4, lat: -8.6, rx: 1.5, ry: 0.3 }, // Flores
    { lon: 120.0, lat: -9.9, rx: 0.9, ry: 0.3 }, // Sumba
    { lon: 124.5, lat: -9.4, rx: 1.5, ry: 0.4 }, // Timor
    { lon: 129.5, lat: -3.1, rx: 1.3, ry: 0.4 }, // Seram
    { lon: 126.6, lat: -3.4, rx: 0.6, ry: 0.5 }, // Buru
    { lon: 106.0, lat: -2.3, rx: 0.7, ry: 0.5 }, // Bangka
    { lon: 107.9, lat: -2.8, rx: 0.5, ry: 0.4 }, // Belitung
    { lon: 113.3, lat: -7.0, rx: 0.6, ry: 0.15 }, // Madura
    { lon: 97.6, lat: 1.1, rx: 0.3, ry: 0.6 }, // Nias
];

// Titik contoh sebaran satwa endemik (lokasi ilustratif)
const mapPins: { name: string; lon: number; lat: number; delay: number }[] = [
    { name: 'Orangutan Sumatera', lon: 97.4, lat: 3.7, delay: 0 },
    { name: 'Harimau Sumatera', lon: 101.8, lat: -2.2, delay: 0.5 },
    { name: 'Badak Jawa', lon: 105.3, lat: -6.7, delay: 1.0 },
    { name: 'Jalak Bali', lon: 114.6, lat: -8.2, delay: 1.5 },
    { name: 'Orangutan Kalimantan', lon: 112.2, lat: -2.0, delay: 0.3 },
    { name: 'Komodo', lon: 119.5, lat: -8.6, delay: 0.8 },
    { name: 'Anoa', lon: 121.7, lat: -2.5, delay: 1.3 },
    { name: 'Tarsius', lon: 124.8, lat: 1.5, delay: 0.2 },
    { name: 'Cendrawasih Botak', lon: 130.8, lat: -0.3, delay: 0.9 },
    { name: 'Cenderawasih Kuning Besar', lon: 138.0, lat: -3.7, delay: 1.6 },
];

/* ---------- Lainnya ---------- */

const steps = [
    {
        title: 'Temukan & Foto',
        icon: Camera,
        color: 'from-emerald-500 to-teal-600',
        desc: 'Temukan flora atau fauna unik di sekitar Anda dan ambil fotonya.',
    },
    {
        title: 'Upload & Identifikasi',
        icon: Search,
        color: 'from-amber-500 to-orange-600',
        desc: 'Unggah ke platform dan biarkan komunitas membantu identifikasi.',
    },
    {
        title: 'Validasi & Publikasi',
        icon: CheckCircle,
        color: 'from-blue-500 to-indigo-600',
        desc: 'Data divalidasi oleh pakar dan dipublikasikan untuk sains.',
    },
];

const highlightPrograms = [
    {
        title: 'Pemetaan Titik Keanekaragaman',
        icon: MapPin,
        description:
            'Bantu menandai area dengan temuan spesies tinggi untuk mendukung kebijakan konservasi berbasis data.',
    },
    {
        title: 'Pantau Spesies Kunci',
        icon: Binoculars,
        description:
            'Laporkan kemunculan spesies prioritas agar tren populasi dapat dipantau lebih cepat oleh peneliti.',
    },
    {
        title: 'Edukasi Warga Lokal',
        icon: Users,
        description:
            'Ajak komunitas sekitar mengenali Biodiversitas setempat melalui observasi sederhana di lingkungan sekitar.',
    },
];

const avatarColors = [
    'from-emerald-400 to-teal-600',
    'from-amber-400 to-orange-600',
    'from-sky-400 to-blue-600',
    'from-pink-400 to-rose-600',
    'from-violet-400 to-indigo-600',
];

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6 },
};

/* ------------------------------------------------------------------ */
/* KOMPONEN KECIL                                                      */
/* ------------------------------------------------------------------ */

function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;

        const controls = animate(0, value, {
            duration: 1.8,
            ease: 'easeOut',
            onUpdate: (v) => setDisplay(Math.round(v)),
        });

        return () => controls.stop();
    }, [inView, value]);

    return <span ref={ref}>{display.toLocaleString('id-ID')}</span>;
}

// Foto satwa. Jika file tidak ditemukan, tampil kotak hijau dengan ikon.
function SpeciesPhoto({
    src,
    alt,
    category,
    className = '',
}: {
    src: string;
    alt: string;
    category: string;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);
    const Icon = category === 'burung' ? Bird : PawPrint;

    if (failed) {
        return (
            <div
                className={`flex items-center justify-center bg-linear-to-br from-emerald-500 to-teal-600 text-white ${className}`}
            >
                <Icon className="h-1/2 w-1/2" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`object-cover ${className}`}
        />
    );
}

function SectionHeading({
    title,
    subtitle,
    light = false,
}: {
    title: string;
    subtitle: string;
    light?: boolean;
}) {
    return (
        <motion.div {...reveal} className="mx-auto mb-14 max-w-2xl text-center">
            <h2
                className={`text-4xl font-black tracking-tight md:text-5xl ${
                    light ? 'text-white' : 'text-neutral-900 dark:text-white'
                }`}
            >
                {title}
            </h2>
            <p
                className={`mt-4 text-lg ${
                    light ? 'text-emerald-100/80' : 'text-neutral-500'
                }`}
            >
                {subtitle}
            </p>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/* HALAMAN                                                             */
/* ------------------------------------------------------------------ */

type WelcomeProps = {
    canRegister: boolean;
    stats: {
        totalObservations: number;
        totalSpecies: number;
        activeContributors: number;
    };
    species?: SpeciesItem[];
};

const Welcome = ({ stats, species = [] }: WelcomeProps) => {
    const [current, setCurrent] = useState(0);
    const reduceMotion = useReducedMotion();

    // 6 satwa pertama untuk kartu galeri
    const featuredSpecies = species.slice(0, 6);
    // Ulang daftar jika terlalu sedikit agar pita berjalan tidak terlihat kosong
    const marqueeBase =
        species.length > 0 && species.length < 8
            ? [...species, ...species, ...species]
            : species;

    // Preload semua foto agar transisi tidak berkedip
    useEffect(() => {
        heroImages.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    // Ganti foto otomatis (timer di-reset setiap kali foto berganti)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % heroImages.length);
        }, SLIDE_INTERVAL);

        return () => clearInterval(timer);
    }, [current]);

    const statItems = [
        {
            title: 'Total Observasi',
            value: stats.totalObservations,
            icon: Binoculars,
            gradient: 'from-emerald-500 to-teal-600',
        },
        {
            title: 'Total Spesies',
            value: stats.totalSpecies,
            icon: Leaf,
            gradient: 'from-blue-500 to-indigo-600',
        },
        {
            title: 'Kontributor Aktif',
            value: stats.activeContributors,
            icon: Users,
            gradient: 'from-amber-500 to-orange-600',
        },
    ];

    return (
        <AppLayout>
            <div className="relative flex flex-col overflow-hidden bg-white dark:bg-neutral-950">
                {/* ============================================================ */}
                {/* HERO                                                         */}
                {/* ============================================================ */}
                <section className="relative flex min-h-[88vh] items-center overflow-hidden pt-24 pb-40 md:pt-28 md:pb-52">
                    {/* Layer foto */}
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-neutral-900 to-teal-950">
                        <AnimatePresence>
                            <motion.img
                                key={current}
                                src={heroImages[current]}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                                initial={{
                                    opacity: 0,
                                    scale: reduceMotion ? 1 : 1.12,
                                }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    opacity: { duration: 1.5 },
                                    scale: {
                                        duration: (SLIDE_INTERVAL + 1500) / 1000,
                                        ease: 'linear',
                                    },
                                }}
                            />
                        </AnimatePresence>

                        {/* Overlay gelap agar teks terbaca */}
                        <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/40 to-black/75" />
                        <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply" />
                    </div>

                    {/* Konten */}
                    <div className="relative z-10 container mx-auto w-full px-4">
                        <motion.div
                            className="mx-auto max-w-4xl text-center"
                            {...fadeUp}
                        >
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                                <Sparkles className="h-4 w-4 text-emerald-300" />
                                Platform citizen science biodiversitas Indonesia
                            </div>

                            <h1 className="mb-6 text-5xl leading-[1.1] font-black text-white drop-shadow-lg md:text-7xl">
                                Jelajahi & Lindungi
                                <br />
                                <span className="bg-linear-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                                    Biodiversitas
                                </span>{' '}
                                Nusantara
                            </h1>

                            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
                                Bergabunglah dengan ribuan warga dan ilmuwan
                                Indonesia untuk mendokumentasikan kekayaan hayati
                                lokal. Setiap observasi Anda berkontribusi pada
                                konservasi.
                            </p>

                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Link href="/jelajah?tab=galeri">
                                    <Button
                                        size="lg"
                                        className="h-14 rounded-2xl bg-emerald-600 px-8 text-base font-bold shadow-xl shadow-emerald-900/40 hover:bg-emerald-700"
                                    >
                                        <Camera className="mr-2 h-5 w-5" /> Lihat
                                        Galeri Spesies
                                    </Button>
                                </Link>

                                <Link href="/jelajah?tab=peta">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-14 rounded-2xl border-2 border-white/40 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
                                    >
                                        <Map className="mr-2 h-5 w-5" />{' '}
                                        Jelajahi Peta
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                                    Gratis untuk semua warga
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                    Divalidasi oleh pakar
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-emerald-300" />
                                    Terpetakan di seluruh Nusantara
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Indikator foto (dots) */}
                    <div className="absolute bottom-36 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-44">
                        {heroImages.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Tampilkan foto ${i + 1}`}
                                onClick={() => setCurrent(i)}
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    i === current
                                        ? 'w-8 bg-white'
                                        : 'w-2 bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                </section>

                {/* ============================================================ */}
                {/* STATISTIK (menumpuk di bawah hero)                           */}
                {/* ============================================================ */}
                <section className="relative z-20 -mt-24 px-4 md:-mt-28">
                    <div className="container mx-auto">
                        <motion.div
                            {...reveal}
                            className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-neutral-100 overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)] md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:ring-1 dark:ring-neutral-800"
                        >
                            {statItems.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-center gap-5 p-8"
                                >
                                    <div
                                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg ${item.gradient}`}
                                    >
                                        <item.icon className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black tracking-tighter text-neutral-900 md:text-5xl dark:text-white">
                                            <Counter value={item.value} />
                                        </h3>
                                        <p className="mt-1 text-xs font-bold tracking-[0.18em] text-neutral-400 uppercase">
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* PITA SATWA ENDEMIK                                           */}
                {/* ============================================================ */}
                {marqueeBase.length > 0 && (
                <section className="py-16">
                    <p className="mb-6 px-4 text-center text-sm font-semibold text-neutral-500">
                        Satwa endemik Nusantara yang dapat Anda temukan di
                        BioNusantara
                    </p>

                    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                        <motion.div
                            className="flex w-max gap-4"
                            animate={
                                reduceMotion ? undefined : { x: ['0%', '-50%'] }
                            }
                            transition={{
                                duration: 70,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            {[...marqueeBase, ...marqueeBase].map(
                                (sp, i) => (
                                    <div
                                        key={`${sp.id}-${i}`}
                                        className="flex shrink-0 items-center gap-3 rounded-full border border-emerald-100 bg-emerald-50 py-1.5 pr-6 pl-1.5 dark:border-emerald-900/50 dark:bg-emerald-950/40"
                                    >
                                        <SpeciesPhoto
                                            src={sp.photo}
                                            alt={sp.name}
                                            category={sp.category}
                                            className="h-11 w-11 shrink-0 rounded-full"
                                        />
                                        <div className="text-left">
                                            <p className="text-sm leading-tight font-bold whitespace-nowrap text-emerald-900 dark:text-emerald-200">
                                                {sp.name}
                                            </p>
                                            <p className="text-[11px] leading-tight whitespace-nowrap text-emerald-700/80 italic dark:text-emerald-400/80">
                                                {sp.scientific}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </motion.div>
                    </div>
                </section>
                )}

                {/* ============================================================ */}
                {/* CARA KERJA                                                   */}
                {/* ============================================================ */}
                <section className="relative pt-8 pb-28">
                    <div className="container mx-auto px-4">
                        <SectionHeading
                            title="Bagaimana Cara Kerjanya?"
                            subtitle="Tiga langkah sederhana untuk memulai kontribusi ilmiah Anda."
                        />

                        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                            {/* Garis penghubung */}
                            <div className="absolute top-[3.25rem] right-[17%] left-[17%] hidden border-t-2 border-dashed border-emerald-200 md:block dark:border-emerald-900" />

                            {steps.map((step, i) => (
                                <motion.div
                                    key={step.title}
                                    {...reveal}
                                    transition={{
                                        duration: 0.6,
                                        delay: i * 0.12,
                                    }}
                                    className="relative rounded-[2rem] border border-neutral-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div
                                        className={`relative mx-auto mb-6 flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-3xl bg-linear-to-br text-white shadow-lg ${step.color}`}
                                    >
                                        <step.icon className="h-10 w-10" />
                                        <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-neutral-900 shadow-md ring-2 ring-neutral-100 dark:bg-neutral-950 dark:text-white dark:ring-neutral-800">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* BENTO FITUR                                                  */}
                {/* ============================================================ */}
                <section className="bg-neutral-50 py-24 dark:bg-neutral-900/40">
                    <div className="container mx-auto px-4">
                        <SectionHeading
                            title="Semua yang Anda Butuhkan"
                            subtitle="Dari memetakan temuan hingga validasi pakar, semuanya dalam satu platform."
                        />

                        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
                            {/* Peta mini */}
                            <motion.div
                                {...reveal}
                                className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white md:col-span-2"
                            >
                                <div className="mb-5 flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                                        <Map className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold md:text-3xl">
                                            Peta Sebaran Interaktif
                                        </h3>
                                        <p className="mt-1 max-w-md text-emerald-50/90">
                                            Lihat di mana saja spesies
                                            ditemukan dan pelajari pola
                                            persebarannya di seluruh Nusantara.
                                        </p>
                                    </div>
                                </div>

                                {/* Peta mini Indonesia */}
                                <div
                                    className="relative w-full rounded-2xl ring-1 ring-white/20"
                                    style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
                                >
                                    <div className="absolute inset-0 overflow-hidden rounded-2xl bg-teal-950/50">
                                        <svg
                                            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                                            className="h-full w-full"
                                            role="img"
                                            aria-label="Peta mini kepulauan Indonesia"
                                        >
                                            {/* Garis lintang & bujur */}
                                            {[100, 110, 120, 130, 140].map(
                                                (lon) => (
                                                    <line
                                                        key={`lon-${lon}`}
                                                        x1={sx(lon)}
                                                        x2={sx(lon)}
                                                        y1={0}
                                                        y2={MAP_H}
                                                        stroke="rgba(255,255,255,0.1)"
                                                        strokeWidth={1}
                                                    />
                                                ),
                                            )}
                                            {[5, 0, -5, -10].map((lat) => (
                                                <line
                                                    key={`lat-${lat}`}
                                                    x1={0}
                                                    x2={MAP_W}
                                                    y1={sy(lat)}
                                                    y2={sy(lat)}
                                                    stroke={
                                                        lat === 0
                                                            ? 'rgba(255,255,255,0.22)'
                                                            : 'rgba(255,255,255,0.1)'
                                                    }
                                                    strokeWidth={1}
                                                    strokeDasharray={
                                                        lat === 0 ? '6 6' : undefined
                                                    }
                                                />
                                            ))}

                                            {/* Pulau besar */}
                                            {landmasses.map((land) => (
                                                <path
                                                    key={land.name}
                                                    d={toPath(land.points)}
                                                    fill="rgba(209,250,229,0.85)"
                                                    stroke="rgba(255,255,255,0.6)"
                                                    strokeWidth={1}
                                                    strokeLinejoin="round"
                                                >
                                                    <title>{land.name}</title>
                                                </path>
                                            ))}

                                            {/* Pulau kecil */}
                                            {smallIslands.map((isle, i) => (
                                                <ellipse
                                                    key={i}
                                                    cx={sx(isle.lon)}
                                                    cy={sy(isle.lat)}
                                                    rx={isle.rx * SCALE}
                                                    ry={isle.ry * SCALE}
                                                    fill="rgba(209,250,229,0.85)"
                                                    stroke="rgba(255,255,255,0.6)"
                                                    strokeWidth={1}
                                                />
                                            ))}
                                        </svg>
                                    </div>

                                    {/* Titik satwa endemik */}
                                    {mapPins.map((pin) => (
                                        <span
                                            key={pin.name}
                                            className="group absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center hover:z-30"
                                            style={{
                                                left: `${((pin.lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100}%`,
                                                top: `${((LAT_MAX - pin.lat) / (LAT_MAX - LAT_MIN)) * 100}%`,
                                            }}
                                        >
                                            <span className="relative flex h-3 w-3">
                                                <motion.span
                                                    className="absolute inset-0 rounded-full bg-amber-300"
                                                    animate={
                                                        reduceMotion
                                                            ? undefined
                                                            : {
                                                                  scale: [1, 3],
                                                                  opacity: [
                                                                      0.7, 0,
                                                                  ],
                                                              }
                                                    }
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: pin.delay,
                                                    }}
                                                />
                                                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-amber-400" />
                                            </span>
                                            <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-md bg-neutral-900/90 px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                {pin.name}
                                            </span>
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-emerald-50/75">
                                        Contoh lokasi sebaran satwa endemik.
                                        Arahkan kursor ke titik kuning.
                                    </p>
                                    <Link
                                        href="/jelajah?tab=peta"
                                        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 transition-transform hover:scale-105"
                                    >
                                        Buka peta lengkap{' '}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Galeri satwa endemik */}
                            <motion.div
                                {...reveal}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="flex flex-col rounded-[2rem] border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="mb-6 grid grid-cols-3 gap-2">
                                    {featuredSpecies.map((sp) => (
                                        <div
                                            key={sp.id}
                                            className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
                                        >
                                            <SpeciesPhoto
                                                src={sp.photo}
                                                alt={sp.name}
                                                category={sp.category}
                                                className="h-full w-full"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-1.5 pt-5 pb-1">
                                                <p className="truncate text-[10px] leading-tight font-semibold text-white">
                                                    {sp.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                    Galeri Spesies
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                    Telusuri koleksi satwa endemik Nusantara
                                    lengkap dengan nama ilmiahnya.
                                </p>
                                <Link
                                    href="/jelajah?tab=galeri"
                                    className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                                >
                                    Lihat galeri{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </motion.div>

                            {/* Validasi pakar */}
                            <motion.div
                                {...reveal}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="rounded-[2rem] border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                    Validasi oleh Pakar
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                    Setiap observasi ditinjau pakar biodiversitas
                                    agar data tetap akurat dan dapat dipakai
                                    untuk riset.
                                </p>
                                <Link
                                    href="/ajukan-pakar"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                                >
                                    Daftar sebagai pakar{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </motion.div>

                            {/* Komunitas */}
                            <motion.div
                                {...reveal}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-col justify-between gap-6 rounded-[2rem] border border-neutral-100 bg-white p-8 md:col-span-2 md:flex-row md:items-center dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="max-w-md">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                        Komunitas Citizen Scientist
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                        Siapa pun bisa berkontribusi. Dari
                                        pelajar hingga peneliti, semua berperan
                                        menjaga kekayaan hayati Indonesia.
                                    </p>
                                </div>

                                <div className="flex flex-col items-start gap-3 md:items-end">
                                    <div className="flex -space-x-3">
                                        {avatarColors.map((c, i) => (
                                            <div
                                                key={i}
                                                className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-linear-to-br text-white dark:border-neutral-900 ${c}`}
                                            >
                                                <Users className="h-5 w-5" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                                        {stats.activeContributors.toLocaleString(
                                            'id-ID',
                                        )}{' '}
                                        kontributor aktif
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* FOKUS PROGRAM (latar gelap)                                  */}
                {/* ============================================================ */}
                <section className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-neutral-900 to-teal-950 py-24">
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                    <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

                    <div className="relative container mx-auto px-4">
                        <SectionHeading
                            light
                            title="Fokus Program Komunitas"
                            subtitle="Area kontribusi yang paling dibutuhkan minggu ini untuk mendukung riset nasional."
                        />

                        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
                            {highlightPrograms.map((program, i) => (
                                <motion.div
                                    key={program.title}
                                    {...reveal}
                                    transition={{
                                        duration: 0.6,
                                        delay: i * 0.12,
                                    }}
                                    className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:bg-white/10"
                                >
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                                        <program.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        {program.title}
                                    </h3>
                                    <p className="mt-4 text-sm leading-relaxed text-emerald-100/70">
                                        {program.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* CTA PAKAR & KONTRIBUTOR                                      */}
                {/* ============================================================ */}
                <section className="px-4 py-24">
                    <motion.div
                        {...reveal}
                        className="relative container mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 p-10 text-white md:p-16"
                    >
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle, rgba(255,255,255,0.3) 1.5px, transparent 1.5px)',
                                backgroundSize: '22px 22px',
                            }}
                        />
                        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative grid items-center gap-10 md:grid-cols-2">
                            <div>
                                <h2 className="text-4xl leading-tight font-black md:text-5xl">
                                    Siap berkontribusi untuk alam Indonesia?
                                </h2>
                                <p className="mt-4 max-w-md text-lg text-emerald-50/90">
                                    Mulai sebagai kontributor, atau ajukan diri
                                    sebagai pakar jika Anda ahli di bidang
                                    spesies.
                                </p>

                                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                    <Link href="/register">
                                        <Button
                                            size="lg"
                                            className="h-14 rounded-2xl bg-white px-8 text-base font-bold text-emerald-700 hover:bg-emerald-50"
                                        >
                                            <Camera className="mr-2 h-5 w-5" />{' '}
                                            Mulai Berkontribusi
                                        </Button>
                                    </Link>
                                    <Link href="/ajukan-pakar">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="h-14 rounded-2xl border-2 border-white/50 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                                        >
                                            <Microscope className="mr-2 h-5 w-5" />{' '}
                                            Ajukan sebagai Pakar
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                                <h3 className="mb-5 text-lg font-bold">
                                    Untuk Anda yang seorang pakar
                                </h3>
                                <ul className="space-y-4 text-emerald-50/95">
                                    {[
                                        'Validasi temuan spesies dari warga',
                                        'Bantu menjaga kualitas data ilmiah',
                                        'Pengajuan ditinjau admin dan hasilnya dikirim ke email',
                                    ].map((text) => (
                                        <li
                                            key={text}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                                            <span className="text-sm leading-relaxed">
                                                {text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ============================================================ */}
                {/* FOOTER                                                       */}
                {/* ============================================================ */}
                <footer className="bg-white pt-4 pb-16 dark:bg-neutral-950">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center justify-between gap-8 border-t border-neutral-100 pt-12 md:flex-row dark:border-neutral-900">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="mb-4 flex items-center gap-2 text-2xl font-black text-neutral-900 dark:text-white">
                                    BioNusantara
                                </div>
                                <p className="text-center text-sm text-neutral-500 md:text-left">
                                    © 2026 Platform citizen science untuk
                                    biodiversitas Indonesia.
                                    <br />
                                    Membangun data sains masa depan melalui
                                    kontribusi warga.
                                </p>
                                <div className="mt-4 flex gap-5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    <Link
                                        href="/jelajah?tab=galeri"
                                        className="hover:text-emerald-600"
                                    >
                                        Galeri
                                    </Link>
                                    <Link
                                        href="/jelajah?tab=peta"
                                        className="hover:text-emerald-600"
                                    >
                                        Peta
                                    </Link>
                                    <Link
                                        href="/ajukan-pakar"
                                        className="hover:text-emerald-600"
                                    >
                                        Ajukan Pakar
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                                    Supported by
                                </span>
                                <div className="flex items-center gap-6">
                                    <img
                                        src="/images/logoBRIN.png"
                                        alt="Logo BRIN"
                                        className="h-12 w-auto grayscale transition-all hover:grayscale-0"
                                    />
                                    {/* Tambahkan logo partner lain di sini */}
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
};

export default Welcome;
