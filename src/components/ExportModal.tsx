import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, FileSpreadsheet, Printer, Sparkles } from 'lucide-react';
import { FlipbookModule } from '../types/flipbook';
import { formatFullMarkdown, formatQuizCSV, formatCanvaPromptList } from '../utils/exporter';

interface ExportModalProps {
  module: FlipbookModule;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ module, isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const markdownContent = formatFullMarkdown(module);
  const csvContent = formatQuizCSV(module);
  const canvaPromptContent = formatCanvaPromptList(module);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Download className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">Pusat Ekspor & Unduhan Modul</h3>
              <p className="text-xs text-slate-400">Unduh atau salin dokumen modul dalam berbagai format siap pakai</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Option 1: Full Document Markdown */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <h4 className="font-bold text-slate-900 text-sm">Dokumen Lengkap (Markdown / Teks)</h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Memuat lengkap Konsep Petualangan, Peta Misi, Seluruh Halaman Flipbook, dan Kuis Evaluasi.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(markdownContent, 'md')}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
              >
                {copiedType === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'md' ? 'Tersalin!' : 'Salin'}</span>
              </button>
              <button
                onClick={() =>
                  handleDownloadFile(
                    markdownContent,
                    `${module.concept.adventureTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`,
                    'text/markdown'
                  )
                }
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .MD</span>
              </button>
            </div>
          </div>

          {/* Option 2: Quiz CSV (Quizizz / Google Form) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">Bank Soal Kuis (Format CSV / Excel)</h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Format tabel soal, opsi jawaban A-D, kunci jawaban, dan feedback umpan balik.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(csvContent, 'csv')}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
              >
                {copiedType === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'csv' ? 'Tersalin!' : 'Salin'}</span>
              </button>
              <button
                onClick={() =>
                  handleDownloadFile(csvContent, `kuis-${module.id}.csv`, 'text/csv')
                }
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>
          </div>

          {/* Option 3: Canva AI Prompt Cheat Sheet */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">Cheat Sheet Prompt Gambar Canva</h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kumpulan prompt siap salin untuk Canva Magic Media per halaman.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(canvaPromptContent, 'canva')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
              >
                {copiedType === 'canva' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'canva' ? 'Tersalin!' : 'Salin Prompt'}</span>
              </button>
            </div>
          </div>

          {/* Option 4: Direct Print */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-amber-700" />
                <span>Cetak Lembar Modul / Simpan PDF Browser</span>
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Mencetak tata letak dokumen rapi tanpa elemen navigasi website.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                setTimeout(() => window.print(), 300);
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
            >
              Buka Dialog Cetak
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
