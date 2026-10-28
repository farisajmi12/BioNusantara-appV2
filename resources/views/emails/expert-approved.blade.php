<x-mail::message>
# Selamat, {{ $application->full_name }}!

Pengajuan Anda sebagai pakar biodiversitas telah **disetujui**. Anda sekarang dapat mengakses fitur validasi pakar.

Jika menu pakar belum muncul, silakan keluar lalu masuk kembali.

<x-mail::button :url="url('/dashboard')">
Buka Dashboard
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>