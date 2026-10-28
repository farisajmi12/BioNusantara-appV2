
# Panduan Kolaborasi Tim (Contributing Guide)

## 1. Tujuan
Dokumen ini berisi panduan kolaborasi tim dalam pengembangan aplikasi BioNusantara-appV2 menggunakan Git dan GitHub agar pekerjaan setiap anggota terorganisasi dengan baik.

## 2. Aturan Penamaan Branch
Setiap anggota tim wajib membuat branch baru sebelum mengerjakan tugas. Hindari melakukan perubahan langsung pada branch `main`.

Gunakan format penamaan branch berikut:
- `feat/nama-fitur` untuk penambahan fitur.
- `fix/nama-perbaikan` untuk memperbaiki bug.
- `docs/nama-dokumentasi` untuk perubahan dokumentasi.
- `refactor/nama-perubahan` untuk merapikan kode.

Contoh:
- `feat/login-page`
- `fix/validasi-form`
- `docs/contributing-guide`

Gunakan nama branch yang singkat, jelas, dan menggunakan huruf kecil.

## 3. Aturan Penulisan Commit
Setiap perubahan harus memiliki pesan commit yang menjelaskan tujuan perubahan.

Gunakan format:
`<type>: <deskripsi perubahan>`

Jenis commit yang digunakan:
- `feat`: menambahkan fitur.
- `fix`: memperbaiki bug.
- `docs`: menambahkan atau memperbarui dokumentasi.
- `refactor`: merapikan kode tanpa mengubah fungsi utama.
- `chore`: perubahan konfigurasi atau pemeliharaan proyek.

Contoh:
- `feat: add login page`
- `fix: correct form validation`
- `docs: add contributing guide`

Hindari pesan commit yang terlalu umum, seperti `update`, `perbaikan`, atau `coba`.

## 4. Alur Kerja Git
Setiap anggota tim mengikuti langkah berikut:

1. Ambil perubahan terbaru dari branch utama.
2. Buat branch baru sesuai tugas yang dikerjakan.
3. Kerjakan perubahan pada branch tersebut.
4. Periksa perubahan sebelum melakukan commit.
5. Simpan perubahan menggunakan commit dengan pesan yang jelas.
6. Push branch ke GitHub.
7. Buat Pull Request (PR) menuju branch `main`.
8. Minta anggota tim melakukan review terhadap perubahan.
9. Perbaiki jika ada masukan dari reviewer.
10. Setelah disetujui dan pemeriksaan selesai, gabungkan perubahan melalui Pull Request.

Contoh perintah Git:

```bash
git switch main
git pull origin main
git switch -c docs/contributing-guide
git add CONTRIBUTING.md
git commit -m "docs: add contributing guide"
git push -u origin docs/contributing-guide
```

## 5. Aturan Pull Request (PR)
Setiap Pull Request harus memenuhi ketentuan berikut:

- Menggunakan judul yang jelas dan sesuai perubahan.
- Menjelaskan tujuan dan ringkasan perubahan.
- Mencantumkan fitur atau file yang diubah.
- Menyertakan screenshot jika perubahan berkaitan dengan tampilan antarmuka.
- Memastikan tidak ada perubahan yang tidak berkaitan dengan tugas.
- Meminta review dari anggota tim sebelum digabungkan.
- Menyelesaikan konflik jika terjadi sebelum proses penggabungan.

Contoh judul PR:
`docs: add contributing guide`

## 6. Aturan Kolaborasi Tim
- Setiap anggota bertanggung jawab atas tugasnya masing-masing.
- Selalu periksa branch aktif sebelum mengubah file.
- Jangan memasukkan password, API key, atau informasi rahasia ke repository.
- Jangan mengubah atau menghapus kode anggota lain tanpa koordinasi.
- Lakukan komunikasi jika terjadi konflik atau kendala.
- Pastikan perubahan sudah diperiksa sebelum diajukan melalui Pull Request.

## 7. Penutup
Dengan mengikuti panduan ini, diharapkan seluruh anggota tim dapat berkolaborasi secara terstruktur, mengurangi konflik kode, dan menjaga kualitas pengembangan aplikasi BioNusantara-appV2.
