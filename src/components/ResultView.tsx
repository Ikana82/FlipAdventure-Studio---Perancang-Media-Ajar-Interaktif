import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Edit3,
  Download,
  Printer,
  UserCheck,
  Video,
  FileImage,
  Volume2,
  VolumeX,
  Film,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layout,
  Palette,
  FileSpreadsheet,
  FileText,
  Share2,
  Layers,
  Award,
} from 'lucide-react';
import { GeneratedProject, SceneItem } from '../types/edusmart';
import { sound } from '../utils/audio';

interface ResultViewProps {
  project: GeneratedProject;
  onEditInput: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  onShowToast: (message: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  project,
  onEditInput,
  onRegenerate,
  isRegenerating,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'flipbook' | 'canva' | 'quiz'>('storyboard');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [scenes, setScenes] = useState<SceneItem[]>(project.scenes || []);
  const [generatingImageIndex, setGeneratingImageIndex] = useState<number | null>(null);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});
  const [playingVoiceIndex, setPlayingVoiceIndex] = useState<number | null>(null);

  // Flipbook reader state
  const [flipbookPageIndex, setFlipbookPageIndex] = useState(0);
  const [flipbookTasks, setFlipbookTasks] = useState<Record<number, boolean>>({});

  // Robust clipboard copy with fallback
  const handleCopy = async (text: string, sectionKey: string, toastLabel = 'Berhasil disalin!') => {
    let copied = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      // fallback
    }

    if (!copied) {
      try {
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        copied = true;
      } catch (err) {
        console.warn('Copy fallback failed:', err);
      }
    }

    setCopiedSection(sectionKey);
    onShowToast(toastLabel);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Text-To-Speech audio player for narration
  const handleSpeakNarration = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onShowToast('Browser Anda tidak mendukung Web Speech Audio.');
      return;
    }

    if (playingVoiceIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingVoiceIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setPlayingVoiceIndex(null);
    };
    utterance.onerror = () => {
      setPlayingVoiceIndex(null);
    };

    setPlayingVoiceIndex(index);
    window.speechSynthesis.speak(utterance);
    onShowToast('Memutar suara narasi pembelajaran...');
  };

  // Direct AI image generator with vector illustration fallback
  const handleGenerateImage = async (sceneIndex: number, prompt: string, sceneTitle?: string) => {
    setGeneratingImageIndex(sceneIndex);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          title: sceneTitle || `Adegan ${sceneIndex + 1}`,
          aspectRatio: project.inputs.orientation || '16:9',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghasilkan gambar');
      }

      setScenes((prev) => {
        const next = [...prev];
        next[sceneIndex] = {
          ...next[sceneIndex],
          generatedImageUrl: data.imageUrl,
        };
        return next;
      });

      if (data.isFallback) {
        onShowToast('Ilustrasi vektor edukatif telah dibuat! Anda juga dapat menyalin prompt AI di bawah.');
      } else {
        onShowToast(`Ilustrasi Adegan ${sceneIndex + 1} berhasil dibuat!`);
      }
    } catch (err: any) {
      console.warn('Image generation notification:', err);
      onShowToast(err.message || 'Layanan ilustrasi selesai diproses.');
    } finally {
      setGeneratingImageIndex(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateFullMarkdown = () => {
    let md = `# ${project.title}\n`;
    md += `**Target Jenjang:** ${project.targetGrade} | **Tujuan:** ${project.learningObjective}\n\n`;

    if (project.overview) {
      md += `## Ringkasan Konsep\n${project.overview}\n\n`;
    }

    if (project.characterReference) {
      const cr = project.characterReference;
      md += `## Character Reference (${cr.name})\n`;
      md += `- Identitas: ${cr.identity}\n`;
      md += `- Penampilan: ${cr.appearance}\n`;
      md += `- Pakaian: ${cr.outfit}\n`;
      md += `- Ciri Tetap: ${cr.invariableFeatures}\n`;
      md += `- Prompt Snippet: \`${cr.fullPromptSnippet}\`\n\n`;
    }

    if (project.materialContent) {
      const mc = project.materialContent;
      md += `## Penjelasan Materi Pokok\n${mc.explanation}\n\n`;
      if (mc.dailyExamples?.length) {
        md += `### Contoh Nyata Sehari-hari\n`;
        mc.dailyExamples.forEach((ex) => (md += `- ${ex}\n`));
        md += `\n`;
      }
      if (mc.funActivities?.length) {
        md += `### Aktivitas Pembelajaran\n`;
        mc.funActivities.forEach((act) => (md += `- ${act}\n`));
        md += `\n`;
      }
    }

    if (scenes.length) {
      md += `## Rangkaian Adegan / Slide / Panel\n\n`;
      scenes.forEach((sc) => {
        md += `### Adegan ${sc.sceneNumber}: ${sc.sceneTitle || 'Eksplorasi'}\n`;
        md += `- **Deskripsi Visual:** ${sc.visualDescription}\n`;
        if (sc.narrationOrDialog) md += `- **Narasi/Dialog:** "${sc.narrationOrDialog}"\n`;
        md += `- **Prompt Text-to-Image:** \`${sc.textToImagePrompt}\`\n`;
        if (sc.imageToVideoPrompt) md += `- **Prompt Image-to-Video:** \`${sc.imageToVideoPrompt}\`\n`;
        if (sc.sfxAndBgm) md += `- **Audio SFX & BGM:** ${sc.sfxAndBgm}\n`;
        md += `\n`;
      });
    }

    if (project.quizQuestions?.length) {
      md += `## Kuis & Penilaian Pembelajaran\n\n`;
      project.quizQuestions.forEach((q) => {
        md += `### Soal ${q.questionNumber}: ${q.question}\n`;
        q.options.forEach((opt) => (md += `- ${opt.label}. ${opt.text}\n`));
        md += `- **Kunci Jawaban:** ${q.correctAnswer}\n`;
        md += `- **Penjelasan:** ${q.explanation}\n\n`;
      });
    }

    return md;
  };

  const handleDownloadMarkdown = () => {
    const md = generateFullMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('File Markdown berhasil diunduh!');
  };

  // Export Quiz to CSV (Quizizz / Heyzine format)
  const handleExportQuizCSV = () => {
    if (!project.quizQuestions?.length) {
      onShowToast('Tidak ada soal kuis yang tersedia untuk diekspor.');
      return;
    }
    let csv = 'No,Pertanyaan,Pilihan A,Pilihan B,Pilihan C,Pilihan D,Kunci Jawaban,Penjelasan\n';
    project.quizQuestions.forEach((q) => {
      const a = q.options.find((o) => o.label === 'A')?.text || '';
      const b = q.options.find((o) => o.label === 'B')?.text || '';
      const c = q.options.find((o) => o.label === 'C')?.text || '';
      const d = q.options.find((o) => o.label === 'D')?.text || '';
      csv += `"${q.questionNumber}","${q.question.replace(/"/g, '""')}","${a.replace(/"/g, '""')}","${b.replace(/"/g, '""')}","${c.replace(/"/g, '""')}","${d.replace(/"/g, '""')}","${q.correctAnswer}","${q.explanation.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kuis-${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('CSV Kuis berhasil diunduh (siap impor Quizizz/Heyzine)!');
  };

  // Flipbook navigation helpers
  const totalFlipPages = Math.max(scenes.length, 1);
  const currentFlipPage = scenes[flipbookPageIndex] || scenes[0];

  const handleFlipNext = () => {
    if (flipbookPageIndex < totalFlipPages - 1) {
      sound.playPageFlip();
      setFlipbookPageIndex((prev) => prev + 1);
    }
  };

  const handleFlipPrev = () => {
    if (flipbookPageIndex > 0) {
      sound.playPageFlip();
      setFlipbookPageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={onEditInput}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors border border-purple-200"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Input</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors border border-slate-200 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Memproses...' : 'Generate Ulang'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(generateFullMarkdown(), 'all', 'Semua konten hasil berhasil disalin!')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-600/20 transition-all hover:scale-[1.02]"
          >
            {copiedSection === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'all' ? 'Semua Tersalin!' : 'Salin Semua Hasil'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            title="Unduh File Markdown (.md)"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            title="Cetak atau Simpan PDF"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Project Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
            {project.inputs.mediaType || 'Media Pembelajaran'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-lavender-100 text-purple-900 border border-purple-200">
            Jenjang: {project.targetGrade}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
            Gaya: {project.inputs.visualStyle}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-slate-900 leading-tight">
          {project.title}
        </h1>

        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs sm:text-sm text-purple-950 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-0.5">Tujuan Pembelajaran:</strong>
            <p className="leading-relaxed">{project.learningObjective}</p>
          </div>
        </div>

        {project.overview && (
          <div className="pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="block text-slate-900 mb-1">Konsep / Naskah Pengantar:</strong>
            <p className="whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {project.overview}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Tabs for Viewing Options */}
      <div className="flex items-center gap-2 p-1.5 bg-purple-100/60 rounded-2xl border border-purple-200/80 overflow-x-auto scrollbar-none no-print">
        <button
          onClick={() => setActiveTab('storyboard')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'storyboard'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-purple-800 hover:bg-white/50'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Naskah & Storyboard</span>
        </button>

        <button
          onClick={() => setActiveTab('flipbook')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'flipbook'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-purple-800 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Simulasi Flipbook 3D</span>
        </button>

        <button
          onClick={() => setActiveTab('canva')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'canva'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-purple-800 hover:bg-white/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Kit Produksi Canva</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-purple-800 hover:bg-white/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Kuis Penilaian ({project.quizQuestions?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: STORYBOARD & SCENES VIEW */}
      {activeTab === 'storyboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Character Reference if available */}
          {project.characterReference && (
            <div className="bg-gradient-to-br from-purple-50/90 via-lavender-50/70 to-indigo-50/60 rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      Character Reference: {project.characterReference.name}
                    </h3>
                    <p className="text-xs text-purple-700">
                      Panduan visual untuk menjaga konsistensi karakter di semua adegan, komik, atau slide
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleCopy(
                      project.characterReference!.fullPromptSnippet,
                      'char-ref',
                      'Snippet karakter konsisten disalin!'
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors shadow-2xs self-start sm:self-auto"
                >
                  {copiedSection === 'char-ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Character Snippet</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Identitas & Peran:</span>
                  <strong className="text-slate-800">{project.characterReference.identity}</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Wajah & Penampilan:</span>
                  <strong className="text-slate-800">{project.characterReference.appearance}</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Pakaian & Aksesori:</span>
                  <strong className="text-slate-800">{project.characterReference.outfit}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <strong className="text-amber-900 block mb-0.5">Ciri Visual yang Tidak Boleh Berubah:</strong>
                <p>{project.characterReference.invariableFeatures}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Prompt Snippet Karakter (English):
                </span>
                <div className="font-mono text-[11px] bg-slate-900 text-purple-200 p-3 rounded-xl leading-relaxed break-words">
                  {project.characterReference.fullPromptSnippet}
                </div>
              </div>
            </div>
          )}

          {/* Learning Material Content Section */}
          {project.materialContent && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Materi Pembelajaran & Konsep Inti</span>
                </h3>
                <button
                  onClick={() =>
                    handleCopy(
                      project.materialContent!.explanation,
                      'mat-exp',
                      'Penjelasan materi disalin!'
                    )
                  }
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  {copiedSection === 'mat-exp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Salin Teks Materi</span>
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {project.materialContent.explanation}
              </div>

              {project.materialContent.dailyExamples?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Contoh Nyata dalam Kehidupan Sehari-hari:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.materialContent.dailyExamples.map((ex, i) => (
                      <div key={i} className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-slate-800 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {i + 1}
                        </span>
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.materialContent.funActivities?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Aktivitas Pembelajaran Kreatif:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.materialContent.funActivities.map((act, i) => (
                      <div key={i} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-800 flex items-start gap-2">
                        <span className="text-base shrink-0">🎯</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scenes / Storyboard Panels */}
          {scenes.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    Rangkaian Adegan & Prompt Visual ({scenes.length} Adegan)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Setiap adegan dilengkapi deskripsi visual, narasi audio, prompt Text-to-Image, dan prompt Image-to-Video
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {scenes.map((scene, idx) => (
                  <div
                    key={scene.sceneNumber || idx}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-5 transition-all hover:border-purple-200"
                  >
                    {/* Scene Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                          {scene.sceneNumber || idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-800 text-base">
                          {scene.sceneTitle || `Adegan ${scene.sceneNumber || idx + 1}`}
                        </h4>
                      </div>
                      {scene.durationSec && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Durasi: ±{scene.durationSec} Detik
                        </span>
                      )}
                    </div>

                    {/* Visual Description */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Deskripsi Visual:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                        {scene.visualDescription}
                      </p>
                    </div>

                    {/* Narration or Dialog with Audio Voice Playback Tool */}
                    {scene.narrationOrDialog && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>Narasi / Dialog / Suara:</span>
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Voice Playback Button */}
                            <button
                              onClick={() => handleSpeakNarration(scene.narrationOrDialog!, idx)}
                              className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                                playingVoiceIndex === idx
                                  ? 'bg-purple-600 text-white border-purple-600 animate-pulse'
                                  : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200'
                              }`}
                              title="Dengarkan narasi ini dengan suara pembicara"
                            >
                              {playingVoiceIndex === idx ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5" />
                                  <span>Hentikan Suara</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Putar Suara</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() =>
                                handleCopy(
                                  scene.narrationOrDialog!,
                                  `nar-${idx}`,
                                  `Narasi adegan ${idx + 1} disalin!`
                                )
                              }
                              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                            >
                              {copiedSection === `nar-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>Salin Narasi</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-purple-950 italic bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 leading-relaxed">
                          "{scene.narrationOrDialog}"
                        </p>
                      </div>
                    )}

                    {/* Generated Image Preview if available */}
                    {scene.generatedImageUrl && (
                      <div className="space-y-2 p-3 bg-purple-50/60 rounded-2xl border border-purple-200">
                        <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                          <span>Hasil Ilustrasi Edukasi Adegan {scene.sceneNumber}:</span>
                          <a
                            href={scene.generatedImageUrl}
                            download={`adegan-${scene.sceneNumber}.png`}
                            className="flex items-center gap-1 text-[11px] text-purple-700 hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh Gambar</span>
                          </a>
                        </div>
                        <div className="relative rounded-xl overflow-hidden shadow-md max-h-96 flex items-center justify-center bg-black/5">
                          <img
                            src={scene.generatedImageUrl}
                            alt={`Ilustrasi Adegan ${scene.sceneNumber}`}
                            className="w-full h-auto object-contain max-h-96 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    {/* Prompt Text-to-Image */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <FileImage className="w-3.5 h-3.5 text-purple-600" />
                          <span>Prompt Text-to-Image (Canva / Midjourney / DALL-E):</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleCopy(
                                scene.textToImagePrompt,
                                `img-prompt-${idx}`,
                                `Prompt gambar adegan ${idx + 1} disalin!`
                              )
                            }
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-200 transition-colors"
                          >
                            {copiedSection === `img-prompt-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>Salin Prompt</span>
                          </button>

                          {/* Direct AI Image Generation Button */}
                          <button
                            onClick={() => handleGenerateImage(idx, scene.textToImagePrompt, scene.sceneTitle)}
                            disabled={generatingImageIndex === idx}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-xs transition-colors disabled:opacity-50"
                          >
                            {generatingImageIndex === idx ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Membuat...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Generate Ilustrasi</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="font-mono text-[11px] bg-slate-900 text-purple-200 p-3.5 rounded-2xl leading-relaxed break-words border border-slate-800">
                        {scene.textToImagePrompt}
                      </div>
                    </div>

                    {/* Prompt Image-to-Video */}
                    {scene.imageToVideoPrompt && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Film className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Prompt Image-to-Video (Runway / Kling / Pika):</span>
                          </span>

                          <button
                            onClick={() =>
                              handleCopy(
                                scene.imageToVideoPrompt!,
                                `vid-prompt-${idx}`,
                                `Prompt video adegan ${idx + 1} disalin!`
                              )
                            }
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200 transition-colors"
                          >
                            {copiedSection === `vid-prompt-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>Salin Prompt Video</span>
                          </button>
                        </div>

                        <div className="font-mono text-[11px] bg-slate-900 text-cyan-200 p-3.5 rounded-2xl leading-relaxed break-words border border-slate-800">
                          {scene.imageToVideoPrompt}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VIRTUAL FLIPBOOK SIMULATOR */}
      {activeTab === 'flipbook' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span>Simulasi Flipbook Interaktif Digital</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pratinjau tampilan buku cerita digital yang dapat dibalik per halaman seperti di Heyzine / AnyFlip
              </p>
            </div>

            {/* Flip navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleFlipPrev}
                disabled={flipbookPageIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold disabled:opacity-30 transition-colors border border-purple-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Halaman Sebelumnya</span>
              </button>

              <span className="text-xs font-mono font-bold px-3 py-1.5 bg-purple-100 text-purple-900 rounded-xl">
                {flipbookPageIndex + 1} / {totalFlipPages}
              </span>

              <button
                onClick={handleFlipNext}
                disabled={flipbookPageIndex === totalFlipPages - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-30 transition-colors shadow-xs"
              >
                <span>Halaman Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Virtual Flipbook 2-Page Spread */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-slate-100 via-purple-50/50 to-indigo-50/40 p-4 sm:p-6 rounded-3xl border border-purple-200 shadow-inner">
            {/* Left Page: Visual Artwork & Prompt */}
            <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex flex-col justify-between space-y-4 min-h-[380px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Halaman {currentFlipPage?.sceneNumber || flipbookPageIndex + 1} Visual
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Format: {project.inputs.orientation || 'Landscape'}
                  </span>
                </div>

                {currentFlipPage?.generatedImageUrl ? (
                  <div className="rounded-xl overflow-hidden border border-purple-200 max-h-64 flex items-center justify-center bg-black/5">
                    <img
                      src={currentFlipPage.generatedImageUrl}
                      alt={currentFlipPage.sceneTitle || 'Ilustrasi'}
                      className="w-full h-auto object-contain max-h-64 rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl p-6 bg-purple-50/60 border-2 border-dashed border-purple-200 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <FileImage className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">Deskripsi Visual Halaman Ini:</p>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-xs leading-relaxed">
                        {currentFlipPage?.visualDescription}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleGenerateImage(
                          flipbookPageIndex,
                          currentFlipPage?.textToImagePrompt || '',
                          currentFlipPage?.sceneTitle
                        )
                      }
                      disabled={generatingImageIndex === flipbookPageIndex}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Buat Ilustrasi Halaman Ini</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Text-to-Image Prompt (Canva Magic Media):
                </span>
                <p className="font-mono text-[10px] text-purple-900 bg-purple-50 p-2.5 rounded-xl line-clamp-2">
                  {currentFlipPage?.textToImagePrompt}
                </p>
              </div>
            </div>

            {/* Right Page: Narrative & Interactive Task */}
            <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex flex-col justify-between space-y-4 min-h-[380px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    {currentFlipPage?.sceneTitle || `Materi Halaman ${flipbookPageIndex + 1}`}
                  </h4>
                  {currentFlipPage?.narrationOrDialog && (
                    <button
                      onClick={() => handleSpeakNarration(currentFlipPage.narrationOrDialog!, flipbookPageIndex)}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dengarkan</span>
                    </button>
                  )}
                </div>

                {currentFlipPage?.narrationOrDialog ? (
                  <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 text-xs sm:text-sm text-purple-950 italic leading-relaxed">
                    "{currentFlipPage.narrationOrDialog}"
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentFlipPage?.visualDescription}
                  </p>
                )}

                {/* Interactive Task / Challenge */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900">Aktivitas Siswa di Halaman Ini:</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    Diskusikan atau catat hal penting dari gambar ini bersama temanmu! Apakah kamu menemukan petunjuk baru?
                  </p>
                  <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!flipbookTasks[flipbookPageIndex]}
                      onChange={() => {
                        const next = !flipbookTasks[flipbookPageIndex];
                        setFlipbookTasks((prev) => ({ ...prev, [flipbookPageIndex]: next }));
                        if (next) sound.playCorrect();
                      }}
                      className="rounded border-amber-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Tandai Halaman Ini Selesai Dipelajari
                    </span>
                  </label>
                </div>
              </div>

              {/* Page Footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span>Modul: {project.title}</span>
                <span className="font-mono font-bold">Hal. {flipbookPageIndex + 1}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CANVA PRODUCTION KIT & PRINT READY ASSETS */}
      {activeTab === 'canva' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                <span>Kit Produksi Canva & Heyzine Flipbook</span>
              </h3>
              <p className="text-xs text-slate-500">
                Spesifikasi format cetak A4 300 DPI, rasio aspek, panduan layout Canva, dan prompt AI siap pakai
              </p>
            </div>

            <button
              onClick={() => {
                let text = `# Panduan Produksi Canva - ${project.title}\n\n`;
                scenes.forEach((sc, i) => {
                  text += `## Halaman ${i + 1}: ${sc.sceneTitle || ''}\n`;
                  text += `Prompt Image (A4 300 DPI): ${sc.textToImagePrompt}\n`;
                  if (sc.imageToVideoPrompt) text += `Prompt Video (Loop): ${sc.imageToVideoPrompt}\n`;
                  text += `\n`;
                });
                handleCopy(text, 'canva-kit', 'Semua prompt Canva berhasil disalin!');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Semua Prompt Canva</span>
            </button>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Dimensi Cetak A4:
              </span>
              <p className="font-bold text-sm text-slate-800">210 x 297 mm (Portrait)</p>
              <p className="text-[11px] text-slate-500">Rasio 1:1.41 (--ar 5:7), 300 DPI High-Resolution</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Dimensi Layar / Video:
              </span>
              <p className="font-bold text-sm text-slate-800">1920 x 1080 px (16:9)</p>
              <p className="text-[11px] text-slate-500">Cocok untuk YouTube Edukasi, Smartboard, & Presentasi</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Platform Flipbook:
              </span>
              <p className="font-bold text-sm text-slate-800">Heyzine / AnyFlip / FlipHTML5</p>
              <p className="text-[11px] text-slate-500">Ekspor PDF dari Canva lalu unggah untuk efek buku bolak-balik</p>
            </div>
          </div>

          {/* Prompt Sheet per Scene */}
          <div className="space-y-4 pt-2">
            <h4 className="font-heading font-bold text-base text-slate-800">
              Daftar Prompt AI Visual Canva & Animasi ({scenes.length} Halaman):
            </h4>

            {scenes.map((sc, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-900">
                    Halaman {sc.sceneNumber || i + 1}: {sc.sceneTitle || 'Materi'}
                  </span>
                  <button
                    onClick={() => handleCopy(sc.textToImagePrompt, `canva-${i}`, `Prompt halaman ${i + 1} disalin!`)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    {copiedSection === `canva-${i}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Salin Prompt Gambar</span>
                  </button>
                </div>

                <div className="font-mono text-[11px] bg-slate-900 text-purple-200 p-3 rounded-xl break-words">
                  {sc.textToImagePrompt}
                </div>

                {sc.imageToVideoPrompt && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-700 block mb-1">
                      Prompt Image-to-Video Looping (Kling/Runway):
                    </span>
                    <div className="font-mono text-[11px] bg-slate-900 text-cyan-200 p-3 rounded-xl break-words">
                      {sc.imageToVideoPrompt}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE QUIZ & ASSESSMENT */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Kuis & Evaluasi Pembelajaran ({project.quizQuestions?.length || 0} Soal)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pilihan ganda dengan kunci jawaban dan umpan balik edukatif ramah anak
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportQuizCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
                title="Ekspor CSV untuk impor ke Heyzine, Quizizz, atau Google Forms"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unduh CSV Kuis</span>
              </button>

              <button
                onClick={() => {
                  if (!project.quizQuestions?.length) return;
                  let txt = `KUIS EVALUASI: ${project.title}\n\n`;
                  project.quizQuestions.forEach((q) => {
                    txt += `${q.questionNumber}. ${q.question}\n`;
                    q.options.forEach((opt) => (txt += `   ${opt.label}. ${opt.text}\n`));
                    txt += `   Kunci: ${q.correctAnswer}\n`;
                    txt += `   Pembahasan: ${q.explanation}\n\n`;
                  });
                  handleCopy(txt, 'quiz-txt', 'Format teks kuis berhasil disalin!');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Bank Soal</span>
              </button>
            </div>
          </div>

          {project.quizQuestions && project.quizQuestions.length > 0 ? (
            <div className="space-y-5">
              {project.quizQuestions.map((q) => {
                const selected = userQuizAnswers[q.questionNumber];
                const isSubmitted = quizSubmitted[q.questionNumber];

                return (
                  <div key={q.questionNumber} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800">
                        Pertanyaan #{q.questionNumber}
                      </span>
                      {q.difficulty && (
                        <span className="text-slate-400 font-semibold">{q.difficulty}</span>
                      )}
                    </div>

                    <p className="font-bold text-slate-800 text-sm sm:text-base leading-relaxed">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => {
                        const isOptionSelected = selected === opt.label;
                        const isCorrect = q.correctAnswer === opt.label;

                        let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-purple-300';
                        if (isSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isOptionSelected && !isCorrect) {
                            btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                          }
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-purple-50 border-purple-500 text-purple-900 font-bold';
                        }

                        return (
                          <button
                            key={opt.label}
                            onClick={() => {
                              if (!isSubmitted) {
                                setUserQuizAnswers((prev) => ({ ...prev, [q.questionNumber]: opt.label }));
                              }
                            }}
                            className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {opt.label}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit / Feedback */}
                    {!isSubmitted ? (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            if (selected) {
                              setQuizSubmitted((prev) => ({ ...prev, [q.questionNumber]: true }));
                              if (selected === q.correctAnswer) {
                                sound.playCorrect();
                              } else {
                                sound.playWrong();
                              }
                            }
                          }}
                          disabled={!selected}
                          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-40 transition-colors"
                        >
                          Cek Jawaban
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`p-3 rounded-xl border text-xs leading-relaxed ${
                          selected === q.correctAnswer
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-300 text-amber-950'
                        }`}
                      >
                        <strong className="block mb-0.5">
                          {selected === q.correctAnswer ? 'Jawaban Benar! 🎉' : `Kunci Jawaban: ${q.correctAnswer}`}
                        </strong>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <HelpCircle className="w-10 h-10 text-purple-400 mx-auto" />
              <p className="text-xs text-slate-500">
                Belum ada pertanyaan kuis yang dibuat untuk proyek ini. Anda dapat membuat kuis khusus dengan memilih generator <strong>Quiz & Assessment Creator</strong>.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Production Notes */}
      {project.productionNotes && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-3">
          <h4 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Catatan Produksi & Rekomendasi untuk Pendidik</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            {project.productionNotes.recommendedBgm && (
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <strong className="text-purple-900 block mb-0.5">Rekomendasi BGM:</strong>
                <span>{project.productionNotes.recommendedBgm}</span>
              </div>
            )}
            {project.productionNotes.voiceoverTone && (
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <strong className="text-purple-900 block mb-0.5">Tone Voice-Over:</strong>
                <span>{project.productionNotes.voiceoverTone}</span>
              </div>
            )}
          </div>
          {project.productionNotes.tipsForEducator && (
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              <strong>Tips Penyampaian:</strong> {project.productionNotes.tipsForEducator}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
