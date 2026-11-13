// AI Director Engine: Converts Bengali Voice Transcript into High-Retention 4-Layer Documentary Reels
import { PRESET_VISUALS } from '../constants/presets';

/**
 * Intelligent 4-Layer Dynamic Bengali Semantic Parser
 * Dynamically assigns:
 * 1. avatar_explainer (Explainer speaker)
 * 2. procedural_motion (Sonar waves, Counters, Charts, Heartbeat)
 * 3. paper_collage (Newspaper/Report with marker highlight)
 * 4. stock_visual (Accurate contextual images, NOT static repeats)
 */
export function parseTranscriptRuleBased(transcriptText, totalDuration = 0, driveHookUrl = '') {
  if (!transcriptText || transcriptText.trim() === '') {
    return [];
  }

  // Split into sentences (by Bengali dori ।, ?, !, or newline)
  const sentences = transcriptText
    .split(/[।?!;\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 2);

  if (sentences.length === 0) return [];

  const avgDurationPerSentence = Math.max(
    4,
    totalDuration > 0 ? Math.floor(totalDuration / sentences.length) : 5
  );

  let currentTime = 0;
  const scenes = [];

  // 4-Layer sequence cycler to ensure balanced visual distribution
  const LAYER_CYCLE = ['avatar_explainer', 'stock_visual', 'procedural_motion', 'paper_collage'];

  sentences.forEach((sentence, idx) => {
    const sceneDuration = Math.min(
      8,
      Math.max(4, Math.round(sentence.split(' ').length * 0.45 || avgDurationPerSentence))
    );
    const startTime = currentTime;
    const endTime = startTime + sceneDuration;
    currentTime = endTime;

    const lower = sentence.toLowerCase();

    // Default layer assignment based on cycle to avoid repetitive visuals
    let visualType = LAYER_CYCLE[idx % LAYER_CYCLE.length];
    let motionType = 'particles';
    let soundFx = 'whoosh';
    let highlightText = sentence.split(' ').slice(0, 3).join(' ');
    let headline = sentence.slice(0, 40) + '...';
    let imageUrl = '';
    let searchQuery = '';

    // First scene: Hook (Drive footage if provided, otherwise Avatar explainer)
    if (idx === 0) {
      visualType = driveHookUrl ? 'personal_hook' : 'avatar_explainer';
      headline = 'আজকের বিশেষ অনুসন্ধান';
      soundFx = 'whoosh';
    }
    // Submarines / Sonar / Military / Warships / Waves
    else if (
      lower.includes('সাবমেরিন') ||
      lower.includes('শব্দতরঙ্গ') ||
      lower.includes('মাইন') ||
      lower.includes('জাহাজ') ||
      lower.includes('যুদ্ধজাহাজ') ||
      lower.includes('তরঙ্গ')
    ) {
      visualType = 'procedural_motion';
      motionType = 'sonar';
      soundFx = 'boom';
      highlightText = 'তীব্র শব্দতরঙ্গ ও সোনার';
      headline = 'সামরিক সাবমেরিনের শব্দতরঙ্গ';
    }
    // Marine Life / Dolphins / Sea / Ocean
    else if (
      lower.includes('ডলফিন') ||
      lower.includes('কৃষ্ণসাগর') ||
      lower.includes('সমুদ্র') ||
      lower.includes('সাগর') ||
      lower.includes('প্রাণী') ||
      lower.includes('মাছ')
    ) {
      visualType = 'stock_visual';
      imageUrl = PRESET_VISUALS.dolphin;
      searchQuery = 'dolphin swimming ocean water';
      motionType = 'waves';
      soundFx = 'whoosh';
      highlightText = 'সমুদ্রের অবোলা প্রাণী';
      headline = 'কৃষ্ণসাগরের বিপন্ন সামুদ্রিক জীব';
    }
    // Statistics / Numbers / Large death count or financial figures
    else if (
      lower.includes('লাখ') ||
      lower.includes('হাজার') ||
      lower.includes('কোটি') ||
      lower.includes('বিলিয়ন') ||
      lower.includes('মারা') ||
      lower.includes('সংখ্যা')
    ) {
      visualType = 'procedural_motion';
      motionType = 'counter';
      soundFx = 'camera';
      highlightText = extractNumberHighlight(sentence) || 'বিশাল পরিসংখ্যান';
      headline = 'নজিরবিহীন পরিসংখ্যান ও তথ্য';
    }
    // Financial / Crash / Loss / Money
    else if (
      lower.includes('ক্ষতি') ||
      lower.includes('লস') ||
      lower.includes('টাকা') ||
      lower.includes('ডলার') ||
      lower.includes('অর্থনীতি') ||
      lower.includes('দেউলিয়া')
    ) {
      visualType = 'procedural_motion';
      motionType = 'chart';
      soundFx = 'cash';
      highlightText = 'অর্থনৈতিক ধস';
      headline = 'আর্থিক পতনের বিশেষ রিপোর্ট';
    }
    // Report / Document / Law / Court / Investigation
    else if (
      lower.includes('রিপোর্ট') ||
      lower.includes('সংবাদ') ||
      lower.includes('তথ্য') ||
      lower.includes('বিজ্ঞান') ||
      lower.includes('গবেষণা') ||
      lower.includes('প্রমাণ')
    ) {
      visualType = 'paper_collage';
      soundFx = 'camera';
      highlightText = 'বিশেষ অনুসন্ধান রিপোর্ট';
      headline = 'আন্তর্জাতিক গবেষকদের প্রামাণ্য দলিল';
    }
    // Human superiority / Philosophy / Introspection
    else if (
      lower.includes('আশরাফুল') ||
      lower.includes('মাখলুকাত') ||
      lower.includes('শ্রেষ্ঠ') ||
      lower.includes('মানুষ') ||
      lower.includes('গর্ব')
    ) {
      visualType = 'avatar_explainer';
      soundFx = 'whoosh';
      highlightText = 'মানুষ ও শ্রেষ্ঠত্বের প্রশ্ন';
      headline = 'আমরা কি সত্যিই সৃষ্টির সেরা জীব?';
    }

    scenes.push({
      id: `scene_${Date.now()}_${idx}`,
      startTime,
      endTime,
      duration: sceneDuration,
      visualType,
      motionType,
      caption: sentence,
      headline,
      highlightText,
      soundFx,
      zoomScale: 1.08 + (idx % 3) * 0.05,
      imageUrl: imageUrl || PRESET_VISUALS.ocean,
      searchQuery: searchQuery || sentence.slice(0, 20),
      driveVideoUrl: visualType === 'personal_hook' ? driveHookUrl : ''
    });
  });

  return scenes;
}

// Extract specific numbers/amounts from Bengali sentences
function extractNumberHighlight(sentence) {
  const match = sentence.match(/(\d+|এক|দুই|তিন|চার|পাঁচ|শত|হাজার|লাখ|কোটি|বিলিয়ন)\s*(লাখ|হাজার|কোটি|বিলিয়ন|টাকা|ডলার|ডলফিন|মৃত)/i);
  if (match) {
    return match[0];
  }
  return '';
}

/**
 * Gemini API Director Integration (When API Key is Provided)
 */
export async function generateScenesWithGemini(transcriptText, apiKey, driveHookUrl = '') {
  if (!apiKey) {
    return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
  }

  const prompt = `You are an expert 9:16 documentary reel director (like Vox, Johnny Harris, Abdullah).
Analyze this Bengali narration script and produce a JSON array of scenes adhering to our 4-layer ratio:
- avatar_explainer: 25% (speaking character)
- procedural_motion: 25% (sonar waves, counters, charts, heartbeat)
- paper_collage: 25% (newspaper report with yellow marker highlight)
- stock_visual: 25% (contextual cinematic visual)

Rules:
1. Scene 1 should always be 'avatar_explainer' or 'personal_hook'.
2. Avoid consecutive scenes with the same visualType.
3. For scenes with military/submarines, set motionType to 'sonar'.
4. For large numbers or death counts, set motionType to 'counter'.
5. For financial loss, set motionType to 'chart'.
6. For ocean/disruption, set motionType to 'waves'.

Output strictly a JSON array with objects containing:
startTime (number), endTime (number), duration (number), visualType (string), motionType (string), caption (Bengali text), headline (Bengali text), highlightText (Bengali text), soundFx ('whoosh'|'boom'|'camera'|'cash'|'pop'), searchQuery (English keywords).

Script:
"""
${transcriptText}
"""
Output ONLY valid JSON.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

    if (!response.ok) {
      return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);

    const parsed = JSON.parse(rawText);
    return parsed.map((item, idx) => ({
      ...item,
      id: `gemini_scene_${idx}_${Date.now()}`,
      zoomScale: 1.08 + (idx % 3) * 0.05,
      imageUrl: PRESET_VISUALS.ocean,
      driveVideoUrl: item.visualType === 'personal_hook' ? driveHookUrl : ''
    }));
  } catch (err) {
    console.error('Error invoking Gemini, using local engine:', err);
    return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
  }
}
