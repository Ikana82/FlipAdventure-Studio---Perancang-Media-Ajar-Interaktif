import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { GeneratorForm } from './components/GeneratorForm';
import { ResultView } from './components/ResultView';
import { PresetsModal } from './components/PresetsModal';
import { UploadMaterialModal } from './components/UploadMaterialModal';
import { SavedProjectsModal } from './components/SavedProjectsModal';
import { FormDataState, GeneratedProject, GeneratorType, PresetProject } from './types/edusmart';
import { PRESET_PROJECTS } from './data/generators';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const INITIAL_FORM_DATA: FormDataState = {
  topic: '',
  contentExplanation: '',
  targetGrade: 'SD Kelas 3–4',
  learningObjective: '',
  mediaType: 'Video Animasi Pembelajaran',
  visualStyle: 'Cute Cartoon',
  language: 'Bahasa Indonesia',
  orientation: 'Landscape 16:9',
  sceneCount: 4,
  characterType: 'Guru atau pendamping belajar.',
  customCharacterName: '',
  customCharacterDesc: '',
  additionalInstructions: '',
};

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'form' | 'result' | 'presets'>('dashboard');
  const [selectedGenerator, setSelectedGenerator] = useState<GeneratorType>('video');
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_DATA);
  const [currentProject, setCurrentProject] = useState<GeneratedProject | null>(null);
  const [savedProjects, setSavedProjects] = useState<GeneratedProject[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Load saved projects from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('edusmart_projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProjects(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage when savedProjects change
  useEffect(() => {
    try {
      localStorage.setItem('edusmart_projects', JSON.stringify(savedProjects));
    } catch {
      // ignore
    }
  }, [savedProjects]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartGenerator = (type: GeneratorType) => {
    setSelectedGenerator(type);
    let defaultMedia = 'Video Animasi Pembelajaran';
    if (type === 'comic') defaultMedia = 'Komik Edukasi';
    else if (type === 'presentation') defaultMedia = 'Presentasi';
    else if (type === 'illustration') defaultMedia = 'Ilustrasi Edukasi';
    else if (type === 'quiz') defaultMedia = 'Media Pembelajaran Interaktif';

    setFormData((prev) => ({
      ...prev,
      mediaType: defaultMedia,
    }));
    setCurrentView('form');
  };

  const handleLoadPreset = (preset: PresetProject) => {
    setSelectedGenerator(preset.generatorType);
    setFormData(preset.formData);
    setCurrentView('form');
    showToast(`Contoh "${preset.title}" dimuat ke formulir!`);
  };

  const handleApplyMaterial = (data: {
    topic: string;
    contentExplanation: string;
    targetGrade: string;
    learningObjective: string;
    mediaType?: string;
    generatorType: GeneratorType;
    fileName?: string;
    fileSize?: number;
  }) => {
    setSelectedGenerator(data.generatorType);
    setFormData((prev) => ({
      ...prev,
      topic: data.topic,
      contentExplanation: data.contentExplanation,
      targetGrade: data.targetGrade,
      learningObjective: data.learningObjective,
      mediaType: data.mediaType || prev.mediaType,
      uploadedFileName: data.fileName,
      uploadedFileSize: data.fileSize,
    }));
    setCurrentView('form');
    showToast(`Materi "${data.topic}" berhasil diekstrak dan dimuat!`);
  };

  const handleDirectGenerate = async (data: {
    topic: string;
    contentExplanation: string;
    targetGrade: string;
    learningObjective: string;
    mediaType?: string;
    generatorType: GeneratorType;
    fileName?: string;
    fileSize?: number;
  }) => {
    setSelectedGenerator(data.generatorType);
    const updatedForm: FormDataState = {
      ...formData,
      topic: data.topic,
      contentExplanation: data.contentExplanation,
      targetGrade: data.targetGrade,
      learningObjective: data.learningObjective,
      mediaType: data.mediaType || formData.mediaType,
      uploadedFileName: data.fileName,
      uploadedFileSize: data.fileSize,
    };
    setFormData(updatedForm);
    await handleSubmitForm(updatedForm);
  };

  const handleDeleteProject = (projectId: string) => {
    setSavedProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setCurrentView('dashboard');
    }
    showToast('Proyek berhasil dihapus dari riwayat.');
  };

  const handleSubmitForm = async (inputData: FormDataState) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generatorType: selectedGenerator,
          ...inputData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses generasi media.');
      }

      const newProject: GeneratedProject = {
        id: `project-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        generatorType: selectedGenerator,
        inputs: inputData,
        title: data.title || inputData.topic,
        targetGrade: data.targetGrade || inputData.targetGrade,
        learningObjective: data.learningObjective || inputData.learningObjective,
        overview: data.overview,
        characterReference: data.characterReference,
        materialContent: data.materialContent,
        scenes: data.scenes || [],
        quizQuestions: data.quizQuestions || [],
        productionNotes: data.productionNotes,
      };

      setCurrentProject(newProject);
      setSavedProjects((prev) => [newProject, ...prev]);
      setCurrentView('result');
      showToast('Media pembelajaran berhasil dirancang dengan AI!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Terjadi gangguan saat membuat konten. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navbar */}
      <Navbar
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onGoHome={() => setCurrentView('dashboard')}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        savedCount={savedProjects.length}
        activeProjectTitle={currentProject?.title}
        hasActiveProject={!!currentProject}
        onNewProject={() => {
          setFormData(INITIAL_FORM_DATA);
          setCurrentView('dashboard');
        }}
      />

      {/* App Body: Sidebar + Main Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentView={currentView}
          selectedGenerator={selectedGenerator}
          onSelectGenerator={handleStartGenerator}
          onSelectDashboard={() => setCurrentView('dashboard')}
          onSelectPresets={() => setIsPresetsModalOpen(true)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onOpenSavedModal={() => setIsSavedModalOpen(true)}
          savedCount={savedProjects.length}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 overflow-x-hidden">
          {currentView === 'dashboard' && (
            <DashboardView
              onStartGenerator={handleStartGenerator}
              onLoadPreset={handleLoadPreset}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
            />
          )}

          {currentView === 'form' && (
            <GeneratorForm
              generatorType={selectedGenerator}
              formData={formData}
              onChangeFormData={setFormData}
              onSubmit={handleSubmitForm}
              onBack={() => setCurrentView('dashboard')}
              isGenerating={isGenerating}
            />
          )}

          {currentView === 'result' && currentProject && (
            <ResultView
              project={currentProject}
              onEditInput={() => setCurrentView('form')}
              onRegenerate={() => handleSubmitForm(formData)}
              isRegenerating={isGenerating}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Presets Modal */}
      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onSelectPreset={handleLoadPreset}
      />

      {/* Upload Material File Modal */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onApplyMaterial={handleApplyMaterial}
        onDirectGenerate={handleDirectGenerate}
      />

      {/* Saved Projects Modal */}
      <SavedProjectsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedProjects={savedProjects}
        onSelectProject={(project) => {
          setCurrentProject(project);
          setCurrentView('result');
        }}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
}
