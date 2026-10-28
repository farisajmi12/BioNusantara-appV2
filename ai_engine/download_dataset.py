import os
import requests
import time
import hashlib

# =====================================================================
# 🤖 SCRIPT PEMANEN FOTO MULTI-SUMBER - BioNusantara
# Domain: HEWAN ENDEMIK INDONESIA
# Urutan sumber:
#   1. iNaturalist → 2. GBIF → 3. EOL → 4. Wikimedia
# Fitur:
#   - Skip otomatis kalau foto sudah ada (by filename + hash)
#   - Menu pilihan kategori sebelum download
#   - Nama folder sesuai dengan SpeciesSeeder
#   - Session + User-Agent bersama (perbaikan: Wikimedia API sering
#     menolak/rate-limit request tanpa User-Agent yang jelas)
#   - Retry sederhana untuk error jaringan sesaat
#   - Buffer pencarian diperbesar (3x kebutuhan, dari sebelumnya 2x)
#     karena banyak foto drop akibat ukuran kecil / duplikat / gagal unduh
# =====================================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

HEADERS = {
    "User-Agent": "BioNusantara-DataHarvester/1.0 "
                   "(riset biodiversitas non-komersial; PRSDI/BRIN)"
}
SESSION = requests.Session()
SESSION.headers.update(HEADERS)

SEARCH_BUFFER_MULTIPLIER = 3  # sebelumnya 2
MAX_RETRIES = 2
RETRY_DELAY = 2.0


def get_file_hash(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()


def get_existing_filenames(folder: str) -> set:
    """Ambil semua nama file yang sudah ada di folder (tanpa ekstensi)."""
    if not os.path.exists(folder):
        return set()
    return set(os.path.splitext(f)[0] for f in os.listdir(folder))


def make_filename(class_name: str, img_url: str) -> str:
    """Buat nama file unik berdasarkan class_name + hash URL."""
    url_hash = hashlib.md5(img_url.encode()).hexdigest()[:12]
    return f"{class_name}_{url_hash}.jpg"


def request_with_retry(method_get_kwargs: dict, url: str):
    """Wrapper request GET dengan retry sederhana untuk error jaringan sesaat."""
    last_exc = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            return SESSION.get(url, timeout=15, **method_get_kwargs)
        except requests.exceptions.RequestException as e:
            last_exc = e
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
            continue
    if last_exc:
        raise last_exc


# =====================================================================
# SUMBER 1: iNATURALIST
# =====================================================================
def fetch_from_inaturalist(taxon_name: str, total_needed: int) -> list:
    url = "https://api.inaturalist.org/v1/observations"
    photo_urls = []
    page = 1
    target = total_needed * SEARCH_BUFFER_MULTIPLIER

    print(f"    🌿 [iNaturalist] Mencari '{taxon_name}'...")

    while len(photo_urls) < target:
        params = {
            "taxon_name": taxon_name,
            "has_photos": "true",
            "quality_grade": "research",
            "per_page": 200,
            "page": page,
            "order": "votes",
            "order_by": "votes",
        }
        try:
            response = request_with_retry({"params": params}, url)
            if response.status_code != 200:
                break

            data = response.json()
            results = data.get("results", [])
            total_available = data.get("total_results", 0)

            if not results:
                break

            for obs in results:
                for photo in obs.get("photos", []):
                    img_url = photo.get("url", "").replace("square", "medium")
                    if img_url:
                        photo_urls.append(img_url)

            print(f"    📄 Hal {page}: {len(photo_urls)} URL (tersedia: {total_available})")

            if len(photo_urls) >= total_available or len(photo_urls) >= target:
                break

            page += 1
            time.sleep(1.0)

        except Exception as e:
            print(f"    ❌ iNaturalist error: {e}")
            break

    print(f"    ✅ iNaturalist: {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 2: GBIF
# =====================================================================
def fetch_from_gbif(taxon_name: str, total_needed: int) -> list:
    photo_urls = []
    offset = 0
    limit = 300
    target = total_needed * SEARCH_BUFFER_MULTIPLIER

    print(f"    🌍 [GBIF] Mencari '{taxon_name}'...")

    try:
        match_response = request_with_retry(
            {"params": {"name": taxon_name, "verbose": "false"}},
            "https://api.gbif.org/v1/species/match",
        )
        if match_response.status_code != 200:
            return []

        match_data = match_response.json()
        taxon_key = match_data.get("usageKey") or match_data.get("speciesKey")

        if not taxon_key:
            print(f"    ⚠️  GBIF: Taxon key tidak ditemukan")
            return []

        print(f"    🔑 GBIF taxon key: {taxon_key}")

    except Exception as e:
        print(f"    ❌ GBIF match error: {e}")
        return []

    while len(photo_urls) < target:
        try:
            obs_response = request_with_retry(
                {
                    "params": {
                        "taxonKey": taxon_key,
                        "mediaType": "StillImage",
                        "limit": limit,
                        "offset": offset,
                    }
                },
                "https://api.gbif.org/v1/occurrence/search",
            )
            if obs_response.status_code != 200:
                break

            obs_data = obs_response.json()
            results = obs_data.get("results", [])
            total_available = obs_data.get("count", 0)

            if not results:
                break

            for obs in results:
                for media in obs.get("media", []):
                    img_url = media.get("identifier", "")
                    if img_url and img_url.startswith("http"):
                        photo_urls.append(img_url)

            print(f"    📄 Offset {offset}: {len(photo_urls)} URL (tersedia: {total_available})")

            if offset + limit >= total_available or len(photo_urls) >= target:
                break

            offset += limit
            time.sleep(1.0)

        except Exception as e:
            print(f"    ❌ GBIF error: {e}")
            break

    print(f"    ✅ GBIF: {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 3: EOL
# =====================================================================
def fetch_from_eol(taxon_name: str, total_needed: int) -> list:
    photo_urls = []

    print(f"    📚 [EOL] Mencari '{taxon_name}'...")

    try:
        search_response = request_with_retry(
            {"params": {"q": taxon_name, "page": 1, "exact": "true"}},
            "https://eol.org/api/search/1.0.json",
        )

        if search_response.status_code != 200:
            return []

        results = search_response.json().get("results", [])

        if not results:
            search_response = request_with_retry(
                {"params": {"q": taxon_name, "page": 1}},
                "https://eol.org/api/search/1.0.json",
            )
            results = search_response.json().get("results", [])

        if not results:
            print(f"    ⚠️  EOL: Tidak ditemukan")
            return []

        page_id = results[0].get("id")
        print(f"    🔑 EOL page ID: {page_id}")

        detail_response = request_with_retry(
            {
                "params": {
                    "images_per_page": 100,
                    "images_page": 1,
                    "videos_per_page": 0,
                    "sounds_per_page": 0,
                    "maps_per_page": 0,
                    "texts_per_page": 0,
                    "details": "true",
                    "common_names": "false",
                    "synonyms": "false",
                }
            },
            f"https://eol.org/api/pages/1.0/{page_id}.json",
        )

        if detail_response.status_code != 200:
            return []

        for obj in detail_response.json().get("dataObjects", []):
            if obj.get("dataType") == "http://purl.org/dc/dcmitype/StillImage":
                img_url = obj.get("eolMediaURL") or obj.get("mediaURL", "")
                if img_url and img_url.startswith("http"):
                    photo_urls.append(img_url)

        time.sleep(1.0)

    except Exception as e:
        print(f"    ❌ EOL error: {e}")

    print(f"    ✅ EOL: {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 4: WIKIMEDIA
# =====================================================================
def fetch_from_wikimedia(taxon_name: str, total_needed: int) -> list:
    photo_urls = []

    print(f"    📖 [Wikimedia] Mencari '{taxon_name}'...")

    try:
        search_response = request_with_retry(
            {
                "params": {
                    "action": "query",
                    "list": "search",
                    "srsearch": f"{taxon_name} filetype:bitmap",
                    "srnamespace": 6,
                    "srlimit": 100,
                    "format": "json",
                }
            },
            "https://commons.wikimedia.org/w/api.php",
        )

        if search_response.status_code != 200:
            return []

        search_results = search_response.json().get("query", {}).get("search", [])

        if not search_results:
            print(f"    ⚠️  Wikimedia: Tidak ada hasil")
            return []

        titles_str = "|".join([r["title"] for r in search_results[:50]])

        img_response = request_with_retry(
            {
                "params": {
                    "action": "query",
                    "titles": titles_str,
                    "prop": "imageinfo",
                    "iiprop": "url",
                    "format": "json",
                }
            },
            "https://commons.wikimedia.org/w/api.php",
        )

        if img_response.status_code != 200:
            return []

        for page_data in img_response.json().get("query", {}).get("pages", {}).values():
            imageinfo = page_data.get("imageinfo", [])
            if imageinfo:
                img_url = imageinfo[0].get("url", "")
                if img_url and img_url.startswith("http"):
                    photo_urls.append(img_url)

        time.sleep(1.0)

    except Exception as e:
        print(f"    ❌ Wikimedia error: {e}")

    print(f"    ✅ Wikimedia: {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# FUNGSI DOWNLOAD UTAMA
# =====================================================================
def download_dataset(
    taxon_name,
    base_folder,
    class_name,
    train_count=150,
    val_count=50,
    min_image_size=5000
):
    train_dir = os.path.join(BASE_DIR, base_folder, "train", class_name)
    val_dir   = os.path.join(BASE_DIR, base_folder, "validation", class_name)
    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir,   exist_ok=True)

    total_needed = train_count + val_count
    taxon_list = [taxon_name] if isinstance(taxon_name, str) else taxon_name

    downloaded_train = len(os.listdir(train_dir))
    downloaded_val   = len(os.listdir(val_dir))

    if downloaded_train >= train_count and downloaded_val >= val_count:
        print(f"  ✅ {class_name} sudah lengkap ({downloaded_train} train, {downloaded_val} val). Skip.\n")
        return

    existing_filenames = get_existing_filenames(train_dir) | get_existing_filenames(val_dir)

    print(f"\n  {'='*50}")
    print(f"  📦 {class_name}")
    print(f"     Target : {train_count} train + {val_count} val")
    print(f"     Sudah  : {downloaded_train} train, {downloaded_val} val")
    print(f"  {'='*50}")

    all_photo_urls = []
    still_need = total_needed - downloaded_train - downloaded_val

    for taxon in taxon_list:
        urls = fetch_from_inaturalist(taxon, total_needed)
        all_photo_urls.extend(urls)

    if len(all_photo_urls) < still_need:
        print(f"\n  ⚡ Kurang, lanjut ke GBIF...")
        for taxon in taxon_list:
            all_photo_urls.extend(fetch_from_gbif(taxon, total_needed))

    if len(all_photo_urls) < still_need:
        print(f"\n  ⚡ Masih kurang, lanjut ke EOL...")
        for taxon in taxon_list:
            all_photo_urls.extend(fetch_from_eol(taxon, total_needed))

    if len(all_photo_urls) < still_need:
        print(f"\n  ⚡ Masih kurang, lanjut ke Wikimedia...")
        for taxon in taxon_list:
            all_photo_urls.extend(fetch_from_wikimedia(taxon, total_needed))

    if not all_photo_urls:
        print(f"  ⚠️  Tidak ada foto dari sumber manapun untuk {class_name}, skip.\n")
        return

    all_photo_urls = list(dict.fromkeys(all_photo_urls))
    print(f"\n  📊 Total URL unik: {len(all_photo_urls)}")

    seen_hashes           = set()
    downloaded_train_now  = 0
    downloaded_val_now    = 0

    for img_url in all_photo_urls:
        still_need_train = (downloaded_train + downloaded_train_now) < train_count
        still_need_val   = (downloaded_val + downloaded_val_now) < val_count

        if not still_need_train and not still_need_val:
            break

        filename      = make_filename(class_name, img_url)
        filename_stem = os.path.splitext(filename)[0]

        if filename_stem in existing_filenames:
            print(f"  🔁 Skip (sudah ada): {filename}")
            if still_need_train:
                downloaded_train_now += 1
            else:
                downloaded_val_now += 1
            continue

        try:
            img_response = request_with_retry({}, img_url)
            if img_response.status_code != 200:
                continue

            img_data = img_response.content

            if len(img_data) < min_image_size:
                continue

            file_hash = get_file_hash(img_data)
            if file_hash in seen_hashes:
                print(f"  🔁 Skip (konten duplikat): {filename}")
                continue
            seen_hashes.add(file_hash)

            if still_need_train:
                target_path = os.path.join(train_dir, filename)
                tipe = "TRAIN"
                downloaded_train_now += 1
                counter = downloaded_train + downloaded_train_now
                target_total = train_count
            else:
                target_path = os.path.join(val_dir, filename)
                tipe = "VAL"
                downloaded_val_now += 1
                counter = downloaded_val + downloaded_val_now
                target_total = val_count

            with open(target_path, 'wb') as f:
                f.write(img_data)

            existing_filenames.add(filename_stem)

            print(f"  ✅ [{tipe} {counter}/{target_total}] {filename} ({len(img_data)//1024} KB)")
            time.sleep(0.3)

        except Exception as e:
            print(f"  ❌ Gagal download: {e}")
            time.sleep(1.0)

    final_train = len(os.listdir(train_dir))
    final_val   = len(os.listdir(val_dir))
    print(f"\n  🎉 {class_name} selesai! Train: {final_train}, Val: {final_val}")
    if final_train < train_count:
        print(f"     ⚠️  Train kurang {train_count - final_train} foto — sumber online mungkin "
              f"tidak punya cukup foto publik untuk spesies ini.")
    if final_val < val_count:
        print(f"     ⚠️  Val kurang {val_count - final_val} foto")
    print()


# =====================================================================
# DAFTAR SPESIES — HEWAN ENDEMIK INDONESIA
# ⚠️  BELUM 100% DIVERIFIKASI SATU-PER-SATU KE GBIF/IUCN.
#     Disusun dari pengetahuan umum yang relatif mapan untuk spesies
#     populer/well-documented — WAJIB dicek ulang taksonominya
#     (terutama status endemik & nama ilmiah terkini) sebelum dipakai
#     sebagai daftar final proyek. Tanda (*) = rangenya meluas sedikit
#     ke negara tetangga (PNG/Malaysia/Timor Leste), enggak 100% eksklusif
#     Indonesia, tapi populasi utamanya di Indonesia.
# Format: (taxon_name atau list alias, class_name, common_name)
# =====================================================================

MAMALIA_LIST = [
    # --- Bawaan Asli ---
    ("Bubalus depressicornis", "Bubalus_depressicornis", "Anoa Dataran Rendah"),
    ("Bubalus quarlesi",       "Bubalus_quarlesi",       "Anoa Pegunungan"),
    ("Babyrousa babyrussa",    "Babyrousa_babyrussa",    "Babirusa Buru"),
    ("Babyrousa celebensis",   "Babyrousa_celebensis",   "Babirusa Sulawesi"),
    ("Pongo abelii",           "Pongo_abelii",           "Orangutan Sumatera"),
    ("Pongo pygmaeus",         "Pongo_pygmaeus",         "Orangutan Kalimantan"),
    ("Pongo tapanuliensis",    "Pongo_tapanuliensis",    "Orangutan Tapanuli"),
    ("Nasalis larvatus",       "Nasalis_larvatus",       "Bekantan"),
    ("Ailurops ursinus",       "Ailurops_ursinus",       "Kuskus Beruang Sulawesi"),
    ("Tarsius tarsier",        "Tarsius_tarsier",        "Tarsius Sulawesi"),
    ("Tarsius bancanus",       "Tarsius_bancanus",       "Tarsius Kalimantan"),
    ("Nycticebus javanicus",   "Nycticebus_javanicus",   "Kukang Jawa"),
    ("Macaca nigra",           "Macaca_nigra",           "Monyet Hitam Sulawesi (Yaki)"),
    ("Macaca maura",           "Macaca_maura",           "Monyet Dare Sulawesi Selatan"),
    ("Presbytis comata",       "Presbytis_comata",       "Surili Jawa"),
    ("Trachypithecus auratus", "Trachypithecus_auratus", "Lutung Jawa"),
    ("Hylobates moloch",       "Hylobates_moloch",       "Owa Jawa"),
    ("Hylobates klossii",      "Hylobates_klossii",      "Bilou / Owa Mentawai"),
    ("Panthera tigris sumatrae","Panthera_tigris_sumatrae","Harimau Sumatera"),
    ("Rhinoceros sondaicus",   "Rhinoceros_sondaicus",   "Badak Jawa"),
    ("Dicerorhinus sumatrensis","Dicerorhinus_sumatrensis","Badak Sumatera"),
    ("Elephas maximus sumatranus","Elephas_maximus_sumatranus","Gajah Sumatera"),
    ("Axis kuhlii",            "Axis_kuhlii",            "Rusa Bawean"),
    ("Zaglossus bruijnii",     "Zaglossus_bruijnii",     "Moncong Panjang Papua"),
    ("Dendrolagus mbaiso",     "Dendrolagus_mbaiso",     "Kanguru Pohon Mbaiso"),
    # --- Tambahan Baru ---
    ("Tragulus javanicus",     "Tragulus_javanicus",     "Pelanduk Jawa (Kancil)"),
    ("Sus verrucosus",         "Sus_verrucosus",         "Babi Kutil Jawa"),
    ("Spilocuscus maculatus",  "Spilocuscus_maculatus",  "Kuskus Totol (Papua)"),
    ("Phalanger orientalis",   "Phalanger_orientalis",   "Kuskus Timur (Maluku/Papua)"),
    ("Manis javanica",         "Manis_javanica",         "Trenggiling Sunda"),
    ("Symphalangus syndactylus","Symphalangus_syndactylus","Siamang (Sumatera)"),
]

BURUNG_LIST = [
    # --- Bawaan Asli ---
    ("Leucopsar rothschildi",  "Leucopsar_rothschildi",  "Jalak Bali"),
    ("Paradisaea rubra",       "Paradisaea_rubra",       "Cendrawasih Merah (Raja Ampat)"),
    ("Cicinnurus respublica",  "Cicinnurus_respublica",  "Cendrawasih Botak (Wilson)"),
    ("Semioptera wallacii",    "Semioptera_wallacii",    "Cendrawasih Halmahera (Wallace)"),
    ("Paradigalla carunculata","Paradigalla_carunculata","Paradigala Jambul"),
    ("Macrocephalon maleo",    "Macrocephalon_maleo",    "Maleo"),
    ("Nisaetus bartelsi",      "Nisaetus_bartelsi",      "Elang Jawa"),
    ("Cacatua sulphurea",      "Cacatua_sulphurea",      "Kakatua Jambul Kuning"),
    ("Cacatua alba",           "Cacatua_alba",           "Kakatua Putih Maluku Utara"),
    ("Cacatua moluccensis",    "Cacatua_moluccensis",    "Kakatua Seram"),
    ("Rhyticeros cassidix",    "Rhyticeros_cassidix",    "Rangkong Sulawesi"),
    ("Tanygnathus sumatranus", "Tanygnathus_sumatranus", "Nuri Sulawesi"),
    ("Eos bornea",             "Eos_bornea",             "Nuri Maluku"),
    ("Lorius domicella",       "Lorius_domicella",       "Nuri Kalung Ungu (Seram)"),
    ("Loriculus exilis",       "Loriculus_exilis",       "Serindit Sulawesi"),
    ("Pavo muticus",           "Pavo_muticus",           "Merak Hijau"),
    # --- Tambahan Baru ---
    ("Nisaetus floris",        "Nisaetus_floris",        "Elang Flores"),
    ("Pitta guajana",          "Pitta_guajana",          "Paok Pancawarna Jawa"),
    ("Lophura bulweri",        "Lophura_bulweri",        "Pegar Bulwer (Kalimantan)"),
    ("Aepypodius bruijnii",    "Aepypodius_bruijnii",    "Kalkun Waigeo"),
    ("Buceros rhinoceros",     "Buceros_rhinoceros",     "Rangkong Cula (Enggang)"),
    ("Ptilinopus melanospilus","Ptilinopus_melanospilus","Walik Kembang"),
]

REPTIL_LIST = [
    # --- Bawaan Asli ---
    ("Varanus komodoensis",    "Varanus_komodoensis",    "Komodo"),
    ("Chelodina mccordi",      "Chelodina_mccordi",      "Kura-kura Leher Ular Rote"),
    ("Varanus prasinus",       "Varanus_prasinus",       "Biawak Hijau Papua"),
    # --- Tambahan Baru ---
    ("Varanus macraei",        "Varanus_macraei",        "Biawak Biru Batanta"),
    ("Varanus melinus",        "Varanus_melinus",        "Biawak Kuning Maluku"),
    ("Hydrosaurus amboinensis","Hydrosaurus_amboinensis","Soa-soa Layar Ambon"),
    ("Morelia viridis",        "Morelia_viridis",        "Sanca Hijau Papua"),
    ("Crocodylus novaeguineae","Crocodylus_novaeguineae","Buaya Irian"),
    ("Bronchocela jubata",     "Bronchocela_jubata",     "Bunglon Surai (Jawa)"),
]

AMFIBI_LIST = [
    # --- Bawaan Asli ---
    ("Leptophryne cruentata",  "Leptophryne_cruentata",  "Kodok Merah Jawa"),
    # --- Tambahan Baru (Spesies dengan taksonomi mapan & cukup foto publik) ---
    ("Megophrys montana",      "Megophrys_montana",      "Katak Bertanduk Jawa"),
    ("Rhacophorus margaritifer","Rhacophorus_margaritifer","Katak Pohon Mutiara (Jawa)"),
    ("Microhyla achatina",     "Microhyla_achatina",     "Katak Percil Jawa"),
    ("Barbourula kalimantanensis","Barbourula_kalimantanensis","Katak Kepala Pipih Kalimantan"),
    ("Litoria infrafrenata",   "Litoria_infrafrenata",   "Katak Pohon Bibir Putih (Papua)"),
]


def run_category(label: str, species_list: list, base_folder: str,
                  train_count: int = 150, val_count: int = 50):
    """Jalankan download untuk satu kategori."""
    if not species_list:
        print(f"\n⚠️  Kategori {label} kosong — belum ada spesies terdaftar. Lewati.\n")
        return

    print(f"\n{'#'*55}")
    print(f"# KATEGORI: {label.upper()} ({len(species_list)} spesies)")
    print(f"{'#'*55}\n")

    for idx, (taxon_name, class_name, common_name) in enumerate(species_list, 1):
        print(f"[{idx}/{len(species_list)}] Memproses: {class_name} ({common_name})")
        download_dataset(
            taxon_name=taxon_name,
            base_folder=base_folder,
            class_name=class_name,
            train_count=train_count,
            val_count=val_count,
        )


# =====================================================================
# 🚀 MENU UTAMA
# =====================================================================
if __name__ == "__main__":
    print("=" * 55)
    print("🌾 ROBOT PEMANEN BIONUSANTARA - 4 SUMBER (Hewan Endemik)")
    print("   1.iNaturalist → 2.GBIF → 3.EOL → 4.Wikimedia")
    print("=" * 55)
    print(f"📂 Base directory: {BASE_DIR}\n")

    print("Pilih kategori yang ingin didownload:")
    print(f"  1. Mamalia ({len(MAMALIA_LIST)} spesies)")
    print(f"  2. Burung  ({len(BURUNG_LIST)} spesies)")
    print(f"  3. Reptil  ({len(REPTIL_LIST)} spesies)")
    print(f"  4. Amfibi  ({len(AMFIBI_LIST)} spesies)")
    print("  5. Semua kategori sekaligus")
    print()

    pilihan = input("Masukkan nomor pilihan (1/2/3/4/5): ").strip()

    if pilihan == "1":
        run_category("Mamalia", MAMALIA_LIST, "dataset_mamalia")
    elif pilihan == "2":
        run_category("Burung", BURUNG_LIST, "dataset_burung")
    elif pilihan == "3":
        run_category("Reptil", REPTIL_LIST, "dataset_reptil")
    elif pilihan == "4":
        run_category("Amfibi", AMFIBI_LIST, "dataset_amfibi")
    elif pilihan == "5":
        run_category("Mamalia", MAMALIA_LIST, "dataset_mamalia")
        run_category("Burung", BURUNG_LIST, "dataset_burung")
        run_category("Reptil", REPTIL_LIST, "dataset_reptil")
        run_category("Amfibi", AMFIBI_LIST, "dataset_amfibi")
    else:
        print("❌ Pilihan tidak valid. Masukkan angka 1-5.")
        exit(1)

    print("=" * 55)
    print("✅ SELESAI!")
    print("=" * 55)