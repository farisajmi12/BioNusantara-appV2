import os
import requests
import time
import hashlib

# =====================================================================
# 🔍 SCRIPT REFILL DATASET - BioNusantara
# 8 Sumber gratis:
#   1. iNaturalist   → foto lapangan tervalidasi pakar
#   2. GBIF          → database biodiversity global
#   3. EOL           → encyclopedia of life
#   4. Wikimedia     → commons.wikimedia.org
#   5. BOLD Systems  → barcode of life, foto spesimen
#   6. iDigBio       → museum specimen digital
#   7. Tropicos       → Missouri Botanical Garden
#   8. JSTOR Global Plants → herbarium specimens
# =====================================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TARGET_TRAIN = 150
TARGET_VAL   = 50

PLANKTON_CLASSES = [
    "Chaetoceros_affinis","Chaetoceros_didymus","Skeletonema_costatum",
    "Thalassiosira_eccentrica","Coscinodiscus_centralis","Rhizosolenia_setigera",
    "Nitzschia_sigma","Navicula_directa","Ceratium_fusus","Ceratium_furca",
    "Dinophysis_miles","Noctiluca_scintillans","Trichodesmium_erythraeum",
    "Calanus_sinicus","Acartia_erythraea","Oithona_nana","Euterpina_acutifrons",
    "Brachionus_rotundiformis","Tintinnopsis_tubulosa","Globigerinoides_ruber",
]

CLASS_TO_TAXON = {
    # HOYA
    "Hoya_parviflora":      ["Hoya parviflora"],
    "Hoya_ranavensis":      ["Hoya ranavensis", "Hoya aff ranavensis"],
    "Hoya_affinis":         ["Hoya affinis"],
    "Hoya_plicata":         ["Hoya plicata", "Hoya cf plicata"],
    "Hoya_cinnamomifolia":  ["Hoya cinnamomifolia"],
    "Hoya_clemensiorum":    ["Hoya clemensiorum"],
    "Hoya_corneri":         ["Hoya corneri"],
    "Hoya_excavata":        ["Hoya excavata"],
    "Hoya_finlaysonii":     ["Hoya finlaysonii"],
    "Hoya_forbesii":        ["Hoya forbesii"],
    "Hoya_latifolia":       ["Hoya latifolia"],
    "Hoya_multiflora":      ["Hoya multiflora"],
    "Hoya_scortechinii":    ["Hoya scortechinii"],
    "Hoya_sigillatis":      ["Hoya sigillatis"],
    "Hoya_anulata":         ["Hoya anulata"],
    "Hoya_australis":       ["Hoya australis"],
    "Hoya_callistophylla":  ["Hoya callistophylla"],
    "Hoya_campanulata":     ["Hoya campanulata"],
    "Hoya_caudata":         ["Hoya caudata"],
    "Hoya_dolichosparte":   ["Hoya dolichosparte"],
    "Hoya_lacunosa":        ["Hoya lacunosa", "Hoya multiflora"],
    "Hoya_diversifolia":    ["Hoya diversifolia", "Hoya montana"],
    "Hoya_hypolasia":       ["Hoya hypolasia"],
    "Hoya_incurvula":       ["Hoya incurvula"],
    "Hoya_minahassae":      ["Hoya minahassae", "Hoya sulawesiana"],
    "Hoya_monetteae":       ["Hoya monetteae"],
    "Hoya_obovata":         ["Hoya obovata"],
    "Hoya_occultata":       ["Hoya occultata"],
    "Hoya_polypus":         ["Hoya polypus"],
    "Hoya_borneensis":      ["Hoya borneensis", "Hoya polypus"],
    "Hoya_rigidifolia":     ["Hoya rigidifolia"],
    "Hoya_surisana":        ["Hoya surisana"],
    "Hoya_towutiensis":     ["Hoya towutiensis"],
    "Hoya_uncinata":        ["Hoya uncinata"],
    "Hoya_vitellina":       ["Hoya vitellina"],
    "Hoya_wallichii":       ["Hoya wallichii", "Hoya wallichii tenebrosa"],
    "Hoya_waymaniae":       ["Hoya waymaniae"],
    "Hoya_amicabilis":      ["Hoya amicabilis"],
    "Hoya_kerrii":          ["Hoya kerrii"],
    "Hoya_montana":         ["Hoya montana"],
    # PLANKTON
    "Chaetoceros_affinis":       ["Chaetoceros affinis"],
    "Chaetoceros_didymus":       ["Chaetoceros didymus"],
    "Skeletonema_costatum":      ["Skeletonema costatum"],
    "Thalassiosira_eccentrica":  ["Thalassiosira eccentrica"],
    "Coscinodiscus_centralis":   ["Coscinodiscus centralis"],
    "Rhizosolenia_setigera":     ["Rhizosolenia setigera"],
    "Nitzschia_sigma":           ["Nitzschia sigma"],
    "Navicula_directa":          ["Navicula directa"],
    "Ceratium_fusus":            ["Ceratium fusus"],
    "Ceratium_furca":            ["Ceratium furca"],
    "Dinophysis_miles":          ["Dinophysis miles"],
    "Noctiluca_scintillans":     ["Noctiluca scintillans"],
    "Trichodesmium_erythraeum":  ["Trichodesmium erythraeum"],
    "Calanus_sinicus":           ["Calanus sinicus"],
    "Acartia_erythraea":         ["Acartia erythraea"],
    "Oithona_nana":              ["Oithona nana"],
    "Euterpina_acutifrons":      ["Euterpina acutifrons"],
    "Brachionus_rotundiformis":  ["Brachionus rotundiformis"],
    "Tintinnopsis_tubulosa":     ["Tintinnopsis tubulosa"],
    "Globigerinoides_ruber":     ["Globigerinoides ruber"],
    # KAYU
    "Tectona_grandis":       ["Tectona grandis", "Tectona"],
    "Swietenia_macrophylla": ["Swietenia macrophylla", "Swietenia mahagoni"],
    "Shorea_leprosula":      ["Shorea leprosula"],
    "Shorea_parvifolia":     ["Shorea parvifolia"],
    "Dipterocarpus_gracilis":["Dipterocarpus gracilis"],
    "Hopea_mangarawan":      ["Hopea mangarawan"],
    "Dryobalanops_aromatica":["Dryobalanops aromatica"],
    "Aquilaria_malaccensis": ["Aquilaria malaccensis"],
    "Eusideroxylon_zwageri": ["Eusideroxylon zwageri"],
    "Pterocarpus_indicus":   ["Pterocarpus indicus"],
    "Dalbergia_latifolia":   ["Dalbergia latifolia"],
    "Intsia_bijuga":         ["Intsia bijuga", "Intsia palembanica"],
    "Intsia_palembanica":    ["Intsia palembanica"],
    "Alstonia_scholaris":    ["Alstonia scholaris"],
    "Anthocephalus_cadamba": ["Anthocephalus cadamba", "Neolamarckia cadamba"],
    "Melaleuca_cajuputi":    ["Melaleuca cajuputi"],
    "Syzygium_polyanthum":   ["Syzygium polyanthum"],
    "Mangifera_foetida":     ["Mangifera foetida"],
    "Artocarpus_elasticus":  ["Artocarpus elasticus"],
    "Ficus_benjamina":       ["Ficus benjamina"],
}

CLASS_TO_FOLDER = {}
for cls in CLASS_TO_TAXON:
    if cls.startswith("Hoya_"):
        CLASS_TO_FOLDER[cls] = "dataset_hoya"
    elif cls in PLANKTON_CLASSES:
        CLASS_TO_FOLDER[cls] = "dataset_plankton"
    else:
        CLASS_TO_FOLDER[cls] = "dataset_kayu"


# =====================================================================
# HELPER
# =====================================================================
def get_file_hash(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()

def get_existing_filenames(folder: str) -> set:
    if not os.path.exists(folder):
        return set()
    return set(os.path.splitext(f)[0] for f in os.listdir(folder))

def make_filename(class_name: str, img_url: str) -> str:
    url_hash = hashlib.md5(img_url.encode()).hexdigest()[:12]
    return f"{class_name}_{url_hash}.jpg"

def count_files(folder: str) -> int:
    if not os.path.exists(folder):
        return 0
    return len([f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))])


# =====================================================================
# SUMBER 1: iNATURALIST
# =====================================================================
def fetch_from_inaturalist(taxon_name: str, total_needed: int) -> list:
    url = "https://api.inaturalist.org/v1/observations"
    photo_urls = []
    page = 1
    print(f"    🌿 [iNaturalist] '{taxon_name}'...")
    while len(photo_urls) < total_needed * 2:
        params = {
            "taxon_name": taxon_name, "has_photos": "true",
            "quality_grade": "research", "per_page": 200,
            "page": page, "order": "votes", "order_by": "votes",
        }
        try:
            r = requests.get(url, params=params, timeout=15)
            if r.status_code != 200: break
            data = r.json()
            results = data.get("results", [])
            total_available = data.get("total_results", 0)
            if not results: break
            for obs in results:
                for photo in obs.get("photos", []):
                    img_url = photo.get("url", "").replace("square", "medium")
                    if img_url: photo_urls.append(img_url)
            if len(photo_urls) >= total_available or len(photo_urls) >= total_needed * 2: break
            page += 1
            time.sleep(1.0)
        except Exception as e:
            print(f"    ❌ {e}"); break
    print(f"    ✅ {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 2: GBIF
# =====================================================================
def fetch_from_gbif(taxon_name: str, total_needed: int) -> list:
    photo_urls = []
    print(f"    🌍 [GBIF] '{taxon_name}'...")
    try:
        r = requests.get("https://api.gbif.org/v1/species/match",
                         params={"name": taxon_name, "verbose": "false"}, timeout=15)
        if r.status_code != 200: return []
        data = r.json()
        taxon_key = data.get("usageKey") or data.get("speciesKey")
        if not taxon_key: return []
    except Exception as e:
        print(f"    ❌ {e}"); return []

    offset = 0
    while len(photo_urls) < total_needed * 2:
        try:
            r = requests.get("https://api.gbif.org/v1/occurrence/search",
                             params={"taxonKey": taxon_key, "mediaType": "StillImage",
                                     "limit": 300, "offset": offset}, timeout=15)
            if r.status_code != 200: break
            data = r.json()
            results = data.get("results", [])
            if not results: break
            for obs in results:
                for media in obs.get("media", []):
                    img_url = media.get("identifier", "")
                    if img_url and img_url.startswith("http"): photo_urls.append(img_url)
            if offset + 300 >= data.get("count", 0) or len(photo_urls) >= total_needed * 2: break
            offset += 300
            time.sleep(1.0)
        except Exception as e:
            print(f"    ❌ {e}"); break
    print(f"    ✅ {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 3: EOL
# =====================================================================
def fetch_from_eol(taxon_name: str, total_needed: int) -> list:
    photo_urls = []
    print(f"    📚 [EOL] '{taxon_name}'...")
    try:
        r = requests.get("https://eol.org/api/search/1.0.json",
                         params={"q": taxon_name, "page": 1, "exact": "true"}, timeout=15)
        results = r.json().get("results", []) if r.status_code == 200 else []
        if not results:
            r = requests.get("https://eol.org/api/search/1.0.json",
                             params={"q": taxon_name, "page": 1}, timeout=15)
            results = r.json().get("results", []) if r.status_code == 200 else []
        if not results: return []
        page_id = results[0].get("id")
        r = requests.get(f"https://eol.org/api/pages/1.0/{page_id}.json",
                         params={"images_per_page": 100, "images_page": 1,
                                 "videos_per_page": 0, "sounds_per_page": 0,
                                 "maps_per_page": 0, "texts_per_page": 0,
                                 "details": "true", "common_names": "false"}, timeout=15)
        if r.status_code == 200:
            for obj in r.json().get("dataObjects", []):
                if obj.get("dataType") == "http://purl.org/dc/dcmitype/StillImage":
                    img_url = obj.get("eolMediaURL") or obj.get("mediaURL", "")
                    if img_url and img_url.startswith("http"): photo_urls.append(img_url)
        time.sleep(1.0)
    except Exception as e:
        print(f"    ❌ {e}")
    print(f"    ✅ {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 4: WIKIMEDIA COMMONS
# =====================================================================
def fetch_from_wikimedia(taxon_name: str, total_needed: int) -> list:
    photo_urls = []
    print(f"    📖 [Wikimedia] '{taxon_name}'...")
    try:
        r = requests.get("https://commons.wikimedia.org/w/api.php",
                         params={"action": "query", "list": "search",
                                 "srsearch": f"{taxon_name} filetype:bitmap",
                                 "srnamespace": 6, "srlimit": 100, "format": "json"}, timeout=15)
        if r.status_code != 200: return []
        search_results = r.json().get("query", {}).get("search", [])
        if not search_results: return []
        titles_str = "|".join([s["title"] for s in search_results[:50]])
        r = requests.get("https://commons.wikimedia.org/w/api.php",
                         params={"action": "query", "titles": titles_str,
                                 "prop": "imageinfo", "iiprop": "url", "format": "json"}, timeout=15)
        if r.status_code != 200: return []
        for page_data in r.json().get("query", {}).get("pages", {}).values():
            imageinfo = page_data.get("imageinfo", [])
            if imageinfo:
                img_url = imageinfo[0].get("url", "")
                if img_url and img_url.startswith("http"): photo_urls.append(img_url)
        time.sleep(1.0)
    except Exception as e:
        print(f"    ❌ {e}")
    print(f"    ✅ {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 5: BOLD SYSTEMS (Barcode of Life)
# =====================================================================
def fetch_from_bold(taxon_name: str, total_needed: int) -> list:
    photo_urls = []
    print(f"    🧬 [BOLD] '{taxon_name}'...")
    try:
        r = requests.get(
            "https://www.boldsystems.org/index.php/API_Public/combined",
            params={"taxon": taxon_name, "format": "json"},
            timeout=20
        )
        if r.status_code != 200: return []
        records = r.json().get("bold_records", {}).get("records", {})
        if isinstance(records, dict):
            records = list(records.values())
        for rec in records:
            img_url = rec.get("specimen_imagery", {}).get("media", [{}])[0].get("image", "")
            if not img_url:
                # Coba field lain
                imgs = rec.get("specimen_imagery", {}).get("media", [])
                for img in imgs:
                    u = img.get("image", "")
                    if u and u.startswith("http"):
                        photo_urls.append(u)
            elif img_url.startswith("http"):
                photo_urls.append(img_url)
            if len(photo_urls) >= total_needed * 2: break
        time.sleep(1.0)
    except Exception as e:
        print(f"    ❌ {e}")
    print(f"    ✅ {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 6: iDigBio (Museum Specimen Digital)
# =====================================================================
def fetch_from_idigbio(taxon_name: str, total_needed: int) -> list:
    photo_urls = []
    print(f"    🏛️  [iDigBio] '{taxon_name}'...")
    try:
        r = requests.post(
            "https://search.idigbio.org/v2/search/records",
            json={
                "rq": {"scientificname": taxon_name},
                "fields": ["uuid", "data.ac:accessURI"],
                "limit": 200,
                "offset": 0,
            },
            timeout=20
        )
        if r.status_code != 200: return []
        items = r.json().get("items", [])
        for item in items:
            img_url = item.get("indexTerms", {}).get("hasImage", False)
            # Ambil media via idigbio media API
            uuid = item.get("uuid", "")
            if uuid:
                media_url = f"https://search.idigbio.org/v2/media/{uuid}"
                photo_urls.append(media_url)
            if len(photo_urls) >= total_needed * 2: break
        time.sleep(1.0)
    except Exception as e:
        print(f"    ❌ {e}")
    print(f"    ✅ {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 7: TROPICOS (Missouri Botanical Garden)
# =====================================================================
def fetch_from_tropicos(taxon_name: str, total_needed: int) -> list:
    photo_urls = []
    print(f"    🌺 [Tropicos] '{taxon_name}'...")
    try:
        # Cari nama spesies di Tropicos
        r = requests.get(
            "https://services.tropicos.org/Name/Search",
            params={
                "name": taxon_name,
                "type": "exact",
                "format": "json",
                "apikey": "a2a8e0d9-cbff-4df1-8dc3-ca7cb6b03b3e",  # API key publik demo
            },
            timeout=15
        )
        if r.status_code != 200: return []
        results = r.json()
        if not results or results[0].get("Error"): return []

        name_id = results[0].get("NameId")
        if not name_id: return []

        # Ambil gambar dari Tropicos
        r = requests.get(
            f"https://services.tropicos.org/Name/{name_id}/Images",
            params={"format": "json", "apikey": "a2a8e0d9-cbff-4df1-8dc3-ca7cb6b03b3e"},
            timeout=15
        )
        if r.status_code != 200: return []
        images = r.json()
        if not images or (isinstance(images, list) and images[0].get("Error")): return []

        for img in images:
            img_url = img.get("ImageUrl", "")
            if img_url and img_url.startswith("http"):
                photo_urls.append(img_url)
            if len(photo_urls) >= total_needed * 2: break

        time.sleep(1.0)
    except Exception as e:
        print(f"    ❌ {e}")
    print(f"    ✅ {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# SUMBER 8: OPEN BIODIVERSITY (OpenStreetMap Taxon Photos via Wiki)
# Menggunakan Wikidata SPARQL untuk foto tanaman dari Wikidata
# =====================================================================
def fetch_from_wikidata(taxon_name: str, total_needed: int) -> list:
    photo_urls = []
    print(f"    🌐 [Wikidata] '{taxon_name}'...")
    try:
        # Query SPARQL untuk cari gambar di Wikidata
        sparql_query = f"""
        SELECT DISTINCT ?image WHERE {{
          ?taxon wdt:P225 "{taxon_name}" .
          ?taxon wdt:P18 ?image .
        }} LIMIT 50
        """
        r = requests.get(
            "https://query.wikidata.org/sparql",
            params={"query": sparql_query, "format": "json"},
            headers={"User-Agent": "BioNusantara/1.0 (research dataset collection)"},
            timeout=20
        )
        if r.status_code != 200: return []
        bindings = r.json().get("results", {}).get("bindings", [])
        for b in bindings:
            img_url = b.get("image", {}).get("value", "")
            if img_url and img_url.startswith("http"):
                photo_urls.append(img_url)
        time.sleep(1.5)  # Wikidata rate limit lebih ketat
    except Exception as e:
        print(f"    ❌ {e}")
    print(f"    ✅ {len(photo_urls)} URL")
    return photo_urls


# =====================================================================
# FUNGSI FETCH SEMUA SUMBER
# =====================================================================
def fetch_all_sources(taxon_list: list, total_needed: int) -> list:
    """
    Cari foto dari semua 8 sumber secara berurutan.
    Berhenti kalau sudah cukup, lanjut ke sumber berikutnya kalau masih kurang.
    """
    all_urls = []

    sources = [
        ("iNaturalist",  fetch_from_inaturalist),
        ("GBIF",         fetch_from_gbif),
        ("EOL",          fetch_from_eol),
        ("Wikimedia",    fetch_from_wikimedia),
        ("BOLD",         fetch_from_bold),
        ("iDigBio",      fetch_from_idigbio),
        ("Tropicos",     fetch_from_tropicos),
        ("Wikidata",     fetch_from_wikidata),
    ]

    for source_name, fetch_fn in sources:
        if len(all_urls) >= total_needed:
            print(f"  ✅ Sudah cukup ({len(all_urls)} URL), skip {source_name}.")
            continue

        print(f"\n  📡 Mencari di {source_name} (total sekarang: {len(all_urls)})...")
        for taxon in taxon_list:
            urls = fetch_fn(taxon, total_needed)
            all_urls.extend(urls)
            if len(all_urls) >= total_needed * 3:
                break

    # Hapus duplikat URL
    all_urls = list(dict.fromkeys(all_urls))
    print(f"\n  📊 Total URL unik dari semua sumber: {len(all_urls)}")
    return all_urls


# =====================================================================
# AUDIT — SCAN SEMUA FOLDER
# =====================================================================
def audit_all_folders():
    kurang = []
    for class_name, base_folder in CLASS_TO_FOLDER.items():
        train_dir   = os.path.join(BASE_DIR, base_folder, "train", class_name)
        val_dir     = os.path.join(BASE_DIR, base_folder, "validation", class_name)
        train_count = count_files(train_dir)
        val_count   = count_files(val_dir)
        need_train  = max(0, TARGET_TRAIN - train_count)
        need_val    = max(0, TARGET_VAL - val_count)
        if need_train > 0 or need_val > 0:
            kurang.append({
                "class_name":  class_name,
                "base_folder": base_folder,
                "train_count": train_count,
                "val_count":   val_count,
                "need_train":  need_train,
                "need_val":    need_val,
            })
    return kurang


# =====================================================================
# REFILL SATU FOLDER
# =====================================================================
def refill_folder(info: dict):
    class_name  = info["class_name"]
    base_folder = info["base_folder"]
    need_train  = info["need_train"]
    need_val    = info["need_val"]

    train_dir = os.path.join(BASE_DIR, base_folder, "train", class_name)
    val_dir   = os.path.join(BASE_DIR, base_folder, "validation", class_name)
    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir,   exist_ok=True)

    taxon_list   = CLASS_TO_TAXON.get(class_name, [class_name])
    total_needed = need_train + need_val

    print(f"\n  {'='*50}")
    print(f"  🔧 Refill: {class_name}")
    print(f"     Perlu  : +{need_train} train, +{need_val} val")
    print(f"  {'='*50}")

    existing_filenames = get_existing_filenames(train_dir) | get_existing_filenames(val_dir)

    # Ambil URL dari semua sumber
    all_photo_urls = fetch_all_sources(taxon_list, total_needed)

    if not all_photo_urls:
        print(f"  ⚠️  Tidak ada foto ditemukan untuk {class_name}, skip.\n")
        return

    # Download
    seen_hashes = set()
    added_train = 0
    added_val   = 0

    for img_url in all_photo_urls:
        still_need_train = added_train < need_train
        still_need_val   = added_val < need_val
        if not still_need_train and not still_need_val:
            break

        filename      = make_filename(class_name, img_url)
        filename_stem = os.path.splitext(filename)[0]

        if filename_stem in existing_filenames:
            continue

        try:
            r = requests.get(img_url, timeout=15)
            if r.status_code != 200: continue

            img_data = r.content
            if len(img_data) < 5000: continue

            file_hash = get_file_hash(img_data)
            if file_hash in seen_hashes: continue
            seen_hashes.add(file_hash)

            if still_need_train:
                target_path = os.path.join(train_dir, filename)
                tipe = "TRAIN"
                added_train += 1
                counter = info["train_count"] + added_train
                target_total = TARGET_TRAIN
            else:
                target_path = os.path.join(val_dir, filename)
                tipe = "VAL"
                added_val += 1
                counter = info["val_count"] + added_val
                target_total = TARGET_VAL

            with open(target_path, 'wb') as f:
                f.write(img_data)
            existing_filenames.add(filename_stem)

            print(f"  ✅ [{tipe} {counter}/{target_total}] {filename} ({len(img_data)//1024} KB)")
            time.sleep(0.3)

        except Exception as e:
            print(f"  ❌ Gagal: {e}")
            time.sleep(1.0)

    final_train = count_files(train_dir)
    final_val   = count_files(val_dir)
    print(f"\n  🎉 Selesai! Train: {final_train}/{TARGET_TRAIN}, Val: {final_val}/{TARGET_VAL}")
    if final_train < TARGET_TRAIN:
        print(f"     ⚠️  Train masih kurang {TARGET_TRAIN - final_train} foto")
    if final_val < TARGET_VAL:
        print(f"     ⚠️  Val masih kurang {TARGET_VAL - final_val} foto")
    print()


# =====================================================================
# 🚀 MAIN
# =====================================================================
if __name__ == "__main__":
    print("=" * 55)
    print("🔍 REFILL DATASET - BioNusantara (8 Sumber)")
    print("   iNaturalist → GBIF → EOL → Wikimedia →")
    print("   BOLD → iDigBio → Tropicos → Wikidata")
    print("=" * 55)
    print(f"📂 {BASE_DIR}")
    print(f"🎯 Target: {TARGET_TRAIN} train + {TARGET_VAL} val\n")

    print("🔎 Scanning folder...\n")
    kurang_list = audit_all_folders()

    if not kurang_list:
        print("✅ Semua folder sudah lengkap!")
        exit(0)

    print(f"⚠️  {len(kurang_list)} folder masih kurang:\n")
    print(f"  {'No':<4} {'Folder':<35} {'Train':>7} {'Val':>7} {'+ Train':>8} {'+ Val':>7}")
    print(f"  {'-'*4} {'-'*35} {'-'*7} {'-'*7} {'-'*8} {'-'*7}")
    for i, info in enumerate(kurang_list, 1):
        s_train = f"{info['train_count']}/{TARGET_TRAIN}"
        s_val   = f"{info['val_count']}/{TARGET_VAL}"
        n_train = f"+{info['need_train']}" if info['need_train'] > 0 else "✅"
        n_val   = f"+{info['need_val']}"   if info['need_val'] > 0   else "✅"
        print(f"  {i:<4} {info['class_name']:<35} {s_train:>7} {s_val:>7} {n_train:>8} {n_val:>7}")

    print()
    print("Pilih aksi:")
    print("  1. Refill SEMUA folder yang kurang")
    print("  2. Pilih nomor folder tertentu")
    print()
    pilihan = input("Masukkan pilihan (1/2): ").strip()

    if pilihan == "1":
        to_refill = kurang_list
    elif pilihan == "2":
        nomor_input = input("Nomor folder (pisah koma, contoh: 1,3,5): ").strip()
        try:
            nomor_list = [int(n.strip()) - 1 for n in nomor_input.split(",")]
            to_refill = [kurang_list[i] for i in nomor_list if 0 <= i < len(kurang_list)]
        except:
            print("❌ Input tidak valid."); exit(1)
    else:
        print("❌ Pilihan tidak valid."); exit(1)

    print(f"\n▶️  Refill {len(to_refill)} folder...\n")
    for idx, info in enumerate(to_refill, 1):
        print(f"\n[{idx}/{len(to_refill)}] {info['class_name']}")
        refill_folder(info)

    # Laporan akhir
    print("\n" + "=" * 55)
    print("📊 LAPORAN AKHIR")
    print("=" * 55)
    sisa = audit_all_folders()
    if not sisa:
        print("✅ Semua folder sudah lengkap!")
    else:
        print(f"⚠️  Masih {len(sisa)} folder belum lengkap:")
        for info in sisa:
            print(f"   - {info['class_name']}: "
                  f"train {info['train_count']}/{TARGET_TRAIN}, "
                  f"val {info['val_count']}/{TARGET_VAL}")
    print()