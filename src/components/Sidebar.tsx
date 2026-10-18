import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  LayoutGrid,
  Image as ImageIcon,
  Film,
  Video,
  Sparkles,
  CheckCircle2,
  Presentation,
  Compass,
  History,
  X,
  UploadCloud,
} from 'lucide-react';
import { GeneratorType } from '../types/edusmart';
import { GENERATORS } from '../data/generators';

interface SidebarProps {
  currentView: 'dashboard' | 'form' | 'result' | 'presets';
  selectedGenerator: GeneratorType;
  onSelectGenerator: (type: GeneratorType) => void;
  onSelectDashboard: () => void;
  onSelectPresets: () => void;
  onOpenUploadModal?: () => void;
  onOpenSavedModal?: () => void;
  savedCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-4 h-4" />,
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  Image: <ImageIcon className="w-4 h-4" />,
  Film: <Film className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  Presentation: <Presentation className="w-4 h-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedGenerator,
  onSelectGenerator,
  onSelectDashboard,
  onSelectPresets,
  onOpenUploadModal,
  onOpenSavedModal,
  savedCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full py-5 px-3 bg-white border-r border-purple-100">
      {/* Mobile close header */}
      <div className="flex items-center justify-between px-3 pb-4 mb-2 lg:hidden border-b border-purple-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
            ES
          </div>
          <span className="font-heading font-bold text-slate-800 text-sm">EduSmart Creator</span>
        </div>
        <button onClick={onCloseMobile} className="p-1 rounded-lg text-slate-500 hover:bg-purple-50">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Item: Dashboard */}
      <div className="space-y-1.5 mb-6">
        <button
          onClick={() => {
            onSelectDashboard();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
            currentView === 'dashboard'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/80'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard Utama</span>
        </button>

        {onOpenUploadModal && (
          <button
            onClick={() => {
              onOpenUploadModal();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left bg-amber-50 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 group"
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="w-4 h-4 shrink-0 text-amber-700 group-hover:scale-110 transition-transform" />
              <span>Upload File Materi</span>
            </div>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900">
              AI
            </span>
          </button>
        )}

        <button
          onClick={() => {
            onSelectPresets();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
            currentView === 'presets'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/80'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0 text-cyan-600" />
          <span>Contoh Proyek Edukasi</span>
        </button>
      </div>

      {/* 8 Generator categories */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
        <p className="px-3.5 text-[10px] font-extrabold tracking-wider text-purple-900/60 uppercase mb-2">
          Pilihan Generator AI
        </p>
        {GENERATORS.map((gen) => {
          const isActive = (currentView === 'form' || currentView === 'result') && selectedGenerator === gen.id;
          return (
            <button
              key={gen.id}
              onClick={() => {
                onSelectGenerator(gen.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left group ${
                isActive
                  ? 'bg-purple-100/90 text-purple-900 font-bold border border-purple-200'
                  : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50/60'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isActive ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-200/60'
                }`}
              >
                {ICON_MAP[gen.iconName] || <Sparkles className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <span className="block truncate leading-tight">{gen.title}</span>
                <span className="text-[10px] text-slate-400 font-normal truncate block">{gen.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 mt-2 border-t border-purple-100">
        <button
          onClick={() => {
            if (onOpenSavedModal) {
              onOpenSavedModal();
              onCloseMobile();
            }
          }}
          className="w-full text-left p-3 rounded-2xl bg-gradient-to-br from-purple-50 via-lavender-50 to-indigo-50/60 hover:from-purple-100 hover:to-indigo-100/80 border border-purple-100 hover:border-purple-300 text-xs transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-purple-900 text-[11px] group-hover:text-purple-700">
              Riwayat Proyek
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-purple-200 text-purple-800 text-[10px] font-extrabold group-hover:bg-purple-600 group-hover:text-white transition-colors">
              {savedCount}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Klik untuk melihat & membuka proyek yang telah dibuat.
          </p>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on lg+) */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer (visible on <lg) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
