import { FlipbookModule } from '../types/flipbook';

export function formatFullMarkdown(module: FlipbookModule): string {
  let md = `# ${module.concept.adventureTitle.toUpperCase()}\n\n`;
  md += `**DATA INFORMASI MODUL:**\n`;
  md += `1. Topik/Judul Media: ${module.metadata.topic}\n`;
  md += `2. Target Sasaran/Kelas: ${module.metadata.gradeLevel}\n`;
  md += `3. Model/Pendekatan Pembelajaran: ${module.metadata.learningModel}\n`;
  if (module.metadata.summaryContent) {
    md += `4. Materi Pokok/Ringkasan Isi:\n   ${module.metadata.summaryContent}\n`;
  }
  md += `5. Jumlah Halaman: ${module.pages.length} Halaman\n\n`;

  // Bagian Konsep & Peta Misi
  md += `## KONSEP PETUALANGAN & PETA MISI\n`;
  md += `- **Judul Petualangan:** ${module.concept.adventureTitle}\n`;
  md += `- **Tema Dunia:** ${module.concept.worldTheme}\n`;
  md += `- **Karakter Pemandu:** ${module.concept.guideCharacter.name} - ${module.concept.guideCharacter.description}\n`;
  if (module.concept.guideCharacter.catchphrase) {
    md += `  *(Slogan: "${module.concept.guideCharacter.catchphrase}")*\n`;
  }
  md += `- **Peta Misi:**\n`;
  module.concept.missionMap.forEach((m) => {
    md += `  ${m.stepNumber}. **${m.postName}** | Sintaks: ${m.syntaxStage} | Sasaran: ${m.briefObjective} (🏆 ${m.badgeName})\n`;
  });
  md += `\n---\n\n`;

  // Format per halaman persis sesuai instruksi:
  md += `## RANCANGAN HALAMAN FLIPBOOK INTERAKTIF\n\n`;
  module.pages.forEach((page) => {
    md += `### ${page.title}\n\n`;
    md += `1. **Teks Materi & Narasi:**\n`;
    md += `   "${page.storyAndContent}"\n\n`;

    md += `2. **Prompt Text-to-Image (A4 Portrait 300 DPI):**\n`;
    md += `   \`${page.imagePrompt}\`\n\n`;

    md += `3. **Prompt Image-to-Video (Jika halaman berisi video interaktif):**\n`;
    md += `   \`${page.videoPrompt}\`\n\n`;

    md += `4. **Panduan Layout Canva & Interaktivitas:**\n`;
    md += `   ${page.canvaLayoutAndInteractivity}\n\n`;

    if (page.interactiveTask) {
      md += `   *Aktivitas/Tugas Siswa:* ${page.interactiveTask}\n`;
    }
    if (page.interactiveClue) {
      md += `   *Petunjuk Rahasia (Clue):* 💡 ${page.interactiveClue}\n`;
    }

    md += `\n---\n\n`;
  });

  // Bagian Penutup: Evaluasi Interaktif
  md += `## BAGIAN PENUTUP: EVALUASI INTERAKTIF (Siap Input Heyzine / Zep Quiz)\n\n`;
  module.quiz.forEach((q) => {
    md += `**Nomor Soal ${q.questionNumber}**\n`;
    md += `- **Pertanyaan:** ${q.question}\n`;
    md += `- **Pilihan Jawaban:**\n`;
    q.options.forEach((opt) => {
      md += `  ${opt.label}. ${opt.text}\n`;
    });
    md += `- **Kunci Jawaban:** ${q.correctAnswer}\n`;
    md += `- **Feedback / Umpan Balik:** ${q.feedback}\n\n`;
  });

  return md;
}

export function formatQuizCSV(module: FlipbookModule): string {
  let csv = 'Question,Option A,Option B,Option C,Option D,Correct Answer,Feedback\n';
  module.quiz.forEach((q) => {
    const optA = q.options.find((o) => o.label === 'A')?.text || '';
    const optB = q.options.find((o) => o.label === 'B')?.text || '';
    const optC = q.options.find((o) => o.label === 'C')?.text || '';
    const optD = q.options.find((o) => o.label === 'D')?.text || '';

    const clean = (str: string) => `"${str.replace(/"/g, '""')}"`;
    csv += `${clean(q.question)},${clean(optA)},${clean(optB)},${clean(optC)},${clean(optD)},${clean(q.correctAnswer)},${clean(q.feedback)}\n`;
  });
  return csv;
}

export function formatCanvaPromptList(module: FlipbookModule): string {
  let text = `=== PANDUAN ASET VISUAL & VIDEO AI (PRODUKSI CANVA) ===\n`;
  text += `Modul: ${module.concept.adventureTitle}\n`;
  text += `Standar Cetak: A4 Portrait (210 x 297 mm), 300 DPI, Flat Vector 2D, Pastel Colors\n\n`;

  module.pages.forEach((p) => {
    text += `[${p.title}]\n`;
    text += `1. Prompt Text-to-Image (A4 Portrait 300 DPI):\n`;
    text += `   ${p.imagePrompt}\n\n`;
    text += `2. Prompt Image-to-Video (Looping Runway/Kling/Pika):\n`;
    text += `   ${p.videoPrompt}\n\n`;
    text += `3. Panduan Layout Canva & Interaktivitas:\n`;
    text += `   ${p.canvaLayoutAndInteractivity}\n\n`;
    text += `----------------------------------------------------\n\n`;
  });

  return text;
}
