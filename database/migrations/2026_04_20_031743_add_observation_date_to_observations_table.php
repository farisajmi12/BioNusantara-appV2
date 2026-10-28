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
            // Menambahkan kolom observation_date bertipe DATETIME dan boleh kosong (nullable)
            $table->dateTime('observation_date')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            // Menghapus kolom jika di-rollback
            $table->dropColumn('observation_date');
        });
    }
};