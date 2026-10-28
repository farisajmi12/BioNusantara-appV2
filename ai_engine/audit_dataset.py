import os
import json
from PIL import Image, ImageFile

# =====================================================================
# 🔍 AUDIT KUALITAS DATASET - BioNusantara
# Jalankan SETELAH download_dataset.py, SEBELUM ModelAuto.py
#
# Mengecek:
#   1. Jumlah foto per kelas (train & val) vs threshold minimum
#   2. Foto corrupt / tidak bisa dibuka
#   3. Foto duplikat/hampir identik DALAM satu kelas (perceptual hash)
#   4. Kebocoran train<->val (foto sama/mirip muncul di kedua split)
#   5. Rasio ketimpangan jumlah foto antar kelas
#
# Output: ringkasan di terminal + audit_report.json
# =====================================================================

ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Sesuaikan dengan folder dataset yang aktif sekarang
DATASET_FOLDERS = ['dataset_mamalia', 'dataset_burung', 'dataset_reptil', 'dataset_amfibi']

MIN_TRAIN_RECOMMENDED = 80   # rekomendasi realistis, bukan sekadar MIN_TRAIN_PHOTOS di ModelAuto.py
MIN_VAL_RECOMMENDED   = 15
HASH_SIZE             = 8    # ukuran average hash (8x8 = 64 bit)
DUPLICATE_THRESHOLD   = 5    # jarak Hamming <= ini dianggap "hampir identik"


def average_hash(img_path: str, hash_size: int = HASH_SIZE):
    """Hitung perceptual hash sederhana (average hash) tanpa dependency eksternal."""
    try:
        with Image.open(img_path) as img:
            img = img.convert('L').resize((hash_size, hash_size), Image.LANCZOS)
            pixels = list(img.getdata())
            avg = sum(pixels) / len(pixels)
            bits = ''.join('1' if p > avg else '0' for p in pixels)
            return int(bits, 2)
    except Exception:
        return None


def hamming_distance(a: int, b: int) -> int:
    return bin(a ^ b).count('1')


def list_images(folder: str) -> list:
    if not os.path.exists(folder):
        return []
    return [os.path.join(folder, f) for f in os.listdir(folder)
            if f.lower().endswith(('.jpg', '.jpeg', '.png'))
            and os.path.isfile(os.path.join(folder, f))]


def check_corrupt(img_path: str) -> bool:
    try:
        with Image.open(img_path) as img:
            img.verify()
        return False
    except Exception:
        return True


def find_near_duplicates(hashes: dict, threshold: int = DUPLICATE_THRESHOLD) -> list:
    """hashes: {filepath: hash_int}. Return list of (file_a, file_b, distance)."""
    items = [(f, h) for f, h in hashes.items() if h is not None]
    duplicates = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            f_a, h_a = items[i]
            f_b, h_b = items[j]
            dist = hamming_distance(h_a, h_b)
            if dist <= threshold:
                duplicates.append((f_a, f_b, dist))
    return duplicates


def audit_class(dataset_folder: str, class_name: str) -> dict:
    train_dir = os.path.join(BASE_DIR, dataset_folder, 'train', class_name)
    val_dir   = os.path.join(BASE_DIR, dataset_folder, 'validation', class_name)

    train_files = list_images(train_dir)
    val_files   = list_images(val_dir)

    result = {
        'class_name':     class_name,
        'dataset_folder':  dataset_folder,
        'train_count':     len(train_files),
        'val_count':       len(val_files),
        'below_train_min': len(train_files) < MIN_TRAIN_RECOMMENDED,
        'below_val_min':   len(val_files) < MIN_VAL_RECOMMENDED,
        'corrupt_files':   [],
        'duplicates_train': [],
        'duplicates_val':   [],
        'train_val_leak':   [],
    }

    # 1. Cek corrupt
    for f in train_files + val_files:
        if check_corrupt(f):
            result['corrupt_files'].append(os.path.relpath(f, BASE_DIR))

    # Hitung hash hanya untuk file yang enggak corrupt
    valid_train = [f for f in train_files if f not in result['corrupt_files']]
    valid_val   = [f for f in val_files if f not in result['corrupt_files']]

    train_hashes = {f: average_hash(f) for f in valid_train}
    val_hashes   = {f: average_hash(f) for f in valid_val}

    # 2. Duplikat dalam train
    train_dups = find_near_duplicates(train_hashes)
    result['duplicates_train'] = [
        (os.path.basename(a), os.path.basename(b), d) for a, b, d in train_dups
    ]

    # 3. Duplikat dalam val
    val_dups = find_near_duplicates(val_hashes)
    result['duplicates_val'] = [
        (os.path.basename(a), os.path.basename(b), d) for a, b, d in val_dups
    ]

    # 4. Kebocoran train <-> val (paling penting!)
    for f_train, h_train in train_hashes.items():
        if h_train is None:
            continue
        for f_val, h_val in val_hashes.items():
            if h_val is None:
                continue
            dist = hamming_distance(h_train, h_val)
            if dist <= DUPLICATE_THRESHOLD:
                result['train_val_leak'].append(
                    (os.path.basename(f_train), os.path.basename(f_val), dist)
                )

    return result


def run_audit():
    print("=" * 65)
    print("🔍 AUDIT KUALITAS DATASET - BioNusantara")
    print("=" * 65)

    all_results = []
    total_classes = 0
    total_below_min = 0
    total_corrupt = 0
    total_leak = 0

    for dataset_folder in DATASET_FOLDERS:
        train_root = os.path.join(BASE_DIR, dataset_folder, 'train')
        if not os.path.exists(train_root):
            continue

        class_names = sorted([d for d in os.listdir(train_root)
                               if os.path.isdir(os.path.join(train_root, d))])
        if not class_names:
            continue

        print(f"\n📂 {dataset_folder} ({len(class_names)} kelas)")
        print("-" * 65)

        for class_name in class_names:
            total_classes += 1
            result = audit_class(dataset_folder, class_name)
            all_results.append(result)

            flags = []
            if result['below_train_min']:
                flags.append(f"⚠️  train {result['train_count']} < {MIN_TRAIN_RECOMMENDED}")
                total_below_min += 1
            if result['below_val_min']:
                flags.append(f"⚠️  val {result['val_count']} < {MIN_VAL_RECOMMENDED}")
            if result['corrupt_files']:
                flags.append(f"❌ {len(result['corrupt_files'])} corrupt")
                total_corrupt += len(result['corrupt_files'])
            if result['duplicates_train']:
                flags.append(f"🔁 {len(result['duplicates_train'])} dup-train")
            if result['duplicates_val']:
                flags.append(f"🔁 {len(result['duplicates_val'])} dup-val")
            if result['train_val_leak']:
                flags.append(f"🚨 {len(result['train_val_leak'])} LEAK train<->val")
                total_leak += len(result['train_val_leak'])

            status = "  ".join(flags) if flags else "✅ OK"
            print(f"  {class_name:<35} train={result['train_count']:<4} "
                  f"val={result['val_count']:<4} {status}")

    # Ringkasan
    print("\n" + "=" * 65)
    print("📊 RINGKASAN")
    print("=" * 65)
    print(f"   Total kelas dicek        : {total_classes}")
    print(f"   Kelas di bawah minimum   : {total_below_min}")
    print(f"   Total foto corrupt       : {total_corrupt}")
    print(f"   Total kasus leak train<->val : {total_leak}")

    if total_leak > 0:
        print(f"\n🚨 PERHATIAN: ada {total_leak} kasus foto mirip antara train dan val.")
        print("   Ini bisa bikin val_accuracy kelihatan lebih tinggi dari performa asli.")
        print("   Rekomendasi: pindahkan salah satu foto yang mirip (jangan dua-duanya)")
        print("   supaya val set benar-benar berisi foto yang belum pernah dilihat train.")

    if total_corrupt > 0:
        print(f"\n❌ Ada {total_corrupt} foto corrupt — akan otomatis dihapus oleh")
        print("   ModelAuto.py step 1.5, tapi lebih baik dibersihkan dulu di sini.")

    # Simpan report lengkap
    report_path = os.path.join(BASE_DIR, 'audit_report.json')
    with open(report_path, 'w') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Report lengkap disimpan ke: {report_path}")
    print("=" * 65)


if __name__ == "__main__":
    run_audit()