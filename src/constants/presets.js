// Visual Assets, Sample Scripts, and Scene Type Definitions

export const SCENE_TYPES = {
  PERSONAL_FACE: {
    id: 'personal_face',
    name: 'ব্যক্তিগত হুক ফুটেজ (Face Hook)',
    color: '#6366F1',
    description: 'ড্রাইভ থেকে আপনার নিজস্ব কথা বলার ভিডিও ফুটেজ'
  },
  FINANCIAL_LOSS: {
    id: 'financial_loss',
    name: 'আর্থিক হিসাব ও পতনের গ্রাফ',
    color: '#EF4444',
    description: 'টাকা/ডলারের বড় সংখ্যা এবং নিম্নমুখী লাল গ্রাফ'
  },
  SPACE_EXPLORATION: {
    id: 'space_exploration',
    name: 'মহাকাশ ও ভবিষ্যৎ বিজ্ঞান',
    color: '#8B5CF6',
    description: 'নক্ষত্রমণ্ডলী, মহাকাশচারীর কাট-আউট ও কসমিক মোশন'
  },
  NEWS_HEADLINE: {
    id: 'news_headline',
    name: 'নিউজপেপার ও মার্কার হাইলাইট',
    color: '#F59E0B',
    description: 'সংবাদের শিরোনামে হলুদ মার্কার দিয়ে হাইলাইট'
  },
  MEDICAL_CRISIS: {
    id: 'medical_crisis',
    name: 'চিকিৎসা ও স্বাস্থ্য সংকট',
    color: '#EC4899',
    description: 'হার্টবিট পালস, হাসপাতাল এবং নাটকীয় ভিজ্যুয়াল'
  },
  DOCUMENTARY_CUTOUT: {
    id: 'documentary_cutout',
    name: '2.5D কাট-আউট ও পেপার টেক্সচার',
    color: '#10B981',
    description: 'চরিত্রের পিএনজি কাট-আউট এবং ভিন্টেজ পেপার লুক'
  }
};

// Rich Built-in SVG Visual Assets for offline, instant, HD rendering
export const PRESET_VISUALS = {
  astronaut: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  space_bg: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  economy_chart: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  newspaper: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
  hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  businessman: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  bangladesh_city: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80'
};

// Sample Pre-configured Stories for 1-Click Testing
export const SAMPLE_STORIES = [
  {
    id: 'story_economy',
    title: 'বাংলাদেশের অর্থনীতির বড় ক্ষতি',
    audioText: 'এ বছর বাংলাদেশের অর্থনীতিতে প্রায় দুই বিলিয়ন ডলারের ক্ষতি হয়েছে। গতকাল যে ব্যবসাগুলো সগৌরবে দাঁড়িয়ে ছিল, আজ তারা দেউলিয়ার পথে। এই বিশাল সংকটের আসল কারণ কী?',
    duration: 18,
    scenes: [
      {
        id: 's_1',
        startTime: 0,
        endTime: 5,
        type: 'personal_face',
        caption: 'এ বছর বাংলাদেশের অর্থনীতিতে কী ঘটেছে?',
        headline: 'সবচেয়ে বড় অর্থনৈতিক ধাক্কা',
        highlightText: 'দুই বিলিয়ন ডলার',
        soundFx: 'whoosh',
        zoomScale: 1.08,
        imageUrl: PRESET_VISUALS.businessman
      },
      {
        id: 's_2',
        startTime: 5,
        endTime: 11,
        type: 'financial_loss',
        caption: 'প্রায় দুই বিলিয়ন ডলারের নজিরবিহীন ক্ষতি!',
        headline: 'রপ্তানি ও রেমিটেন্সে তীব্র ধস',
        highlightText: '$2,000,000,000 Loss',
        soundFx: 'cash',
        zoomScale: 1.15,
        imageUrl: PRESET_VISUALS.economy_chart
      },
      {
        id: 's_3',
        startTime: 11,
        endTime: 18,
        type: 'news_headline',
        caption: 'আজ বহু শীর্ষ প্রতিষ্ঠান চরম দেউলিয়ার মুখে।',
        headline: 'দৈনিক সংবাদ: ঋণখেলাপি ও ব্যাংক সংকট চরম সীমায়',
        highlightText: 'দেউলিয়ার পথে শত প্রতিষ্ঠান',
        soundFx: 'camera',
        zoomScale: 1.1,
        imageUrl: PRESET_VISUALS.newspaper
      }
    ]
  },
  {
    id: 'story_space',
    title: 'মঙ্গল গ্রহে মানবজাতির নতুন স্বপ্ন',
    audioText: 'মহাকাশচারীরা আজ অনন্ত মহাবিশ্ব ঘুরে বেরিয়ে মঙ্গল গ্রহে মানবজাতির বসবাসের স্বপ্ন দেখছে। পৃথিবী ছাড়িয়ে বহু দূর গ্যালাক্সিতে আমাদের দ্বিতীয় ঠিকানার সন্ধান শুরু হয়েছে।',
    duration: 16,
    scenes: [
      {
        id: 's_sp_1',
        startTime: 0,
        endTime: 5,
        type: 'personal_face',
        caption: 'আমরা কি সত্যিই মঙ্গলে বাস করতে পারব?',
        headline: 'মহাকাশের নতুন যুগে মানবজাতি',
        highlightText: 'দ্বিতীয় পৃথিবী',
        soundFx: 'whoosh',
        zoomScale: 1.05,
        imageUrl: PRESET_VISUALS.astronaut
      },
      {
        id: 's_sp_2',
        startTime: 5,
        endTime: 11,
        type: 'space_exploration',
        caption: 'অনন্ত মহাবিশ্বে চলছে দ্বিতীয় পৃথিবীর অনুসন্ধান!',
        headline: 'মিশন মার্স ২০২৬: লাল গ্রহের রহস্য',
        highlightText: 'মঙ্গল গ্রহে মানব বসতি',
        soundFx: 'boom',
        zoomScale: 1.18,
        imageUrl: PRESET_VISUALS.space_bg
      },
      {
        id: 's_sp_3',
        startTime: 11,
        endTime: 16,
        type: 'documentary_cutout',
        caption: 'বিজ্ঞানীদের মতে এই স্বপ্ন এখন আর কল্পবিজ্ঞান নয়।',
        headline: 'স্পেস স্টেশনের নতুন গবেষণা পত্র',
        highlightText: 'ভবিষ্যতের ঠিকানা',
        soundFx: 'pop',
        zoomScale: 1.1,
        imageUrl: PRESET_VISUALS.astronaut
      }
    ]
  }
];
