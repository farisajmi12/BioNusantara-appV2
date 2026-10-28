import { router } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Filter, Grid3X3, Map, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

type ExploreTab = 'peta' | 'galeri';

if ((L.Icon.Default.prototype as any)._getIconUrl) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
}

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const VALID_TABS: ExploreTab[] = ['peta', 'galeri'];
const CATEGORIES = ['Semua', 'Hoya', 'Kayu', 'Plankton'];

const getTabFromLocation = (): ExploreTab => {
    if (typeof window === 'undefined') return 'peta';

    const tab = new URLSearchParams(window.location.search).get('tab');
    return VALID_TABS.includes(tab as ExploreTab) ? (tab as ExploreTab) : 'peta';
};

// ==========================================
// FUNGSI UNTUK MERAKIT URL GAMBAR OTOMATIS
// ==========================================
const getSpeciesImageUrl = (category: string, scientificName: string, dbPhotoUrl: string) => {
    if (dbPhotoUrl && dbPhotoUrl !== '/placeholder.svg' && dbPhotoUrl !== '') {
        return dbPhotoUrl;
    }
    
    const folder = category.toLowerCase();
    
    const fileName = scientificName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    
    return `/images/${folder}/${fileName}.jpg`;
};

// Fungsi helper untuk mendapatkan gambar observasi user
const getObservationImageUrl = (observation: any) => {
    if (observation?.photos && observation.photos.length > 0 && observation.photos[0].file_path) {
        return `/storage/${observation.photos[0].file_path}`;
    }
    return '/images/placeholder.jpg';
};

const Jelajah = ({ species = [], observations = [] }: { species: any[], observations: any[] }) => {
    const [activeTab, setActiveTab] = useState<ExploreTab>(() => getTabFromLocation());
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handlePopState = () => setActiveTab(getTabFromLocation());

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const filteredSpecies = useMemo(() => {
        const keyword = search.toLowerCase();

        return species.filter((s) => {
            const matchSearch =
                s.commonName.toLowerCase().includes(keyword) ||
                s.scientificName.toLowerCase().includes(keyword);

            const matchCategory =
                selectedCategory === 'Semua' || s.category === selectedCategory;

            return matchSearch && matchCategory;
        });
    }, [search, selectedCategory, species]);

    const speciesObservations = useMemo(() => {
        if (!selectedSpecies) return [];
        return observations.filter(
            (obs) => obs.speciesName === selectedSpecies,
        );
    }, [selectedSpecies, observations]);

    const onTabChange = (value: string) => {
        if (!VALID_TABS.includes(value as ExploreTab)) return;

        const nextTab = value as ExploreTab;
        setActiveTab(nextTab);

        if (typeof window === 'undefined') return;

        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set('tab', nextTab);
        window.history.replaceState({}, '', nextUrl.toString());
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-2 text-3xl font-bold">Jelajah Biodiversitas</h1>
                <p className="mb-6 text-muted-foreground">
                    Eksplorasi observasi yang sudah divalidasi
                </p>

                <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
                    <TabsList className="border border-border/70 bg-card/70 dark:bg-card/60">
                        <TabsTrigger value="peta" className="gap-2">
                            <Map className="h-4 w-4" /> Peta Interaktif
                        </TabsTrigger>
                        <TabsTrigger value="galeri" className="gap-2">
                            <Grid3X3 className="h-4 w-4" /> Galeri Spesies
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="peta">
                        <div
                            className="overflow-hidden rounded-lg border border-border/70 bg-card/70"
                            style={{ height: '500px' }}
                        >
                            <MapContainer
                                center={[-2.5, 118]}
                                zoom={5}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {observations.map((observation) => (
                                    <Marker
                                        key={observation.id}
                                        position={[Number(observation.latitude), Number(observation.longitude)]}
                                    >
                                        <Popup>
                                            <div className="w-52">
                                                {/* PERBAIKAN: Gunakan Helper getObservationImageUrl */}
                                                <img
                                                    src={getObservationImageUrl(observation)}
                                                    alt={observation.speciesName}
                                                    className="mb-2 h-32 w-full rounded object-cover"
                                                    onError={(event) => {
                                                        (event.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                    }}
                                                />
                                                <p className="font-bold">{observation.speciesName}</p>
                                                <p className="text-xs italic text-gray-500">
                                                    {observation.scientificName}
                                                </p>
                                                <p className="mt-1 text-xs">📅 {observation.date}</p>
                                                <p className="text-xs">👤 {observation.observer}</p>

                                                <Button
                                                    size="sm"
                                                    className="mt-2 w-full gap-2"
                                                    onClick={() =>
                                                        router.visit(`/detailSpesies/${observation.id}`)
                                                    }
                                                >
                                                    Lihat Detail
                                                </Button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value="galeri">
                        {selectedSpecies ? (
                            <div>
                                <button
                                    onClick={() => setSelectedSpecies(null)}
                                    className="mb-6 flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Spesies
                                </button>

                                {speciesObservations.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {speciesObservations.map((observation) => (
                                            <Card
                                                key={observation.id}
                                                className="overflow-hidden transition-all hover:shadow-md"
                                            >
                                                {/* PERBAIKAN: Gunakan Helper getObservationImageUrl */}
                                                <img
                                                    src={getObservationImageUrl(observation)}
                                                    alt={observation.speciesName}
                                                    className="h-48 w-full object-cover transition-transform hover:scale-105"
                                                    onError={(event) => {
                                                        (event.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                    }}
                                                />
                                                <CardContent className="p-4">
                                                    <p className="mb-1 text-xs text-muted-foreground">
                                                        📅 {observation.date} • 👤 {observation.observer}
                                                    </p>
                                                    <h3 className="text-lg font-bold">
                                                        {observation.speciesName}
                                                    </h3>
                                                    <p className="mb-3 text-sm italic text-muted-foreground">
                                                        {observation.scientificName}
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        className="mt-2 w-full gap-2"
                                                        onClick={() =>
                                                            router.visit(`/detailSpesies/${observation.id}`)
                                                        }
                                                    >
                                                        Lihat Detail
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border bg-muted/20 py-12 text-center">
                                        <p className="text-muted-foreground">
                                            Belum ada data observasi untuk spesies {selectedSpecies}.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="relative flex-1">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari nama spesies..."
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                                        <Filter className="mr-1 hidden h-4 w-4 text-muted-foreground sm:block" />
                                        {CATEGORIES.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                                    selectedCategory === category
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-border bg-background text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground'
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {filteredSpecies.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {filteredSpecies.map((species) => (
                                            <Card
                                                key={species.id}
                                                className="overflow-hidden transition-all hover:shadow-md"
                                            >
                                                <img
                                                    src={getSpeciesImageUrl(species.category, species.scientificName, species.photoUrl)}
                                                    alt={species.commonName}
                                                    className="h-48 w-full object-cover transition-transform hover:scale-105"
                                                    onError={(event) => {
                                                        (event.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                    }}
                                                />
                                                <CardContent className="p-4">
                                                    <h3 className="text-lg font-bold">
                                                        {species.commonName}
                                                    </h3>
                                                    <p className="mb-3 text-sm italic text-muted-foreground">
                                                        {species.scientificName}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <Badge
                                                            variant={
                                                                species.category === 'Hoya'
                                                                    ? 'default'
                                                                    : species.category === 'Kayu'
                                                                      ? 'secondary'
                                                                      : 'outline'
                                                            }
                                                        >
                                                            {species.category}
                                                        </Badge>
                                                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                                            {species.observationCount} obs
                                                        </span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="mt-2 w-full gap-2"
                                                        onClick={() =>
                                                            setSelectedSpecies(species.commonName)
                                                        }
                                                    >
                                                        Lihat Daftar Observasi
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border bg-muted/20 py-12 text-center">
                                        <p className="text-muted-foreground">
                                            Tidak ada spesies yang cocok dengan filter tersebut.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSearch('');
                                                setSelectedCategory('Semua');
                                            }}
                                            className="mt-4 font-medium text-primary hover:underline"
                                        >
                                            Reset Filter
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default Jelajah;