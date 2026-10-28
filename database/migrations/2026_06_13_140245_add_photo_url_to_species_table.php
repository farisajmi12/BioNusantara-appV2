<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('species', function (Blueprint $table) {
            // Menambahkan kolom photo_url setelah kolom description. 
            // nullable() artinya boleh kosong jika belum ada fotonya.
            $table->string('photo_url')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('species', function (Blueprint $table) {
            // Menghapus kolom jika di-rollback
            $table->dropColumn('photo_url');
        });
    }
};