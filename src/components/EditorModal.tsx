import React, { useState } from 'react';
import { X, Sparkles, Save, Wand2, Loader2, FileImage, Video, Layers } from 'lucide-react';
import { FlipbookPage } from '../types/flipbook';

interface EditorModalProps {
  page: FlipbookPage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPage: FlipbookPage) => void;
  targetGrade?: string;
  guideCharacterName?: string;
}

const AI_POLISH_PRESETS = [
  'Sederhanakan narasi teks agar lebih mudah dipahami siswa',
  'Buat narasi lebih seru, dramatis, dan memancing rasa penasaran',
  'Perjelas prompt video looping (Runway/Kling) agar lebih halus',
  'Perinci panduan tata letak elemen Canva dan frame video',
];

export const EditorModal: React.FC<EditorModalProps> = ({
  page,
  isOpen,
  onClose,
  onSave,
  targetGrade,
  guideCharacterName,
}) => {
  if (!isOpen || !page) return null;

  const [formData, setFormData] = useState<FlipbookPage>({ ...page });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAiRefine = async (instruction: string) => {
    if (!instruction.trim()) return;
    setIsAiLoading(true);
    setAiError('');

    try {
      const res = await fetch('/api/refine-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: formData,
          instruction,
          targetGrade,
          guideCharacterName,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi asisten AI.');
      }

      const refined = await res.json();
      setFormData((prev) => ({
        ...prev,
        ...refined,
        pageNumber: prev.pageNumber,
      }));
      setAiPrompt('');
    } catch (err: any) {
      setAiError(err?.message || 'Terjadi kesalahan saat memoles halaman.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
              {formData.pageNumber}
            </span>
            <div>
              <h3 className="text-base font-bold font-heading">Edit Halaman {formData.pageNumber}</h3>
              <p className="text-xs text-slate-400">Sesuaikan teks materi, prompt gambar A4, video looping, dan tata letak Canva</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* AI Polisher Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Asisten AI Poles Halaman:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {AI_POLISH_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleAiRefine(preset)}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 bg-white hover:bg-orange-100 border border-orange-200 text-orange-950 text-[11px] rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Atau ketik instruksi khusus untuk AI (misal: 'buat narasi lebih ceria', 'tambahkan detail video')..."
                className="flex-1 px-3 py-1.5 bg-white border border-orange-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => handleAiRefine(aiPrompt)}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shrink-0"
              >
                {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>Poles</span>
              </button>
            </div>

            {aiError && <p className="text-xs text-rose-600">{aiError}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Halaman:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
            />
          </div>

          {/* 1. Story & Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">1. Teks Materi & Narasi Siap Tempel:</label>
            <textarea
              rows={4}
              value={formData.storyAndContent}
              onChange={(e) => setFormData({ ...formData, storyAndContent: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* 2. Text-to-Image Prompt (A4 Portrait 300 DPI) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileImage className="w-3.5 h-3.5 text-pink-600" />
              <span>2. Prompt Text-to-Image (A4 Portrait 300 DPI):</span>
            </label>
            <textarea
              rows={3}
              value={formData.imagePrompt}
              onChange={(e) => setFormData({ ...formData, imagePrompt: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code leading-relaxed"
            />
          </div>

          {/* 3. Image-to-Video Looping Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-cyan-600" />
              <span>3. Prompt Image-to-Video Looping (Runway/Kling/Pika):</span>
            </label>
            <textarea
              rows={2}
              value={formData.videoPrompt}
              onChange={(e) => setFormData({ ...formData, videoPrompt: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code leading-relaxed"
            />
          </div>

          {/* 4. Canva Layout & Interactivity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>4. Panduan Layout Canva & Interaktivitas:</span>
            </label>
            <textarea
              rows={2}
              value={formData.canvaLayoutAndInteractivity}
              onChange={(e) => setFormData({ ...formData, canvaLayoutAndInteractivity: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Interactive Task */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tugas / Aktivitas Interaktif Siswa:
            </label>
            <input
              type="text"
              value={formData.interactiveTask || ''}
              onChange={(e) => setFormData({ ...formData, interactiveTask: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
