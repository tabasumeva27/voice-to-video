// AI Director Engine: Converts Speech Transcript into Structured Visual Storyboard
import { PRESET_VISUALS } from '../constants/presets';

/**
 * Intelligent Bengali Semantic Parser (Works 100% offline & free)
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

  // Calculate rough duration per sentence
  const avgDurationPerSentence = Math.max(
    4,
    totalDuration > 0 ? Math.floor(totalDuration / sentences.length) : 5
  );

  let currentTime = 0;
  const scenes = [];

  sentences.forEach((sentence, idx) => {
    const sceneDuration = Math.min(
      8,
      Math.max(4, Math.round(sentence.split(' ').length * 0.45 || avgDurationPerSentence))
    );
    const startTime = currentTime;
    const endTime = startTime + sceneDuration;
    currentTime = endTime;

    const lower = sentence.toLowerCase();

    // Scene Classification
    let type = 'documentary_cutout';
    let highlightText = '';
    let soundFx = 'whoosh';
    let imageUrl = PRESET_VISUALS.businessman;
    let headline = sentence.slice(0, 36) + '...';

    // Hook Scene: Always dedicate the very first 5-7 seconds to User's Personal Face
    if (idx === 0) {
      type = 'personal_face';
      highlightText = sentence.split(' ').slice(0, 3).join(' ');
      soundFx = 'whoosh';
      imageUrl = driveHookUrl || PRESET_VISUALS.businessman;
      headline = 'আজকের বিশেষ বিশ্লেষণ';
    } 
    // Financial / Loss / Numbers Detection
    else if (
      lower.includes('বিলিয়ন') ||
      lower.includes('কোটি') ||
      lower.includes('ডলার') ||
      lower.includes('টাকা') ||
      lower.includes('ক্ষতি') ||
      lower.includes('লস') ||
      lower.includes('দেউলিয়া') ||
      lower.includes('ব্যাংক') ||
      lower.includes('অর্থনীতি')
    ) {
      type = 'financial_loss';
      highlightText = extractFinancialHighlight(sentence) || 'বিশাল অর্থনৈতিক ধাক্কা';
      soundFx = 'cash';
      imageUrl = PRESET_VISUALS.economy_chart;
      headline = 'আর্থিক পতনের বিশেষ রিপোর্ট';
    } 
    // Space / Science / Mars Detection
    else if (
      lower.includes('মহাকাশ') ||
      lower.includes('মঙ্গল') ||
      lower.includes('গ্রহ') ||
      lower.includes('চাঁদ') ||
      lower.includes('গ্যালাক্সি') ||
      lower.includes('নক্ষত্র') ||
      lower.includes('রকেট') ||
      lower.includes('বিজ্ঞান')
    ) {
      type = 'space_exploration';
      highlightText = 'মহাকাশে নতুন দিগন্ত';
      soundFx = 'boom';
      imageUrl = PRESET_VISUALS.space_bg;
      headline = 'মিশন মার্স ও অনন্ত মহাবিশ্ব';
    } 
    // Medical / Illness / Sudden Crisis Detection
    else if (
      lower.includes('অসুস্থ') ||
      lower.includes('হাসপাতাল') ||
      lower.includes('রোগ') ||
      lower.includes('ডাক্তার') ||
      lower.includes('চিকিৎসা') ||
      lower.includes('জীবিত') ||
      lower.includes('হঠাৎ') ||
      lower.includes('মৃত্যু')
    ) {
      type = 'medical_crisis';
      highlightText = 'অপ্রত্যাশিত শারীরিক সংকট';
      soundFx = 'pop';
      imageUrl = PRESET_VISUALS.hospital;
      headline = 'মানব জীবনের চরম বাস্তব সত্য';
    } 
    // News / Documents / Reports Detection
    else if (
      lower.includes('সংবাদ') ||
      lower.includes('রিপোর্ট') ||
      lower.includes('খবর') ||
      lower.includes('আদালত') ||
      lower.includes('পুলিশ') ||
      lower.includes('নোটিশ') ||
      lower.includes('প্রকাশ') ||
      lower.includes('গণমাধ্যম')
    ) {
      type = 'news_headline';
      highlightText = 'বিশেষ সংবাদ প্রতিবেদন';
      soundFx = 'camera';
      imageUrl = PRESET_VISUALS.newspaper;
      headline = 'শীর্ষ সংবাদে আলোড়ন সৃষ্টিকারী ঘটনা';
    } else {
      type = 'documentary_cutout';
      highlightText = sentence.split(' ').slice(0, 2).join(' ');
      soundFx = 'whoosh';
      imageUrl = PRESET_VISUALS.bangladesh_city;
      headline = 'বাস্তব জীবনের প্রামাণ্য চিত্র';
    }

    scenes.push({
      id: `scene_${Date.now()}_${idx}`,
      startTime,
      endTime,
      duration: sceneDuration,
      type,
      caption: sentence,
      headline,
      highlightText,
      soundFx,
      zoomScale: 1.08 + (idx % 3) * 0.05,
      imageUrl
    });
  });

  return scenes;
}

// Extract specific numbers/amounts from Bengali sentences
function extractFinancialHighlight(sentence) {
  const match = sentence.match(/(\d+|দুই|তিন|চার|পাঁচ|শত|হাজার|লক্ষ|কোটি|বিলিয়ন)\s*(বিলিয়ন|কোটি|টাকা|ডলার|লস|ক্ষতি)/i);
  if (match) {
    return match[0];
  }
  return 'আর্থিক সংকট ও দেনা';
}

/**
 * Gemini API Director Integration (When API Key is Provided)
 */
export async function generateScenesWithGemini(transcriptText, apiKey, driveHookUrl = '') {
  if (!apiKey) {
    return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
  }

  const prompt = `You are an expert documentary video director (in the style of Vox, Johnny Harris, MagnatesMedia, and popular Bangladeshi creator Abdullah).
Analyze this narration script (in Bengali) and break it into a sequence of high-retention 9:16 vertical reel scenes.
Rules:
1. Scene 1 (0 to 5-7 seconds) MUST be 'personal_face' for the creator's talking hook.
2. For financial loss/numbers, use 'financial_loss'.
3. For space/future/mars, use 'space_exploration'.
4. For sudden sickness/hospital, use 'medical_crisis'.
5. For documents/news/court, use 'news_headline'.
6. For other scenes, use 'documentary_cutout'.
7. Output valid JSON array with keys: startTime, endTime, type, caption (Bengali), headline (Bengali), highlightText (Bengali), soundFx ('whoosh'|'cash'|'boom'|'camera'|'pop').

Script:
"""
${transcriptText}
"""
Respond with ONLY the JSON array, no markdown fences or other text.`;

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
      console.warn('Gemini API call failed, falling back to local semantic engine');
      return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
    }

    const parsed = JSON.parse(rawText);
    return parsed.map((item, idx) => ({
      ...item,
      id: `gemini_scene_${idx}_${Date.now()}`,
      imageUrl: item.type === 'personal_face' && driveHookUrl ? driveHookUrl : (PRESET_VISUALS[item.type] || PRESET_VISUALS.businessman),
      zoomScale: 1.08 + (idx % 3) * 0.05
    }));
  } catch (error) {
    console.error('Error invoking Gemini, using local engine:', error);
    return parseTranscriptRuleBased(transcriptText, 0, driveHookUrl);
  }
}
