import os
import shutil
import hashlib
import json
from datetime import datetime

# =====================================================================
# 🔄 SCRIPT SYNC FOTO TERVERIFIKASI → DATASET AI
# BioNusantara — Domain: HEWAN ENDEMIK INDONESIA
#
# Fungsi:
#   - Baca observasi yang sudah diverifikasi pakar dari database Laravel
#   - Copy foto ke folder dataset AI yang sesuai
#   - Skip foto yang sudah pernah di-copy (by hash)
#   - Catat riwayat sync ke sync_log.json
#
# PERBAIKAN DARI VERSI SEBELUMNYA:
#   1. CATEGORY_TO_FOLDER diganti ke kategori hewan endemik.
#   2. BUG PENTING: kategori di PHP dulu ambil dari $obs->category dulu,
#      padahal field itu SELALU berisi string "auto" (dikirim form
#      buat.tsx / edit.tsx, tidak pernah diubah) — bukan null. Operator
#      `??` PHP cuma fallback kalau null, jadi $obs->species->category
#      (sumber kebenaran yang sebenarnya) TIDAK PERNAH kepakai, dan
#      SEMUA foto tervalidasi selalu ke-skip sebagai kategori tak
#      dikenal. Sekarang kategori diambil LANGSUNG dari species->category
#      (mengabaikan obs->category yang memang cuma penanda "AI auto-
#      detect", bukan kategori final).
#   3. species_to_folder_name() dulu cuma ambil 2 kata pertama dari nama
#      ilmiah — memotong subspesies 3 kata (mis. "Panthera tigris
#      sumatrae" jadi folder "Panthera_tigris", enggak cocok dengan
#      folder "Panthera_tigris_sumatrae" yang dipakai download_dataset.py
#      /ModelAuto.py). Sekarang pakai SELURUH kata dalam nama ilmiah.
#
# Cara pakai:
#   1. Pastikan Laravel app berjalan (untuk akses database)
#   2. Jalankan: python sync_verified_to_dataset.py
#   3. Setelah selesai, jalankan: python ModelAuto.py
# =====================================================================

LARAVEL_ROOT    = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
LARAVEL_STORAGE = os.path.join(LARAVEL_ROOT, 'storage', 'app', 'public')
AI_ENGINE_DIR   = os.path.dirname(os.path.abspath(__file__))
SYNC_LOG_FILE   = os.path.join(AI_ENGINE_DIR, 'sync_log.json')

# Mapping kategori → folder dataset (harus sama dengan folder yang
# dibaca ModelAuto.py / download_dataset.py)
CATEGORY_TO_FOLDER = {
    'mamalia': 'dataset_mamalia',
    'burung':  'dataset_burung',
    'reptil':  'dataset_reptil',
    'amfibi':  'dataset_amfibi',
}

TRAIN_RATIO = 0.8


# ============================================================
# HELPER
# ============================================================
def get_file_hash(filepath: str) -> str:
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        hasher.update(f.read())
    return hasher.hexdigest()


def load_sync_log() -> dict:
    if os.path.exists(SYNC_LOG_FILE):
        with open(SYNC_LOG_FILE, 'r') as f:
            return json.load(f)
    return {'synced_hashes': [], 'history': []}


def save_sync_log(log: dict):
    with open(SYNC_LOG_FILE, 'w') as f:
        json.dump(log, f, indent=2, ensure_ascii=False)


def count_files(folder: str) -> int:
    if not os.path.exists(folder):
        return 0
    return len([f for f in os.listdir(folder)
                if os.path.isfile(os.path.join(folder, f))])


def get_split(class_name: str, base_folder: str) -> str:
    train_count = count_files(os.path.join(AI_ENGINE_DIR, base_folder, 'train', class_name))
    val_count   = count_files(os.path.join(AI_ENGINE_DIR, base_folder, 'validation', class_name))
    total       = train_count + val_count

    if total == 0:
        return 'train'

    current_ratio = train_count / total
    return 'train' if current_ratio < TRAIN_RATIO else 'validation'


# ============================================================
# BACA DATA DARI DATABASE LARAVEL (via artisan tinker)
# ============================================================
def get_verified_observations() -> list:
    import subprocess

    # PERBAIKAN: kategori diambil LANGSUNG dari $obs->species->category,
    # bukan dari $obs->category (yang selalu berisi "auto", bukan null,
    # sehingga fallback PHP `??` sebelumnya tidak pernah aktif).
    php_script = """<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

use App\\Models\\Observation;

$observations = Observation::with(['photos', 'species'])
    ->where('status', 'verified')
    ->whereNotNull('species_id')
    ->get();

$result = [];
foreach ($observations as $obs) {
    if ($obs->photos->isEmpty()) continue;
    if (!$obs->species) continue;

    foreach ($obs->photos as $photo) {
        $result[] = [
            'observation_id' => $obs->id,
            'photo_id'       => $photo->id,
            'file_path'      => $photo->file_path,
            'species_name'   => $obs->species->scientific_name,
            'category'       => strtolower($obs->species->category ?? 'unknown'),
        ];
    }
}

echo json_encode($result);
"""

    script_path = os.path.join(LARAVEL_ROOT, '_sync_helper.php')
    with open(script_path, 'w') as f:
        f.write(php_script)

    try:
        result = subprocess.run(
            ['php', script_path],
            cwd=LARAVEL_ROOT,
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode != 0:
            print(f"❌ Error menjalankan PHP: {result.stderr}")
            return []

        observations = json.loads(result.stdout)
        print(f"✅ Ditemukan {len(observations)} foto terverifikasi di database")
        return observations

    except Exception as e:
        print(f"❌ Gagal ambil data dari database: {e}")
        return []
    finally:
        if os.path.exists(script_path):
            os.remove(script_path)


# ============================================================
# NORMALISASI NAMA SPESIES → NAMA FOLDER
# ============================================================
def species_to_folder_name(scientific_name: str) -> str:
    """
    Ubah nama ilmiah spesies ke format nama folder.
    PERBAIKAN: pakai SELURUH kata (bukan cuma 2 kata pertama), supaya
    subspesies 3 kata (mis. "Panthera tigris sumatrae") tetap cocok
    dengan nama folder yang dipakai download_dataset.py/ModelAuto.py.
    Contoh:
      'Panthera tigris sumatrae'  → 'Panthera_tigris_sumatrae'
      'Bubalus depressicornis'    → 'Bubalus_depressicornis'
    """
    # Hapus nama lokal dalam kurung kalau ada, mis. "Nama (lokal)"
    name = scientific_name.split('(')[0].strip()
    parts = name.split()
    return '_'.join(parts)


# ============================================================
# MAIN SYNC
# ============================================================
def sync_verified_to_dataset():
    print("=" * 60)
    print("🔄 SYNC FOTO TERVERIFIKASI → DATASET AI")
    print("   BioNusantara — Hewan Endemik Indonesia")
    print("=" * 60)
    print(f"📂 Laravel root  : {LARAVEL_ROOT}")
    print(f"📂 Storage path  : {LARAVEL_STORAGE}")
    print(f"📂 AI engine     : {AI_ENGINE_DIR}\n")

    sync_log      = load_sync_log()
    synced_hashes = set(sync_log.get('synced_hashes', []))

    print("🔍 Mengambil data observasi terverifikasi dari database...\n")
    observations = get_verified_observations()

    if not observations:
        print("⚠️  Tidak ada data observasi terverifikasi, atau gagal koneksi database.")
        print("   Pastikan PHP tersedia dan Laravel app berjalan.")
        return

    copied      = 0
    skipped_dup = 0
    skipped_err = 0
    skipped_cat = 0
    unknown_categories_seen = set()

    summary = {}

    for obs in observations:
        file_path    = obs.get('file_path', '')
        species_name = obs.get('species_name', '')
        category     = obs.get('category', 'unknown').lower()

        if category not in CATEGORY_TO_FOLDER:
            skipped_cat += 1
            unknown_categories_seen.add(category)
            continue

        src_path = os.path.join(LARAVEL_STORAGE, file_path)
        if not os.path.exists(src_path):
            src_path = os.path.join(LARAVEL_STORAGE, 'observations', file_path)
            if not os.path.exists(src_path):
                skipped_err += 1
                continue

        try:
            file_hash = get_file_hash(src_path)
        except Exception:
            skipped_err += 1
            continue

        if file_hash in synced_hashes:
            skipped_dup += 1
            continue

        class_name  = species_to_folder_name(species_name)
        base_folder = CATEGORY_TO_FOLDER[category]

        split       = get_split(class_name, base_folder)
        dest_dir    = os.path.join(AI_ENGINE_DIR, base_folder, split, class_name)
        os.makedirs(dest_dir, exist_ok=True)

        obs_id   = obs.get('observation_id', 'unknown')
        photo_id = obs.get('photo_id', 'unknown')
        ext      = os.path.splitext(file_path)[1] or '.jpg'
        filename = f"{class_name}_obs{obs_id}_p{photo_id}{ext}"
        dest_path = os.path.join(dest_dir, filename)

        try:
            shutil.copy2(src_path, dest_path)
            synced_hashes.add(file_hash)
            copied += 1

            if class_name not in summary:
                summary[class_name] = {'train': 0, 'validation': 0}
            summary[class_name][split] += 1

            print(f"  ✅ [{split.upper()}] {class_name} ← obs#{obs_id} ({category})")

        except Exception as e:
            print(f"  ❌ Gagal copy {filename}: {e}")
            skipped_err += 1

    sync_log['synced_hashes'] = list(synced_hashes)
    sync_log['history'].append({
        'timestamp':    datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'copied':       copied,
        'skipped_dup':  skipped_dup,
        'skipped_err':  skipped_err,
        'skipped_cat':  skipped_cat,
    })
    save_sync_log(sync_log)

    print(f"\n{'='*60}")
    print(f"📊 LAPORAN SYNC:")
    print(f"   ✅ Foto berhasil di-copy : {copied}")
    print(f"   🔁 Skip (sudah pernah)   : {skipped_dup}")
    print(f"   ❌ Skip (file tidak ada) : {skipped_err}")
    print(f"   ⚠️  Skip (kategori ?)     : {skipped_cat}")
    print(f"{'='*60}")

    if unknown_categories_seen:
        print(f"\n⚠️  Kategori tak dikenal ditemukan: {sorted(unknown_categories_seen)}")
        print(f"   Kalau ini kategori spesies yang valid, tambahkan ke")
        print(f"   CATEGORY_TO_FOLDER di bagian atas file ini.")
        print(f"   Kalau isinya 'unknown' terus, cek kolom `category` pada")
        print(f"   tabel species di database — kemungkinan belum di-seed dengan")
        print(f"   nilai mamalia/burung/reptil/amfibi (lihat SpeciesSeeder.php).")

    if summary:
        print(f"\n📋 DETAIL PER SPESIES:")
        for cls, counts in sorted(summary.items()):
            print(f"   {cls:<35} +{counts['train']} train, +{counts['validation']} val")

    if copied > 0:
        print(f"\n✅ {copied} foto baru berhasil disync ke dataset!")
        print(f"\n💡 Langkah selanjutnya:")
        print(f"   Jalankan: python ModelAuto.py")
        print(f"   Model akan otomatis include spesies baru yang sudah punya foto.")
    else:
        print(f"\n✅ Tidak ada foto baru — dataset sudah up to date.")

    print()


if __name__ == "__main__":
    sync_verified_to_dataset()