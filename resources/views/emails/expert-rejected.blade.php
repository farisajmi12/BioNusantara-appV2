<x-mail::message>
# Halo, {{ $application->full_name }}

Mohon maaf, pengajuan Anda sebagai pakar **belum dapat disetujui**.

**Alasan:** {{ $application->rejection_reason }}

Anda dapat mengajukan kembali dengan data atau kredensial yang diperbarui.

<x-mail::button :url="url('/ajukan-pakar')">
Ajukan Kembali
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>