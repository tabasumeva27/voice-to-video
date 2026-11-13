// AI Director Engine: Converts Bengali Voice Transcript into High-Retention 4-Layer Documentary Reels
import { PRESET_VISUALS } from '../constants/presets';

/**
 * Intelligent 4-Layer Dynamic Bengali Semantic Parser
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

    let visualType = LAYER_CYCLE[idx % LAYER_CYCLE.length];
    let motionType = 'counter';
    let soundFx = 'whoosh';
    let highlightText = sentence.split(' ').slice(0, 3).join(' ');
    let headline = sentence.slice(0, 42) + '...';
    let imageUrl = '';
    let searchQuery = '';

    // 1. First Scene: Creator Hook or Speaking Avatar
    if (idx === 0) {
      visualType = driveHookUrl ? 'personal_hook' : 'avatar_explainer';
      headline = 'আজকের বিশেষ অনুসন্ধান';
      highlightText = '৫ই আগস্টের পর';
      soundFx = 'whoosh';
    }
    // 2. Garments Workers / RMG Sector / Minimum Wage
    else if (
      lower.includes('পোশাক') ||
      lower.includes('শ্রমিক') ||
      lower.includes('মজুরি') ||
      lower.includes('বারো হাজার') ||
      lower.includes('১২,৫০০') ||
      lower.includes('১২৫০০')
    ) {
      visualType = 'stock_visual';
      imageUrl = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
      searchQuery = 'garments textile factory workers';
      highlightText = extractWageHighlight(sentence) || '১২,৫০০ টাকা মজুরি';
      headline = 'পোশাক শিল্পের শ্রমিক ও মজুরি সংকট';
      soundFx = 'whoosh';
    }
    // 3. Inflation / Price Hike / Percentage Analysis
    else if (
      lower.includes('মূল্যস্ফীতি') ||
      lower.includes('শতাংশ') ||
      lower.includes('%') ||
      lower.includes('ছাপ্পান্ন') ||
      lower.includes('আট দশমিক') ||
      lower.includes('বেড়েছে')
    ) {
      visualType = 'procedural_motion';
      motionType = 'counter';
      soundFx = 'camera';
      highlightText = extractPercentageHighlight(sentence) || '৮.৮% মূল্যস্ফীতি';
      headline = 'টানা ৫৬ মাস ধরে মূল্যস্ফীতি মজুরিকে ছাড়িয়েছে';
    }
    // 4. Pay Scale / Government Employees / Salary Hike
    else if (
      lower.includes('পে স্কেল') ||
      lower.includes('সরকারি') ||
      lower.includes('বেতন') ||
      lower.includes('পেনশন') ||
      lower.includes('গ্রেড')
    ) {
      visualType = 'procedural_motion';
      motionType = 'chart';
      soundFx = 'cash';
      highlightText = '১০০% থেকে ১৪২% বৃদ্ধি';
      headline = 'সরকারি কর্মচারীদের নতুন পে স্কেল';
    }
    // 5. Market / Rice / Oil / Buying Power
    else if (
      lower.includes('বাজার') ||
      lower.includes('চাল') ||
      lower.includes('তেল') ||
      lower.includes('সয়াবিন') ||
      lower.includes('দাম') ||
      lower.includes('সড়ে দশ হাজার')
    ) {
      visualType = 'paper_collage';
      soundFx = 'camera';
      highlightText = 'নিত্যপ্রয়োজনীয় দ্রব্যমূল্য';
      headline = 'চাল ও তেলের বাজারে অস্বস্তি';
    }
    // 6. Submarine / War (if user uploads maritime topics)
    else if (lower.includes('সাবমেরিন') || lower.includes('শব্দতরঙ্গ') || lower.includes('ডলফিন')) {
      visualType = 'procedural_motion';
      motionType = 'sonar';
      soundFx = 'boom';
      highlightText = 'সাবমেরিনের শব্দতরঙ্গ';
      headline = 'কৃষ্ণসাগরে সামরিক তৎপরতা';
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
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      searchQuery: searchQuery || sentence.slice(0, 24),
      driveVideoUrl: visualType === 'personal_hook' ? driveHookUrl : ''
    });
  });

  return scenes;
}

function extractWageHighlight(s) {
  const m = s.match(/(বারো হাজার পাঁচশো|১২,৫০০|১২৫০০|বিশ হাজার|২০,০০০|ত্রিশ হাজার|৩০,০০০|মজুরি|বেতন)/i);
  return m ? m[0] + ' টাকা' : '';
}

function extractPercentageHighlight(s) {
  const m = s.match(/(\d+(\.\d+)?\s*(শতাংশ|%|দশমিক|গুণ)|আট দশমিক আট|ছাপ্পান্ন মাস|একশো শতাংশ)/i);
  return m ? m[0] : '';
}

/**
 * Gemini API Director Integration
 */
export async function generateScenesWithGemini(transcriptText, apiKey, driveHookUrl = '') {
  if (!apiKey) {
    return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
  }

  const cleanKey = apiKey.trim();
  const prompt = `You are an expert 9:16 documentary reel director (like Vox, Abdullah, Johnny Harris).
Analyze this Bengali narration script about economy/garments workers/inflation/wages:
"""
${transcriptText}
"""
Rules:
1. Divide into coherent scenes matching sentences.
2. visualType must be balanced among: 'avatar_explainer', 'procedural_motion', 'paper_collage', 'stock_visual'.
3. For sentences mentioning percentages, inflation, or wages, set motionType to 'counter' or 'chart'.
4. For market prices (rice, oil), use 'paper_collage' with yellow highlight.
5. Provide precise Bengali headline and highlightText.

Return STRICTLY a JSON array with objects containing:
startTime (number), endTime (number), duration (number), visualType (string), motionType (string), caption (Bengali), headline (Bengali), highlightText (Bengali), soundFx ('whoosh'|'boom'|'camera'|'cash').
No markdown fences, just JSON.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${cleanKey}`,
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
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      driveVideoUrl: item.visualType === 'personal_hook' ? driveHookUrl : ''
    }));
  } catch (err) {
    console.error('Gemini director error:', err);
    return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
  }
}
