import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Target,
  Palette,
  Languages,
  Maximize2,
  Sliders,
  UserCheck,
  AlertCircle,
  Loader2,
  Info,
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  FileUp,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { FormDataState, GeneratorType } from '../types/edusmart';
import { GENERATORS } from '../data/generators';

interface GeneratorFormProps {
  generatorType: GeneratorType;
  formData: FormDataState;
  onChangeFormData: (data: FormDataState) => void;
  onSubmit: (data: FormDataState) => Promise<void>;
  onBack: () => void;
  isGenerating: boolean;
}

const TARGET_GRADES = [
  'PAUD',
  'TK A',
  'TK B',
  'SD Kelas 1–2',
  'SD Kelas 3–4',
  'SD Kelas 5–6',
  'SMP',
  'SMA',
  'Kustom',
];

const MEDIA_TYPES = [
  'Video Animasi Pembelajaran',
  'Presentasi',
  'Komik Edukasi',
  'Ilustrasi Edukasi',
  'Buku Cerita Edukasi',
  'Media Pembelajaran Interaktif',
];

const VISUAL_STYLES = [
  '2D Flat Vector',
  'Cute Cartoon',
  '3D Animated Storybook',
  '3D Cartoon',
  'Kawaii Illustration',
  'Paper Cut Illustration',
  'Minimalist Educational Illustration',
  'Custom Style',
];

const LANGUAGES = [
  'Bahasa Indonesia',
  'English',
  'Bilingual Indonesia–English',
];

const ORIENTATIONS = [
  { label: 'Landscape 16:9', desc: 'Cocok untuk Video YouTube, Smartboard, & Presentasi' },
  { label: 'Portrait 9:16', desc: 'Cocok untuk Video TikTok, Shorts, & Reels Edukasi' },
  { label: 'Portrait A4', desc: 'Cocok untuk Lembar Kerja, Komik Cetak, & Buku Cerita' },
  { label: 'Square 1:1', desc: 'Cocok untuk Instagram Feed & Flashcard Kartu Belajar' },
];

const CHARACTER_TYPES = [
  'Tanpa karakter.',
  'Guru atau pendamping belajar.',
  'Karakter hewan.',
  'Karakter anak-anak.',
  'Karakter fantasi.',
  'Karakter kustom.',
];

function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  generatorType,
  formData,
  onChangeFormData,
  onSubmit,
  onBack,
  isGenerating,
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentGen = GENERATORS.find((g) => g.id === generatorType) || GENERATORS[0];

  const handleFieldChange = (field: keyof FormDataState, value: any) => {
    onChangeFormData({
      ...formData,
      [field]: value,
    });
    if (errorMsg) setErrorMsg('');
  };

  // Process uploaded file (PDF, TXT, MD, DOCX, Images)
  const handleFileProcess = async (file: File) => {
    if (!file) return;

    setIsAnalyzingFile(true);
    setFileUploadError(null);
    setFileUploadSuccess(null);

    try {
      const isTextFile =
        file.type.startsWith('text/') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.csv');

      if (isTextFile) {
        const text = await file.text();
        if (text.trim().length > 0) {
          handleFieldChange('contentExplanation', text);
        }

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

        onChangeFormData({
          ...formData,
          topic: data.suggestedTopic || formData.topic || file.name.replace(/\.[^/.]+$/, ''),
          contentExplanation: data.extractedSummary || text,
          targetGrade: data.suggestedTargetGrade || formData.targetGrade,
          learningObjective: data.suggestedLearningObjective || formData.learningObjective,
          uploadedFileName: file.name,
          uploadedFileSize: file.size,
        });

        setFileUploadSuccess(
          `File "${file.name}" berhasil dianalisis! Materi pokok & tema terisi otomatis.`
        );
      } else {
        // Binary files: PDF, DOCX, PNG, JPG
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
          (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');

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
          throw new Error(data.error || 'Gagal menganalisis isi file dokumen.');
        }

        onChangeFormData({
          ...formData,
          topic: data.suggestedTopic || formData.topic || file.name.replace(/\.[^/.]+$/, ''),
          contentExplanation: data.extractedSummary || formData.contentExplanation,
          targetGrade: data.suggestedTargetGrade || formData.targetGrade,
          learningObjective: data.suggestedLearningObjective || formData.learningObjective,
          uploadedFileName: file.name,
          uploadedFileSize: file.size,
        });

        setFileUploadSuccess(
          `Dokumen "${file.name}" berhasil diekstrak! Materi pembelajaran dan tema siap digunakan.`
        );
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setFileUploadError(
        err.message || 'Gagal membaca file. Pastikan format file sesuai (PDF, Word, Teks, atau Gambar).'
      );
    } finally {
      setIsAnalyzingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveUploadedFile = () => {
    onChangeFormData({
      ...formData,
      uploadedFileName: undefined,
      uploadedFileSize: undefined,
    });
    setFileUploadSuccess(null);
    setFileUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      setErrorMsg('Harap masukkan Judul atau Tema Pembelajaran.');
      return;
    }
    if (!formData.contentExplanation.trim()) {
      setErrorMsg('Harap jelaskan Materi Pokok atau unggah file dokumen materi.');
      return;
    }

    setErrorMsg('');
    await onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,.doc,.docx,.txt,.md,.rtf,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Back button & Generator Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-700 transition-colors py-1.5 px-3 rounded-xl hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full border border-purple-200">
          {currentGen.title}
        </span>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mb-1">
            Formulir Pembuatan: {currentGen.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {currentGen.description}
          </p>
        </div>

        {/* FEATURE: Upload File Materi Pembelajaran Card */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-50/90 via-lavender-50/60 to-indigo-50/50 p-5 sm:p-6 border border-purple-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-600/30 shrink-0">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <span>Upload File Materi Pembelajaran</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                    Otomatisasi AI
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Punya modul PDF, silabus, dokumen Word (.docx), atau naskah materi? Unggah di sini dan AI akan mengekstrak konsep serta menentukan tema pembelajaran secara otomatis.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzingFile}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 disabled:opacity-50"
            >
              {isAnalyzingFile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Membaca Dokumen...</span>
                </>
              ) : (
                <>
                  <FileUp className="w-4 h-4" />
                  <span>Pilih File Materi</span>
                </>
              )}
            </button>
          </div>

          {/* Drag & Drop Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-purple-600 bg-purple-100/70 scale-[0.99]'
                : 'border-purple-200 hover:border-purple-400 bg-white/70 hover:bg-white'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-slate-600">
              <UploadCloud className="w-6 h-6 text-purple-500 mb-0.5" />
              <p className="font-semibold text-slate-800">
                Tarik & letakkan file materi di sini, atau <span className="text-purple-700 underline font-bold">klik untuk memilih</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Format yang didukung: <strong>PDF, Word (.docx), Teks (.txt, .md), & Gambar Catatan</strong> (Maks 15 MB)
              </p>
            </div>
          </div>

          {/* Upload Status & File Badge */}
          {formData.uploadedFileName && (
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                      {formData.uploadedFileName}
                    </span>
                    {formData.uploadedFileSize && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({formatBytes(formData.uploadedFileSize)})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Materi berhasil diekstrak dan tema terisi otomatis</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
                >
                  Ganti File
                </button>
                <button
                  type="button"
                  onClick={handleRemoveUploadedFile}
                  title="Hapus File"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* File Upload Alerts */}
          {fileUploadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{fileUploadSuccess}</span>
            </div>
          )}

          {fileUploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{fileUploadError}</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Judul atau Tema Pembelajaran */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              1. Judul atau Tema Pembelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.topic}
              onChange={(e) => handleFieldChange('topic', e.target.value)}
              placeholder="Contoh: Terjadinya Pelangi, Siklus Hidup Kupu-kupu, Pecahan Sederhana, Tata Surya..."
              className="w-full px-4 py-3 bg-slate-50 border border-purple-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* 2. Materi yang Ingin Dijelaskan */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Materi yang Ingin Dijelaskan <span className="text-rose-500">*</span>
              </label>

              {/* Quick upload trigger right on Field 2 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzingFile}
                className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5 text-purple-600" />
                <span>Upload File Materi</span>
              </button>
            </div>
            <textarea
              rows={5}
              required
              value={formData.contentExplanation}
              onChange={(e) => handleFieldChange('contentExplanation', e.target.value)}
              placeholder="Jelaskan fakta ilmiah, konsep materi, atau silabus. Anda juga dapat mengklik 'Upload File Materi' di atas untuk mengunggah PDF, Word, atau teks secara instan..."
              className="w-full px-4 py-3 bg-slate-50 border border-purple-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* 3. Target Pendidikan & 4. Tujuan Pembelajaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span>3. Target Pendidikan</span>
              </label>
              <select
                value={formData.targetGrade}
                onChange={(e) => handleFieldChange('targetGrade', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-purple-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                {TARGET_GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-600" />
                <span>4. Tujuan Pembelajaran</span>
              </label>
              <input
                type="text"
                value={formData.learningObjective}
                onChange={(e) => handleFieldChange('learningObjective', e.target.value)}
                placeholder="Contoh: Siswa dapat menyebutkan proses pembiasan cahaya dan urutan warna pelangi."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-purple-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              />
            </div>
          </div>

          {/* 5. Jenis Media & 6. Gaya Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>5. Jenis Media</span>
              </label>
              <select
                value={formData.mediaType}
                onChange={(e) => handleFieldChange('mediaType', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-purple-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                {MEDIA_TYPES.map((media) => (
                  <option key={media} value={media}>
                    {media}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span>6. Gaya Visual</span>
              </label>
              <select
                value={formData.visualStyle}
                onChange={(e) => handleFieldChange('visualStyle', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-purple-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                {VISUAL_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 7. Bahasa & 8. Orientasi Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-purple-600" />
                <span>7. Bahasa Pengantar</span>
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleFieldChange('language', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-purple-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
                <span>8. Orientasi Visual</span>
              </label>
              <select
                value={formData.orientation}
                onChange={(e) => handleFieldChange('orientation', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-purple-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                {ORIENTATIONS.map((ori) => (
                  <option key={ori.label} value={ori.label}>
                    {ori.label} ({ori.desc})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 9. Jumlah Adegan atau Slide */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-600" />
                <span>9. Jumlah Adegan / Slide / Panel:</span>
              </label>
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-purple-600 text-white">
                {formData.sceneCount} Adegan
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[3, 4, 5, 6, 8].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => handleFieldChange('sceneCount', count)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.sceneCount === count
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white border border-purple-100 text-slate-700 hover:bg-purple-100/50'
                  }`}
                >
                  {count} Adegan
                </button>
              ))}
            </div>
          </div>

          {/* 10. Karakter Utama & Character Reference */}
          <div className="space-y-3 p-4 rounded-2xl bg-lavender-50/50 border border-purple-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>10. Karakter Utama (Konsistensi Karakter)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHARACTER_TYPES.map((char) => (
                <button
                  type="button"
                  key={char}
                  onClick={() => handleFieldChange('characterType', char)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    formData.characterType === char
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white border-purple-100 text-slate-700 hover:border-purple-300'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>

            {formData.characterType !== 'Tanpa karakter.' && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nama Karakter (Opsional):
                  </span>
                  <input
                    type="text"
                    value={formData.customCharacterName}
                    onChange={(e) => handleFieldChange('customCharacterName', e.target.value)}
                    placeholder="Contoh: Kiko si Kancil, Dokter Gigi Cici, Robo-Bimo..."
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    Ciri Visual Khusus:
                  </span>
                  <input
                    type="text"
                    value={formData.customCharacterDesc}
                    onChange={(e) => handleFieldChange('customCharacterDesc', e.target.value)}
                    placeholder="Contoh: Rompi hijau pastel, kacamata bulat, topi petualang..."
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 11. Instruksi Tambahan */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-purple-600" />
              <span>11. Instruksi Tambahan (Opsional)</span>
            </label>
            <textarea
              rows={2}
              value={formData.additionalInstructions}
              onChange={(e) => handleFieldChange('additionalInstructions', e.target.value)}
              placeholder="Contoh: Gunakan nada bercerita yang ceria, sertakan analogi kearifan lokal, tekankan pada pemecahan masalah mandiri..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-purple-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-purple-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={isGenerating || isAnalyzingFile}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isGenerating || isAnalyzingFile}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Merancang Media dengan AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Media Pembelajaran</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
