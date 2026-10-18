import React, { useState } from 'react';
import { Copy, Check, Printer, FileText, Sparkles, BookOpen, FileImage, Video, Layers } from 'lucide-react';
import { FlipbookModule } from '../types/flipbook';
import { formatFullMarkdown } from '../utils/exporter';

interface FullDocumentViewProps {
  module: FlipbookModule;
}

export const FullDocumentView: React.FC<FullDocumentViewProps> = ({ module }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(formatFullMarkdown(module));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action header (hidden during print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          <h3 className="text-lg font-bold font-heading text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <span>Draf Lengkap Rancangan Media Ajar Interaktif</span>
          </h3>
          <p className="text-xs text-slate-500">
            Sesuai format wajib: Teks Materi & Narasi, Prompt A4 300 DPI, Video Looping AI, dan Evaluasi Interaktif
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02]"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Draf Lengkap (Markdown)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable / Clean Document Container */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
            <span>MODUL PEMBELAJARAN INTERAKTIF BERBASIS FLIPBOOK GAMIFIKASI</span>
            <span>{module.metadata.createdAt}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-slate-950 mb-3">
            {module.concept.adventureTitle}
          </h1>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <span className="px-3 py-1 bg-slate-100 rounded-lg">
              1. Topik/Judul Media: <strong className="text-slate-900">{module.metadata.topic}</strong>
            </span>
            <span className="px-3 py-1 bg-slate-100 rounded-lg">
              2. Target Sasaran/Kelas: <strong className="text-slate-900">{module.metadata.gradeLevel}</strong>
            </span>
            <span className="px-3 py-1 bg-slate-100 rounded-lg">
              3. Model/Pendekatan: <strong className="text-slate-900">{module.metadata.learningModel}</strong>
            </span>
          </div>
          {module.metadata.summaryContent && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <strong className="text-slate-900 block mb-0.5">4. Materi Pokok / Ringkasan Isi:</strong>
              {module.metadata.summaryContent}
            </div>
          )}
        </div>

        {/* SECTION 1: KONSEP PETUALANGAN & PETA MISI */}
        <section className="space-y-4">
          <div className="border-b border-orange-300 pb-2">
            <h2 className="text-xl font-bold font-heading text-orange-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-extrabold">
                1
              </span>
              <span>KONSEP PETUALANGAN & PETA MISI</span>
            </h2>
          </div>

          <div className="space-y-3 text-sm text-slate-800 leading-relaxed">
            <p>
              <strong className="text-slate-950">Judul Petualangan: </strong>
              {module.concept.adventureTitle}
            </p>
            <p>
              <strong className="text-slate-950">Tema Dunia: </strong>
              {module.concept.worldTheme}
            </p>
            <p>
              <strong className="text-slate-950">Karakter Pemandu: </strong>
              {module.concept.guideCharacter.name} &mdash; {module.concept.guideCharacter.description}
              {module.concept.guideCharacter.catchphrase && (
                <span className="italic block mt-1 text-slate-600">
                  (Slogan Pemandu: "{module.concept.guideCharacter.catchphrase}")
                </span>
              )}
            </p>

            <div>
              <strong className="text-slate-950 block mb-2">Peta Misi:</strong>
              <div className="space-y-2.5 pl-2 sm:pl-4 border-l-2 border-orange-200">
                {module.concept.missionMap.map((m) => (
                  <div key={m.stepNumber} className="text-xs sm:text-sm">
                    <span className="font-bold text-slate-900">
                      {m.stepNumber}. {m.postName}
                    </span>
                    <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5 pl-2">
                      <li>Sintaks Pembelajaran: {m.syntaxStage}</li>
                      <li>Sasaran Misi: {m.briefObjective}</li>
                      <li>Lencana Penghargaan: 🏆 {m.badgeName}</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: RANCANGAN HALAMAN FLIPBOOK (Wajib dipatuhi untuk setiap halaman) */}
        <section className="space-y-6">
          <div className="border-b border-orange-300 pb-2">
            <h2 className="text-xl font-bold font-heading text-orange-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-extrabold">
                2
              </span>
              <span>RANCANGAN HALAMAN FLIPBOOK (BERURUTAN)</span>
            </h2>
          </div>

          <div className="space-y-8">
            {module.pages.map((p) => (
              <div key={p.pageNumber} className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <h3 className="font-bold font-heading text-slate-900 text-base sm:text-lg">
                    {p.title}
                  </h3>
                  {p.syntaxPhase && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded-md">
                      {p.syntaxPhase}
                    </span>
                  )}
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {/* 1. Teks Materi & Narasi */}
                  <div>
                    <strong className="text-slate-950 block mb-1">1. Teks Materi & Narasi:</strong>
                    <div className="p-4 bg-white rounded-xl border border-slate-200/80 text-slate-800 leading-relaxed italic">
                      "{p.storyAndContent}"
                    </div>
                  </div>

                  {/* 2. Prompt Text-to-Image (A4 Portrait 300 DPI) */}
                  <div>
                    <strong className="text-slate-950 block mb-1 flex items-center gap-1.5">
                      <FileImage className="w-3.5 h-3.5 text-pink-600" />
                      <span>2. Prompt Text-to-Image (A4 Portrait 300 DPI):</span>
                    </strong>
                    <div className="font-mono-code text-[11px] bg-slate-900 text-pink-300 p-3.5 rounded-xl break-words leading-relaxed">
                      {p.imagePrompt}
                    </div>
                  </div>

                  {/* 3. Prompt Image-to-Video */}
                  <div>
                    <strong className="text-slate-950 block mb-1 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-cyan-600" />
                      <span>3. Prompt Image-to-Video (Jika halaman berisi video interaktif):</span>
                    </strong>
                    <div className="font-mono-code text-[11px] bg-slate-900 text-cyan-300 p-3.5 rounded-xl break-words leading-relaxed">
                      {p.videoPrompt}
                    </div>
                  </div>

                  {/* 4. Panduan Layout Canva & Interaktivitas */}
                  <div>
                    <strong className="text-slate-950 block mb-1 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>4. Panduan Layout Canva & Interaktivitas:</span>
                    </strong>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                      {p.canvaLayoutAndInteractivity}
                    </div>
                  </div>

                  {p.interactiveTask && (
                    <div>
                      <strong className="text-slate-950 block mb-1">Tugas / Aktivitas Interaktif:</strong>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-slate-800">
                        {p.interactiveTask}
                      </div>
                    </div>
                  )}

                  {p.interactiveClue && (
                    <div className="text-xs text-amber-800 flex items-start gap-1.5 pl-1">
                      <span>💡 <strong>Petunjuk Rahasia:</strong> {p.interactiveClue}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: EVALUASI INTERAKTIF */}
        <section className="space-y-6">
          <div className="border-b border-orange-300 pb-2">
            <h2 className="text-xl font-bold font-heading text-orange-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-extrabold">
                3
              </span>
              <span>BAGIAN PENUTUP: EVALUASI INTERAKTIF (Siap Input Heyzine / Zep Quiz)</span>
            </h2>
          </div>

          <div className="space-y-6">
            {module.quiz.map((q) => (
              <div key={q.questionNumber} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                    Nomor Soal {q.questionNumber}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Kunci Jawaban: {q.correctAnswer}
                  </span>
                </div>

                <p className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                  {q.question}
                </p>

                <div className="space-y-1.5 pl-2 text-xs sm:text-sm text-slate-700">
                  {q.options.map((opt) => (
                    <div
                      key={opt.label}
                      className={`p-2 rounded-lg flex items-start gap-2 ${
                        opt.label === q.correctAnswer ? 'font-bold text-emerald-900 bg-emerald-50/70' : ''
                      }`}
                    >
                      <span>{opt.label}.</span>
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900">Feedback / Umpan Balik: </strong>
                  {q.feedback}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
