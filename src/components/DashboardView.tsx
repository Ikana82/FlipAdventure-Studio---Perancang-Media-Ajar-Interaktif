import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  LayoutGrid,
  Image as ImageIcon,
  Film,
  Video,
  CheckCircle2,
  Presentation,
  Compass,
  Star,
  Check,
  Search,
  Lightbulb,
  UploadCloud,
  FileUp,
} from 'lucide-react';
import { GeneratorType, PresetProject } from '../types/edusmart';
import { GENERATORS, PRESET_PROJECTS } from '../data/generators';

interface DashboardViewProps {
  onStartGenerator: (type: GeneratorType) => void;
  onLoadPreset: (preset: PresetProject) => void;
  onOpenUploadModal: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6 text-purple-600" />,
  LayoutGrid: <LayoutGrid className="w-6 h-6 text-indigo-600" />,
  Image: <ImageIcon className="w-6 h-6 text-violet-600" />,
  Film: <Film className="w-6 h-6 text-fuchsia-600" />,
  Video: <Video className="w-6 h-6 text-purple-600" />,
  Sparkles: <Sparkles className="w-6 h-6 text-amber-500" />,
  CheckCircle2: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
  Presentation: <Presentation className="w-6 h-6 text-cyan-600" />,
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartGenerator,
  onLoadPreset,
  onOpenUploadModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGenerators = GENERATORS.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12">
      {/* Hero SaaS Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 text-white p-7 sm:p-10 shadow-xl shadow-purple-900/10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold tracking-wide uppercase text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Educational Media Studio</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
            EduSmart Learning Creator AI
          </h1>

          <p className="text-sm sm:text-base text-purple-100 leading-relaxed max-w-2xl font-normal">
            Buat media pembelajaran anak yang kreatif, interaktif, dan edukatif dengan bantuan AI. Siapkan konsep pembelajaran, storyboard visual, prompt ilustrasi & animasi, naskah video, komik berkarakter, serta kuis penilaian dalam hitungan detik.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4 text-slate-900" />
              <span>Upload File Materi</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900">
                Otomatis
              </span>
            </button>
            <button
              onClick={() => onStartGenerator('video')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-purple-800 font-bold text-xs sm:text-sm shadow-md hover:bg-purple-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Video className="w-4 h-4 text-purple-700" />
              <span>Buat Video Pembelajaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStartGenerator('comic')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-900/50 hover:bg-purple-900/80 border border-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Komik Edukasi</span>
            </button>
          </div>
        </div>

        {/* Ambient shapes */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 text-8xl opacity-15 pointer-events-none select-none">
          🎨
        </div>
      </div>

      {/* FEATURE CARD: Upload Materi Ajar Quick Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="flex items-start sm:items-center gap-4 z-10">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-purple-600/25 shrink-0">
            <UploadCloud className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                Punya File Materi atau Silabus Sendiri?
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Fitur Unggulan
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Unggah file dokumen materi pembelajaran Anda (PDF, Word, Teks, atau Gambar Catatan). AI EduSmart akan otomatis menganalisis materi, merumuskan tema pembelajaran, jenjang sasaran, dan tujuan belajar tanpa perlu mengetik manual.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                ✓ Ekstrak Otomatis
              </span>
              <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                ✓ Format PDF, Word (.docx), TXT
              </span>
              <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                ✓ Siap Jadi Video, Komik, Kuis, Lembar Ajar
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 w-full md:w-auto z-10"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File Materi Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-purple-50/70 to-transparent pointer-events-none" />
      </div>

      {/* Generator Tools Grid Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800">
              Pilihan Generator Media Ajar
            </h2>
            <p className="text-xs text-slate-500">
              Pilih jenis generator media di bawah untuk memulai perancangan konten pembelajaran:
            </p>
          </div>

          {/* Search filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari jenis generator..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-purple-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            />
          </div>
        </div>

        {/* 8 Generator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredGenerators.map((gen) => (
            <div
              key={gen.id}
              className="bg-white rounded-3xl p-5 border border-purple-100/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100/80 flex items-center justify-center transition-colors shadow-2xs">
                    {ICON_MAP[gen.iconName]}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    {gen.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-heading font-bold text-slate-800 text-base mb-1 group-hover:text-purple-700 transition-colors">
                  {gen.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {gen.description}
                </p>

                {/* Output Highlights */}
                <div className="space-y-1.5 mb-6 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Output Utama:
                  </span>
                  {gen.outputHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => onStartGenerator(gen.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs transition-all shadow-2xs group-hover:bg-purple-600 group-hover:text-white"
              >
                <span>Mulai</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preset Projects / Inspirasi Section */}
      <div className="bg-gradient-to-br from-lavender-50 via-purple-50/50 to-indigo-50/40 rounded-3xl p-6 sm:p-8 border border-purple-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-800">
                Contoh Proyek Edukasi Siap Pakai
              </h3>
              <p className="text-xs text-slate-500">
                Pilih salah satu contoh topik di bawah ini untuk mengisi formulir generator secara instan:
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full text-purple-700 border border-purple-200">
            {PRESET_PROJECTS.length} Contoh Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_PROJECTS.map((preset) => (
            <div
              key={preset.id}
              className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                    {preset.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {preset.targetGrade}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 mb-1">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {preset.description}
                </p>
              </div>

              <button
                onClick={() => onLoadPreset(preset)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Gunakan Contoh Ini</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
