import React from 'react';
import { Sparkles, Menu, X, PlusCircle, Bookmark, Compass, UploadCloud, History } from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onGoHome: () => void;
  onOpenPresets: () => void;
  onOpenUploadModal?: () => void;
  onOpenSavedModal?: () => void;
  savedCount?: number;
  activeProjectTitle?: string;
  hasActiveProject: boolean;
  onNewProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onGoHome,
  onOpenPresets,
  onOpenUploadModal,
  onOpenSavedModal,
  savedCount = 0,
  activeProjectTitle,
  hasActiveProject,
  onNewProject,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Mobile menu trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl lg:hidden transition-colors"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-base sm:text-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 bg-clip-text text-transparent">
                    EduSmart
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-800 border border-purple-200">
                    AI Creator
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                  {hasActiveProject && activeProjectTitle
                    ? activeProjectTitle
                    : 'AI-powered Educational Media Creator'}
                </p>
              </div>
            </button>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2">
            {onOpenSavedModal && savedCount > 0 && (
              <button
                onClick={onOpenSavedModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                title="Buka riwayat proyek tersimpan"
              >
                <History className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Riwayat ({savedCount})</span>
                <span className="sm:hidden">{savedCount}</span>
              </button>
            )}

            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all hover:scale-[1.02]"
                title="Unggah file materi atau silabus untuk mengekstrak tema otomatis"
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden sm:inline">Upload Materi</span>
                <span className="sm:hidden">Upload</span>
              </button>
            )}

            <button
              onClick={onOpenPresets}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Contoh Proyek</span>
              <span className="sm:hidden">Contoh</span>
            </button>

            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Buat Baru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
