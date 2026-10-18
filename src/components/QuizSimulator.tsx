import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Copy,
  Check,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Share2,
} from 'lucide-react';
import { FlipbookModule } from '../types/flipbook';
import { sound } from '../utils/audio';
import { formatQuizCSV } from '../utils/exporter';

interface QuizSimulatorProps {
  module: FlipbookModule;
  soundEnabled: boolean;
}

export const QuizSimulator: React.FC<QuizSimulatorProps> = ({ module, soundEnabled }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'play' | 'review' | 'export'>('play');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [copiedFormat, setCopiedFormat] = useState<'heyzine' | 'csv' | null>(null);

  const questions = module.quiz;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (qNumber: number, label: string) => {
    if (submitted[qNumber]) return;
    setUserAnswers((prev) => ({ ...prev, [qNumber]: label }));
  };

  const handleConfirmAnswer = (qNumber: number) => {
    const selected = userAnswers[qNumber];
    if (!selected) return;

    setSubmitted((prev) => ({ ...prev, [qNumber]: true }));
    const question = questions.find((q) => q.questionNumber === qNumber);
    const isCorrect = question?.correctAnswer === selected;

    if (soundEnabled) {
      if (isCorrect) {
        sound.playCorrect();
      } else {
        sound.playWrong();
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmitted({});
    setCurrentQuestionIndex(0);
  };

  // Calculate score
  const totalQuestions = questions.length;
  const correctCount = questions.filter(
    (q) => submitted[q.questionNumber] && userAnswers[q.questionNumber] === q.correctAnswer
  ).length;
  const submittedCount = Object.keys(submitted).length;
  const allCompleted = submittedCount === totalQuestions;
  const finalScore = Math.round((correctCount / totalQuestions) * 100);

  // Formatted text for Heyzine / Zep Quiz
  const getHeyzineText = () => {
    let text = `=== FORMAT KUIS SIAP INPUT: HEYZINE / ZEP QUIZ / QUIZIZZ ===\n`;
    text += `Petualangan: ${module.concept.adventureTitle}\n\n`;

    questions.forEach((q) => {
      text += `Soal ${q.questionNumber}: ${q.question}\n`;
      q.options.forEach((opt) => {
        text += `${opt.label}. ${opt.text}\n`;
      });
      text += `Kunci: ${q.correctAnswer}\n`;
      text += `Feedback: ${q.feedback}\n\n`;
    });
    return text;
  };

  const handleCopyHeyzine = () => {
    navigator.clipboard.writeText(getHeyzineText());
    setCopiedFormat('heyzine');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(formatQuizCSV(module));
    setCopiedFormat('csv');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold font-heading text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-500" />
            <span>Kuis Evaluasi Gamifikasi ({questions.length} Soal)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Pertanyaan berbasis narasi petualangan, siap diinput ke Heyzine Flipbook atau Zep Quiz
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold border border-slate-200">
            <button
              onClick={() => setActiveTab('play')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'play' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Uji Coba Interaktif
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'review' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kunci & Feedback
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'export' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Format Heyzine / CSV
            </button>
          </div>

          <button
            onClick={handleResetQuiz}
            title="Reset Ulang Kuis"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TAB 1: PLAY INTERACTIVE MODE */}
      {activeTab === 'play' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
            </span>
            <span className="font-semibold text-orange-600">
              Skor Sementara: {correctCount * 25} Poin ({correctCount}/{submittedCount} Benar)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          {currentQ && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-200/70 px-2.5 py-0.5 rounded-md">
                  Soal Kasus #{currentQ.questionNumber}
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-2 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.questionNumber] === opt.label;
                  const isAnswerSubmitted = submitted[currentQ.questionNumber];
                  const isCorrect = currentQ.correctAnswer === opt.label;

                  let btnStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400/20';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-medium';
                    } else {
                      btnStyle = 'border-slate-100 bg-slate-50/60 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'border-orange-500 bg-orange-50 text-orange-950 font-bold ring-2 ring-orange-400/20';
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectOption(currentQ.questionNumber, opt.label)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${btnStyle}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : isAnswerSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opt.label}
                      </div>
                      <span className="text-sm pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Confirm / Feedback section */}
              {!submitted[currentQ.questionNumber] ? (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleConfirmAnswer(currentQ.questionNumber)}
                    disabled={!userAnswers[currentQ.questionNumber]}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 disabled:opacity-40 transition-all hover:scale-[1.02]"
                  >
                    Kunci Jawaban Saya
                  </button>
                </div>
              ) : (
                <div
                  className={`p-4 rounded-2xl border animate-in fade-in ${
                    userAnswers[currentQ.questionNumber] === currentQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {userAnswers[currentQ.questionNumber] === currentQ.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Jawaban Tepat Sekali! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Jawaban Kurang Tepat (Kunci: {currentQ.correctAnswer})</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed mt-1">{currentQ.feedback}</p>
                </div>
              )}

              {/* Navigation between questions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 disabled:opacity-40"
                >
                  Soal Sebelumnya
                </button>

                <div className="flex gap-1">
                  {questions.map((q, idx) => (
                    <button
                      key={q.questionNumber}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentQuestionIndex === idx
                          ? 'bg-orange-500 text-white'
                          : submitted[q.questionNumber]
                          ? userAnswers[q.questionNumber] === q.correctAnswer
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 disabled:opacity-40"
                >
                  Soal Berikutnya
                </button>
              </div>

              {/* Complete trophy card if all answered */}
              {allCompleted && (
                <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white text-center shadow-lg animate-in zoom-in-95">
                  <Trophy className="w-12 h-12 mx-auto mb-2 text-amber-200" />
                  <h4 className="text-xl font-bold font-heading">Kuis Petualangan Selesai!</h4>
                  <p className="text-sm text-orange-100 mt-1">
                    Kamu berhasil menjawab <strong className="text-white">{correctCount}</strong> dari{' '}
                    <strong className="text-white">{totalQuestions}</strong> pertanyaan dengan tepat.
                  </p>
                  <div className="text-3xl font-extrabold my-2">{finalScore} / 100 Poin</div>
                  <button
                    onClick={handleResetQuiz}
                    className="mt-2 px-5 py-2 bg-white text-orange-600 font-bold text-xs rounded-xl shadow-xs hover:bg-orange-50"
                  >
                    Mainkan Sekali Lagi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REVIEW MODE (ALL QUESTIONS WITH KEYS & FEEDBACK) */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.questionNumber} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-800">
                  Nomor {q.questionNumber}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Kunci: {q.correctAnswer}
                </span>
              </div>
              <p className="font-bold text-slate-800 text-sm sm:text-base">{q.question}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt) => (
                  <div
                    key={opt.label}
                    className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                      opt.label === q.correctAnswer
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="font-bold">{opt.label}.</span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                <strong className="text-amber-900">Umpan Balik / Feedback: </strong>
                {q.feedback}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: EXPORT FORMATS (HEYZINE & CSV) */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format Heyzine / Zep Quiz */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>Format Teks Heyzine / Zep Quiz</span>
                </h4>
                <button
                  onClick={handleCopyHeyzine}
                  className="flex items-center gap-1 px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-lg transition-colors border border-orange-200"
                >
                  {copiedFormat === 'heyzine' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFormat === 'heyzine' ? 'Tersalin!' : 'Salin Semua'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Format teks terstruktur yang mudah di-copy-paste langsung ke modul Heyzine Flipbook atau Zep Quiz.
              </p>
              <pre className="font-mono-code text-[11px] bg-slate-900 text-slate-200 p-3.5 rounded-2xl overflow-y-auto max-h-64 whitespace-pre-wrap leading-relaxed">
                {getHeyzineText()}
              </pre>
            </div>
          </div>

          {/* Format CSV untuk Quizizz / Google Form / Kahoot */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Format CSV (Quizizz / Excel)</span>
                </h4>
                <button
                  onClick={handleCopyCSV}
                  className="flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors border border-emerald-200"
                >
                  {copiedFormat === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFormat === 'csv' ? 'Tersalin!' : 'Salin CSV'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Siap diimpor ke Quizizz, Wordwall, atau Google Spreadsheet sebagai bank soal evaluasi.
              </p>
              <pre className="font-mono-code text-[11px] bg-slate-900 text-slate-200 p-3.5 rounded-2xl overflow-y-auto max-h-64 whitespace-pre-wrap leading-relaxed">
                {formatQuizCSV(module)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
