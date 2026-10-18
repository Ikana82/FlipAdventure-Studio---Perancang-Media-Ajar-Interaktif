export interface GuideCharacter {
  name: string;
  speciesOrRole?: string;
  description: string;
  catchphrase?: string;
}

export interface MissionPost {
  stepNumber: number;
  postName: string;
  syntaxStage: string;
  briefObjective: string;
  badgeName: string;
}

export interface AdventureConcept {
  adventureTitle: string;
  worldTheme: string;
  guideCharacter: GuideCharacter;
  paletteColors?: string[];
  missionMap: MissionPost[];
}

export interface FlipbookPage {
  pageNumber: number;
  title: string;
  syntaxPhase?: string;
  storyAndContent: string; // 1. Teks Materi & Narasi
  imagePrompt: string; // 2. Prompt Text-to-Image (A4 Portrait 300 DPI, flat vector 2D, pastel, clean background, --no text)
  videoPrompt: string; // 3. Prompt Image-to-Video (Kling/Runway/Pika natural looping)
  canvaLayoutAndInteractivity: string; // 4. Panduan Layout Canva & Interaktivitas
  interactiveTask?: string;
  taskType?: string;
  interactiveClue?: string;
}

export interface QuizOption {
  label: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface QuizQuestion {
  questionNumber: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  feedback: string;
}

export interface FlipbookModule {
  id: string;
  metadata: {
    topic: string;
    gradeLevel: string;
    learningModel: string;
    theme: string;
    summaryContent?: string;
    createdAt: string;
  };
  concept: AdventureConcept;
  pages: FlipbookPage[];
  quiz: QuizQuestion[];
}

export interface GenerationInput {
  topic: string; // 1. Topik/Judul Media
  gradeLevel: string; // 2. Target Sasaran/Kelas
  learningModel: string; // 3. Model/Pendekatan Pembelajaran
  summaryContent?: string; // 4. Materi Pokok/Ringkasan Isi (teks materi, silabus, atau poin penting)
  pageCount: number; // 5. Jumlah Halaman yang Diinginkan
  theme?: string;
  guideCharacter?: string;
  quizCount?: number;
  tone?: string;
  specialInstructions?: string;
}
