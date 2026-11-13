// Visual Assets, Sample Scripts, and 4-Layer Dynamic Scene Definitions

export const SCENE_TYPES = {
  PERSONAL_HOOK: {
    id: 'personal_hook',
    name: 'ব্যক্তিগত হুক ফুটেজ (Face Hook)',
    color: '#6366F1',
    description: 'আপনার নিজস্ব কথা বলার ভিডিও বা অ্যানিমেটেড এক্সপ্লেনার'
  },
  AVATAR_EXPLAINER: {
    id: 'avatar_explainer',
    name: 'অ্যানিমেটেড এক্সপ্লেনার (SVG Avatar)',
    color: '#8B5CF6',
    description: 'কথা বলা অবতার চরিত্র ও স্টুডিও ব্যাকগ্রাউন্ড'
  },
  PROCEDURAL_MOTION: {
    id: 'procedural_motion',
    name: 'কোড-মোশন গ্রাফিক্স (Sonar/Chart/Map)',
    color: '#06B6D4',
    description: 'সোনার তরঙ্গ, কাউন্টার, নিম্নমুখী চার্ট বা সমুদ্রের অ্যানিমেশন'
  },
  PAPER_COLLAGE: {
    id: 'paper_collage',
    name: 'নিউজপেপার ও পেপার কোলাজ',
    color: '#F59E0B',
    description: 'সংবাদের পেপার টেক্সচার ও মার্কার দিয়ে হাইলাইট'
  },
  STOCK_VISUAL: {
    id: 'stock_visual',
    name: 'ডাইনামিক স্টক ভিজ্যুয়াল (Ken Burns)',
    color: '#10B981',
    description: 'বিষয় অনুযায়ী নিখুঁত সামঞ্জস্যপূর্ণ হাই-রেজোলিউশন ভিজ্যুয়াল'
  }
};

// Curated high quality presets matching popular explainer topics
export const PRESET_VISUALS = {
  dolphin: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80',
  submarine: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80',
  ocean: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
  economy_chart: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  newspaper: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
  space_bg: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
};

// Rich Sample Story demonstrating the 4-layer ratio
export const SAMPLE_STORIES = [
  {
    id: 'story_dolphin_blacksea',
    title: 'কৃষ্ণসাগরে ডলফিন ট্র্যাজেডি ও সাবমেরিন যুদ্ধ',
    audioText: 'আমরা নিজেদের সৃষ্টির সেরা জীব বলে গর্ব করি। কিন্তু রাশিয়া-ইউক্রেন যুদ্ধের বিধ্বংসী প্রভাব এবার এসে পড়েছে কৃষ্ণসাগরের অবোলা প্রাণীদের ওপর। সামরিক সাবমেরিন ও যুদ্ধজাহাজের তীব্র শব্দতরঙ্গ সমুদ্রের ডলফিনদের কানের সংবেদনশীল অংশ পুরোপুরি ধ্বংস করে দিচ্ছে। ফলে প্রায় ১ লাখ ২০ হাজার ডলফিন মারা গেছে।',
    duration: 24,
    scenes: [
      {
        id: 's_1',
        startTime: 0,
        endTime: 6,
        visualType: 'avatar_explainer',
        motionType: 'particles',
        caption: 'আমরা নিজেদের সৃষ্টির সেরা জীব বলে গর্ব করি।',
        headline: 'মানুষ কি সত্যিই সৃষ্টির সেরা জীব?',
        highlightText: 'সৃষ্টির সেরা জীব',
        soundFx: 'whoosh',
        zoomScale: 1.05
      },
      {
        id: 's_2',
        startTime: 6,
        endTime: 12,
        visualType: 'stock_visual',
        motionType: 'waves',
        caption: 'রাশিয়া-ইউক্রেন যুদ্ধের বিধ্বংসী প্রভাব এবার পড়েছে কৃষ্ণসাগরে।',
        headline: 'কৃষ্ণসাগরে সামরিক সংঘাতের কালো ছায়া',
        highlightText: 'কৃষ্ণসাগরে যুদ্ধ',
        soundFx: 'boom',
        zoomScale: 1.15,
        imageUrl: PRESET_VISUALS.ocean,
        searchQuery: 'black sea warships navy military'
      },
      {
        id: 's_3',
        startTime: 12,
        endTime: 18,
        visualType: 'procedural_motion',
        motionType: 'sonar',
        caption: 'সাবমেরিনের তীব্র শব্দতরঙ্গ ডলফিনদের কান বধির করে দিচ্ছে।',
        headline: 'সাবমেরিনের প্রাণঘাতী সোনার ফ্রিকোয়েন্সি',
        highlightText: 'তীব্র শব্দতরঙ্গ',
        soundFx: 'whoosh',
        zoomScale: 1.1
      },
      {
        id: 's_4',
        startTime: 18,
        endTime: 24,
        visualType: 'paper_collage',
        motionType: 'counter',
        caption: 'উপকূলে এ পর্যন্ত প্রায় ১ লাখ ২০ হাজার ডলফিন মারা গেছে।',
        headline: 'আন্তর্জাতিক পরিবেশবিদদের আঁতকে ওঠার মতো রিপোর্ট',
        highlightText: '১,২০,০০০ ডলফিন মৃত',
        soundFx: 'camera',
        zoomScale: 1.08
      }
    ]
  }
];
