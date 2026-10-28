# ============================================================
# 🧠 Script Training Model MASTER AUTO - BioNusantara
# UPGRADE: MobileNetV2 → EfficientNetB2
# Domain: HEWAN ENDEMIK INDONESIA (mamalia, burung, reptil, amfibi)
# Keunggulan EfficientNetB2:
#   - Input 260x260 (vs 224x224) → lebih detail
#   - Compound scaling → lebih akurat
#   - ~9M parameter (vs 3.4M MobileNetV2)
#
# ⚠️  SEBELUM MENJALANKAN INI:
#   1. Jalankan download_dataset.py untuk mengisi dataset_mamalia/,
#      dataset_burung/, dataset_reptil/, dataset_amfibi/
#   2. Jalankan audit_dataset.py untuk cek kualitas data (foto corrupt,
#      duplikat, kebocoran train<->val) sebelum training beneran
#   3. MIN_TRAIN_PHOTOS di bawah masih 3 (angka lama) — sesuaikan
#      berdasarkan hasil audit_dataset.py, jangan dinaikkan asal-asalan
#      tanpa tahu jumlah foto asli per kelas yang sebenarnya tersedia.
# ============================================================
import os
import sys
import shutil
import json
import random
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB2
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras import layers
from tensorflow.keras.regularizers import l2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from sklearn.utils.class_weight import compute_class_weight
import scipy
from PIL import Image, ImageFile, ImageEnhance, ImageFilter
from datetime import datetime
import hashlib

# ============================================================
# 🛠️ KONFIGURASI
# ============================================================
ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None
sys.modules['scipy'] = scipy

print("✅ TensorFlow version:", tf.__version__)

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
auto_dir    = os.path.join(BASE_DIR, 'dataset_auto')
backup_dir  = os.path.join(BASE_DIR, 'dataset_auto_skipped')
STATUS_FILE = os.path.join(BASE_DIR, 'species_status.json')

IMG_SIZE         = 260   # EfficientNetB2 optimal di 260x260
MIN_TRAIN_PHOTOS = 3     # TODO: sesuaikan berdasarkan hasil audit_dataset.py
MIN_VAL_PHOTOS   = 1
AUGMENT_TARGET   = 50


# ============================================================
# AUGMENTASI OTOMATIS
# ============================================================
def augment_image(img: Image.Image) -> Image.Image:
    angle = random.choice([0, 90, 180, 270, random.randint(-30, 30)])
    if angle != 0:
        img = img.rotate(angle, expand=True, fillcolor=(128, 128, 128))
    flip = random.choice(['none', 'horizontal', 'vertical'])
    if flip == 'horizontal':
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    elif flip == 'vertical':
        img = img.transpose(Image.FLIP_TOP_BOTTOM)
    img = ImageEnhance.Brightness(img).enhance(random.uniform(0.6, 1.4))
    img = ImageEnhance.Contrast(img).enhance(random.uniform(0.7, 1.3))
    if random.random() > 0.5:
        img = ImageEnhance.Color(img).enhance(random.uniform(0.7, 1.3))
    if random.random() > 0.7:
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 1.2)))
    if random.random() > 0.4:
        w, h = img.size
        crop = random.uniform(0.75, 0.95)
        l_   = int(w * (1 - crop) / 2)
        t    = int(h * (1 - crop) / 2)
        img  = img.crop((l_, t, w - l_, h - t))
    img = img.resize((IMG_SIZE, IMG_SIZE), Image.LANCZOS)
    return img


def auto_augment_class(class_dir: str, class_name: str, target: int) -> int:
    source_files = [
        f for f in os.listdir(class_dir)
        if f.lower().endswith(('.jpg', '.jpeg', '.png'))
        and not f.startswith(f"{class_name}_aug_")
        and os.path.isfile(os.path.join(class_dir, f))
    ]
    current = len([f for f in os.listdir(class_dir)
                   if os.path.isfile(os.path.join(class_dir, f))])
    if current >= target or not source_files:
        return 0
    need = target - current
    generated = attempts = 0
    while generated < need and attempts < need * 15:
        attempts += 1
        src_path = os.path.join(class_dir, random.choice(source_files))
        try:
            with Image.open(src_path) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img_aug = augment_image(img.copy())
            content_hash = hashlib.md5(np.array(img_aug).tobytes()).hexdigest()[:10]
            aug_path     = os.path.join(class_dir, f"{class_name}_aug_{content_hash}.jpg")
            if os.path.exists(aug_path):
                continue
            img_aug.save(aug_path, 'JPEG', quality=90)
            generated += 1
        except Exception:
            continue
    return generated


# ============================================================
# STATUS SPESIES
# ============================================================
def load_species_status() -> dict:
    if os.path.exists(STATUS_FILE):
        with open(STATUS_FILE, 'r') as f:
            return json.load(f)
    return {}


def save_species_status(status: dict):
    with open(STATUS_FILE, 'w') as f:
        json.dump(status, f, indent=2, ensure_ascii=False)


def update_species_status(included: list, skipped: list):
    status = load_species_status()
    now    = datetime.now().strftime("%Y-%m-%d %H:%M")
    for s in included:
        name = s['name']
        prev = status.get(name, {}).get('status', 'belum_ada')
        status[name] = {
            'status': 'aktif', 'train_count': s['train'],
            'val_count': s['val'], 'last_trained': now,
            'note': ('Baru aktif! Sebelumnya: ' + prev
                     if prev in ('menunggu_foto', 'foto_kurang')
                     else 'Aktif dalam training')
        }
    for s in skipped:
        name = s['name']
        status[name] = {
            'status':      'menunggu_foto' if s['train'] == 0 else 'foto_kurang',
            'train_count': s['train'], 'val_count': s['val'],
            'last_check':  now,
            'note':        ('Belum ada foto — menunggu kontribusi masyarakat'
                            if s['train'] == 0
                            else f"Foto kurang: {s['train']} train, {s['val']} val")
        }
    save_species_status(status)
    return status


# ============================================================
# KEMBALIKAN BACKUP
# ============================================================
def kembalikan_backup(skipped_classes: list):
    if not skipped_classes or not os.path.exists(backup_dir):
        return
    print(f"\n♻️  Mengembalikan {len(skipped_classes)} spesies dari backup...")
    for s in skipped_classes:
        for split in ['train', 'validation']:
            src  = os.path.join(backup_dir, split, s['name'])
            dest = os.path.join(auto_dir, split, s['name'])
            if os.path.exists(src):
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                shutil.move(src, dest)
    shutil.rmtree(backup_dir, ignore_errors=True)
    print("✅ Semua folder dikembalikan.")


skipped_classes  = []
included_classes = []

try:
    # ============================================================
    # 1. GABUNGKAN SEMUA DATASET
    # ============================================================
    print("\n🔄 Menggabungkan dataset Mamalia, Burung, Reptil, dan Amfibi...")
    # category_map merekam class_name -> kategori (mamalia/burung/reptil/amfibi)
    # supaya predict.py enggak perlu nebak dari nama spesies — dibaca dari
    # struktur folder sumber di sini, tempat kategori itu sebenarnya diketahui.
    category_map = {}
    for split in ['train', 'validation']:
        os.makedirs(os.path.join(auto_dir, split), exist_ok=True)
        for category in ['dataset_mamalia', 'dataset_burung', 'dataset_reptil', 'dataset_amfibi']:
            src_dir = os.path.join(BASE_DIR, category, split)
            if os.path.exists(src_dir):
                for class_name in os.listdir(src_dir):
                    src_class  = os.path.join(src_dir, class_name)
                    if not os.path.isdir(src_class):
                        continue
                    category_map[class_name] = category.replace('dataset_', '')
                    dest_class = os.path.join(auto_dir, split, class_name)
                    if not os.path.exists(dest_class):
                        shutil.copytree(src_class, dest_class)
                        print(f"   ✅ Disalin: {category}/{split}/{class_name}")

    with open(os.path.join(BASE_DIR, 'species_category.json'), 'w') as f:
        json.dump(category_map, f, indent=2, ensure_ascii=False)
    print(f"   💾 species_category.json disimpan ({len(category_map)} spesies)")

    # ============================================================
    # 1.5 HAPUS FOTO CORRUPT
    # ============================================================
    print("\n🧹 Mengecek foto yang rusak...")
    removed = 0
    for split in ['train', 'validation']:
        split_dir = os.path.join(auto_dir, split)
        if not os.path.exists(split_dir):
            continue
        for class_name in os.listdir(split_dir):
            class_dir = os.path.join(split_dir, class_name)
            if not os.path.isdir(class_dir):
                continue
            for img_name in os.listdir(class_dir):
                img_path = os.path.join(class_dir, img_name)
                try:
                    with Image.open(img_path) as img:
                        img.verify()
                except Exception:
                    print(f"   🗑️  Dihapus: {class_name}/{img_name}")
                    os.remove(img_path)
                    removed += 1
    print(f"✨ {removed} foto rusak dihapus.\n")

    # ============================================================
    # 1.7 FILTER SPESIES
    # ============================================================
    print("🔍 Mengecek dataset per spesies...\n")
    train_dir_check = os.path.join(auto_dir, 'train')
    val_dir_check   = os.path.join(auto_dir, 'validation')

    if os.path.exists(train_dir_check):
        for class_name in sorted(os.listdir(train_dir_check)):
            train_class_dir = os.path.join(train_dir_check, class_name)
            val_class_dir   = os.path.join(val_dir_check, class_name)
            if not os.path.isdir(train_class_dir):
                continue
            train_count = len([f for f in os.listdir(train_class_dir)
                               if os.path.isfile(os.path.join(train_class_dir, f))])
            val_count   = len([f for f in os.listdir(val_class_dir)
                               if os.path.isfile(os.path.join(val_class_dir, f))]) \
                          if os.path.exists(val_class_dir) else 0
            if train_count < MIN_TRAIN_PHOTOS or val_count < MIN_VAL_PHOTOS:
                skipped_classes.append({'name': class_name, 'train': train_count, 'val': val_count})
            else:
                included_classes.append({'name': class_name, 'train': train_count, 'val': val_count})

    update_species_status(included_classes, skipped_classes)

    print(f"✅ Spesies DILATIH : {len(included_classes)}")
    print(f"⚠️  Spesies di-SKIP : {len(skipped_classes)}\n")

    if skipped_classes:
        for s in skipped_classes:
            print(f"   ⏳ {s['name']}: {s['train']} train, {s['val']} val")
        print()
        for s in skipped_classes:
            for split in ['train', 'validation']:
                src  = os.path.join(auto_dir, split, s['name'])
                dest = os.path.join(backup_dir, split, s['name'])
                if os.path.exists(src):
                    os.makedirs(os.path.dirname(dest), exist_ok=True)
                    shutil.move(src, dest)
        print("✅ Backup selesai.\n")

    if len(included_classes) < 2:
        print("❌ ERROR: Tidak cukup spesies (minimal 2)!")
        sys.exit(1)

    # ============================================================
    # 1.8 AUGMENTASI OTOMATIS
    # ============================================================
    print(f"🔄 Augmentasi spesies < {AUGMENT_TARGET} foto...\n")
    total_augmented = 0
    for s in included_classes:
        class_dir = os.path.join(auto_dir, 'train', s['name'])
        if not os.path.exists(class_dir):
            continue
        current_count = len([f for f in os.listdir(class_dir)
                             if os.path.isfile(os.path.join(class_dir, f))])
        if current_count < AUGMENT_TARGET:
            generated = auto_augment_class(class_dir, s['name'], AUGMENT_TARGET)
            if generated > 0:
                final_count = len([f for f in os.listdir(class_dir)
                                  if os.path.isfile(os.path.join(class_dir, f))])
                print(f"   🔄 {s['name']}: {current_count}→{final_count} (+{generated})")
                total_augmented += generated
    print(f"\n✅ Total augmentasi: {total_augmented} foto\n" if total_augmented > 0
          else f"   ✅ Semua sudah ≥{AUGMENT_TARGET} foto.\n")

    # ============================================================
    # 2. PERSIAPAN DATASET
    # ============================================================
    train_dir = os.path.join(auto_dir, 'train')
    val_dir   = os.path.join(auto_dir, 'validation')

    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.15,
        zoom_range=0.25,
        horizontal_flip=True,
        vertical_flip=True,
        brightness_range=[0.7, 1.3],
        fill_mode='nearest'
    )
    val_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

    train_gen = train_datagen.flow_from_directory(
        train_dir, target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=16, class_mode='categorical', shuffle=True
    )
    val_gen = val_datagen.flow_from_directory(
        val_dir, target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=16, class_mode='categorical', shuffle=False
    )

    num_classes = len(train_gen.class_indices)
    print(f"\n🔢 Spesies aktif: {num_classes}")

    # ============================================================
    # CLASS WEIGHT
    # ============================================================
    print("\n⚖️  Class weights...")
    labels = train_gen.classes
    cwa    = compute_class_weight(class_weight='balanced',
                                  classes=np.unique(labels), y=labels)
    class_weight_dict = dict(enumerate(cwa))
    print(f"   Min:{min(cwa):.3f} Max:{max(cwa):.3f} Rasio:{max(cwa)/min(cwa):.1f}x ✅\n")

    # ============================================================
    # 3. BANGUN MODEL EfficientNetB2
    #    (classifier head diperkecil + L2 regularization — mencegah
    #    overfit lebih cepat pada dataset per-kelas yang masih terbatas)
    # ============================================================
    print(f"🏗️  EfficientNetB2 ({IMG_SIZE}x{IMG_SIZE}, {num_classes} kelas)...")
    base_model = EfficientNetB2(
        weights='imagenet', include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    base_model.trainable = False

    inputs  = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x       = base_model(inputs, training=False)
    x       = layers.GlobalAveragePooling2D()(x)
    x       = layers.BatchNormalization()(x)
    x       = layers.Dense(256, activation='relu', kernel_regularizer=l2(1e-4))(x)
    x       = layers.Dropout(0.4)(x)
    x       = layers.Dense(128, activation='relu', kernel_regularizer=l2(1e-4))(x)
    x       = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    model   = tf.keras.Model(inputs, outputs)

    loss_fn = tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss=loss_fn,
        metrics=['accuracy']
    )
    model.summary()

    checkpoint_path = os.path.join(BASE_DIR, "ModelAuto_best.h5")
    cb1 = [
        EarlyStopping(patience=7, restore_best_weights=True,
                      monitor='val_accuracy', verbose=1),
        ReduceLROnPlateau(factor=0.5, patience=3, monitor='val_loss',
                          verbose=1, min_lr=1e-6),
        ModelCheckpoint(checkpoint_path, monitor='val_accuracy',
                        save_best_only=True, verbose=1)
    ]
    cb2 = [
        EarlyStopping(patience=7, restore_best_weights=True,
                      monitor='val_accuracy', verbose=1),
        ReduceLROnPlateau(factor=0.3, patience=3, monitor='val_loss',
                          verbose=1, min_lr=1e-7),
        ModelCheckpoint(checkpoint_path, monitor='val_accuracy',
                        save_best_only=True, verbose=1)
    ]

    # ============================================================
    # PHASE 1 — 30 EPOCH
    # ============================================================
    print(f"\n🚀 Phase 1: Training classifier (30 epoch)...\n")
    h1          = model.fit(train_gen, validation_data=val_gen, epochs=30,
                            callbacks=cb1, class_weight=class_weight_dict)
    val_acc_p1  = max(h1.history['val_accuracy'])
    print(f"\n✅ Phase 1 selesai! Val accuracy: {val_acc_p1*100:.2f}%")

    # ============================================================
    # PHASE 2 — FINE-TUNE 100 LAYER (30 EPOCH)
    # ============================================================
    print("\n🔓 Phase 2: Fine-tuning 100 layer terakhir...")
    base_model.trainable = True
    for layer in base_model.layers[:-100]:
        layer.trainable = False
    tn = sum(1 for l in base_model.layers if l.trainable)
    print(f"   Layer aktif: {tn}/{len(base_model.layers)}\n")

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.00005),
        loss=loss_fn,
        metrics=['accuracy']
    )
    h2         = model.fit(train_gen, validation_data=val_gen, epochs=30,
                           callbacks=cb2, class_weight=class_weight_dict)
    val_acc_p2 = max(h2.history['val_accuracy'])
    print(f"\n✅ Phase 2 selesai! Val accuracy: {val_acc_p2*100:.2f}%")

    # ============================================================
    # SIMPAN
    # ============================================================
    save_path = os.path.join(BASE_DIR, "ModelAuto_EfficientNetB2.h5")
    model.save(save_path)

    with open(os.path.join(BASE_DIR, "model_classes.txt"), 'w') as f:
        for cn in sorted(train_gen.class_indices.keys()):
            f.write(cn + '\n')

    # ✅ model_info.json — dibaca predict.py & evaluate_model.py untuk
    #    preprocessing yang benar
    with open(os.path.join(BASE_DIR, 'model_info.json'), 'w') as f:
        json.dump({
            'model_type':   'EfficientNetB2',
            'img_size':     IMG_SIZE,
            'num_classes':  num_classes,
            'val_accuracy': f"{val_acc_p2*100:.2f}%",
            'trained_at':   datetime.now().strftime("%Y-%m-%d %H:%M")
        }, f, indent=2)

    fs = load_species_status()
    for s in included_classes:
        if s['name'] in fs:
            fs[s['name']].update({
                'status': 'aktif',
                'last_trained': datetime.now().strftime("%Y-%m-%d %H:%M"),
                'val_accuracy': f"{val_acc_p2*100:.2f}%"
            })
    save_species_status(fs)

    print(f"\n{'='*60}")
    print(f"💾 {save_path}")
    print(f"\n📊 RINGKASAN:")
    print(f"   Model      : EfficientNetB2 ✨ (upgrade dari MobileNetV2)")
    print(f"   Input      : {IMG_SIZE}x{IMG_SIZE}px (upgrade dari 224x224)")
    print(f"   Spesies    : {num_classes} dilatih, {len(skipped_classes)} di-skip")
    print(f"   Augmentasi : {total_augmented} foto baru")
    print(f"   Phase 1    : {val_acc_p1*100:.2f}%")
    print(f"   Phase 2    : {val_acc_p2*100:.2f}%")
    print(f"{'='*60}")
    if skipped_classes:
        print(f"\n⏳ Spesies menunggu foto:")
        for s in skipped_classes:
            print(f"   - {s['name']}")
        print(f"\n💡 Tambah foto → jalankan ModelAuto.py → otomatis masuk training!")
    print("\n💡 Selanjutnya jalankan evaluate_model.py untuk melihat confusion")
    print("   matrix dan metrik per-spesies — val_accuracy di atas belum")
    print("   tentu mencerminkan performa sebenarnya (lihat catatan di file itu).")
    print("\n✅ SUKSES!")

finally:
    kembalikan_backup(skipped_classes)