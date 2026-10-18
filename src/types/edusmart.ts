export type GeneratorType =
  | 'material'
  | 'storyboard'
  | 'illustration'
  | 'animation'
  | 'video'
  | 'comic'
  | 'quiz'
  | 'presentation';

export interface GeneratorMeta {
  id: GeneratorType;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  description: string;
  outputHighlights: string[];
}

export interface CharacterReference {
  name: string;
  identity: string;
  visualAge: string;
  appearance: string;
  outfit: string;
  invariableFeatures: string;
  fullPromptSnippet: string;
}

export interface SceneItem {
  sceneNumber: number;
  sceneTitle?: string;
  visualDescription: string;
  narrationOrDialog?: string;
  screenText?: string;
  sfxAndBgm?: string;
  transition?: string;
  durationSec?: number;
  textToImagePrompt: string;
  negativePrompt?: string;
  imageToVideoPrompt?: string;
  generatedImageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface QuizOption {
  label: string; // A, B, C, D
  text: string;
}

export interface QuizQuestion {
  questionNumber: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  difficulty?: string;
}

export interface MaterialContent {
  explanation: string;
  dailyExamples: string[];
  funActivities: string[];
  evaluationQuestions: string[];
}

export interface ProductionNotes {
  recommendedBgm?: string;
  voiceoverTone?: string;
  tipsForEducator?: string;
}

export interface GeneratedProject {
  id: string;
  createdAt: string;
  generatorType: GeneratorType;
  inputs: FormDataState;
  title: string;
  targetGrade: string;
  learningObjective: string;
  overview?: string;
  characterReference?: CharacterReference;
  materialContent?: MaterialContent;
  scenes?: SceneItem[];
  quizQuestions?: QuizQuestion[];
  productionNotes?: ProductionNotes;
}

export interface FormDataState {
  topic: string;
  contentExplanation: string;
  targetGrade: string;
  learningObjective: string;
  mediaType: string;
  visualStyle: string;
  language: string;
  orientation: string;
  sceneCount: number;
  characterType: string;
  customCharacterName: string;
  customCharacterDesc: string;
  additionalInstructions: string;
  uploadedFileName?: string;
  uploadedFileSize?: number;
}

export interface PresetProject {
  id: string;
  title: string;
  category: string;
  targetGrade: string;
  generatorType: GeneratorType;
  description: string;
  formData: FormDataState;
}
