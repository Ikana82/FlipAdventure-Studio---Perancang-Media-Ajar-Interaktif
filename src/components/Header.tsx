import React from 'react';
import { BookOpen, Sparkles, Map, HelpCircle, Palette, Download, Volume2, VolumeX, PlusCircle, Printer } from 'lucide-react';

interface HeaderProps {
  activeTab: 'flipbook' | 'mission' | 'quiz' | 'canva' | 'document';
  setActiveTab: (tab: 'flipbook' | 'mission' | 'quiz' | 'canva' | 'document') => void;
  onOpenGenerator: () => void;
  onOpenExport: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  currentTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGenerator,
  onOpenExport,
  soundEnabled,
  setSoundEnabled,
  currentTitle,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                  FlipAdventure Studio
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Media Ajar Gamifikasi
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[220px] sm:max-w-xs md:max-w-md font-medium">
                {currentTitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('flipbook')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'flipbook'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Simulasi Flipbook</span>
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'mission'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Peta Misi</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Kuis Evaluasi</span>
            </button>
            <button
              onClick={() => setActiveTab('canva')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'canva'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Kit Desain Canva</span>
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'document'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Format Lengkap</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Efek Suara'}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={handlePrint}
              title="Cetak Dokumen Modul"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors hidden sm:flex"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor</span>
            </button>

            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Rancang Modul Baru</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('flipbook')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'flipbook' ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Flipbook
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'mission' ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Peta Misi
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'quiz' ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Kuis Evaluasi
          </button>
          <button
            onClick={() => setActiveTab('canva')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'canva' ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Kit Canva
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'document' ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Draf Lengkap
          </button>
        </div>
      </div>
    </header>
  );
};
