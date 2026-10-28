<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpeciesSeeder extends Seeder
{
    public function run(): void
    {
        $species = [
            // =====================
            // KATEGORI: REPTIL
            // =====================
            [
                'scientific_name' => 'Varanus komodoensis',
                'common_name' => 'Komodo',
                'category' => 'reptil',
                'description' => 'Kadal terbesar di dunia yang merupakan hewan endemik asli Pulau Komodo, Rinca, Flores, dan Gili Motang.',
                'photo_url' => '/images/reptil/komodo.jpg'
            ],
            [
                'scientific_name' => 'Chelodina mccordi',
                'common_name' => 'Kura-kura Leher Ular Rote',
                'category' => 'reptil',
                'description' => 'Kura-kura endemik dari Pulau Rote yang memiliki leher panjang menyerupai ular untuk berburu mangsa di air.',
                'photo_url' => '/images/reptil/kura_leher_ular.jpg'
            ],
            [
                'scientific_name' => 'Varanus prasinus',
                'common_name' => 'Biawak Hijau Papua',
                'category' => 'reptil',
                'description' => 'Biawak arboreal berwarna hijau zamrud yang sangat beradaptasi dengan kehidupan di tajuk pohon hutan hujan Papua.',
                'photo_url' => '/images/reptil/biawak_hijau.jpg'
            ],
            [
                'scientific_name' => 'Varanus macraei',
                'common_name' => 'Biawak Biru Batanta',
                'category' => 'reptil',
                'description' => 'Biawak endemik dari Pulau Batanta, Raja Ampat, dengan corak warna biru kehitaman yang mencolok.',
                'photo_url' => '/images/reptil/biawak_biru.jpg'
            ],
            [
                'scientific_name' => 'Hydrosaurus amboinensis',
                'common_name' => 'Soa-soa Layar Ambon',
                'category' => 'reptil',
                'description' => 'Kadal semi-akuatik besar dengan sirip menyerupai layar di bagian ekornya, sering ditemukan di sekitar sungai.',
                'photo_url' => '/images/reptil/soa_soa.jpg'
            ],
            [
                'scientific_name' => 'Morelia viridis',
                'common_name' => 'Sanca Hijau Papua',
                'category' => 'reptil',
                'description' => 'Ular sanca tidak berbisa yang memiliki warna hijau terang saat dewasa dan hidup di pepohonan (arboreal).',
                'photo_url' => '/images/reptil/sanca_hijau.jpg'
            ],

            // =====================
            // KATEGORI: MAMALIA
            // =====================
            [
                'scientific_name' => 'Pongo abelii',
                'common_name' => 'Orangutan Sumatera',
                'category' => 'mamalia',
                'description' => 'Kera besar endemik Pulau Sumatera yang memiliki bulu berwarna cokelat kemerahan cerah dan hidup arboreal di tajuk pohon.',
                'photo_url' => '/images/mamalia/orangutan_sumatera.jpg'
            ],
            [
                'scientific_name' => 'Pongo pygmaeus',
                'common_name' => 'Orangutan Kalimantan',
                'category' => 'mamalia',
                'description' => 'Kera besar endemik Pulau Kalimantan dengan tubuh yang umumnya lebih besar dan wajah lebih bulat dari spesies Sumatera.',
                'photo_url' => '/images/mamalia/orangutan_kalimantan.jpg'
            ],
            [
                'scientific_name' => 'Nasalis larvatus',
                'common_name' => 'Bekantan',
                'category' => 'mamalia',
                'description' => 'Monyet endemik Pulau Kalimantan yang memiliki ciri khas hidung panjang dan besar, sering ditemukan di kawasan hutan bakau.',
                'photo_url' => '/images/mamalia/bekantan.jpg'
            ],
            [
                'scientific_name' => 'Babyrousa babyrussa',
                'common_name' => 'Babirusa',
                'category' => 'mamalia',
                'description' => 'Hewan endemik Sulawesi, Maluku, dan sekitarnya yang memiliki gading melengkung ke belakang menembus moncongnya.',
                'photo_url' => '/images/mamalia/babirusa.jpg'
            ],
            [
                'scientific_name' => 'Bubalus depressicornis',
                'common_name' => 'Anoa Dataran Rendah',
                'category' => 'mamalia',
                'description' => 'Sering disebut kerbau kerdil, mamalia endemik Sulawesi ini hidup di hutan tropis dan memiliki tanduk lurus ke belakang.',
                'photo_url' => '/images/mamalia/anoa.jpg'
            ],
            [
                'scientific_name' => 'Panthera tigris sumatrae',
                'common_name' => 'Harimau Sumatera',
                'category' => 'mamalia',
                'description' => 'Subspesies harimau endemik Pulau Sumatera yang terancam punah, memiliki ciri loreng yang lebih rapat dibanding subspesies lain.',
                'photo_url' => '/images/mamalia/harimau_sumatera.jpg'
            ],
            [
                'scientific_name' => 'Rhinoceros sondaicus',
                'common_name' => 'Badak Jawa',
                'category' => 'mamalia',
                'description' => 'Badak bercula satu yang sangat langka dan kini hanya dapat ditemukan secara alami di Taman Nasional Ujung Kulon, Banten.',
                'photo_url' => '/images/mamalia/badak_jawa.jpg'
            ],
            [
                'scientific_name' => 'Dicerorhinus sumatrensis',
                'common_name' => 'Badak Sumatera',
                'category' => 'mamalia',
                'description' => 'Satu-satunya badak Asia yang memiliki dua cula dan tubuh berambut, menjadikannya spesies badak terkecil di dunia.',
                'photo_url' => '/images/mamalia/badak_sumatera.jpg'
            ],
            [
                'scientific_name' => 'Tarsius tarsier',
                'common_name' => 'Tarsius',
                'category' => 'mamalia',
                'description' => 'Primata nokturnal kecil endemik Sulawesi dengan mata bulat besar yang adaptif untuk melihat dalam kondisi gelap.',
                'photo_url' => '/images/mamalia/tarsius.jpg'
            ],
            [
                'scientific_name' => 'Macaca nigra',
                'common_name' => 'Monyet Hitam Sulawesi (Yaki)',
                'category' => 'mamalia',
                'description' => 'Monyet endemik Sulawesi Utara dengan tubuh dominan hitam, jambul di kepala, dan bagian pantat berwarna merah muda cerah.',
                'photo_url' => '/images/mamalia/yaki.jpg'
            ],
            [
                'scientific_name' => 'Tragulus javanicus',
                'common_name' => 'Pelanduk Jawa (Kancil)',
                'category' => 'mamalia',
                'description' => 'Salah satu ungulata terkecil di dunia yang banyak ditemukan di hutan dataran rendah Jawa.',
                'photo_url' => '/images/mamalia/kancil.jpg'
            ],
            [
                'scientific_name' => 'Spilocuscus maculatus',
                'common_name' => 'Kuskus Totol',
                'category' => 'mamalia',
                'description' => 'Marsupialia endemik Papua dan sekitarnya yang memiliki pola totol putih dan cokelat pada rambutnya.',
                'photo_url' => '/images/mamalia/kuskus_totol.jpg'
            ],

            // =====================
            // KATEGORI: BURUNG
            // =====================
            [
                'scientific_name' => 'Leucopsar rothschildi',
                'common_name' => 'Jalak Bali',
                'category' => 'burung',
                'description' => 'Burung pengicau berukuran sedang, endemik Pulau Bali dengan bulu putih bersih dan corak kulit biru khas di sekitar mata.',
                'photo_url' => '/images/burung/jalak_bali.jpg'
            ],
            [
                'scientific_name' => 'Paradisaea apoda',
                'common_name' => 'Cenderawasih Kuning Besar',
                'category' => 'burung',
                'description' => 'Burung endemik dari tanah Papua yang dijuluki "Bird of Paradise", memiliki bulu hiasan berwarna kuning dan cokelat yang memukau.',
                'photo_url' => '/images/burung/cenderawasih.jpg'
            ],
            [
                'scientific_name' => 'Cicinnurus respublica',
                'common_name' => 'Cendrawasih Botak (Wilson)',
                'category' => 'burung',
                'description' => 'Burung endemik dari Kepulauan Waigeo dan Batanta dengan pola mahkota biru cerah tanpa bulu di kepalanya.',
                'photo_url' => '/images/burung/cendrawasih_botak.jpg'
            ],
            [
                'scientific_name' => 'Macrocephalon maleo',
                'common_name' => 'Maleo',
                'category' => 'burung',
                'description' => 'Burung endemik Sulawesi yang terkenal karena tidak mengerami telurnya, melainkan menguburnya di dalam pasir atau tanah panas bumi.',
                'photo_url' => '/images/burung/maleo.jpg'
            ],
            [
                'scientific_name' => 'Nisaetus bartelsi',
                'common_name' => 'Elang Jawa',
                'category' => 'burung',
                'description' => 'Burung pemangsa endemik Jawa yang identik dengan lambang negara Garuda, memiliki jambul hitam yang khas di kepalanya.',
                'photo_url' => '/images/burung/elang_jawa.jpg'
            ],
            [
                'scientific_name' => 'Cacatua sulphurea',
                'common_name' => 'Kakatua Jambul Kuning',
                'category' => 'burung',
                'description' => 'Burung paruh bengkok berwarna putih dengan jambul berwarna kuning mencolok yang sangat terancam kepunahan.',
                'photo_url' => '/images/burung/kakatua_jambul_kuning.jpg'
            ],
            [
                'scientific_name' => 'Rhyticeros cassidix',
                'common_name' => 'Rangkong Sulawesi',
                'category' => 'burung',
                'description' => 'Burung enggang berukuran besar endemik Sulawesi dengan cula tanduk (casque) berwarna merah pada jantan.',
                'photo_url' => '/images/burung/rangkong_sulawesi.jpg'
            ],

            // =====================
            // KATEGORI: AMFIBI
            // =====================
            [
                'scientific_name' => 'Leptophryne cruentata',
                'common_name' => 'Kodok Merah Jawa',
                'category' => 'amfibi',
                'description' => 'Kodok endemik Jawa Barat yang sangat langka, ditandai dengan bercak-bercak berwarna merah darah di tubuhnya.',
                'photo_url' => '/images/amfibi/kodok_merah.jpg'
            ],
            [
                'scientific_name' => 'Megophrys montana',
                'common_name' => 'Katak Bertanduk Jawa',
                'category' => 'amfibi',
                'description' => 'Katak berukuran sedang yang memiliki tonjolan kulit menyerupai tanduk di atas matanya, pandai berkamuflase di serasah daun.',
                'photo_url' => '/images/amfibi/katak_bertanduk.jpg'
            ],
            [
                'scientific_name' => 'Rhacophorus margaritifer',
                'common_name' => 'Katak Pohon Mutiara (Jawa)',
                'category' => 'amfibi',
                'description' => 'Katak pohon endemik Jawa yang memiliki adaptasi khusus untuk hidup di vegetasi dekat sumber air.',
                'photo_url' => '/images/amfibi/katak_mutiara.jpg'
            ],
            [
                'scientific_name' => 'Barbourula kalimantanensis',
                'common_name' => 'Katak Kepala Pipih Kalimantan',
                'category' => 'amfibi',
                'description' => 'Satu-satunya spesies katak di dunia yang diketahui tidak memiliki paru-paru dan sepenuhnya bernapas melalui kulitnya.',
                'photo_url' => '/images/amfibi/katak_kepala_pipih.jpg'
            ],
            [
                'scientific_name' => 'Litoria infrafrenata',
                'common_name' => 'Katak Pohon Bibir Putih',
                'category' => 'amfibi',
                'description' => 'Katak pohon besar dari wilayah timur Indonesia yang sangat mudah dikenali dari garis putih mencolok pada rahang bawahnya.',
                'photo_url' => '/images/amfibi/katak_bibir_putih.jpg'
            ]
        ];

        // Matikan pengecekan Foreign Key untuk mencegah error saat truncate (apabila tabel berelasi)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Kosongkan tabel dari data sebelumnya
        DB::table('species')->truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Injeksi data massal menggunakan Loop
        foreach ($species as $item) {
            DB::table('species')->insert(
                array_merge($item, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        // Tampilkan pesan sukses di Terminal
        $this->command->info("✅ Selesai! Total: " . count($species) . " hewan endemik berhasil dimasukkan ke Database beserta deskripsinya.");
    }
}