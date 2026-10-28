import { useState, useCallback, useEffect } from "react";
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, MapPin, Loader2, Save, Navigation, CalendarClock, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { BreadcrumbItem } from '@/types';
import exifr from "exifr";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapFlyTo = ({ position }: { position: L.LatLng | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);
  return null;
};

const LocationPicker = ({ position, setPosition, setData }: any) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setData((prev: any) => ({
        ...prev,
        latitude: e.latlng.lat.toFixed(6),
        longitude: e.latlng.lng.toFixed(6),
      }));
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return position ? <Marker position={position} /> : null;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Buat Observasi', href: '/user/observasi/buat' }
];

const Observasi = () => {
  const { toast } = useToast();
  
  const { data, setData, post, processing, errors, transform } = useForm({
    category: "auto",
    latitude: "",
    longitude: "",
    observation_date: "", 
    photo: null as File | null,
    notes: "",
    status: "pending", 
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [mapPosition, setMapPosition] = useState<L.LatLng | null>(null);
  const defaultCenter: [number, number] = [-2.5, 118];
  const [showMap, setShowMap] = useState(false);

  // STATE BARU: Untuk Live AI Preview
  const [livePrediction, setLivePrediction] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData((prev) => ({ ...prev, photo: file }));

    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // 🚀 FITUR BARU: TEMBAK AI SECARA LIVE
    setIsPredicting(true);
    setLivePrediction(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', 'auto');
      
      const aiRes = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData
      });
      const aiData = await aiRes.json();
      
      if (aiData.success) {
        setLivePrediction(aiData.prediction.replace(/_/g, ' '));
      } else {
        setLivePrediction("Tidak dapat dikenali");
      }
    } catch (err) {
      console.error("AI Server Error:", err);
      setLivePrediction("Gagal terhubung ke AI");
    } finally {
      setIsPredicting(false);
    }

    try {
      const exif = await exifr.parse(file); 
      setShowMap(true);

      let newLat = "";
      let newLng = "";
      let newDate = "";

      if (exif && exif.latitude && exif.longitude) {
        const newPos = L.latLng(exif.latitude, exif.longitude);
        setMapPosition(newPos);
        newLat = exif.latitude.toFixed(6);
        newLng = exif.longitude.toFixed(6);
      } else {
        setMapPosition(null); 
      }

      if (exif && exif.DateTimeOriginal) {
        const d = new Date(exif.DateTimeOriginal);
        const tzOffset = d.getTimezoneOffset() * 60000;
        newDate = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
      }

      setData((prev) => ({
        ...prev,
        latitude: newLat,
        longitude: newLng,
        observation_date: newDate,
      }));

      if (newLat || newDate) {
        toast({ title: "Data EXIF Diperbarui! 📸", description: "Lokasi & Waktu telah disesuaikan dengan foto yang baru." });
      }
    } catch (error) {
      setShowMap(true);
      setMapPosition(null);
      setData((prev) => ({ ...prev, latitude: "", longitude: "", observation_date: "" }));
    }
  }, [setData, toast]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Browser tidak mendukung fitur lokasi.", variant: "destructive" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = L.latLng(latitude, longitude);
        setData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));
        setMapPosition(newPos);
        toast({ title: "Lokasi Ditemukan! 🎯" });
      },
      () => {
        toast({ title: "Akses Ditolak", description: "Gagal mendapatkan lokasi GPS.", variant: "destructive" });
      }
    );
  };

  const submitForm = (targetStatus: "pending" | "draft") => {
    if (!data.latitude || !data.longitude) {
      toast({ title: "Error", description: "Tentukan lokasi pada peta terlebih dahulu!", variant: "destructive" });
      return;
    }
    if (!data.photo) {
      toast({ title: "Error", description: "Upload foto terlebih dahulu!", variant: "destructive" });
      return;
    }

    transform((currentData) => ({
      ...currentData,
      status: targetStatus,
    }));
    
    post('/user/observasi');
  };

  const handleGantiFoto = () => {
    setPhotoPreview(null);
    setShowMap(false);
    setMapPosition(null);
    setLivePrediction(null);
    setData((prev) => ({
        ...prev,
        photo: null,
        latitude: "",
        longitude: "",
        observation_date: "",
    }));
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat Observasi" />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold font-sans">Form Observasi</h1>
        <p className="mb-6 text-muted-foreground">Dokumentasikan temuan biodiversitas Anda dan biarkan AI kami mengidentifikasinya</p>

        <div className="space-y-6">
          <Card className="overflow-hidden border-2 border-transparent focus-within:border-primary transition-colors">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-sans">
                <Camera className="h-5 w-5 text-primary" /> Upload Foto Objek
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {photoPreview ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden shadow-sm border">
                    <img src={photoPreview} alt="Preview" className="w-full object-cover" style={{ maxHeight: 350 }} />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      className="absolute bottom-3 right-3 shadow-md backdrop-blur-md bg-white/80" 
                      onClick={handleGantiFoto}
                    >
                      Ganti Foto
                    </Button>
                  </div>
                  
                  {/* 🚀 TAMPILAN HASIL LIVE AI */}
                  {isPredicting ? (
                    <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 animate-pulse">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-medium text-sm">AI sedang memindai foto...</span>
                    </div>
                  ) : livePrediction && (
                    <div className="flex flex-col items-center justify-center p-5 rounded-lg bg-emerald-50 border border-emerald-200 shadow-sm text-center">
                      <div className="flex items-center gap-2 text-emerald-700 mb-1">
                        <Bot className="h-5 w-5" />
                        <span className="font-semibold text-sm uppercase tracking-wider">Hasil Deteksi AI</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-900 italic font-serif tracking-wide">{livePrediction}</span>
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-12 transition-all hover:border-primary/50 hover:bg-muted/30">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Klik atau seret foto ke sini</p>
                    <p className="text-xs text-muted-foreground mt-1">Mendukung JPEG, PNG, JPG (Maks 10MB)</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              )}
              {errors.photo && <p className="text-sm text-red-500 font-medium mt-2">{errors.photo}</p>}
            </CardContent>
          </Card>

          {/* ... (Bagian Card Lokasi dan Catatan Sama Persis) ... */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-sans">
                <MapPin className="h-5 w-5" /> Informasi Lokasi & Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="flex items-center gap-2 mb-2"><CalendarClock className="h-4 w-4"/> Waktu Pengambilan Foto</Label>
                <Input 
                  type="datetime-local" 
                  value={data.observation_date} 
                  onChange={(e) => setData('observation_date', e.target.value)} 
                />
                {errors.observation_date && <p className="text-sm text-red-500 mt-1">{errors.observation_date}</p>}
              </div>

              {showMap && (
                <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                  <div className="h-64 w-full rounded-md overflow-hidden border relative z-0">
                    <MapContainer center={mapPosition || defaultCenter} zoom={mapPosition ? 13 : 4} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationPicker position={mapPosition} setPosition={setMapPosition} setData={setData} />
                      <MapFlyTo position={mapPosition} />
                    </MapContainer>
                  </div>
                  <Button type="button" variant="secondary" className="w-full gap-2 mt-2" onClick={handleCurrentLocation}>
                    <Navigation className="h-4 w-4" /> Gunakan Lokasi Saat Ini
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label>Latitude</Label>
                  <Input value={data.latitude} readOnly className="bg-muted mt-1" />
                  {errors.latitude && <p className="text-sm text-red-500">{errors.latitude}</p>}
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input value={data.longitude} readOnly className="bg-muted mt-1" />
                  {errors.longitude && <p className="text-sm text-red-500">{errors.longitude}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-sans">Catatan Observasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Catatan Tambahan (Opsional)</Label>
                <Textarea placeholder="Ceritakan detail temuan Anda..." value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 sm:flex-row mt-6">
            <Button type="button" size="lg" className="flex-1 gap-2 text-base" onClick={() => submitForm("pending")} disabled={processing}>
              {processing ? <Loader2 className="animate-spin h-5 w-5" /> : <Upload className="h-5 w-5" />} 
              Kirim ke Pakar Sekarang
            </Button>
            <Button type="button" variant="outline" size="lg" className="flex-1 gap-2 text-base" onClick={() => submitForm("draft")} disabled={processing}>
              <Save className="h-5 w-5" /> Simpan Draft
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Observasi;