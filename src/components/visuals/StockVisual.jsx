import React, { useState } from 'react';

/**
 * Contextual Stock & Dynamic Visual Component
 * Detects keywords like garments, textile, factory, worker, market, rice, oil, inflation, etc.
 */
export default function StockVisual({ imageUrl = '', query = '', caption = '', isPlaying = false, zoomScale = 1.15 }) {
  const [hasError, setHasError] = useState(false);

  const resolvedUrl = React.useMemo(() => {
    if (imageUrl && !hasError && !imageUrl.includes('placeholder')) return imageUrl;

    const text = (query + ' ' + caption).toLowerCase();

    // 1. Garments / RMG / Factory / Workers / Textile
    if (text.includes('পোশাক') || text.includes('শ্রমিক') || text.includes('গার্মেন্টস') || text.includes('ফ্যাক্টরি') || text.includes('মজুরি') || text.includes('গার্মেন্ট')) {
      return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
    }
    // 2. Market / Groceries / Rice / Oil / Food
    if (text.includes('বাজার') || text.includes('চাল') || text.includes('তেল') || text.includes('খাদ্য') || text.includes('দাম') || text.includes('মূল্য')) {
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
    }
    // 3. Money / Salary / Pay scale / Cash
    if (text.includes('বেতন') || text.includes('টাকা') || text.includes('স্কেল') || text.includes('পেনশন') || text.includes('টাকার')) {
      return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80';
    }
    // 4. Submarine / Warship / Navy
    if (text.includes('সাবমেরিন') || text.includes('যুদ্ধজাহাজ') || text.includes('মাইন') || text.includes('যুদ্ধ')) {
      return 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80';
    }
    // 5. Dolphins / Marine / Sea
    if (text.includes('ডলফিন') || text.includes('সমুদ্র') || text.includes('কৃষ্ণসাগর')) {
      return 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80';
    }

    // Dynamic AI Generated Visual via Pollinations free CDN
    if (query) {
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(query + ' cinematic documentary portrait')}?width=608&height=1080&nologo=true`;
    }

    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
  }, [imageUrl, query, caption, hasError]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      <img
        src={resolvedUrl}
        alt="Contextual visual"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-1000 ease-out"
        style={{
          transform: isPlaying ? `scale(${zoomScale || 1.15})` : 'scale(1)',
          filter: 'contrast(105%) brightness(90%)'
        }}
      />
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
