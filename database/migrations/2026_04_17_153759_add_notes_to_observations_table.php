<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            // Menambahkan kolom notes bertipe TEXT dan boleh kosong (nullable)
            // Diposisikan setelah kolom 'status' agar rapi
            $table->text('notes')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            // Menghapus kolom notes jika migration di-rollback (dibatalkan)
            $table->dropColumn('notes');
        });
    }
};