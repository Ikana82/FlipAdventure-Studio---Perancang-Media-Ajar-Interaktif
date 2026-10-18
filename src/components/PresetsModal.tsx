import React from 'react';
import { X, Compass, Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import { PresetProject } from '../types/edusmart';
import { PRESET_PROJECTS } from '../data/generators';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetProject) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Compass className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading">Contoh Proyek Edukasi</h3>
              <p className="text-xs text-purple-200">
                Pilih topik contoh untuk memuat seluruh konfigurasi materi ke formulir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of presets */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {PRESET_PROJECTS.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-2xl bg-purple-50/40 hover:bg-purple-50 border border-purple-100 hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900">
                    {preset.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Target: {preset.targetGrade}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {preset.formData.mediaType}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{preset.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{preset.description}</p>
              </div>

              <button
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                <span>Muat ke Formulir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
