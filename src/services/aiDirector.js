// AI Director Engine: Converts Bengali Voice Transcript into High-Retention 4-Layer Documentary Reels
// Enforces Vox/Abdullah-style visual variety (No consecutive duplicate visualTypes)

const GEMINI_TEXT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash-latest'
];

const LAYER_CYCLE = ['avatar_explainer', 'stock_visual', 'procedural_motion', 'paper_collage'];

/**
 * Intelligent 4-Layer Dynamic Bengali Semantic Parser (100% Free & Offline Fallback)
 */
export function parseTranscriptRuleBased(transcriptText, totalDuration = 0, driveHookUrl = '') {
  if (!transcriptText || transcriptText.trim() === '') {
    return [];
  }

  const sentences = transcriptText
    .split(/[।?!;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  if (sentences.length === 0) return [];

  const avgDurationPerSentence = Math.max(
    4,
    totalDuration > 0 ? totalDuration / sentences.length : 5
  );

  let currentTime = 0;
  let lastVisualType = '';
  const scenes = [];

  sentences.forEach((sentence, idx) => {
    const wordCount = sentence.split(/\s+/).filter(Boolean).length;
    const rawDuration = totalDuration > 0
      ? Math.max(2.5, avgDurationPerSentence)
      : Math.min(8, Math.max(3.5, Math.round(wordCount * 0.45)));

    const startTime = Math.round(currentTime * 10) / 10;
    const endTime = Math.round((currentTime + rawDuration) * 10) / 10;
    currentTime = endTime;

    const lower = sentence.toLowerCase();

    let visualType = LAYER_CYCLE[idx % LAYER_CYCLE.length];
    let motionType = 'counter';
    let soundFx = 'whoosh';
    let highlightText = sentence.split(/\s+/).slice(0, 3).join(' ');
    let headline = sentence.length > 44 ? sentence.slice(0, 44) + '...' : sentence;
    let searchQuery = '';
    let metrics = [];

    if (idx === 0) {
      visualType = driveHookUrl ? 'personal_hook' : 'avatar_explainer';
      headline = 'আজকের মূল অনুসন্ধান';
      highlightText = sentence.split(/\s+/).slice(0, 3).join(' ');
      soundFx = 'whoosh';
    } else if (
      lower.includes('সাবমেরিন') ||
      lower.includes('শব্দতরঙ্গ') ||
      lower.includes('মাইন') ||
      lower.includes('যুদ্ধজাহাজ')
    ) {
      visualType = 'procedural_motion';
      motionType = 'sonar';
      soundFx = 'boom';
      highlightText = 'শব্দতরঙ্গ ও সোনার';
      headline = 'সাবমেরিন ও সামরিক সংকেত';
    } else if (
      lower.includes('অসুস্থ') ||
      lower.includes('হাসপাতাল') ||
      lower.includes('রোগ') ||
      lower.includes('মৃত্যু') ||
      lower.includes('চিকিৎসা')
    ) {
      visualType = 'procedural_motion';
      motionType = 'heartbeat';
      soundFx = 'pop';
      highlightText = 'জরুরি পরিস্থিতি';
      headline = 'স্বাস্থ্য ও মানবিক সংকট';
    } else if (
      lower.includes('মূল্যস্ফীতি') ||
      lower.includes('শতাংশ') ||
      lower.includes('%') ||
      lower.includes('পে স্কেল') ||
      lower.includes('বেতন') ||
      lower.includes('মজুরি') ||
      lower.includes('টাকা') ||
      lower.includes('ডলার') ||
      lower.includes('কোটি') ||
      lower.includes('লাখ') ||
      lower.includes('হাজার')
    ) {
      const pct = extractPercentageHighlight(sentence);
      const wage = extractWageHighlight(sentence);
      visualType = idx % 2 === 0 ? 'procedural_motion' : 'stock_visual';
      motionType = lower.includes('দাম') || lower.includes('কমে') || lower.includes('কমছে') ? 'chart' : 'counter';
      soundFx = 'cash';
      highlightText = pct || wage || highlightText;
      if (pct && wage) metrics = [pct, wage];
      else if (pct) metrics = [pct];
      else if (wage) metrics = [wage];
    } else if (
      lower.includes('রিপোর্ট') ||
      lower.includes('সংবাদ') ||
      lower.includes('বাজার') ||
      lower.includes('চাল') ||
      lower.includes('তেল') ||
      lower.includes('আইন') ||
      lower.includes('তথ্য')
    ) {
      visualType = 'paper_collage';
      soundFx = 'camera';
      headline = sentence.length > 52 ? sentence.slice(0, 52) + '...' : sentence;
    } else if (
      lower.includes('পোশাক') ||
      lower.includes('শ্রমিক') ||
      lower.includes('ডলফিন') ||
      lower.includes('সমুদ্র') ||
      lower.includes('মহাকাশ') ||
      lower.includes('প্রযুক্তি')
    ) {
      visualType = 'stock_visual';
      searchQuery = sentence.slice(0, 30);
    }

    // Strict No-Consecutive-Duplicate Visual Type Rule
    if (visualType === lastVisualType && idx > 0) {
      const nextIdx = (LAYER_CYCLE.indexOf(visualType) + 1) % LAYER_CYCLE.length;
      visualType = LAYER_CYCLE[nextIdx];
    }
    lastVisualType = visualType;

    scenes.push({
      id: `scene_${Date.now()}_${idx}`,
      startTime,
      endTime,
      duration: Math.round(rawDuration * 10) / 10,
      visualType,
      motionType,
      caption: sentence,
      headline,
      highlightText,
      metrics,
      soundFx,
      zoomScale: 1.08 + (idx % 3) * 0.04,
      imageUrl: '',
      searchQuery: searchQuery || sentence,
      driveVideoUrl: visualType === 'personal_hook' ? driveHookUrl : ''
    });
  });

  return scenes;
}

function extractWageHighlight(s) {
  const m = s.match(/(\d[\d,]*|বারো হাজার পাঁচশো|সাড়ে দশ হাজার|বিশ হাজার|ত্রিশ হাজার|সাঁইত্রিশ হাজার|উনিশ|একশো বিয়াল্লিশ|একশো)\s*(টাকা|হাজার|কোটি|বিলিয়ন|ডলার)/i);
  return m ? m[0] : '';
}

function extractPercentageHighlight(s) {
  const m = s.match(/(\d+(?:\.\d+)?\s*(?:%|শতাংশ)|(?:আট|সাত|নয়|দশ|আঠারো|বিশ|একশো)\s*(?:দশমিক\s*\S+\s*)?শতাংশ)/i);
  return m ? m[0] : '';
}

/**
 * Gemini API Director Integration (Uses current Gemini 2.5 / 2.0 models)
 */
export async function generateScenesWithGemini(transcriptText, apiKey, driveHookUrl = '') {
  if (!apiKey || apiKey.trim().length < 8) {
    return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
  }

  const cleanKey = apiKey.trim();
  const prompt = `You are an expert 9:16 documentary reel director (Vox, Johnny Harris, Abdullah style).
Analyze this Bengali narration script and split it into high-retention visual scenes:
"""
${transcriptText}
"""

Rules:
1. Keep the exact Bengali narration text in "caption" (split naturally by sentences, do NOT alter or omit sentences).
2. Balance visualType across: "avatar_explainer", "procedural_motion", "paper_collage", "stock_visual"${driveHookUrl ? ', "personal_hook" (for Scene 1)' : ''}.
3. NEVER put the same visualType in two consecutive scenes.
4. For "procedural_motion", pick motionType from: "counter", "chart", "sonar", "heartbeat", "particles".
5. Provide concise Bengali "headline" (max 8 words), "highlightText" (key number/phrase, max 4 words), and optional "metrics" (array of up to 2 short Bengali stat pills).
6. Provide "searchQuery" in English (2-4 keywords for stock photo matching) and "soundFx" ("whoosh" | "boom" | "camera" | "cash" | "pop").

Return STRICTLY a JSON array of objects with keys:
duration (number in seconds, 3-7), visualType, motionType, caption, headline, highlightText, metrics, searchQuery, soundFx.`;

  for (const model of GEMINI_TEXT_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      if (!Array.isArray(parsed) || parsed.length === 0) continue;

      let curr = 0;
      let prevType = '';
      return parsed.map((item, idx) => {
        const d = Math.max(2.5, Number(item.duration) || 4.5);
        const startTime = Math.round(curr * 10) / 10;
        const endTime = Math.round((curr + d) * 10) / 10;
        curr = endTime;

        let vType = item.visualType || LAYER_CYCLE[idx % LAYER_CYCLE.length];
        if (idx === 0 && driveHookUrl) vType = 'personal_hook';
        if (vType === prevType && idx > 0) {
          vType = LAYER_CYCLE[(LAYER_CYCLE.indexOf(vType) + 1) % LAYER_CYCLE.length];
        }
        prevType = vType;

        return {
          ...item,
          id: `gemini_scene_${idx}_${Date.now()}`,
          startTime,
          endTime,
          duration: d,
          visualType: vType,
          motionType: item.motionType || 'counter',
          metrics: Array.isArray(item.metrics) ? item.metrics : [],
          zoomScale: 1.08 + (idx % 3) * 0.04,
          imageUrl: '',
          driveVideoUrl: vType === 'personal_hook' ? driveHookUrl : ''
        };
      });
    } catch (err) {
      console.warn(`Gemini director failed on ${model}:`, err);
    }
  }

  return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
}
