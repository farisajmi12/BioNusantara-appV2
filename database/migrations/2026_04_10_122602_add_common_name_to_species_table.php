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
    Schema::table('species', function (Blueprint $table) {
        // Tambahkan kolom common_name setelah scientific_name
        $table->string('common_name')->nullable()->after('scientific_name');
    });
}

public function down(): void
{
    Schema::table('species', function (Blueprint $table) {
        $table->dropColumn('common_name');
    });
}};