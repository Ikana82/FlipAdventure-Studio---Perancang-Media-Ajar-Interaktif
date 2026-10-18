import React from 'react';
import {
  X,
  History,
  FolderOpen,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  BookOpen,
  Download,
  Sparkles,
} from 'lucide-react';
import { GeneratedProject } from '../types/edusmart';

interface SavedProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProjects: GeneratedProject[];
  onSelectProject: (project: GeneratedProject) => void;
  onDeleteProject: (projectId: string) => void;
}

export const SavedProjectsModal: React.FC<SavedProjectsModalProps> = ({
  isOpen,
  onClose,
  savedProjects,
  onSelectProject,
  onDeleteProject,
}) => {
  if (!isOpen) return null;

  const handleDownloadMarkdown = (project: GeneratedProject, e: React.MouseEvent) => {
    e.stopPropagation();
    let md = `# ${project.title}\n`;
    md += `**Target Jenjang:** ${project.targetGrade} | **Tujuan:** ${project.learningObjective}\n\n`;

    if (project.overview) {
      md += `## Ringkasan Konsep\n${project.overview}\n\n`;
    }

    if (project.materialContent) {
      md += `## Penjelasan Materi Pokok\n${project.materialContent.explanation}\n\n`;
    }

    if (project.scenes?.length) {
      md += `## Rangkaian Adegan / Panel\n\n`;
      project.scenes.forEach((sc) => {
        md += `### Adegan ${sc.sceneNumber}: ${sc.sceneTitle || ''}\n`;
        md += `- **Deskripsi Visual:** ${sc.visualDescription}\n`;
        if (sc.narrationOrDialog) md += `- **Narasi/Dialog:** "${sc.narrationOrDialog}"\n`;
        md += `- **Prompt Image:** \`${sc.textToImagePrompt}\`\n\n`;
      });
    }

    if (project.quizQuestions?.length) {
      md += `## Kuis & Evaluasi\n\n`;
      project.quizQuestions.forEach((q) => {
        md += `### Soal ${q.questionNumber}: ${q.question}\n`;
        q.options.forEach((opt) => (md += `- ${opt.label}. ${opt.text}\n`));
        md += `- **Kunci:** ${q.correctAnswer}\n\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <History className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading">Riwayat Proyek Pembelajaran</h3>
              <p className="text-xs text-purple-200">
                {savedProjects.length} proyek tersimpan di peramban Anda
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

        {/* List of projects */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 scrollbar-thin">
          {savedProjects.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Belum Ada Proyek yang Tersimpan</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Buat media pembelajaran baru menggunakan salah satu generator atau upload materi Anda, dan hasilnya akan tersimpan otomatis di sini.
              </p>
            </div>
          ) : (
            savedProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProject(p);
                  onClose();
                }}
                className="p-5 rounded-2xl bg-purple-50/40 hover:bg-purple-50/90 border border-purple-100 hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 max-w-lg">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 uppercase">
                      {p.generatorType}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{p.createdAt}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {p.targetGrade}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {p.overview || p.learningObjective}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                    {p.scenes?.length ? (
                      <span>🎬 {p.scenes.length} Adegan/Slide</span>
                    ) : null}
                    {p.quizQuestions?.length ? (
                      <span>📝 {p.quizQuestions.length} Soal Kuis</span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDownloadMarkdown(p, e)}
                    title="Unduh Markdown"
                    className="p-2 text-slate-400 hover:text-purple-700 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-purple-200"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus proyek "${p.title}" dari riwayat?`)) {
                        onDeleteProject(p.id);
                      }
                    }}
                    title="Hapus Proyek"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectProject(p);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform group-hover:scale-105"
                  >
                    <span>Buka</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
