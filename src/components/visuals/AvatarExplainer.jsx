import React from 'react';

/**
 * Animated SVG Explainer Character (Vox/Documentary style avatar)
 * Automatically animates speaking mouth, eye blinks, and dynamic body motion
 */
export default function AvatarExplainer({ caption = '', mood = 'neutral', isPlaying = false, progress = 0 }) {
  // Eye blink calculation
  const isBlinking = isPlaying && (Math.sin(progress * 40) > 0.92);
  // Mouth opening calculation tied to audio playback progress
  const mouthOpen = isPlaying ? Math.abs(Math.sin(progress * 70)) * 14 + 2 : 3;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950">
      {/* Background Ambient Glow & Grid */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Subtle Studio Light */}
      <div className="absolute -top-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Explainer Avatar */}
      <div className="relative z-10 w-52 h-64 sm:w-60 sm:h-72 transition-transform duration-300"
           style={{ transform: isPlaying ? `translateY(${Math.sin(progress * 20) * 4}px)` : 'none' }}>
        <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Body / Shoulders */}
          <path d="M40 240 C40 180, 70 160, 100 160 C130 160, 160 180, 160 240 Z" fill="url(#suitGrad)" />
          {/* Shirt Collar / Tie */}
          <polygon points="100,165 85,190 115,190" fill="#ffffff" />
          <polygon points="100,175 95,230 100,240 105,230" fill="#ef4444" />

          {/* Neck */}
          <rect x="88" y="130" width="24" height="35" rx="6" fill="#fbcfe8" />

          {/* Head */}
          <ellipse cx="100" cy="95" rx="42" ry="48" fill="url(#skinGrad)" />

          {/* Modern Hair */}
          <path d="M56 85 C56 50, 75 40, 100 40 C128 40, 144 52, 144 85 C144 70, 130 54, 100 54 C70 54, 58 70, 56 85 Z" fill="url(#hairGrad)" />

          {/* Glasses Frame (Gives smart analyst/documentary explainer look) */}
          <rect x="70" y="82" width="24" height="18" rx="4" fill="none" stroke="#1e293b" strokeWidth="3" />
          <rect x="106" y="82" width="24" height="18" rx="4" fill="none" stroke="#1e293b" strokeWidth="3" />
          <line x1="94" y1="90" x2="106" y2="90" stroke="#1e293b" strokeWidth="3" />

          {/* Eyes (Blinking animated) */}
          {isBlinking ? (
            <>
              <line x1="75" y1="91" x2="89" y2="91" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="111" y1="91" x2="125" y2="91" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="82" cy="91" r="3.5" fill="#0f172a" />
              <circle cx="118" cy="91" r="3.5" fill="#0f172a" />
              <circle cx="83.5" cy="89.5" r="1" fill="#ffffff" />
              <circle cx="119.5" cy="89.5" r="1" fill="#ffffff" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M72 76 Q82 72 90 76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M110 76 Q118 72 128 76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Nose */}
          <path d="M100 95 L98 108 L104 108" stroke="#f472b6" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Animated Talking Mouth */}
          <ellipse cx="100" cy="122" rx={mouthOpen > 5 ? 10 : 7} ry={mouthOpen} fill="#881337" />
          {mouthOpen > 6 && (
            <ellipse cx="100" cy="119" rx="6" ry="2" fill="#ffffff" />
          )}
        </svg>
      </div>

      {/* Explainer Badge */}
      <div className="relative z-10 mt-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-bengali text-indigo-300">
        🎙️ এক্সপ্লেনার উপস্থাপক
      </div>
    </div>
  );
}
