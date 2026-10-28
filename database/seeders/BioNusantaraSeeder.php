<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Species;
use App\Models\User;
use Illuminate\Database\Seeder; 
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BioNusantaraSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Matikan Foreign Key Check agar tidak error saat mengulang seeder
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('roles')->truncate();
        DB::table('users')->truncate();
        DB::table('species')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. SEEDER ROLES (1: Admin, 2: Expert, 3: User)
        $roles = [
            ['id' => 1, 'name' => 'admin', 'display_name' => 'Administrator'],
            ['id' => 2, 'name' => 'expert', 'display_name' => 'Pakar Biodiversitas'],
            ['id' => 3, 'name' => 'user', 'display_name' => 'Citizen Scientist'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }

        // 3. SEEDER USERS
        // Admin
        User::create([
            'name' => 'Admin BioNusantara',
            'email' => 'adminbionusantara@gmail.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => Carbon::now(),
            'role_id' => 1,
        ]);

        // Expert (Pakar)
        User::create([
            'name' => 'Dr. Faris Pakar',
            'email' => 'expert@bionusantara.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => Carbon::now(),
            'role_id' => 2,
        ]);

        // Citizen Scientist (User Umum)
        User::create([
            'name' => 'Muhammad Faris Ajmi',
            'email' => 'faris@user.com',
            'password' => Hash::make('password123'),
            'role_id' => 3,
        ]);

        // 4. SEEDER SPECIES (Disesuaikan dengan Notebook .ipynb kamu)

        // --- Kategori Plankton (26 Spesies sesuai ModelPlankton.ipynb) ---
        $planktons = [
            'Achnanthes sp', 'Bacteriastrum delicatulum', 'Bleakeleya notata', 'Chaetoceros affinis',
            'Chaetoceros diversus', 'Chaetoceros peruvianus', 'Coscinodiscus oculus-iridis', 'Diatom',
            'Guinardia flaccida', 'Hemiaulus hauckii', 'Hemiaulus membranaceus', 'Mastogloia sp',
            'Nitzschia', 'Nitzschia longissima', 'Plagiotropis lepidoptera', 'Pleurosigma',
            'Proboscia alata', 'Proboscia indica', 'Pseudo-nitzschia spp', 'Pseudosolenia calcar-avis',
            'Rhizosolenia calcar-avis', 'Rhizosolenia cochlea', 'Rhizosolenia imbricata',
            'Tetramphora (Amphora) decussata', 'Thalassionema nitzschioides', 'Toxarium undulatum',
        ];

        foreach ($planktons as $name) {
            Species::create([
                'scientific_name' => $name,
                'category' => 'Plankton',
                'description' => 'Spesies plankton teridentifikasi melalui dataset penelitian BioNusantara.',
            ]);
        }

        // --- Kategori Hoya (Sesuai ModelHoya.ipynb) ---
        $hoyas = ['Australis', 'Cinnamomifolia', 'Kerrii', 'Latifolia'];
        foreach ($hoyas as $hoya) {
            Species::create([
                'scientific_name' => 'Hoya '.$hoya,
                'category' => 'Hoya',
                'description' => 'Tanaman hias genus Hoya dari dataset Model Hoya.',
            ]);
        }

        // --- Kategori Kayu (Sesuai ModelKayu_MobileNetV3.pth) ---
        // Menambahkan kategori kayu secara umum sebagai master data
        Species::create([
            'scientific_name' => 'Wood Identification Master',
            'category' => 'Kayu',
            'description' => 'Master data untuk identifikasi jenis kayu.',
        ]);
    }
}
