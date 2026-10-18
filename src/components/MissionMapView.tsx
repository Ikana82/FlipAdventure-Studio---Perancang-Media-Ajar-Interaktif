import React from 'react';
import { Compass, Award, Shield, CheckCircle, ArrowRight, Sparkles, Flag, Star } from 'lucide-react';
import { FlipbookModule } from '../types/flipbook';

interface MissionMapViewProps {
  module: FlipbookModule;
  onSelectPost?: (pageIndex: number) => void;
}

export const MissionMapView: React.FC<MissionMapViewProps> = ({ module, onSelectPost }) => {
  const { concept } = module;

  return (
    <div className="space-y-6">
      {/* Hero Adventure Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white p-6 sm:p-8 shadow-xl shadow-orange-500/15">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{concept.worldTheme}</span>
            </span>
            <span className="px-3 py-1 bg-amber-400/90 text-amber-950 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{module.metadata.learningModel}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading mb-3 leading-tight tracking-tight">
            {concept.adventureTitle}
          </h2>

          {/* Guide Character Feature Card */}
          <div className="mt-4 flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
              {concept.guideCharacter.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-white">{concept.guideCharacter.name}</h4>
                <span className="text-[11px] bg-white/25 px-2 py-0.5 rounded-full font-semibold">
                  Maskot Pembimbing
                </span>
              </div>
              <p className="text-xs text-orange-100 mt-1 leading-relaxed">
                {concept.guideCharacter.description}
              </p>
              {concept.guideCharacter.catchphrase && (
                <p className="text-xs text-amber-200 mt-1.5 font-semibold italic">
                  "{concept.guideCharacter.catchphrase}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 text-7xl opacity-20 pointer-events-none">🗺️</div>
      </div>

      {/* Mission Map Questline / Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-800 flex items-center gap-2">
              <Flag className="w-5 h-5 text-orange-500" />
              <span>Peta Misi Petualangan & Tahapan Sintaks</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap pos misi terhubung langsung dengan alur materi dan sintaks model {module.metadata.learningModel}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
            {concept.missionMap.length} Pos Misi
          </span>
        </div>

        {/* Interactive nodes list */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-1 bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400 rounded-full hidden sm:block" />

          <div className="space-y-6 sm:space-y-8">
            {concept.missionMap.map((post, idx) => (
              <div
                key={post.stepNumber}
                className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group"
              >
                {/* Milestone Node Circle */}
                <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex flex-col items-center justify-center font-bold shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0 border-4 border-white">
                  <span className="text-[10px] sm:text-xs uppercase font-semibold">Pos</span>
                  <span className="text-base sm:text-xl font-extrabold">{post.stepNumber}</span>
                </div>

                {/* Content Card */}
                <div className="flex-1 w-full bg-slate-50 group-hover:bg-amber-50/50 p-5 rounded-2xl border border-slate-200 group-hover:border-amber-300 transition-all shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                      Sintaks: {post.syntaxStage}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>{post.badgeName}</span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-800 mb-1.5">{post.postName}</h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    {post.briefObjective}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Target: Pemahaman Konsep & Karakter Siswa</span>
                    </span>

                    {onSelectPost && (
                      <button
                        onClick={() => onSelectPost(idx)}
                        className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold transition-colors"
                      >
                        <span>Buka Halaman Modul</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
