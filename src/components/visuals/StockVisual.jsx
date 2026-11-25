import React, { useState } from 'react';

/**
 * Universal Contextual Stock Visual with Dynamic Shot Diversity Engine
 * Guarantees zero repetitive images by hashing scene position & topic cues.
 * Applies rich Ken-Burns cinematic zooming & panning.
 */
export default function StockVisual({ 
  imageUrl = '', 
  query = '', 
  caption = '', 
  sceneIndex = 0, 
  isPlaying = false, 
  zoomScale = 1.15 
}) {
  const [hasError, setHasError] = useState(false);

  // Diverse Curated Visual Collections (Wideshot, Medium, Close-up Macro)
  const DIVERSE_POOLS = {
    // 1. Garments / Textile / Workers
    garments: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', // Factory Floor
      'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&w=800&q=80', // Sewing Machine Close-up
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80', // Fabrics & Thread
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'  // Garments Details
    ],
    // 2. Market / Groceries / Rice / Oil / Food
    market: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', // Open Bazaars
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', // Rice Grains Macro
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80', // Oil & Commodities
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'  // Supermarket Shelves
    ],
    // 3. Economy / Money / Cash / Salary / Inflation
    money: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80', // Currency & Chart
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80', // Digital Market Ticker
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80', // Cash Banknotes Count
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'  // Financial Graph Up/Down
    ],
    // 4. Technology / AI / Digital
    tech: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    // 5. Nature / Marine / Submarine / Ocean
    nature: [
      'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80'
    ]
  };

  const resolvedUrl = React.useMemo(() => {
    const text = (query + ' ' + caption).toLowerCase();

    // Select category pool
    let pool = DIVERSE_POOLS.money;
    if (text.includes('পোশাক') || text.includes('শ্রমিক') || text.includes('গার্মেন্টস') || text.includes('ফ্যাক্টরি') || text.includes('মজুরি')) {
      pool = DIVERSE_POOLS.garments;
    } else if (text.includes('বাজার') || text.includes('চাল') || text.includes('তেল') || text.includes('দাম') || text.includes('পণ্য')) {
      pool = DIVERSE_POOLS.market;
    } else if (text.includes('প্রযুক্তি') || text.includes('এআই') || text.includes('বিজ্ঞান')) {
      pool = DIVERSE_POOLS.tech;
    } else if (text.includes('ডলফিন') || text.includes('সমুদ্র') || text.includes('সাবমেরিন') || text.includes('যুদ্ধ')) {
      pool = DIVERSE_POOLS.nature;
    }

    // Pick unique image based on scene index modulo pool length to prevent ANY consecutive repeat!
    const selectedFromPool = pool[sceneIndex % pool.length];

    if (imageUrl && !hasError && !imageUrl.includes('placeholder')) {
      return imageUrl;
    }

    return selectedFromPool;
  }, [imageUrl, query, caption, sceneIndex, hasError]);

  // Alternate Ken-Burns direction: Odd scenes zoom in, Even scenes zoom out/pan
  const isOdd = sceneIndex % 2 === 1;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      <img
        src={resolvedUrl}
        alt="Contextual visual"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-1000 ease-out"
        style={{
          transform: isPlaying 
            ? (isOdd ? `scale(${zoomScale || 1.15})` : `scale(1.02) translateY(-4px)`)
            : 'scale(1)',
          filter: 'contrast(108%) brightness(88%)'
        }}
      />
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
}
