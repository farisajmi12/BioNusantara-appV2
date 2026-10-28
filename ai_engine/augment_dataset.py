import os
import numpy as np
from PIL import Image, ImageFile, ImageEnhance, ImageFilter
import random
import hashlib

# =====================================================================
# 🔄 SCRIPT AUGMENTASI DATASET - BioNusantara (TRAIN SAJA)
# Domain: HEWAN ENDEMIK INDONESIA
#
# ⚠️  PENTING — BACA DULU:
#   Augmentasi hanya bisa TRANSFORMASI dari foto yang sudah ada
#   (rotate/flip/brightness/crop). Kalau suatu kelas 0 foto asli,
#   TIDAK ADA cara bagi script ini untuk "membuat" foto dari kosong —
#   itu bukan bug, itu batasan matematis. Kelas dengan 0 foto akan
#   di-skip dan tetap butuh foto asli baru (lewat download_dataset.py
#   atau kontribusi lapangan) sebelum bisa ikut training.
#
# PERUBAHAN DARI VERSI SEBELUMNYA:
#   1. DATASET_FOLDERS diganti ke kategori hewan endemik (bukan lagi
#      hoya/plankton/kayu).
#   2. VALIDATION SET TIDAK LAGI DIAUGMENTASI. Alasannya: augmentasi
#      di val set bikin model dievaluasi terhadap varian sintetis dari
#      foto yang sama dengan train — val_accuracy jadi bisa "bocor"
#      (kelihatan tinggi padahal bukan performa asli terhadap foto
#      baru). Kelas yang val-nya kurang sekarang cuma di-flag sebagai
#      peringatan, bukan dipaksa diaugment sampai target.
# =====================================================================

ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))

# Target minimum untuk train (val TIDAK diaugment, lihat catatan di atas)
MIN_TARGET_TRAIN = 150
MAX_TARGET_TRAIN = 150

# Ambang minimum val yang direkomendasikan (untuk peringatan saja,
# BUKAN target augmentasi)
MIN_VAL_RECOMMENDED = 15

DATASET_FOLDERS = ['dataset_mamalia', 'dataset_burung', 'dataset_reptil', 'dataset_amfibi']


def count_files(folder: str) -> int:
    if not os.path.exists(folder):
        return 0
    return len([f for f in os.listdir(folder)
                if os.path.isfile(os.path.join(folder, f))
                and f.lower().endswith(('.jpg', '.jpeg', '.png'))])


def augment_image(img: Image.Image) -> Image.Image:
    """Terapkan augmentasi acak ke satu gambar."""
    angle = random.choice([0, 90, 180, 270, random.randint(-30, 30)])
    if angle != 0:
        img = img.rotate(angle, expand=True, fillcolor=(128, 128, 128))

    flip_type = random.choice(['none', 'horizontal', 'vertical', 'both'])
    if flip_type == 'horizontal':
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    elif flip_type == 'vertical':
        img = img.transpose(Image.FLIP_TOP_BOTTOM)
    elif flip_type == 'both':
        img = img.transpose(Image.FLIP_LEFT_RIGHT).transpose(Image.FLIP_TOP_BOTTOM)

    brightness_factor = random.uniform(0.6, 1.4)
    img = ImageEnhance.Brightness(img).enhance(brightness_factor)

    contrast_factor = random.uniform(0.7, 1.3)
    img = ImageEnhance.Contrast(img).enhance(contrast_factor)

    if random.random() > 0.5:
        sat_factor = random.uniform(0.7, 1.3)
        img = ImageEnhance.Color(img).enhance(sat_factor)

    if random.random() > 0.7:
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.5, 1.5)))

    if random.random() > 0.4:
        w, h = img.size
        crop_pct = random.uniform(0.75, 0.95)
        left   = int(w * (1 - crop_pct) / 2)
        top    = int(h * (1 - crop_pct) / 2)
        right  = w - left
        bottom = h - top
        img = img.crop((left, top, right, bottom))

    img = img.resize((224, 224), Image.LANCZOS)
    return img


def augment_class_train(train_dir: str, class_name: str) -> int:
    """Augmentasi satu kelas pada folder TRAIN sampai mencapai target."""
    class_dir = os.path.join(train_dir, class_name)
    current   = count_files(class_dir)

    if current == 0:
        print(f"  ❌ [TRAIN] {class_name}: 0 foto asli — TIDAK BISA diaugmentasi. "
              f"Butuh foto asli dulu (download_dataset.py / kontribusi lapangan).")
        return 0

    if current >= MIN_TARGET_TRAIN:
        print(f"  ✅ [TRAIN] {class_name}: {current} foto, sudah cukup (skip)")
        return 0

    need = min(MIN_TARGET_TRAIN, MAX_TARGET_TRAIN) - current
    print(f"  🔄 [TRAIN] {class_name}: {current} foto → target {MIN_TARGET_TRAIN} "
          f"(perlu +{need} augmentasi)")

    source_files = [
        f for f in os.listdir(class_dir)
        if f.lower().endswith(('.jpg', '.jpeg', '.png'))
        and os.path.isfile(os.path.join(class_dir, f))
    ]

    if not source_files:
        return 0

    generated = 0
    attempts  = 0
    max_attempts = need * 10

    while generated < need and attempts < max_attempts:
        attempts += 1
        src_file = random.choice(source_files)
        src_path = os.path.join(class_dir, src_file)

        try:
            with Image.open(src_path) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img_aug = augment_image(img.copy())

            img_array    = np.array(img_aug)
            content_hash = hashlib.md5(img_array.tobytes()).hexdigest()[:10]
            aug_filename = f"{class_name}_train_aug_{content_hash}.jpg"
            aug_path     = os.path.join(class_dir, aug_filename)

            if os.path.exists(aug_path):
                continue

            img_aug.save(aug_path, 'JPEG', quality=90)
            generated += 1

            if generated % 10 == 0 or generated == need:
                print(f"     [{generated}/{need}] foto train augmentasi dibuat")

        except Exception:
            continue

    final = count_files(class_dir)
    print(f"  ✅ [TRAIN] {class_name}: selesai! {current} → {final} foto (+{generated} augmentasi)")
    return generated


def scan_and_augment():
    """Scan folder TRAIN dan augmentasi yang kurang. Folder VAL hanya di-audit, tidak diaugment."""
    print("=" * 60)
    print("🔄 AUGMENTASI DATASET BIONUSANTARA (TRAIN SAJA)")
    print(f"   Target minimum Train : {MIN_TARGET_TRAIN} foto/spesies")
    print(f"   Validation           : TIDAK diaugmentasi (lihat catatan di atas)")
    print("=" * 60)
    print(f"📂 Base Dir: {BASE_DIR}\n")

    needs_augmentation_train = []
    empty_classes_train      = []
    already_enough_train     = []

    val_below_recommended    = []
    val_empty                = []

    # 1. Audit folder TRAIN (untuk augmentasi)
    for dataset_folder in DATASET_FOLDERS:
        train_dir = os.path.join(BASE_DIR, dataset_folder, 'train')
        if not os.path.exists(train_dir):
            continue
        for class_name in sorted(os.listdir(train_dir)):
            class_dir = os.path.join(train_dir, class_name)
            if not os.path.isdir(class_dir):
                continue
            count = count_files(class_dir)
            if count == 0:
                empty_classes_train.append((dataset_folder, class_name, count))
            elif count < MIN_TARGET_TRAIN:
                needs_augmentation_train.append((dataset_folder, class_name, count))
            else:
                already_enough_train.append((dataset_folder, class_name, count))

    # 2. Audit folder VAL (HANYA laporan, tidak diaugmentasi)
    for dataset_folder in DATASET_FOLDERS:
        val_dir = os.path.join(BASE_DIR, dataset_folder, 'validation')
        if not os.path.exists(val_dir):
            continue
        for class_name in sorted(os.listdir(val_dir)):
            class_dir = os.path.join(val_dir, class_name)
            if not os.path.isdir(class_dir):
                continue
            count = count_files(class_dir)
            if count == 0:
                val_empty.append((dataset_folder, class_name, count))
            elif count < MIN_VAL_RECOMMENDED:
                val_below_recommended.append((dataset_folder, class_name, count))

    # 3. Tampilkan hasil scan TRAIN
    print(f"📊 HASIL SCAN TRAIN (Target: {MIN_TARGET_TRAIN}):")
    print(f"   ✅ Cukup  : {len(already_enough_train)} spesies")
    print(f"   🔄 Kurang : {len(needs_augmentation_train)} spesies (akan diaugmentasi)")
    print(f"   ❌ Kosong : {len(empty_classes_train)} spesies (TIDAK BISA diaugmentasi)\n")

    if empty_classes_train:
        print("-" * 60)
        print("❌ KELAS TRAIN DENGAN 0 FOTO — BUTUH FOTO ASLI, BUKAN AUGMENTASI:")
        print("-" * 60)
        for folder, cls, _ in empty_classes_train:
            print(f"   {folder}/{cls}")
        print()

    # 4. Tampilkan hasil audit VAL (informasi saja)
    print(f"📊 HASIL AUDIT VALIDATION (rekomendasi minimum: {MIN_VAL_RECOMMENDED} foto ASLI):")
    print(f"   ⚠️  Di bawah rekomendasi : {len(val_below_recommended)} spesies")
    print(f"   ❌ Kosong               : {len(val_empty)} spesies\n")

    if val_below_recommended or val_empty:
        print("-" * 60)
        print("⚠️  KELAS VAL YANG BUTUH LEBIH BANYAK FOTO ASLI (tidak diaugmentasi!):")
        print("-" * 60)
        for folder, cls, count in val_below_recommended:
            print(f"   {folder}/{cls}: {count} foto (rekomendasi min {MIN_VAL_RECOMMENDED})")
        for folder, cls, count in val_empty:
            print(f"   {folder}/{cls}: 0 foto — kelas ini tidak akan punya validasi yang valid")
        print()

    if not needs_augmentation_train:
        print("✅ Seluruh folder Train sudah memenuhi target!\n")
    else:
        # 5. Proses augmentasi TRAIN
        print(f"▶️  Mulai proses augmentasi TRAIN...\n")
        total_generated_train = 0
        for idx, (dataset_folder, class_name, _) in enumerate(needs_augmentation_train, 1):
            train_dir = os.path.join(BASE_DIR, dataset_folder, 'train')
            print(f"\n[TRAIN {idx}/{len(needs_augmentation_train)}] {dataset_folder}/{class_name}")
            total_generated_train += augment_class_train(train_dir, class_name)

        print(f"\n{'='*60}")
        print(f"✅ AUGMENTASI TRAIN SELESAI!")
        print(f"   Foto Train baru : +{total_generated_train}")
        print(f"{'='*60}")

    if empty_classes_train or val_empty:
        print("\n💡 Ada kelas yang butuh foto asli sebelum bisa masuk training dengan")
        print("   benar. Jalankan download_dataset.py lagi untuk kelas-kelas ini, atau")
        print("   cek apakah nama taxon-nya sudah benar (lihat audit_dataset.py juga).")


if __name__ == "__main__":
    scan_and_augment()