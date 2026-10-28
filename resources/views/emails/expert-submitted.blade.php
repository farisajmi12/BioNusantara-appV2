<x-mail::message>
# Halo, {{ $application->full_name }}

Terima kasih telah mengajukan diri sebagai pakar di {{ config('app.name') }}.

Pengajuan Anda dari **{{ $application->institution }}** sudah kami terima dan sedang ditinjau oleh admin. Mohon bersabar, proses ini membutuhkan waktu. Hasilnya akan kami kirim ke email ini, baik disetujui maupun ditolak.

Catatan: kami juga mengirim email terpisah berjudul **Verify Email Address** untuk memverifikasi akun Anda. Silakan klik tautan di email itu agar Anda bisa masuk ke dashboard. Verifikasi email akun tidak mempengaruhi hasil peninjauan pakar.

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>