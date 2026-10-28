<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations. (Fungsi untuk MEMBUAT tabel)
     */
    public function up(): void
    {
        Schema::create('observation_photos', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel observations
            $table->foreignId('observation_id')->constrained()->onDelete('cascade');
            $table->string('file_path');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations. (Fungsi untuk MENGHAPUS tabel)
     */
    public function down(): void
    {
        Schema::dropIfExists('observation_photos');
    }
};
