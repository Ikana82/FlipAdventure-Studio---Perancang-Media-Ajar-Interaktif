import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Eye,
  Edit3,
  Layers,
  Lightbulb,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Bookmark,
  ShieldCheck,
  HelpCircle,
  Video,
  Play,
  FileImage,
} from 'lucide-react';
import { FlipbookModule, FlipbookPage } from '../types/flipbook';
import { sound } from '../utils/audio';

interface FlipbookViewerProps {
  module: FlipbookModule;
  soundEnabled: boolean;
  onEditPage: (page: FlipbookPage) => void;
  onOpenQuiz: () => void;
}

export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({
  module,
  soundEnabled,
  onEditPage,
  onOpenQuiz,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'student' | 'designer'>('student');
  const [showClue, setShowClue] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const [copiedType, setCopiedType] = useState<'image' | 'video' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingVideoMock, setIsPlayingVideoMock] = useState(true);

  const totalPages = module.pages.length;
  const currentPage = module.pages[currentPageIndex] || module.pages[0];

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      if (soundEnabled) sound.playPageFlip();
      setCurrentPageIndex((prev) => prev - 1);
      setShowClue(false);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      if (soundEnabled) sound.playPageFlip();
      setCurrentPageIndex((prev) => prev + 1);
      setShowClue(false);
    }
  };

  const toggleTaskComplete = (pageNumber: number) => {
    const isNowDone = !completedTasks[pageNumber];
    setCompletedTasks((prev) => ({ ...prev, [pageNumber]: isNowDone }));
    if (isNowDone && soundEnabled) {
      sound.playCorrect();
    }
  };

  const handleCopyText = (text: string, type: 'image' | 'video') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalPages) * 100);

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-4 sm:p-6 overflow-y-auto' : ''}`}>
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Progress & Chapter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
              {currentPage.pageNumber}/{totalPages}
            </span>
            <div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{currentPage.title}</p>
              {currentPage.syntaxPhase && (
                <p className="text-[11px] text-orange-600 font-semibold flex items-center gap-1">
                  <Bookmark className="w-3 h-3" />
                  <span>Sintaks: {currentPage.syntaxPhase}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* View mode toggle (Student vs Designer) */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold border border-slate-200">
            <button
              onClick={() => setViewMode('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'student'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simulasi Siswa</span>
            </button>
            <button
              onClick={() => setViewMode('designer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'designer'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Panduan Canva A4 & AI</span>
            </button>
          </div>

          <button
            onClick={() => onEditPage(currentPage)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            title="Edit teks / AI refine halaman ini"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Halaman</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white sm:text-slate-800" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Gamification Quest Progress Bar */}
      <div className="bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-emerald-500/10 p-2.5 rounded-xl border border-pink-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          <span className="font-semibold text-slate-700">Misi Halaman Terpecahkan:</span>
          <span className="font-bold text-orange-600">
            {completedCount} dari {totalPages} Pos
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 sm:w-44 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-bold text-emerald-600">{progressPercent}%</span>
        </div>
      </div>

      {/* Interactive 3D Flipbook Container */}
      <div className="relative perspective-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl book-shadow border border-slate-200 overflow-hidden min-h-[540px]">
          {/* LEFT PAGE: AI Visual Prompt (A4 300 DPI) & Looping Video Generator */}
          <div className="relative p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-gradient-to-br from-pink-50/30 via-cyan-50/20 to-slate-50 flex flex-col justify-between book-page-shadow">
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-700 bg-pink-100 px-2.5 py-1 rounded-full">
                  Hal. {currentPage.pageNumber} &mdash; Aset Visual & Video AI
                </span>
                <span className="text-[11px] font-mono-code font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                  A4 Portrait • 300 DPI
                </span>
              </div>

              {/* Guide Character Speech Card */}
              <div className="flex items-start gap-3 p-3.5 bg-white/95 rounded-2xl border border-pink-200/80 shadow-xs mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-400 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-xs">
                  {module.concept.guideCharacter.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">
                      {module.concept.guideCharacter.name}
                    </span>
                    <span className="text-[10px] text-pink-600 font-semibold bg-pink-50 px-1.5 py-0.5 rounded-sm">
                      Pemandu Misi
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed italic">
                    "{module.concept.guideCharacter.catchphrase || module.concept.guideCharacter.description}"
                  </p>
                </div>
              </div>

              {/* SECTION: 2. Text-to-Image Prompt (A4 Portrait 300 DPI) */}
              <div className="space-y-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 text-xs shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono-code text-[11px] text-pink-300 font-bold flex items-center gap-1.5">
                      <FileImage className="w-3.5 h-3.5 text-pink-400" />
                      2. Prompt Text-to-Image (A4 300 DPI):
                    </span>
                    <button
                      onClick={() => handleCopyText(currentPage.imagePrompt, 'image')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-pink-300 transition-colors"
                    >
                      {copiedType === 'image' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedType === 'image' ? 'Tersalin!' : 'Salin Prompt A4'}</span>
                    </button>
                  </div>
                  <p className="font-mono-code text-[11px] text-slate-300 leading-relaxed break-words bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    {currentPage.imagePrompt}
                  </p>
                </div>

                {/* SECTION: 3. Video Generation Prompt (Image-to-Video Looping Runway/Kling) */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 text-xs shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono-code text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                      3. Prompt Video Looping (Kling/Runway/Pika):
                    </span>
                    <button
                      onClick={() => handleCopyText(currentPage.videoPrompt, 'video')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-300 transition-colors"
                    >
                      {copiedType === 'video' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedType === 'video' ? 'Tersalin!' : 'Salin Video AI'}</span>
                    </button>
                  </div>
                  <p className="font-mono-code text-[11px] text-slate-300 leading-relaxed break-words bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    {currentPage.videoPrompt}
                  </p>
                </div>

                {/* SECTION: 4. Panduan Layout Canva & Interaktivitas */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>4. Panduan Layout Canva & Interaktivitas:</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentPage.canvaLayoutAndInteractivity}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom info for page */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-[11px] truncate max-w-[200px]">
                {module.concept.adventureTitle}
              </span>
              <span className="font-mono-code text-[11px]">Hal. {currentPage.pageNumber}</span>
            </div>
          </div>

          {/* RIGHT PAGE: 1. Story & Content + Interactive Task */}
          <div className="relative p-6 sm:p-8 bg-white flex flex-col justify-between book-page-shadow">
            <div>
              {/* Page Title & Syntax Tag */}
              <div className="mb-4">
                <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 mb-2">
                  {currentPage.syntaxPhase || 'Eksplorasi Materi'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 leading-snug">
                  {currentPage.title}
                </h3>
              </div>

              {/* 1. Teks Materi & Narasi */}
              <div className="prose prose-sm max-w-none mb-5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>1. Teks Materi & Narasi Siap Tempel:</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs">
                  {currentPage.storyAndContent}
                </div>
              </div>

              {/* Interactive Student Task & Detective Challenge */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  completedTasks[currentPage.pageNumber]
                    ? 'bg-emerald-50/90 border-emerald-300'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Tugas / Aktivitas Interaktif:
                    </h5>
                  </div>
                  <button
                    onClick={() => toggleTaskComplete(currentPage.pageNumber)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      completedTasks[currentPage.pageNumber]
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedTasks[currentPage.pageNumber] ? 'Misi Selesai!' : 'Tandai Selesai'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentPage.interactiveTask}
                </p>

                {/* Secret Clue button if available */}
                {currentPage.interactiveClue && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60">
                    {!showClue ? (
                      <button
                        onClick={() => {
                          setShowClue(true);
                          if (soundEnabled) sound.playBadgeUnlock();
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/80 hover:bg-amber-200/80 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>Buka Petunjuk Detektif Rahasia 💡</span>
                      </button>
                    ) : (
                      <div className="p-3 bg-amber-100/90 rounded-xl border border-amber-300/80 text-xs text-amber-950 animate-in fade-in">
                        <div className="flex items-center gap-1 font-bold text-amber-900 mb-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                          <span>Petunjuk Rahasia Terungkap:</span>
                        </div>
                        <p>{currentPage.interactiveClue}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Page Navigation Controls */}
            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <span className="text-xs font-semibold text-slate-500">
                {currentPageIndex + 1} / {totalPages}
              </span>

              {currentPageIndex === totalPages - 1 ? (
                <button
                  onClick={onOpenQuiz}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Kuis Evaluasi!</span>
                </button>
              ) : (
                <button
                  onClick={handleNextPage}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Thumbnail Strip */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-thin">
        {module.pages.map((p, idx) => (
          <button
            key={p.pageNumber}
            onClick={() => {
              if (soundEnabled) sound.playPageFlip();
              setCurrentPageIndex(idx);
              setShowClue(false);
            }}
            className={`flex-shrink-0 w-24 sm:w-28 p-2 rounded-xl border text-left transition-all ${
              currentPageIndex === idx
                ? 'border-orange-500 bg-orange-50 shadow-sm ring-2 ring-orange-400/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-700">Hal. {p.pageNumber}</span>
              {completedTasks[p.pageNumber] && (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              )}
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1 leading-tight">{p.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
