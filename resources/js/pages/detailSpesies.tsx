import { Link } from "@inertiajs/react";
import { ArrowLeft, Share2, MapPin, User, Calendar, Image as ImageIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";

// Marker Fix for Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// TERIMA PROPS 'observation' DARI LARAVEL
export default function DetailSpesies({ observation }: { observation: any }) {

    // Logika Berbagi
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: observation?.speciesName,
                    text: `Lihat observasi ${observation?.speciesName} di BioNusantara!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Gagal berbagi:", err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link berhasil disalin!");
        }
    };

    if (!observation) {
        return (
            <AppLayout>
                <div className="container mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold">Observasi tidak ditemukan</h2>
                    <Link href="/jelajah">
                        <Button className="mt-4">Kembali ke Jelajah</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    // PERBAIKAN: Ambil array file_path dari relasi observation.photos
    const photos = observation?.photos && observation.photos.length > 0 
        ? observation.photos.map((photo: any) => `/storage/${photo.file_path}`) 
        : [];

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Bagian Navigasi Atas */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/jelajah"
                        className="flex items-center text-sm font-medium text-emerald-700 hover:underline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Jelajah
                    </Link>
                    <Button 
                        onClick={handleShare}
                        className="bg-[#157f53] hover:bg-[#116643] text-white gap-2"
                    >
                        <Share2 className="h-4 w-4" /> Bagikan Observasi
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Bagian Konten Utama */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden border-none shadow-sm bg-white">
                            <div className="relative aspect-video w-full bg-slate-50 flex items-center justify-center">
                                {photos.length > 0 ? (
                                    <img
                                        src={photos[0]}
                                        alt={observation.speciesName}
                                        className="h-full w-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                                    />
                                ) : (
                                    <div className="text-muted-foreground flex flex-col items-center">
                                        <ImageIcon className="h-12 w-12 opacity-20" />
                                        <p>Gambar tidak tersedia</p>
                                    </div>
                                )}
                                
                                {photos.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                                        1 / {photos.length}
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <h1 className="text-4xl font-bold text-slate-900">{observation.speciesName}</h1>
                                        <p className="text-xl italic text-muted-foreground">{observation.scientificName}</p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-[#157f53] px-5 py-1.5 text-sm font-semibold text-white">
                                        {observation.category}
                                    </span>
                                </div>

                                <div className="mt-10">
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Deskripsi Singkat</h3>
                                    <p className="text-base leading-relaxed text-muted-foreground">
                                        Observasi spesies <span className="font-semibold text-slate-700">{observation.speciesName}</span> ({observation.scientificName}) 
                                        yang didokumentasikan dalam database BioNusantara. Data ini telah diverifikasi dan sangat berguna 
                                        untuk penelitian serta pelestarian keanekaragaman hayati ekosistem Indonesia.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bagian Sidebar */}
                    <div className="space-y-6">
                        {/* Informasi Pelapor */}
                        <Card className="shadow-sm border-border">
                            <CardHeader className="pb-4 border-b bg-muted/5">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#157f53]" /> Informasi Pelapor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="flex justify-between items-center border-b border-dashed pb-3">
                                    <span className="text-sm text-muted-foreground">Nama User</span>
                                    <span className="font-semibold text-slate-800">{observation.observer}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Tgl. Observasi</span>
                                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {observation.date}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lokasi Peta */}
                        <Card className="shadow-sm border-border overflow-hidden relative">
                            <CardHeader className="pb-3 border-b border-border bg-muted/20">
                                <CardTitle className="text-lg flex items-center gap-2 font-serif">
                                    <MapPin className="w-5 h-5 text-[#157f53]" /> Lokasi Peta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 relative">
                                <div className="h-70 w-full relative isolate" style={{ zIndex: 0 }}>
                                    <MapContainer
                                        center={[Number(observation.latitude), Number(observation.longitude)]}
                                        zoom={10}
                                        scrollWheelZoom={false}
                                        dragging={true}
                                        zoomControl={false}
                                        style={{ height: "100%", width: "100%", zIndex: 0 }}
                                    >
                                        <TileLayer
                                            attribution='&copy; OpenStreetMap'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[Number(observation.latitude), Number(observation.longitude)]} />
                                    </MapContainer>
                                </div>
                                
                                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-4 rounded-md border border-border shadow-md z-10 pointer-events-none">
                                    <p className="font-bold text-sm text-[#157f53] mb-1">
                                        Kawasan Koordinat Observasi
                                    </p>
                                    <p className="text-[11px] text-muted-foreground font-medium">
                                        Lat: {Number(observation.latitude).toFixed(4)}, Lng: {Number(observation.longitude).toFixed(4)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}