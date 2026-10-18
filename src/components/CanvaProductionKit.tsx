import React, { useState } from 'react';
import {
  Palette,
  Copy,
  Check,
  Sparkles,
  Layout,
  Type,
  UploadCloud,
  Layers,
  Video,
  FileImage,
  Printer,
  MousePointerClick,
} from 'lucide-react';
import { FlipbookModule } from '../types/flipbook';
import { formatCanvaPromptList } from '../utils/exporter';

interface CanvaProductionKitProps {
  module: FlipbookModule;
}

export const CanvaProductionKit: React.FC<CanvaProductionKitProps> = ({ module }) => {
  const [copiedImageIndex, setCopiedImageIndex] = useState<number | null>(null);
  const [copiedVideoIndex, setCopiedVideoIndex] = useState<number | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Pastel color palette default
  const colors =
    module.concept.paletteColors && module.concept.paletteColors.length > 0
      ? module.concept.paletteColors
      : ['#fbcfe8', '#a5f3fc', '#0284c7', '#0f172a'];

  const handleCopyText = (text: string, index: number, type: 'image' | 'video') => {
    navigator.clipboard.writeText(text);
    if (type === 'image') {
      setCopiedImageIndex(index);
      setTimeout(() => setCopiedImageIndex(null), 2000);
    } else {
      setCopiedVideoIndex(index);
      setTimeout(() => setCopiedVideoIndex(null), 2000);
    }
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleCopyAllPrompts = () => {
    navigator.clipboard.writeText(formatCanvaPromptList(module));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const isElementary =
    module.metadata.gradeLevel.toLowerCase().includes('sd') ||
    module.metadata.gradeLevel.toLowerCase().includes('paud');
  const fontHeading = isElementary ? 'Fredoka / Nunito / Quicksand' : 'Poppins / Montserrat / Space Grotesk';
  const fontBody = isElementary ? 'Comic Neue / Quicksand / Plus Jakarta Sans' : 'Inter / Plus Jakarta Sans / Roboto';

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-500/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
                Panduan Produksi Canva A4
              </span>
              <span className="px-2.5 py-1 bg-cyan-300 text-slate-900 rounded-full text-xs font-bold">
                Cetak 300 DPI & Video Looping
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Kit Aset Visual & Video AI (Produksi Canva)
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-2xl">
              Panduan lengkap tata letak halaman format A4 Portrait (210 x 297 mm), prompt Text-to-Image resolusi tinggi 300 DPI warna pastel (pink/soft cyan), dan prompt animasi video looping natural via Kling/Runway/Pika.
            </p>
          </div>

          <button
            onClick={handleCopyAllPrompts}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-rose-700 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-rose-50 transition-all hover:scale-[1.02] shrink-0"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Semua Prompt Tersalin!' : 'Salin Semua Prompt AI'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Print Specs, Color Palette & Fonts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Dimensions & Print Specs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <Printer className="w-4 h-4" />
            <span>Spesifikasi Kanvas Cetak A4</span>
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-pink-50 border border-pink-200">
              <strong className="text-pink-950 block mb-0.5">Format Standar A4 Portrait:</strong>
              <span className="font-mono-code font-bold">210 × 297 mm</span>
              <p className="text-[11px] text-pink-800 mt-1">
                Rasio aspek <strong>--ar 1:1.41</strong> (atau 5:7), Resolusi cetak tinggi <strong>300 DPI</strong> print-ready, crisp linework.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Gaya Visual Utama:</span>
              <strong className="text-slate-800">Flat Vector 2D, Pastel Colors, Clean Background (--no text)</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Color Palette Swatches */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Palette className="w-4 h-4" />
            <span>Palet Warna Pastel (Pink & Soft Cyan)</span>
          </div>
          <p className="text-xs text-slate-500">Klik warna untuk menyalin kode HEX:</p>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((hex) => (
              <button
                key={hex}
                onClick={() => handleCopyHex(hex)}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-pink-400 bg-white text-left transition-all group"
              >
                <span
                  className="w-6 h-6 rounded-lg shadow-inner shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <div className="truncate">
                  <span className="font-mono-code text-[11px] font-bold block text-slate-700 group-hover:text-pink-600">
                    {hex}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {copiedHex === hex ? 'Tersalin!' : 'Salin Hex'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Font Pairings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
            <Type className="w-4 h-4" />
            <span>Rekomendasi Tipografi Canva</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Font Judul / Cover:</span>
              <strong className="text-slate-800 text-xs sm:text-sm">{fontHeading}</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Ramah, bulat (*rounded*), dan sangat terbaca.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Font Teks Materi:</span>
              <strong className="text-slate-800 text-xs sm:text-sm">{fontBody}</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Sangat nyaman dibaca siswa pada kanvas A4.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page by Page Prompt Card Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Daftar Prompt AI per Halaman (A4 300 DPI & Video Looping)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Salin prompt berikut untuk diinput ke Canva Magic Media, Midjourney, DALL-E, atau generator video AI (Kling/Runway).
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {module.pages.map((p, idx) => (
            <div
              key={p.pageNumber}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-500 text-white font-bold text-xs flex items-center justify-center">
                    {p.pageNumber}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">{p.title}</h4>
                </div>
                <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-900">
                  A4 210x297mm • 300 DPI
                </span>
              </div>

              {/* 2. Text-to-Image Prompt (A4 Portrait 300 DPI) */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-[11px] text-pink-300 font-bold flex items-center gap-1.5">
                    <FileImage className="w-3.5 h-3.5 text-pink-400" />
                    2. Prompt Text-to-Image (Canva / Midjourney / DALL-E):
                  </span>
                  <button
                    onClick={() => handleCopyText(p.imagePrompt, idx, 'image')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-pink-300 transition-colors"
                  >
                    {copiedImageIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedImageIndex === idx ? 'Prompt Tersalin!' : 'Salin Prompt Gambar A4'}</span>
                  </button>
                </div>
                <p className="font-mono-code text-[11px] text-slate-300 leading-relaxed break-words bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  {p.imagePrompt}
                </p>
              </div>

              {/* 3. Image-to-Video Looping Prompt (Runway / Kling / Pika) */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    3. Prompt Video Looping (Runway / Kling / Pika):
                  </span>
                  <button
                    onClick={() => handleCopyText(p.videoPrompt, idx, 'video')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-300 transition-colors"
                  >
                    {copiedVideoIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVideoIndex === idx ? 'Video Tersalin!' : 'Salin Prompt Video'}</span>
                  </button>
                </div>
                <p className="font-mono-code text-[11px] text-slate-300 leading-relaxed break-words bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  {p.videoPrompt}
                </p>
              </div>

              {/* 4. Panduan Layout Canva & Interaktivitas */}
              <div className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <MousePointerClick className="w-3.5 h-3.5 text-indigo-600" />
                  <span>4. Panduan Tata Letak Canva & Interaktivitas:</span>
                </div>
                <p className="text-slate-600 pl-5">{p.canvaLayoutAndInteractivity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Publishing to Heyzine Tutorial */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs">
        <h3 className="text-lg font-bold font-heading text-emerald-950 mb-4 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-emerald-600" />
          <span>Alur Publikasi Flipbook Interaktif (Canva A4 &rarr; PDF 300 DPI &rarr; Heyzine)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-200/80">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
              1
            </span>
            <h5 className="font-bold text-xs text-slate-800 mb-1">Kanvas A4 Portrait Canva</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Buat dokumen A4 (210 x 297 mm). Gunakan palet pastel (pink & cyan) dan susun teks narasi per halaman.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-200/80">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
              2
            </span>
            <h5 className="font-bold text-xs text-slate-800 mb-1">Generate Gambar & Video AI</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Gunakan prompt A4 300 DPI dan video looping Kling/Runway untuk disematkan ke bingkai Canva.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-200/80">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
              3
            </span>
            <h5 className="font-bold text-xs text-slate-800 mb-1">Unduh PDF Cetak 300 DPI</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Klik Bagikan di Canva &gt; Unduh &gt; Pilih format <strong>PDF Cetak (Tinggi 300 DPI)</strong>.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-200/80">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
              4
            </span>
            <h5 className="font-bold text-xs text-slate-800 mb-1">Unggah ke Heyzine & Link Kuis</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Buka <a href="https://heyzine.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">heyzine.com</a>, unggah PDF, lalu aktifkan tombol link kuis interaktif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
