<?php

namespace App\Mail;

use App\Models\ExpertApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExpertApplicationSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ExpertApplication $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Pengajuan Pakar Anda Telah Kami Terima');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.expert-submitted');
    }
}