import os
import json
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# ============================================================
# 📊 EVALUASI MODEL - BioNusantara
# Jalankan SETELAH ModelAuto.py selesai training.
#
# Kenapa ini perlu: val_accuracy yang dilaporkan ModelAuto.py dipantau
# oleh EarlyStopping/ReduceLROnPlateau/ModelCheckpoint selama training,
# jadi val set secara tidak langsung ikut memengaruhi proses training
# (bukan sekadar "diukur"). Angka itu bisa sedikit optimis dibanding
# performa model di data yang benar-benar baru. Script ini menghitung
# metrik yang lebih jujur dan granular: confusion matrix (spesies apa
# ketuker sama spesies apa) dan precision/recall/F1 PER KELAS — bukan
# cuma satu angka akurasi keseluruhan yang bisa menyembunyikan masalah
# di kelas-kelas tertentu (terutama kalau jumlah data antar kelas
# timpang, atau ada spesies yang mirip secara visual).
#
# CATATAN: script ini membaca dataset_auto/validation apa adanya.
# Kalau kamu pernah menjalankan augment_dataset.py dengan MIN_TARGET_VAL
# > 0 pada folder ini, validation set sudah tercampur foto sintetis —
# hasil evaluasi di bawah jadi kurang bisa dipercaya untuk kasus itu.
# Idealnya validation set berisi foto asli semua.
# ============================================================

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BASE_DIR, 'ModelAuto_best.h5')
CLASSES_PATH = os.path.join(BASE_DIR, 'model_classes.txt')
INFO_PATH   = os.path.join(BASE_DIR, 'model_info.json')
VAL_DIR     = os.path.join(BASE_DIR, 'dataset_auto', 'validation')
OUTPUT_DIR  = os.path.join(BASE_DIR, 'evaluation_report')

WORST_CLASSES_TO_SHOW = 15


def load_model_info() -> dict:
    if os.path.exists(INFO_PATH):
        with open(INFO_PATH, 'r') as f:
            return json.load(f)
    return {'model_type': 'EfficientNetB2', 'img_size': 260}


def main():
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model tidak ditemukan di {MODEL_PATH}. Jalankan ModelAuto.py dulu.")
        return
    if not os.path.exists(CLASSES_PATH):
        print(f"❌ {CLASSES_PATH} tidak ditemukan. Jalankan ModelAuto.py dulu.")
        return
    if not os.path.exists(VAL_DIR):
        print(f"❌ {VAL_DIR} tidak ditemukan.")
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    info     = load_model_info()
    img_size = info.get('img_size', 260)

    if info.get('model_type') in ['EfficientNetB2', 'EfficientNetB4']:
        from tensorflow.keras.applications.efficientnet import preprocess_input
    else:
        from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

    with open(CLASSES_PATH, 'r') as f:
        class_names = [line.strip() for line in f if line.strip()]

    print("📦 Memuat model...")
    model = tf.keras.models.load_model(MODEL_PATH)

    print("📂 Memuat validation set (tanpa shuffle, tanpa augmentasi)...")
    val_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
        preprocessing_function=preprocess_input
    )
    val_gen = val_datagen.flow_from_directory(
        VAL_DIR, target_size=(img_size, img_size),
        batch_size=16, class_mode='categorical', shuffle=False
    )

    # Pastikan urutan kelas val_gen konsisten dengan model_classes.txt
    gen_class_names = sorted(val_gen.class_indices.keys())
    if gen_class_names != sorted(class_names):
        print("⚠️  PERINGATAN: daftar kelas di model_classes.txt tidak sama persis")
        print("    dengan kelas yang ada di dataset_auto/validation sekarang.")
        print("    Evaluasi tetap dilanjutkan berdasarkan kelas yang ada di validation set.")

    print(f"🔮 Menjalankan prediksi pada {val_gen.samples} foto validasi...")
    preds = model.predict(val_gen, verbose=1)
    y_true = val_gen.classes
    y_pred = np.argmax(preds, axis=1)

    idx_to_class = {v: k for k, v in val_gen.class_indices.items()}
    target_names = [idx_to_class[i] for i in range(len(idx_to_class))]

    # ============================================================
    # TOP-1 & TOP-3 ACCURACY
    # ============================================================
    top1_acc = accuracy_score(y_true, y_pred)

    top3_preds = np.argsort(preds, axis=1)[:, -3:]
    top3_correct = sum(1 for i, true_label in enumerate(y_true)
                        if true_label in top3_preds[i])
    top3_acc = top3_correct / len(y_true)

    print(f"\n{'='*60}")
    print(f"📊 HASIL EVALUASI")
    print(f"{'='*60}")
    print(f"   Top-1 Accuracy : {top1_acc*100:.2f}%")
    print(f"   Top-3 Accuracy : {top3_acc*100:.2f}%")
    if top3_acc - top1_acc > 0.15:
        print("   💡 Gap top-1 vs top-3 cukup besar — banyak kasus jawaban benar")
        print("      ada di 3 besar tapi bukan urutan pertama. Kemungkinan ada")
        print("      spesies yang mirip secara visual (cek confusion matrix).")

    # ============================================================
    # CLASSIFICATION REPORT (precision/recall/F1 per kelas)
    # ============================================================
    report_dict = classification_report(
        y_true, y_pred, target_names=target_names,
        output_dict=True, zero_division=0
    )
    report_text = classification_report(
        y_true, y_pred, target_names=target_names, zero_division=0
    )

    with open(os.path.join(OUTPUT_DIR, 'classification_report.json'), 'w') as f:
        json.dump(report_dict, f, indent=2, ensure_ascii=False)
    with open(os.path.join(OUTPUT_DIR, 'classification_report.txt'), 'w') as f:
        f.write(report_text)

    # Tampilkan kelas dengan performa terburuk (recall terendah)
    per_class = [(name, report_dict[name]) for name in target_names
                 if name in report_dict]
    per_class_sorted = sorted(per_class, key=lambda x: x[1]['recall'])

    print(f"\n📉 {WORST_CLASSES_TO_SHOW} KELAS DENGAN RECALL TERENDAH:")
    print(f"   (paling sering model GAGAL mengenali kelas ini dengan benar)")
    print("-" * 60)
    for name, metrics in per_class_sorted[:WORST_CLASSES_TO_SHOW]:
        print(f"   {name:<35} recall={metrics['recall']:.2f}  "
              f"precision={metrics['precision']:.2f}  n={int(metrics['support'])}")

    # ============================================================
    # CONFUSION MATRIX
    # ============================================================
    cm = confusion_matrix(y_true, y_pred)
    cm_path = os.path.join(OUTPUT_DIR, 'confusion_matrix.csv')
    with open(cm_path, 'w') as f:
        f.write("," + ",".join(target_names) + "\n")
        for i, row in enumerate(cm):
            f.write(target_names[i] + "," + ",".join(str(v) for v in row) + "\n")

    # Cari pasangan kelas yang paling sering ketuker (off-diagonal terbesar)
    confusions = []
    for i in range(len(target_names)):
        for j in range(len(target_names)):
            if i != j and cm[i][j] > 0:
                confusions.append((target_names[i], target_names[j], int(cm[i][j])))
    confusions.sort(key=lambda x: x[2], reverse=True)

    if confusions:
        print(f"\n🔀 PASANGAN KELAS YANG PALING SERING KETUKER (top 10):")
        print("-" * 60)
        for actual, predicted, count in confusions[:10]:
            print(f"   {actual:<30} → salah diprediksi sebagai → {predicted:<30} ({count}x)")
        print("\n   💡 Kalau ada pasangan yang sama muncul berulang dengan jumlah")
        print("      besar, itu indikasi kuat dua spesies ini sulit dibedakan")
        print("      model — bisa karena data kurang, ATAU karena memang mirip")
        print("      secara visual (batasan yang enggak selalu bisa diatasi cuma")
        print("      dengan menambah data).")

    # Coba simpan heatmap visual (opsional, butuh matplotlib)
    try:
        import matplotlib.pyplot as plt
        fig_size = max(8, len(target_names) * 0.4)
        plt.figure(figsize=(fig_size, fig_size))
        plt.imshow(cm, cmap='Blues')
        plt.colorbar()
        plt.xticks(range(len(target_names)), target_names, rotation=90, fontsize=6)
        plt.yticks(range(len(target_names)), target_names, fontsize=6)
        plt.xlabel('Prediksi')
        plt.ylabel('Sebenarnya')
        plt.title('Confusion Matrix')
        plt.tight_layout()
        plt.savefig(os.path.join(OUTPUT_DIR, 'confusion_matrix.png'), dpi=150)
        print(f"\n🖼️  Heatmap disimpan: {os.path.join(OUTPUT_DIR, 'confusion_matrix.png')}")
    except ImportError:
        print("\n(matplotlib tidak terpasang — heatmap visual dilewati, "
              "confusion_matrix.csv tetap tersimpan. `pip install matplotlib` "
              "kalau mau heatmap-nya.)")

    print(f"\n💾 Semua laporan disimpan di: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()