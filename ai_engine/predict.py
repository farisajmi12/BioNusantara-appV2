import os
import json
import warnings
import numpy as np
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import tensorflow as tf
from flask_cors import CORS
from PIL import Image, ImageFile

# ============================================================
# KONFIGURASI
# Domain: HEWAN ENDEMIK INDONESIA (mamalia, burung, reptil, amfibi)
# ============================================================
ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None
warnings.filterwarnings('ignore', message='.*decompression bomb.*')

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
print("\n🚀 Menyiapkan Master AI BioNusantara...")

# ============================================================
# BACA INFO MODEL — preprocessing sesuai model yang dipakai
# ============================================================
def load_model_info() -> dict:
    info_file = os.path.join(BASE_DIR, 'model_info.json')
    if os.path.exists(info_file):
        with open(info_file, 'r') as f:
            return json.load(f)
    return {'model_type': 'EfficientNetB2', 'img_size': 260}


MODEL_INFO = load_model_info()
MODEL_TYPE = MODEL_INFO.get('model_type', 'EfficientNetB2')
IMG_SIZE   = MODEL_INFO.get('img_size', 260)

print(f"📦 Model type : {MODEL_TYPE}")
print(f"📐 Input size : {IMG_SIZE}x{IMG_SIZE}px")

if MODEL_TYPE in ['EfficientNetB2', 'EfficientNetB4']:
    from tensorflow.keras.applications.efficientnet import preprocess_input
    print("✅ Preprocessing: EfficientNet")
else:
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
    print("✅ Preprocessing: MobileNetV2")

# ============================================================
# LOAD MODEL
# ============================================================
auto_model_path = os.path.join(BASE_DIR, 'ModelAuto_best.h5')
auto_model = None
if os.path.exists(auto_model_path):
    auto_model = tf.keras.models.load_model(auto_model_path)
    print("✅ Model siap!")
else:
    print("⚠️  Model belum ada — jalankan ModelAuto.py dulu.")


# ============================================================
# BACA DAFTAR KELAS
# ============================================================
def get_classes() -> list:
    classes_file = os.path.join(BASE_DIR, 'model_classes.txt')
    if os.path.exists(classes_file):
        with open(classes_file, 'r') as f:
            classes = [line.strip() for line in f if line.strip()]
        print(f"📋 Kelas dari model_classes.txt: {len(classes)} spesies")
        return classes
    train_dir = os.path.join(BASE_DIR, 'dataset_auto', 'train')
    if os.path.exists(train_dir):
        classes = sorted([d for d in os.listdir(train_dir)
                          if os.path.isdir(os.path.join(train_dir, d))])
        print(f"📋 Kelas dari folder: {len(classes)} spesies")
        return classes
    return []


# ============================================================
# BACA STATUS SPESIES
# ============================================================
def get_species_status() -> dict:
    status_file = os.path.join(BASE_DIR, 'species_status.json')
    if os.path.exists(status_file):
        with open(status_file, 'r') as f:
            return json.load(f)
    return {}


# ============================================================
# BACA MAPPING KATEGORI (mamalia/burung/reptil/amfibi)
# Ditulis oleh ModelAuto.py saat menggabungkan dataset — jadi kategori
# dibaca dari struktur folder sumber yang sebenarnya, BUKAN ditebak
# dari nama spesies. Kalau file ini belum ada (ModelAuto.py belum
# pernah dijalankan dengan versi baru), kategori jatuh ke 'tidak diketahui'
# alih-alih menebak salah.
# ============================================================
def get_category_map() -> dict:
    category_file = os.path.join(BASE_DIR, 'species_category.json')
    if os.path.exists(category_file):
        with open(category_file, 'r') as f:
            return json.load(f)
    print("⚠️  species_category.json tidak ditemukan — kategori akan selalu "
          "'tidak diketahui'. Jalankan ulang ModelAuto.py versi terbaru untuk "
          "membuat file ini.")
    return {}


def get_category(class_name: str, category_map: dict) -> str:
    return category_map.get(class_name, 'tidak diketahui')


def get_threshold(num_classes: int) -> float:
    """Threshold dinamis berdasarkan jumlah kelas."""
    if num_classes <= 10:
        return 0.60
    elif num_classes <= 30:
        return 0.50
    elif num_classes <= 60:
        return 0.40
    else:
        return 0.35


def safe_load_image(img_path: str, size: int) -> np.ndarray:
    """Load gambar dengan aman, resize ke ukuran yang benar."""
    with Image.open(img_path) as img:
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize((size, size), Image.LANCZOS)
        return np.array(img, dtype=np.float32)


# ============================================================
# INISIALISASI
# ============================================================
CLASSES_AUTO         = get_classes()
SPECIES_STATUS       = get_species_status()
CATEGORY_MAP         = get_category_map()
CONFIDENCE_THRESHOLD = get_threshold(len(CLASSES_AUTO))
WAITING_SPECIES      = {
    name for name, info in SPECIES_STATUS.items()
    if info.get('status') in ('menunggu_foto', 'foto_kurang')
}

print(f"📋 Total kelas   : {len(CLASSES_AUTO)}")
print(f"⏳ Menunggu foto : {len(WAITING_SPECIES)}")
print(f"🏷️  Kategori dikenali : {len(CATEGORY_MAP)} spesies")
print(f"🎯 Threshold     : {CONFIDENCE_THRESHOLD*100:.0f}% ({len(CLASSES_AUTO)} kelas)\n")


# ============================================================
# ENDPOINT PREDICT
# ============================================================
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'Tidak ada gambar'}), 400

    file = request.files['image']
    temp_dir = os.path.join(BASE_DIR, "temp")
    os.makedirs(temp_dir, exist_ok=True)
    img_path = os.path.join(temp_dir, secure_filename(file.filename))
    file.save(img_path)

    try:
        if not auto_model or len(CLASSES_AUTO) == 0:
            return jsonify({'error': 'Model belum siap!'}), 500

        img_array = safe_load_image(img_path, IMG_SIZE)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        preds      = auto_model.predict(img_array, verbose=0)[0]
        pred_index = int(np.argmax(preds))
        confidence = float(np.max(preds))

        top3_indices = np.argsort(preds)[::-1][:3]
        top3 = [
            {
                'species':        CLASSES_AUTO[i] if i < len(CLASSES_AUTO) else '?',
                'confidence':     float(preds[i]),
                'confidence_pct': f"{preds[i]*100:.1f}%",
                'category':       get_category(
                                      CLASSES_AUTO[i] if i < len(CLASSES_AUTO) else '',
                                      CATEGORY_MAP
                                  ),
                'status':         SPECIES_STATUS.get(
                                      CLASSES_AUTO[i] if i < len(CLASSES_AUTO) else '',
                                      {}
                                  ).get('status', 'aktif')
            }
            for i in top3_indices
        ]

        result_class = "Tidak Diketahui"
        category     = "unknown"
        ai_note      = None

        if confidence >= CONFIDENCE_THRESHOLD:
            if pred_index < len(CLASSES_AUTO):
                result_class = CLASSES_AUTO[pred_index]
                category     = get_category(result_class, CATEGORY_MAP)
        else:
            top_candidate = top3[0]['species'] if top3 else None
            if top_candidate and top_candidate in WAITING_SPECIES:
                ai_note = (
                    f"Kemungkinan {top_candidate.replace('_', ' ')}, "
                    f"namun data foto spesies ini masih terbatas. "
                    f"Silakan verifikasi ke pakar."
                )
            else:
                ai_note = (
                    "AI tidak cukup yakin mengidentifikasi spesies ini. "
                    "Coba foto yang lebih jelas atau konsultasikan ke pakar."
                )

        if result_class == "Tidak Diketahui":
            print(f"⚠️  Confidence rendah: {confidence*100:.2f}% "
                  f"(threshold: {CONFIDENCE_THRESHOLD*100:.0f}%)")
            print(f"    Top: {top3[0]['species']} ({top3[0]['confidence_pct']})")
        else:
            print(f"🎯 {result_class} [{category}] {confidence*100:.2f}%")

        return jsonify({
            'success':        True,
            'prediction':     result_class,
            'category':       category,
            'confidence':     confidence,
            'confidence_pct': f"{confidence*100:.1f}%",
            'top3':           top3,
            'ai_note':        ai_note,
            'model_info': {
                'type':                  MODEL_TYPE,
                'img_size':              IMG_SIZE,
                'total_species_known':   len(CLASSES_AUTO),
                'total_species_waiting': len(WAITING_SPECIES),
            }
        })

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(img_path):
            os.remove(img_path)


# ============================================================
# ENDPOINT STATUS SPESIES (untuk admin dashboard)
# ============================================================
@app.route('/species-status', methods=['GET'])
def species_status():
    aktif    = {k: v for k, v in SPECIES_STATUS.items() if v.get('status') == 'aktif'}
    kurang   = {k: v for k, v in SPECIES_STATUS.items() if v.get('status') == 'foto_kurang'}
    menunggu = {k: v for k, v in SPECIES_STATUS.items() if v.get('status') == 'menunggu_foto'}

    return jsonify({
        'success': True,
        'model_info': MODEL_INFO,
        'summary': {
            'aktif':         len(aktif),
            'foto_kurang':   len(kurang),
            'menunggu_foto': len(menunggu),
            'total':         len(SPECIES_STATUS),
        },
        'aktif':         list(aktif.keys()),
        'foto_kurang':   {k: v.get('train_count', 0) for k, v in kurang.items()},
        'menunggu_foto': list(menunggu.keys()),
    })


if __name__ == '__main__':
    app.run(port=5000)