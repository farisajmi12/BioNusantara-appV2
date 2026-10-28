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
            // Menambahkan kolom category setelah species_id
            $table->string('category')->nullable()->after('species_id');
            
            // Menambahkan kolom hasil prediksi AI setelah category
            $table->string('species_name_ai')->nullable()->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            // Menghapus kolom jika migration di-rollback
            $table->dropColumn(['category', 'species_name_ai']);
        });
    }
};