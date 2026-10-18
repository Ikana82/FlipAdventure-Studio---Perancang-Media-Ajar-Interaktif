import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import mammoth from 'mammoth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side Gemini client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Anda adalah "EduSmart Learning Creator AI", sebuah AI-powered Educational Media Creator tingkat ahli yang membantu guru, orang tua, mahasiswa pendidikan, dan kreator produk digital membuat media pembelajaran anak yang menarik, kreatif, dan edukatif.

PRINSIP PEMBELAJARAN:
- Berpusat pada anak (child-centered), ramah, memicu rasa ingin tahu, dan menggunakan contoh konkret dalam kehidupan sehari-hari.
- Sesuaikan tingkat kosakata dan kesulitan konsep secara akurat dengan jenjang target (PAUD, TK A, TK B, SD Kelas 1-2, SD Kelas 3-4, SD Kelas 5-6, SMP, SMA).
- Untuk konsep sains dan fakta ilmiah, utamakan kebenaran ilmiah dan jangan membuat klaim ilmiah keliru demi kebutuhan visual.
- Semua prompt text-to-image harus berbahasa Inggris, detail, profesional, menyebutkan subjek, pose, latar, pencahayaan, palet warna, gaya ilustrasi yang dipilih, rasio aspek, dan aturan teks (--no text jika tanpa teks).
- Semua prompt image-to-video harus mendeskripsikan gerakan halus karakter (tersenyum, menunjuk, melambaikan tangan) dan pergerakan kamera yang natural untuk Runway/Kling/Pika.
- Jika ada karakter utama, buat deskripsi "Character Reference" yang konsisten di semua adegan/panel.`;

// API to generate educational media
app.post('/api/generate-media', async (req, res) => {
  try {
    const {
      generatorType,
      topic,
      contentExplanation,
      targetGrade,
      learningObjective,
      mediaType,
      visualStyle,
      language,
      orientation,
      sceneCount = 4,
      characterType,
      customCharacterName,
      customCharacterDesc,
      additionalInstructions = '',
    } = req.body;

    if (!topic || !contentExplanation) {
      return res.status(400).json({ error: 'Judul/topik dan penjelasan materi wajib diisi.' });
    }

    const prompt = `Anda adalah EduSmart Learning Creator AI. Rancang media pembelajaran lengkap berkualitas tinggi untuk generator jenis: "${generatorType}".
Spesifikasi Input Pengguna:
- Judul / Topik Pembelajaran: ${topic}
- Penjelasan Materi Pokok: ${contentExplanation}
- Target Jenjang Pendidikan: ${targetGrade}
- Tujuan Pembelajaran: ${learningObjective || 'Memahami konsep dengan jelas dan menyenangkan'}
- Jenis Media: ${mediaType}
- Gaya Visual Ilustrasi: ${visualStyle}
- Bahasa Materi: ${language}
- Rasio Orientasi: ${orientation}
- Jumlah Adegan / Slide / Panel: ${sceneCount}
- Tipe Karakter Utama: ${characterType}
${customCharacterName ? `- Nama Karakter: ${customCharacterName}` : ''}
${customCharacterDesc ? `- Ciri Karakter: ${customCharacterDesc}` : ''}
${additionalInstructions ? `- Instruksi Tambahan: ${additionalInstructions}` : ''}

PETUNJUK KHUSUS FORMAT:
1. Jika jenis "material": Wajib isi 'materialContent' secara mendalam: penjelasan konsep, 3-5 contoh nyata sehari-hari, 2-3 aktivitas belajar interaktif, dan pertanyaan reflektif.
2. Jika jenis "quiz": Wajib isi 4-5 'quizQuestions' lengkap dengan opsi A, B, C, D, kunci jawaban, dan umpan balik ramah anak.
3. Selalu sertakan minimal ${Math.min(sceneCount, 6)} rangkaian 'scenes' (adegan/slide/panel/lembar aktivitas).
4. Prompt Text-to-Image (English): Tulis deskripsi visual detail beresolusi tinggi, warna pastel, karakter ramah, clean isolated background (--no text). ${
      orientation?.includes('A4')
        ? 'Wajib sertakan spesifikasi cetak: "A4 portrait format (210 x 297 mm), aspect ratio --ar 1:1.41, 300 DPI high-resolution print ready, crisp linework".'
        : 'Sertakan rasio: "--ar 16:9 widescreen landscape" atau "--ar 9:16 portrait".'
    }
5. Prompt Image-to-Video (English): Tulis deskripsi gerakan halus karakter (smiling, nodding, gentle wave, pointing to educational concepts) yang looping natural untuk Runway/Kling/Pika.
6. Buat 'characterReference' profil karakter jika terdapat karakter pemandu.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            generatorType: { type: Type.STRING },
            targetGrade: { type: Type.STRING },
            learningObjective: { type: Type.STRING },
            overview: { type: Type.STRING, description: 'Ringkasan konsep atau naskah pembuka' },
            characterReference: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                identity: { type: Type.STRING },
                visualAge: { type: Type.STRING },
                appearance: { type: Type.STRING },
                outfit: { type: Type.STRING },
                invariableFeatures: { type: Type.STRING },
                fullPromptSnippet: { type: Type.STRING, description: 'Prompt snippet to keep character consistent in images' },
              },
            },
            materialContent: {
              type: Type.OBJECT,
              properties: {
                explanation: { type: Type.STRING },
                dailyExamples: { type: Type.ARRAY, items: { type: Type.STRING } },
                funActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
                evaluationQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  sceneTitle: { type: Type.STRING },
                  visualDescription: { type: Type.STRING },
                  narrationOrDialog: { type: Type.STRING },
                  screenText: { type: Type.STRING },
                  sfxAndBgm: { type: Type.STRING },
                  transition: { type: Type.STRING },
                  durationSec: { type: Type.INTEGER },
                  textToImagePrompt: { type: Type.STRING, description: 'Detailed English text-to-image prompt with style and aspect ratio' },
                  negativePrompt: { type: Type.STRING },
                  imageToVideoPrompt: { type: Type.STRING, description: 'Detailed English image-to-video prompt for Kling/Runway/Pika' },
                },
                required: ['sceneNumber', 'visualDescription', 'textToImagePrompt'],
              },
            },
            quizQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionNumber: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        text: { type: Type.STRING },
                      },
                      required: ['label', 'text'],
                    },
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
                required: ['questionNumber', 'question', 'options', 'correctAnswer', 'explanation'],
              },
            },
            productionNotes: {
              type: Type.OBJECT,
              properties: {
                recommendedBgm: { type: Type.STRING },
                voiceoverTone: { type: Type.STRING },
                tipsForEducator: { type: Type.STRING },
              },
            },
          },
          required: ['title', 'targetGrade', 'learningObjective'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating media:', error);
    return res.status(500).json({
      error: 'Gagal membuat media pembelajaran dengan AI. Silakan periksa input dan coba lagi.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Helper to generate a clean SVG educational vector artwork fallback
function generateSvgArtwork(prompt: string, title = 'EduSmart Illustration', aspect = '16:9'): string {
  const isPortrait = aspect.includes('9:16') || aspect.includes('A4') || aspect.includes('3:4');
  const width = isPortrait ? 600 : 960;
  const height = isPortrait ? 840 : 540;

  // Derive theme colors based on prompt content
  let bgGradientStart = '#7e22ce'; // purple-700
  let bgGradientEnd = '#4338ca'; // indigo-700
  let badgeColor = '#f59e0b';
  let themeEmoji = '✨';

  const lower = prompt.toLowerCase();
  if (lower.includes('water') || lower.includes('rain') || lower.includes('ocean') || lower.includes('river')) {
    bgGradientStart = '#0284c7';
    bgGradientEnd = '#0369a1';
    themeEmoji = '💧';
  } else if (lower.includes('forest') || lower.includes('tree') || lower.includes('nature') || lower.includes('plant')) {
    bgGradientStart = '#059669';
    bgGradientEnd = '#047857';
    themeEmoji = '🌿';
  } else if (lower.includes('space') || lower.includes('planet') || lower.includes('star') || lower.includes('sun')) {
    bgGradientStart = '#312e81';
    bgGradientEnd = '#1e1b4b';
    themeEmoji = '🚀';
  } else if (lower.includes('animal') || lower.includes('rabbit') || lower.includes('cat') || lower.includes('bird')) {
    bgGradientStart = '#d97706';
    bgGradientEnd = '#b45309';
    themeEmoji = '🐾';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradientStart}"/>
      <stop offset="100%" stop-color="${bgGradientEnd}"/>
    </linearGradient>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.2)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${width * 0.85}" cy="${height * 0.2}" r="${width * 0.25}" fill="rgba(255,255,255,0.08)"/>
  <circle cx="${width * 0.15}" cy="${height * 0.8}" r="${width * 0.3}" fill="rgba(255,255,255,0.05)"/>
  <g filter="url(#shadow)">
    <rect x="${width * 0.08}" y="${height * 0.1}" width="${width * 0.84}" height="${height * 0.8}" rx="28" fill="url(#cardBg)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  </g>
  <text x="${width * 0.5}" y="${height * 0.42}" font-family="system-ui, sans-serif" font-size="${isPortrait ? '80' : '64'}" text-anchor="middle">${themeEmoji}</text>
  <text x="${width * 0.5}" y="${height * 0.58}" font-family="system-ui, sans-serif" font-weight="800" font-size="${isPortrait ? '26' : '28'}" fill="#ffffff" text-anchor="middle">${escapeXml(title)}</text>
  <text x="${width * 0.5}" y="${height * 0.66}" font-family="system-ui, sans-serif" font-weight="500" font-size="${isPortrait ? '14' : '16'}" fill="rgba(255,255,255,0.85)" text-anchor="middle">Ilustrasi Edukatif 2D Pastel • AI Art Ready</text>
  <g transform="translate(${width * 0.5 - 120}, ${height * 0.74})">
    <rect width="240" height="36" rx="18" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)"/>
    <text x="120" y="23" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">🎨 Canva / Midjourney Prompt Ready</text>
  </g>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// API for direct AI Illustration generation using gemini-3.1-flash-lite-image with reliable fallback
app.post('/api/generate-image', async (req, res) => {
  const { prompt, aspectRatio = '1:1', title } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt gambar wajib diisi.' });
  }

  // Map orientation to valid aspect ratios
  let validAspect: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '1:1';
  if (aspectRatio === '16:9' || aspectRatio === 'Landscape 16:9') validAspect = '16:9';
  else if (aspectRatio === '9:16' || aspectRatio === 'Portrait 9:16') validAspect = '9:16';
  else if (aspectRatio === '4:3' || aspectRatio === 'Portrait A4' || aspectRatio === '3:4') validAspect = '3:4';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: validAspect,
        },
      },
    });

    let imageUrl = '';
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (imageUrl) {
      return res.json({ imageUrl, prompt, isDirectAi: true });
    }
  } catch (err: any) {
    console.warn('Direct AI Image model generation unavailable, generating vector illustration fallback:', err?.message);
  }

  // Graceful visual vector artwork fallback - ensures button NEVER breaks or leaves blank
  const fallbackUrl = generateSvgArtwork(prompt, title || 'Ilustrasi Adegan Edukasi', validAspect);
  return res.json({
    imageUrl: fallbackUrl,
    prompt,
    isFallback: true,
    message: 'Ilustrasi vektor edukatif telah dibuat! Anda juga dapat menggunakan prompt di bawah ini pada Canva Magic Media / Midjourney.',
  });
});

// API to analyze and extract material from uploaded files (PDF, images, text, notes)
app.post('/api/extract-material-file', async (req, res) => {
  try {
    const { fileBase64, mimeType, fileName, textContent } = req.body;

    const parts: any[] = [];

    if (textContent) {
      parts.push({
        text: `Berikut adalah teks isi materi pembelajaran dari file "${fileName || 'dokumen'}":\n\n${textContent}`,
      });
    } else if (fileBase64) {
      const isDocx =
        fileName?.toLowerCase().endsWith('.docx') ||
        fileName?.toLowerCase().endsWith('.doc') ||
        mimeType?.includes('wordprocessingml') ||
        mimeType?.includes('officedocument') ||
        mimeType?.includes('msword');

      if (isDocx) {
        try {
          const buffer = Buffer.from(fileBase64, 'base64');
          const docxResult = await mammoth.extractRawText({ buffer });
          const docxText = docxResult.value;
          parts.push({
            text: `Berikut adalah isi teks yang diekstrak dari dokumen Word "${fileName || 'dokumen.docx'}":\n\n${docxText}`,
          });
        } catch (docxErr: any) {
          console.warn('Mammoth extraction fallback:', docxErr);
          parts.push({
            text: `Dokumen materi pembelajaran "${fileName || 'dokumen.docx'}" dilampirkan oleh pengguna.`,
          });
        }
      } else if (mimeType && (mimeType.includes('pdf') || mimeType.startsWith('image/'))) {
        parts.push({
          inlineData: {
            data: fileBase64,
            mimeType: mimeType.includes('pdf') ? 'application/pdf' : mimeType,
          },
        });
        parts.push({
          text: `Analisis isi dokumen materi pembelajaran "${fileName || 'dokumen'}" yang dilampirkan.`,
        });
      } else {
        // General fallback
        parts.push({
          text: `Analisis isi materi pembelajaran dari file "${fileName || 'dokumen'}" yang dilampirkan pengguna.`,
        });
      }
    } else {
      return res.status(400).json({ error: 'Data file atau teks materi wajib disertakan.' });
    }

    parts.push({
      text: `Tugas Anda:
1. Ekstrak dan susun materi inti pembelajaran secara mendalam, runut, dan siap dipakai sebagai bahan ajar anak (extractedSummary).
2. Tentukan rekomendasi Judul atau Tema Pembelajaran yang menarik, edukatif, dan ramah anak (suggestedTopic).
3. Tentukan rekomendasi Target Jenjang Pendidikan yang paling cocok dari daftar ini: "PAUD", "TK A", "TK B", "SD Kelas 1–2", "SD Kelas 3–4", "SD Kelas 5–6", "SMP", "SMA" (suggestedTargetGrade).
4. Rumuskan Tujuan Pembelajaran yang spesifik dan terukur (suggestedLearningObjective).`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedSummary: {
              type: Type.STRING,
              description: 'Penjelasan materi pokok yang terstruktur dan lengkap untuk bahan ajar',
            },
            suggestedTopic: {
              type: Type.STRING,
              description: 'Rekomendasi judul atau tema pembelajaran',
            },
            suggestedTargetGrade: {
              type: Type.STRING,
              description: 'Rekomendasi target jenjang pendidikan (PAUD, TK A, TK B, SD Kelas 1–2, SD Kelas 3–4, SD Kelas 5–6, SMP, SMA)',
            },
            suggestedLearningObjective: {
              type: Type.STRING,
              description: 'Rekomendasi tujuan pembelajaran',
            },
          },
          required: ['extractedSummary', 'suggestedTopic', 'suggestedTargetGrade', 'suggestedLearningObjective'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error extracting material file:', error);
    return res.status(500).json({
      error: 'Gagal menganalisis file materi. Silakan coba file lain atau salin teks secara manual.',
      details: error?.message,
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduSmart Learning Creator AI listening on port ${PORT}`);
  });
}

startServer();
