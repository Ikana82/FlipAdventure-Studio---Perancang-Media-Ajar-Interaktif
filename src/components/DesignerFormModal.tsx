import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Compass,
  GraduationCap,
  Lightbulb,
  Users,
  Sliders,
  AlertCircle,
  Loader2,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { GenerationInput } from '../types/flipbook';

interface DesignerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenerationInput) => Promise<void>;
  isLoading: boolean;
}

const GRADE_OPTIONS = [
  'PAUD / TK (Usia 4-6 Tahun)',
  'SD Kelas 1-3 (Fase A - Awal Membaca)',
  'SD Kelas 4-6 (Fase B/C - Eksplorasi Konseptual)',
  'SMP Kelas 7-9 (Fase D - Berpikir Kritis)',
  'SMA/SMK Kelas 10-12 (Fase E/F - Analitis & Konseptual Lanjut)',
  'Pendidikan Medis & Kesehatan Masyarakat (Penyuluhan)',
  'Perguruan Tinggi / Pelatihan Guru & Umum',
];

const MODEL_OPTIONS = [
  'Discovery Learning (Penyingkapan Terbimbing)',
  'Problem-Based Learning (PBL) - Orientasi Masalah Nyata',
  'Edukasi Medis & Kesehatan (Penyuluhan / Promosi Kesehatan)',
  'Project-Based Learning (PjBL) - Pembuatan Produk / Karya',
  'Inquiry Learning - Investigasi Ilmiah & Pertanyaan Penyelidik',
  'Game-Based Learning - Misi Berhadiah & Petualangan Poin',
];

const THEME_OPTIONS = [
  { name: 'Detektif Misteri & Pemecah Kasus Rahasia', icon: '🔍' },
  { name: 'Penjelajah Rimba Liar & Alam Tropis', icon: '🌴' },
  { name: 'Laboratorium Medis & Petualangan Sel Tubuh', icon: '🩺' },
  { name: 'Ekspedisi Antariksa & Galaksi Bintang', icon: '🚀' },
  { name: 'Arkeolog Sejarah Kuno & Candi Nusantara', icon: '🏛️' },
  { name: 'Laboratorium Rahasia Sains & Penemuan Cilik', icon: '🔬' },
];

const INSPIRATION_TOPICS = [
  {
    topic: 'Siklus Air & Presipitasi',
    grade: 'SD Kelas 4-6 (Fase B/C - Eksplorasi Konseptual)',
    model: 'Discovery Learning (Penyingkapan Terbimbing)',
    summary: 'Proses penguapan danau (Evaporasi), penguapan tumbuhan (Transpirasi), pendinginan awan (Kondensasi), hujan turun (Presipitasi), dan penyerapan tanah (Infiltrasi).',
  },
  {
    topic: 'Edukasi Kebersihan Gigi & Mulut Anak',
    grade: 'SD Kelas 1-3 (Fase A - Awal Membaca)',
    model: 'Edukasi Medis & Kesehatan (Penyuluhan / Promosi Kesehatan)',
    summary: 'Bahaya sisa gula plak kuman asam, cara menyikat gigi 2 menit dengan teknik memutar, waktu sikat gigi pagi dan malam sebelum tidur.',
  },
  {
    topic: 'Operasi Penjumlahan Pecahan Berbeda Penyebut',
    grade: 'SMP Kelas 7-9 (Fase D - Berpikir Kritis)',
    model: 'Problem-Based Learning (PBL) - Orientasi Masalah Nyata',
    summary: 'Masalah pembagian bahan bakar pesawat, perlunya menyamakan penyebut menggunakan KPK, konsep pecahan senilai sebelum dijumlahkan.',
  },
];

export const DesignerFormModal: React.FC<DesignerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState(GRADE_OPTIONS[2]);
  const [learningModel, setLearningModel] = useState(MODEL_OPTIONS[0]);
  const [summaryContent, setSummaryContent] = useState('');
  const [pageCount, setPageCount] = useState(6);
  const [theme, setTheme] = useState(THEME_OPTIONS[0].name);
  const [guideCharacter, setGuideCharacter] = useState('');
  const [quizCount, setQuizCount] = useState(4);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmptyTemplate = () => {
    const templateText = `1. Topik/Judul Media: \n2. Target Sasaran/Kelas: \n3. Model/Pendekatan Pembelajaran: (Contoh: Discovery Learning, Edukasi Medis, Penyuluhan)\n4. Materi Pokok/Ringkasan Isi: (Tempel teks materi, silabus, atau poin penting)\n5. Jumlah Halaman yang Diinginkan: (Misal: 6, 8, atau 10 halaman)`;
    navigator.clipboard.writeText(templateText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleApplyPreset = (item: typeof INSPIRATION_TOPICS[0]) => {
    setTopic(item.topic);
    setGradeLevel(item.grade);
    setLearningModel(item.model);
    setSummaryContent(item.summary);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Harap isi Topik / Judul Media yang ingin dirancang.');
      return;
    }
    setErrorMsg('');
    await onSubmit({
      topic: topic.trim(),
      gradeLevel,
      learningModel,
      summaryContent: summaryContent.trim(),
      pageCount,
      theme,
      guideCharacter: guideCharacter.trim(),
      quizCount,
      specialInstructions: specialInstructions.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading">Formulir Perancang Media Ajar Flipbook</h2>
              <p className="text-xs text-orange-100">
                Lengkap dengan Teks Materi, Prompt A4 300 DPI, Video Looping AI, dan Kuis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick preset chips & Copy template button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-slate-700">Contoh Topik Siap Pakai:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {INSPIRATION_TOPICS.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(item)}
                  className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  {item.topic.split(' ')[0]} {item.topic.split(' ')[1] || ''}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCopyEmptyTemplate}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                title="Salin template formulir 5 poin ke clipboard"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Tersalin!' : 'Salin Formulir Kosong'}</span>
              </button>
            </div>
          </div>

          {/* 1. Topik / Judul Media */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              1. Topik / Judul Media: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Siklus Air & Presipitasi, Menjaga Kesehatan Gigi, Pecahan Desimal..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 font-medium"
            />
          </div>

          {/* 2. Target Sasaran / Kelas & 3. Model/Pendekatan Pembelajaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                <span>2. Target Sasaran / Kelas:</span>
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 font-medium"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-500" />
                <span>3. Model / Pendekatan Pembelajaran:</span>
              </label>
              <select
                value={learningModel}
                onChange={(e) => setLearningModel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 font-medium"
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Materi Pokok / Ringkasan Isi */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-orange-500" />
                <span>4. Materi Pokok / Ringkasan Isi:</span>
              </label>
              <span className="text-[10px] text-slate-400">Tempel materi, silabus, atau poin penting</span>
            </div>
            <textarea
              rows={3}
              value={summaryContent}
              onChange={(e) => setSummaryContent(e.target.value)}
              placeholder="Tempelkan ringkasan materi, silabus bab, atau poin-poin penting yang ingin dibahas dalam flipbook. (Opsional, AI akan mengembangkan secara mendalam jika dikosongkan)..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 leading-relaxed"
            />
          </div>

          {/* 5. Jumlah Halaman yang Diinginkan */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-orange-500" />
                <span>5. Jumlah Halaman yang Diinginkan:</span>
              </label>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-orange-100 text-orange-700 rounded-md">
                {pageCount} Halaman
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 6, 8, 10].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setPageCount(num)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    pageCount === num
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs ring-2 ring-orange-400/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {num} Halaman
                </button>
              ))}
            </div>
          </div>

          {/* Preferensi Tema Dunia */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-orange-500" />
              <span>Tema Dunia / Karakter Petualangan:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_OPTIONS.map((t) => (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    theme === t.name
                      ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-400/20 text-orange-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-[11px] leading-tight line-clamp-1">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Maskot Karakter & Jumlah Soal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Karakter Pemandu / Maskot (Opsional):
              </label>
              <input
                type="text"
                value={guideCharacter}
                onChange={(e) => setGuideCharacter(e.target.value)}
                placeholder="Contoh: Detektif Kancil berompi cokelat, Dokter Gigi Cilik Mimi..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Jumlah Soal Kuis Evaluasi:
              </label>
              <select
                value={quizCount}
                onChange={(e) => setQuizCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
              >
                <option value={3}>3 Pertanyaan Pilihan Ganda</option>
                <option value={4}>4 Pertanyaan Pilihan Ganda (Standar)</option>
                <option value={5}>5 Pertanyaan Pilihan Ganda</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyusun Modul Flipbook & Prompt AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Susun Modul Flipbook Interaktif</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
