import { FlipbookModule } from '../types/flipbook';

export const PRESET_MODULES: FlipbookModule[] = [
  {
    id: 'siklus-air-lembah-hujan',
    metadata: {
      topic: 'Siklus Air & Presipitasi (IPA)',
      gradeLevel: 'SD Kelas 4-6 (Fase B/C)',
      learningModel: 'Discovery Learning (Penyingkapan Terbimbing)',
      theme: 'Detektif Lembah Rimba Tropis',
      summaryContent: 'Siklus air alami: Evaporasi (penguapan air danau/laut), Transpirasi (penguapan dari tumbuhan), Kondensasi (pendinginan uap menjadi awan), Presipitasi (hujan turun ke bumi), Infiltrasi (penyerapan air ke dalam tanah melalui akar pohon).',
      createdAt: '2026-10-17',
    },
    concept: {
      adventureTitle: 'Misteri Hilangnya Air di Lembah Kabut: Ekspedisi Detektif Kancil',
      worldTheme: 'Detektif Lembah Alam Rimba Tropis',
      guideCharacter: {
        name: 'Detektif Miko',
        speciesOrRole: 'Kancil Cilik Penyelidik Alam berompi cokelat dengan kaca pembesar ajaib',
        description: 'Detektif cerdas dan penuh semangat yang selalu membawa buku catatan rahasia dan kaca pembesar pembaca molekul air.',
        catchphrase: 'Pasang kacamata penyelidikmu! Setiap tetes air punya rahasia besar untuk dipecahkan!',
      },
      paletteColors: ['#fbcfe8', '#a5f3fc', '#0284c7', '#0f172a'],
      missionMap: [
        {
          stepNumber: 1,
          postName: 'Pos 1: Danau Cermin & Jejak Panas Mentari',
          syntaxStage: 'Stimulation (Pemberian Rangsangan)',
          briefObjective: 'Menemukan misteri lenyapnya air danau saat terik matahari siang.',
          badgeName: 'Lencana Detektif Pemula',
        },
        {
          stepNumber: 2,
          postName: 'Pos 2: Gua Uap Tak Kasat Mata',
          syntaxStage: 'Problem Statement (Identifikasi Masalah)',
          briefObjective: 'Membuktikan uap air yang naik ke angkasa (Evaporasi & Transpirasi).',
          badgeName: 'Kompas Uap Rahasia',
        },
        {
          stepNumber: 3,
          postName: 'Pos 3: Puncak Awan Gumpalan Kapas',
          syntaxStage: 'Data Collection (Pengumpulan Data)',
          briefObjective: 'Mengamati titik-titik air mendingin dan berkumpul menjadi awan (Kondensasi).',
          badgeName: 'Penjaga Awan Mendung',
        },
        {
          stepNumber: 4,
          postName: 'Pos 4: Menara Badai & Hujan Berkah',
          syntaxStage: 'Data Processing & Verification (Pengolahan & Pembuktian)',
          briefObjective: 'Menganalisis kenapa awan tak sanggup menahan air hingga turun hujan (Presipitasi).',
          badgeName: 'Pahlawan Tetes Hujan',
        },
        {
          stepNumber: 5,
          postName: 'Pos 5: Labirin Akar Hutan & Mata Air Abadi',
          syntaxStage: 'Generalization (Menarik Kesimpulan)',
          briefObjective: 'Menyelidiki peresapan air ke tanah dan mata air abadi (Infiltrasi).',
          badgeName: 'Medali Pelindung Siklus Bumi',
        },
      ],
    },
    pages: [
      {
        pageNumber: 1,
        title: '[HALAMAN 1: KASUS GANJIL DI DANAU CERMIN]',
        syntaxPhase: 'Stimulation (Pemberian Rangsangan)',
        storyAndContent:
          'Halo Detektif Cilik! Namaku Detektif Miko. Pagi ini, warga Lembah Kabut gempar! Danau Cermin yang biasanya melimpah dengan air segar tiba-tiba surut drastis setelah tiga hari berturut-turut terpapar terik matahari yang menyengat. Ke mana perginya ribuan ember air danau itu? Apakah ada monster yang meminumnya diam-diam, ataukah air itu menyelinap terbang ke langit tanpa kita sadari? Kita harus melacak jejaknya sebelum semua tanaman layu!',
        imagePrompt:
          'Flat vector 2D illustration of a cute smart mousedeer detective wearing a brown vest holding a glowing magnifying glass beside an evaporating tropical lake, pastel colors with soft pink and soft cyan accents, clean background, minimal aesthetic, crisp linework, A4 portrait format (210 x 297 mm), aspect ratio --ar 1:1.41, 300 DPI high-resolution print ready, --no text',
        videoPrompt:
          'Gentle looping animation of the cute mousedeer detective smiling warmly, slowly tilting the magnifying glass to examine the lake ground, while soft subtle mist rises in the background, smooth seamless loop, Runway Kling AI motion.',
        canvaLayoutAndInteractivity:
          'Kanvas A4 Portrait. Bagian atas: Judul besar dengan tipografi Fredoka. Bagian tengah: Bingkai video vertikal atau ilustrasi karakter Detektif Miko. Bagian bawah: Kotak teks materi narasi dalam shape kartu pastel rounded. Di pojok kanan bawah: Tombol interaktif Canva bertaut "Mulai Misi Penyelidikan 🔍" menuju Halaman 2.',
        interactiveTask:
          'Tugas Detektif: Ketuk atau lingkari 3 benda di sekitarmu yang bisa membuat air berubah wujud menjadi tidak terlihat! Tuliskan tebakan sementaramu di buku catatan: menurutmu, apakah air bisa lenyap selamanya atau hanya berpindah tempat?',
        interactiveClue: 'Petunjuk Kaca Pembesar: Perhatikan saat ibumu merebus air panas di panci. Ke mana perginya asap putih tipis itu?',
      },
      {
        pageNumber: 2,
        title: '[HALAMAN 2: RAHASIA PARTIKEL TERBANG - EVAPORASI & TRANSPIRASI]',
        syntaxPhase: 'Problem Statement (Identifikasi Masalah)',
        storyAndContent:
          '"Aha! Lihat lewat kaca pembesar molekulku!" seru Detektif Miko. Ternyata panas matahari adalah agen pengubah alami. Air di permukaan danau menyerap energi panas mentari dan berubah menjadi uap air—gas ringan tak terlihat yang melayang ke angkasa. Proses ini disebut EVAPORASI. Bukan hanya danau, pohon-pohon di hutan kita juga berkeringat mengeluarkan uap air lewat stomata daunnya, yang disebut TRANSPIRASI! Mereka semua terbang beriringan menuju lantai atas langit!',
        imagePrompt:
          'Flat vector 2D educational infographic illustration of water evaporating from a serene lake into tiny cute water droplet sprites floating upward, plus a green tree leaf transpiring microscopic vapors, pastel pink and soft cyan color palette, clean isolated background, crisp vector lines, A4 portrait format (210 x 297 mm), aspect ratio --ar 1:1.41, 300 DPI high-resolution print ready, --no text',
        videoPrompt:
          'Subtle looping animation of tiny glowing water droplet sprites gently floating upward towards the sky from the lake and tree leaves, smooth continuous upward drift, calming educational motion loop.',
        canvaLayoutAndInteractivity:
          'Kanvas A4 Portrait. Tata letak split 2 kolom di tengah: Kartu Kiri "Evaporasi Danau" dan Kartu Kanan "Transpirasi Daun". Frame video kecil disematkan pada ilustrasi partikel uap. Di bagian bawah disematkan tombol pop-up Canva "Buka Fakta Sains 💡" yang menampilkan perbandingan 90% uap laut vs 10% uap pohon.',
        interactiveTask:
          'Aktivitas Penyelidikan: Jika hari sangat mendung dan dingin tanpa sinar matahari, apakah air danau akan menguap lebih cepat atau lebih lambat? Jelaskan alasan logismu!',
        interactiveClue: 'Fakta Sains: 90% uap air di atmosfer berasal dari laut dan danau, sedangkan 10% sisanya disumbang oleh tumbuhan!',
      },
      {
        pageNumber: 3,
        title: '[HALAMAN 3: PESTA DINGIN DI PUNCAK AWAN - KONDENSASI]',
        syntaxPhase: 'Data Collection (Pengumpulan Data)',
        storyAndContent:
          'Kita naik menggunakan balon udara Detektif Miko! Semakin tinggi kita terbang ke atmosfer bumi, udaranya ternyata semakin menusuk dingin, brrr! Uap-uap air yang tadi hangat kini mulai menggigil dan merapatkan diri. Karena dingin, uap air berwujud gas kembali berubah wujud menjadi butiran-butiran air mikroskopis yang sangat halus. Butiran-butiran ini menempel pada debu atmosfer dan berkumpul menjadi AWAN! Perubahan dari uap gas menjadi tetesan air dingin ini disebut KONDENSASI.',
        imagePrompt:
          'Flat vector 2D illustration of cute water vapor particles hugging each other to form fluffy pastel white clouds in a soft pastel cyan sky, small thermometer showing low temperature, clean aesthetic, friendly character style, A4 portrait format (210 x 297 mm), aspect ratio --ar 1:1.41, 300 DPI high-resolution print ready, --no text',
        videoPrompt:
          'Gentle looping animation of fluffy pastel clouds slowly drifting horizontally while tiny cute droplet characters smile and assemble into the cloud body, smooth seamless ambient loop.',
        canvaLayoutAndInteractivity:
          'Kanvas A4 Portrait. Bagian atas dihiasi ilustrasi awan kapas dan balon udara. Teks materi ditempatkan di dalam kotak teks berwarna soft pastel blue berbayang lembut. Di bagian tengah bawah: Tombol audio interaktif "Dengarkan Suara Angin Dingin 🎧" dan link menuju panduan eksperimen embun gelas es.',
        interactiveTask:
          'Eksperimen Rumah Instan: Ambil segelas air es dingin. Mengapa dinding luar gelas yang tadinya kering tiba-tiba basah berembun? Apakah airnya bocor menembus kaca, atau uap air di udara luar yang mengalami kondensasi?',
        interactiveClue: 'Petunjuk Miko: Kaca kamar mandi yang berembun saat mandi air hangat juga merupakan contoh nyata kondensasi!',
      },
      {
        pageNumber: 4,
        title: '[HALAMAN 4: GEMERLAP LANGIT KELABU - PRESIPITASI]',
        syntaxPhase: 'Data Processing & Verification (Pengolahan Data)',
        storyAndContent:
          '"Kroook... Duuuaarr!" Awan kelabu di atas kita sudah terlalu gemuk dan kelebihan muatan! Tetes-tetes air di dalam awan saling bertabrakan, menyatu, dan menjadi semakin berat. Ketika udara tidak lagi mampu menopang beban berat mereka, gravitasi bumi menarik mereka meluncur bebas ke bawah! Wuuush! Inilah PRESIPITASI, atau yang kita kenal sehari-hari sebagai HUJAN. Air yang tadinya hilang akhirnya pulang kembali ke bumi!',
        imagePrompt:
          'Flat vector 2D illustration of a cozy gentle rainfall over a lush tropical valley, raindrops falling in sparkling silver pastel drops, cute mousedeer holding a giant leaf as umbrella, pastel pink and turquoise tones, clean background, crisp line art, A4 portrait format (210 x 297 mm), aspect ratio --ar 1:1.41, 300 DPI high-resolution print ready, --no text',
        videoPrompt:
          'Looping animation of rhythmic soft raindrops falling straight down with gentle ripples forming on the ground, mousedeer blinking and smiling happily under the leaf umbrella, natural continuous rain cycle loop.',
        canvaLayoutAndInteractivity:
          'Kanvas A4 Portrait. Frame video mockup hujan berulang di latar belakang atas. Kotak teks narasi diletakkan di bawah dengan latar belakang semi-transparan putih. Tombol interaktif: "Cek Kecepatan Jatuh Hujan ⏱️" yang menampilkan pop-up fakta 32 km/jam.',
        interactiveTask:
          'Tantangan Detektif Cuaca: Susun kembali kartu urutan siklus air sejauh ini (Evaporasi -> Kondensasi -> Presipitasi). Apa yang akan terjadi jika bumi tidak memiliki gravitasi ketika awan sudah terlalu berat?',
        interactiveClue: 'Tahukah Kamu? Satu tetes air hujan bisa jatuh dengan kecepatan hingga 32 km/jam ke tanah!',
      },
      {
        pageNumber: 5,
        title: '[HALAMAN 5: PENYELAM BAWAH TANAH - INFILTRASI]',
        syntaxPhase: 'Verification & Generalization (Pembuktian)',
        storyAndContent:
          'Kemana air hujan mengalir setelah menyentuh tanah? Sebagian mengalir di atas permukaan membentuk parit dan sungai (Run-off), namun pahlawan sejati kita adalah akar pepohonan rimba! Akar pohon membuat tanah gembur sehingga air hujan meresap jauh ke dalam perut bumi. Proses peresapan ini dinamakan INFILTRASI. Air disaring secara alami oleh bebatuan dan pasir, menjadi air tanah yang sangat jernih, lalu mengalir kembali mengisi Danau Cermin kita!',
        imagePrompt:
          'Flat vector 2D cross-section illustration of fertile soil showing tree roots absorbing and filtering rainwater into clean underground streams flowing back to a sunlit lake, pastel green, pink, and soft blue colors, clean graphic design, A4 portrait format (210 x 297 mm), aspect ratio --ar 1:1.41, 300 DPI high-resolution print ready, --no text',
        videoPrompt:
          'Subtle looping animation showing water droplets soaking through soil layers past tree roots into an underground glowing blue stream, smooth steady downward filtration flow loop.',
        canvaLayoutAndInteractivity:
          'Kanvas A4 Portrait. Diagram penampang tanah melintang di tengah halaman. Tombol interaktif "Buka Simulasi Akar Pohon 🌳" yang dapat diklik siswa untuk melihat dampak hutan gundul vs hutan lebat.',
        interactiveTask:
          'Misi Pelindung Hutan: Apa yang terjadi pada Lembah Kabut jika seluruh pohon ditebang liar saat musim hujan tiba? Tuliskan 2 dampak buruk bagi siklus air dan penduduk desa!',
        interactiveClue: 'Hutan bertindak seperti spons raksasa yang menyerap dan menyimpan air untuk musim kemarau!',
      },
      {
        pageNumber: 6,
        title: '[HALAMAN 6: KESIMPULAN AKHIR - SIKLUS ABADI BUMI]',
        syntaxPhase: 'Generalization (Menarik Kesimpulan)',
        storyAndContent:
          'Selamat, Rekan Detektif! Kasus telah TERPECAHKAN! Danau Cermin tidak pernah kehilangan airnya untuk selamanya. Air di planet bumi kita tidak pernah bertambah dan tidak pernah berkurang—jumlahnya tetap sama sejak zaman dinosaurus miliaran tahun lalu! Air hanya terus berputar dalam siklus abadi: menguap oleh mentari, berkumpul di puncak awan dingin, meluncur turun sebagai hujan berkah, dan meresap ke tanah untuk kembali lagi. Kamu resmi menjadi Penjaga Siklus Air Bumi!',
        imagePrompt:
          'Flat vector 2D circular infographic diagram of the complete water cycle compass with arrows connecting evaporation, condensation, precipitation, and infiltration, golden detective badge at the center, pastel pink and soft cyan colors, clean background, crisp line art, A4 portrait format (210 x 297 mm), aspect ratio --ar 1:1.41, 300 DPI high-resolution print ready, --no text',
        videoPrompt:
          'Looping animation of the golden circular water cycle arrows gently pulsing with light in a clockwise rotation, celebrating stars twinkling around the detective badge, smooth infinite loop.',
        canvaLayoutAndInteractivity:
          'Kanvas A4 Portrait. Diagram lingkaran siklus air di bagian tengah atas. Teks kesimpulan di dalam banner penghargaan. Di bagian bawah terdapat tombol mencolok beranimasi: "UJI KEMAMPUAN: MASUK KE KUIS EVALUASI 🏆" yang langsung menghubungkan ke kuis interaktif Heyzine.',
        interactiveTask:
          'Ikrar Penjaga Air: Tuliskan satu tindakan nyata hemat air yang akan kamu lakukan hari ini di rumah atau sekolah agar air bersih selalu terjaga!',
        interactiveClue: 'Air yang kamu minum hari ini mungkin pernah diminum oleh seekor Tyrannosaurus Rex jutaan tahun yang lalu!',
      },
    ],
    quiz: [
      {
        questionNumber: 1,
        question:
          'Saat Detektif Miko menyelidiki Danau Cermin yang surut di siang hari yang terik, ke manakah partikel air berpindah dan apa nama proses perubahannya?',
        options: [
          { label: 'A', text: 'Air diserap oleh bebatuan menjadi batu karang (Pembekuan)' },
          { label: 'B', text: 'Air menyerap panas mentari lalu berubah menjadi uap air ke udara (Evaporasi)' },
          { label: 'C', text: 'Air berubah menjadi butiran salju berat di dasar danau (Deposisi)' },
          { label: 'D', text: 'Air langsung meluncur ke inti bumi karena tertarik gravitasi (Kondensasi)' },
        ],
        correctAnswer: 'B',
        feedback:
          'Tepat sekali! Evaporasi adalah proses penguapan air dari permukaan cair menjadi gas/uap air akibat panas energi matahari.',
      },
      {
        questionNumber: 2,
        question:
          'Ketika Detektif Miko terbang tinggi ke atmosfer yang dingin, uap air mulai menggigil dan saling berpelukan membentuk awan. Proses fisis apakah ini?',
        options: [
          { label: 'A', text: 'Transpirasi' },
          { label: 'B', text: 'Infiltrasi' },
          { label: 'C', text: 'Kondensasi (Pengembunan)' },
          { label: 'D', text: 'Evaporasi' },
        ],
        correctAnswer: 'C',
        feedback:
          'Luar biasa! Kondensasi terjadi ketika uap air mendingin di atmosfer sehingga berubah wujud kembali menjadi titik-titik air halus pembentuk awan.',
      },
      {
        questionNumber: 3,
        question:
          'Mengapa awan mendung kelabu akhirnya melepaskan air hujan (Presipitasi) turun ke tanah lembah?',
        options: [
          { label: 'A', text: 'Karena butiran air di awan semakin padat, berat, dan gravitasi menariknya jatuh' },
          { label: 'B', text: 'Karena angin meniup awan hingga meledak berkeping-keping' },
          { label: 'C', text: 'Karena matahari membakar awan hingga meleleh menjadi minyak' },
          { label: 'D', text: 'Karena pepohonan menyedot awan secara langsung dengan daunnya' },
        ],
        correctAnswer: 'A',
        feedback:
          'Benar! Presipitasi terjadi ketika titik-titik air di awan sudah terlalu banyak dan berat sehingga udara tak mampu lagi menahannya, lalu jatuh ditarik gravitasi.',
      },
      {
        questionNumber: 4,
        question:
          'Jika hutan di sekitar Lembah Kabut ditebangi secara liar hingga gundul, tahap siklus air manakah yang paling terganggu sehingga danau mudah kekeringan dan banjir?',
        options: [
          { label: 'A', text: 'Infiltrasi (penyerapan air ke dalam tanah) dan Transpirasi pohon' },
          { label: 'B', text: 'Evaporasi air laut' },
          { label: 'C', text: 'Pembentukan gravitasi bumi' },
          { label: 'D', text: 'Rotasi bumi mengelilingi matahari' },
        ],
        correctAnswer: 'A',
        feedback:
          'Hebat! Tanpa akar pohon yang mengikat tanah, air hujan akan langsung meluap menjadi banjir bandang tanpa sempat meresap (Infiltrasi) menjadi cadangan air tanah.',
      },
    ],
  },
];
