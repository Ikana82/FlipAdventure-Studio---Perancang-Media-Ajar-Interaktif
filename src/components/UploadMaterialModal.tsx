import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Target,
  RefreshCw,
  FileUp,
  Layers,
  Check,
} from 'lucide-react';
import { GeneratorType } from '../types/edusmart';
import { GENERATORS } from '../data/generators';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMaterial: (data: {
    topic: string;
    contentExplanation: string;
    targetGrade: string;
    learningObjective: string;
    mediaType?: string;
    generatorType: GeneratorType;
    fileName?: string;
    fileSize?: number;
  }) => void;
  onDirectGenerate?: (data: {
    topic: string;
    contentExplanation: string;
    targetGrade: string;
    learningObjective: string;
    mediaType?: string;
    generatorType: GeneratorType;
    fileName?: string;
    fileSize?: number;
  }) => void;
}

const SAMPLE_MATERIALS = [
  {
    title: 'Siklus Air & Hujan (IPA)',
    grade: 'SD Kelas 3–4',
    generator: 'video' as GeneratorType,
    text: `Materi Siklus Air:
Air di bumi mengalami perputaran terus menerus melalui proses siklus air atau hidrologi.
1. Evaporasi: Air di laut, danau, dan sungai menguap karena panas sinar matahari.
2. Kondensasi: Uap air naik ke atmosfer yang dingin dan berkumpul menjadi awan mendung.
3. Presipitasi: Ketika butiran air di awan terlalu berat, turunlah hujan ke bumi.
4. Infiltrasi & Aliran Permukaan: Air hujan meresap ke dalam tanah menjadi air tanah atau mengalir kembali ke sungai dan laut.
Manfaat air sangat penting bagi tanaman, hewan, dan manusia. Kita harus menjaga kelestarian air bersih dengan tidak mencemari sungai.`,
  },
  {
    title: 'Tata Surya & 8 Planet Pengelana',
    grade: 'SD Kelas 5–6',
    generator: 'comic' as GeneratorType,
    text: `Materi Tata Surya:
Matahari adalah pusat tata surya kita yang memancarkan cahaya dan panas. Ada 8 planet yang mengorbit matahari:
1. Merkurius: Planet terkecil dan terdekat dengan matahari.
2. Venus: Planet paling panas dengan atmosfer tebal beracun.
3. Bumi: Planet tempat tinggal kita yang kaya air dan oksigen.
4. Mars: Planet merah dengan debu besi oksida dan gunung tertinggi Olympus Mons.
5. Jupiter: Planet terbesar dengan badai Bintik Merah Raksasa.
6. Saturnus: Planet bercincin es yang spektakuler.
7. Uranus & Neptunus: Raksasa es dingin di tepian tata surya.
Semua planet mengorbit dalam lintasannya yang teratur karena gaya gravitasi matahari.`,
  },
  {
    title: 'Pentingnya Menabung & Uang Saku',
    grade: 'SD Kelas 1–2',
    generator: 'illustration' as GeneratorType,
    text: `Materi Literasi Finansial Dasar:
Uang adalah alat tukar untuk membeli barang kebutuhan sehari-hari.
Membedakan Kebutuhan vs Keinginan:
- Kebutuhan: Makanan sehat, buku pelajaran, pakaian seragam (harus didahulukan).
- Keinginan: Mainan mahal, permen manis berlebih (bisa ditunda).
Manfaat Menabung:
Menyisihkan sebagian uang saku ke celengan setiap hari melatih kesabaran, disiplin, dan membantu kita membeli barang impian di masa depan tanpa membebani orang tua.`,
  },
];

const TARGET_GRADES = [
  'PAUD',
  'TK A',
  'TK B',
  'SD Kelas 1–2',
  'SD Kelas 3–4',
  'SD Kelas 5–6',
  'SMP',
  'SMA',
];

function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  onClose,
  onApplyMaterial,
  onDirectGenerate,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [manualText, setManualText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Extracted state
  const [extractedTopic, setExtractedTopic] = useState('');
  const [extractedGrade, setExtractedGrade] = useState('SD Kelas 3–4');
  const [extractedObjective, setExtractedObjective] = useState('');
  const [extractedSummary, setExtractedSummary] = useState('');
  const [selectedGenerator, setSelectedGenerator] = useState<GeneratorType>('video');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const [hasExtractedResult, setHasExtractedResult] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const isTextFile =
        file.type.startsWith('text/') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.csv');

      if (isTextFile) {
        const text = await file.text();
        const res = await fetch('/api/extract-material-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            textContent: text,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Gagal memproses file teks.');
        }

        setExtractedTopic(data.suggestedTopic || file.name.replace(/\.[^/.]+$/, ''));
        setExtractedGrade(data.suggestedTargetGrade || 'SD Kelas 3–4');
        setExtractedObjective(data.suggestedLearningObjective || '');
        setExtractedSummary(data.extractedSummary || text);
        setUploadedFileName(file.name);
        setUploadedFileSize(file.size);
        setHasExtractedResult(true);
      } else {
        // Binary files: PDF, Word, Images
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1] || result;
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const mimeType =
          file.type ||
          (file.name.endsWith('.pdf')
            ? 'application/pdf'
            : file.name.endsWith('.docx')
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : 'application/octet-stream');

        const res = await fetch('/api/extract-material-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64: base64Data,
            mimeType: mimeType,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Gagal menganalisis dokumen materi.');
        }

        setExtractedTopic(data.suggestedTopic || file.name.replace(/\.[^/.]+$/, ''));
        setExtractedGrade(data.suggestedTargetGrade || 'SD Kelas 3–4');
        setExtractedObjective(data.suggestedLearningObjective || '');
        setExtractedSummary(data.extractedSummary || '');
        setUploadedFileName(file.name);
        setUploadedFileSize(file.size);
        setHasExtractedResult(true);
      }
    } catch (err: any) {
      console.error('File extraction error:', err);
      setErrorMsg(
        err.message || 'Gagal memproses file materi. Silakan coba file lain atau tempel teks langsung.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualTextExtract = async () => {
    if (!manualText.trim()) {
      setErrorMsg('Harap masukkan teks materi atau silabus terlebih dahulu.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/extract-material-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: 'Catatan_Materi.txt',
          textContent: manualText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menganalisis teks materi.');
      }

      setExtractedTopic(data.suggestedTopic || 'Tema Pembelajaran Baru');
      setExtractedGrade(data.suggestedTargetGrade || 'SD Kelas 3–4');
      setExtractedObjective(data.suggestedLearningObjective || '');
      setExtractedSummary(data.extractedSummary || manualText);
      setUploadedFileName('Naskah_Materi_Pilihan.txt');
      setUploadedFileSize(new Blob([manualText]).size);
      setHasExtractedResult(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal mengekstrak materi.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_MATERIALS[0]) => {
    setManualText(sample.text);
    setActiveTab('text');
    setExtractedTopic(sample.title);
    setExtractedGrade(sample.grade);
    setExtractedObjective(`Siswa mampu memahami konsep ${sample.title} secara komprehensif.`);
    setExtractedSummary(sample.text);
    setSelectedGenerator(sample.generator);
    setUploadedFileName(`Contoh_${sample.title.replace(/\s+/g, '_')}.txt`);
    setUploadedFileSize(new Blob([sample.text]).size);
    setHasExtractedResult(true);
    setErrorMsg(null);
  };

  const handleApplyAndProceed = () => {
    if (!extractedTopic.trim() || !extractedSummary.trim()) {
      setErrorMsg('Judul tema dan ringkasan materi wajib terisi.');
      return;
    }

    let defaultMedia = 'Video Animasi Pembelajaran';
    if (selectedGenerator === 'comic') defaultMedia = 'Komik Edukasi';
    else if (selectedGenerator === 'presentation') defaultMedia = 'Presentasi';
    else if (selectedGenerator === 'illustration') defaultMedia = 'Ilustrasi Edukasi';
    else if (selectedGenerator === 'quiz') defaultMedia = 'Media Pembelajaran Interaktif';

    onApplyMaterial({
      topic: extractedTopic,
      contentExplanation: extractedSummary,
      targetGrade: extractedGrade,
      learningObjective: extractedObjective,
      mediaType: defaultMedia,
      generatorType: selectedGenerator,
      fileName: uploadedFileName || undefined,
      fileSize: uploadedFileSize || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Hidden native input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleProcessFile(f);
          }}
          accept=".pdf,.docx,.doc,.txt,.md,.rtf,.png,.jpg,.jpeg"
          className="hidden"
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading leading-tight">
                Upload File Materi Pembelajaran
              </h2>
              <p className="text-xs text-purple-200">
                Ekstrak otomatis tema, jenjang, dan tujuan pembelajaran yang sudah Anda siapkan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/15 rounded-xl transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* Navigation Tab: Upload File vs Tempel Teks */}
          <div className="flex items-center gap-2 p-1 bg-purple-50 rounded-2xl border border-purple-100 max-w-md">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah File Dokumen</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'text'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Tempel Teks / Silabus</span>
            </button>
          </div>

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleProcessFile(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-purple-600 bg-purple-100/70 scale-[0.99]'
                    : 'border-purple-200 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50/80'
                }`}
              >
                <div className="w-14 h-14 rounded-3xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                  {isAnalyzing ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <FileUp className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-slate-800 text-sm sm:text-base">
                    {isAnalyzing
                      ? 'AI sedang menganalisis dokumen Anda...'
                      : 'Tarik & letakkan file materi Anda di sini'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    {isAnalyzing
                      ? 'Membaca konsep inti, menyusun rekomendasi tema petualangan/pembelajaran, dan merumuskan tujuan belajar...'
                      : 'Atau klik untuk memilih file dari komputer/ponsel Anda. AI akan mengekstrak otomatis.'}
                  </p>
                </div>

                {!isAnalyzing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-1 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Pilih Dokumen Materi</span>
                  </button>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-purple-100 font-semibold">
                    📄 PDF (.pdf)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-purple-100 font-semibold">
                    📝 Word (.docx, .doc)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-purple-100 font-semibold">
                    📃 Teks (.txt, .md)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-purple-100 font-semibold">
                    🖼️ Gambar Ringkasan
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Direct Text / Syllabus Paste */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Tempelkan Teks Materi, Silabus, RPP, atau Poin Pembelajaran:
              </label>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Contoh: Salin poin materi dari buku teks, silabus kurikulum merdeka, atau rangkuman materi di sini..."
                rows={6}
                className="w-full px-4 py-3 bg-purple-50/30 border border-purple-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleManualTextExtract}
                  disabled={isAnalyzing || !manualText.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menganalisis Teks...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Analisis & Rumuskan Tema</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Sample quick-pick files */}
          {!hasExtractedResult && !isAnalyzing && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Atau coba cepat dengan contoh materi berikut:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_MATERIALS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(sample)}
                    className="p-3 text-left rounded-2xl bg-white border border-purple-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                        {sample.grade}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <span className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-purple-700">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      Klik untuk mengisi & membuat modul
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* EXTRACTED RESULT REVIEW & CONFIGURE SECTION */}
          {hasExtractedResult && (
            <div className="rounded-3xl bg-purple-50/70 p-5 sm:p-6 border border-purple-200 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between border-b border-purple-200/80 pb-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Materi Siap! AI Berhasil Merumuskan Tema & Konsep</span>
                </div>
                {uploadedFileName && (
                  <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-1 rounded-lg border border-purple-100">
                    {uploadedFileName} {uploadedFileSize ? `(${formatBytes(uploadedFileSize)})` : ''}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Suggested Topic */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Judul / Tema Pembelajaran yang Dirumuskan:</span>
                  </label>
                  <input
                    type="text"
                    value={extractedTopic}
                    onChange={(e) => setExtractedTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-xs sm:text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* 2. Target Grade */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                    <span>Target Jenjang Siswa:</span>
                  </label>
                  <select
                    value={extractedGrade}
                    onChange={(e) => setExtractedGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {TARGET_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Generator Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Format Media Ajar yang Dibuat:</span>
                  </label>
                  <select
                    value={selectedGenerator}
                    onChange={(e) => setSelectedGenerator(e.target.value as GeneratorType)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {GENERATORS.map((gen) => (
                      <option key={gen.id} value={gen.id}>
                        {gen.title} ({gen.subtitle})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Learning Objective */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tujuan Pembelajaran:</span>
                  </label>
                  <input
                    type="text"
                    value={extractedObjective}
                    onChange={(e) => setExtractedObjective(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* 5. Material Content Preview */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span>Ringkasan Materi Pokok Siap Ajar:</span>
                  </label>
                  <textarea
                    rows={4}
                    value={extractedSummary}
                    onChange={(e) => setExtractedSummary(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none font-sans"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-purple-100 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            Batal
          </button>

          {hasExtractedResult ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyAndProceed}
                className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors"
              >
                Buka di Formulir
              </button>

              <button
                type="button"
                onClick={() => {
                  let defaultMedia = 'Video Animasi Pembelajaran';
                  if (selectedGenerator === 'comic') defaultMedia = 'Komik Edukasi';
                  else if (selectedGenerator === 'presentation') defaultMedia = 'Presentasi';
                  else if (selectedGenerator === 'illustration') defaultMedia = 'Ilustrasi Edukasi';
                  else if (selectedGenerator === 'quiz') defaultMedia = 'Media Pembelajaran Interaktif';

                  const payload = {
                    topic: extractedTopic,
                    contentExplanation: extractedSummary,
                    targetGrade: extractedGrade,
                    learningObjective: extractedObjective,
                    mediaType: defaultMedia,
                    generatorType: selectedGenerator,
                    fileName: uploadedFileName || undefined,
                    fileSize: uploadedFileSize || undefined,
                  };

                  if (onDirectGenerate) {
                    onDirectGenerate(payload);
                  } else {
                    onApplyMaterial(payload);
                  }
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Langsung Buat dengan AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah File Materi</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
