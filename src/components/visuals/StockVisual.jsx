import React, { useState } from 'react';

/**
 * Contextual Stock & Dynamic Visual Component
 * If a specific URL fails or is empty, generates on-the-fly contextual visuals
 * using Pollinations.ai or smart curated fallbacks.
 */
export default function StockVisual({ imageUrl = '', query = '', caption = '', isPlaying = false, zoomScale = 1.15 }) {
  const [hasError, setHasError] = useState(false);

  // Determine fallback image source dynamically from query or caption
  const resolvedUrl = React.useMemo(() => {
    if (imageUrl && !hasError) return imageUrl;

    const textToAnalyze = (query + ' ' + caption).toLowerCase();
    
    // Dolphins / Marine Life / Ocean
    if (textToAnalyze.includes('dolphin') || textToAnalyze.includes('ডলফিন') || textToAnalyze.includes('তিমি') || textToAnalyze.includes('প্রাণী')) {
      return 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80';
    }
    // Submarine / Warship / Military / War
    if (textToAnalyze.includes('submarine') || textToAnalyze.includes('সাবমেরিন') || textToAnalyze.includes('যুদ্ধ') || textToAnalyze.includes('জাহাজ') || textToAnalyze.includes('মাইন')) {
      return 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80';
    }
    // Deep Ocean / Sea / Water
    if (textToAnalyze.includes('sea') || textToAnalyze.includes('ocean') || textToAnalyze.includes('সমুদ্র') || textToAnalyze.includes('পানি')) {
      return 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80';
    }
    // Economy / Finance / Loss
    if (textToAnalyze.includes('money') || textToAnalyze.includes('টাকা') || textToAnalyze.includes('ব্যাংক') || textToAnalyze.includes('অর্থনীতি')) {
      return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80';
    }
    // Space / Planet
    if (textToAnalyze.includes('space') || textToAnalyze.includes('মহাকাশ') || textToAnalyze.includes('মঙ্গল')) {
      return 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80';
    }

    // Dynamic AI prompt generator from query
    if (query) {
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(query + ' cinematic 9:16 documentary wallpaper')}?width=608&height=1080&nologo=true`;
    }

    return 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80';
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
          filter: 'contrast(108%) brightness(95%)'
        }}
      />
      {/* Dark Vignette Overlay for Captions */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
}
