import React from 'react';
import { Newspaper } from 'lucide-react';

/**
 * Professional Full-Frame Paper Collage (Vox / Johnny Harris / Abdullah Style)
 * - Fills 80%+ of the 9:16 frame with dynamic cinematic tilt & push-in
 * - Real animated SVG highlighter stroke that draws across keywords
 * - Vintage print aesthetics, micro-textures, and realistic editorial styling
 */
export default function PaperCollage({ headline = '', highlightText = '', caption = '', isPlaying = false, progress = 0 }) {
  // Highlight stroke drawing animation progress (0 to 1)
  const drawWidth = isPlaying ? Math.min(100, Math.max(0, (progress * 150))) : 100;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3 bg-[#0d0f12] overflow-hidden select-none">
      {/* Background dark studio texture & dramatic spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-black pointer-events-none" />
      
      {/* Cinematic Newspaper / Document Canvas */}
      <div 
        className="relative z-10 w-[92%] bg-[#faf8f2] text-slate-900 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#e5e0d3] transform transition-transform duration-700 ease-out"
        style={{
          transform: isPlaying 
            ? `scale(${1.02 + progress * 0.08}) rotate(${-1.5 + progress * 1}deg)` 
            : 'scale(1) rotate(-1deg)'
        }}
      >
        {/* Newspaper Masthead / Header */}
        <div className="border-b-2 border-black pb-2 mb-3">
          <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-widest text-slate-600 font-bold">
            <span>INVESTIGATIVE DOSSIER</span>
            <span>ISSUE #48 • ARCHIVE</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5">
              <Newspaper className="w-4 h-4 text-red-700 stroke-[2.5]" />
              <h4 className="font-serif font-black text-xs tracking-wider uppercase text-black">
                দৈনিক অনুসন্ধান বার্তা
              </h4>
            </div>
            <span className="text-[9px] font-mono font-bold bg-black text-white px-1.5 py-0.5 rounded">
              VERIFIED REPORT
            </span>
          </div>
        </div>

        {/* Big Editorial Headline */}
        <div className="my-3">
          <h3 className="font-serif font-black text-base sm:text-lg text-slate-950 font-bengali leading-snug tracking-tight">
            {headline || 'নিত্যপ্রয়োজনীয় দ্রব্যমূল্যের সাম্প্রতিক গতিপ্রকৃতি ও বাজার সংকট'}
          </h3>
        </div>

        {/* Real Animated SVG Marker Pen Highlight */}
        {highlightText && (
          <div className="relative my-3 inline-block">
            {/* The SVG Brush Stroke that draws from left to right */}
            <div 
              className="absolute inset-0 bg-yellow-300/90 -rotate-1 rounded-sm -z-0 transition-all duration-300 shadow-[0_0_12px_rgba(253,224,71,0.5)]"
              style={{ width: `${drawWidth}%` }}
            />
            <span className="relative z-10 px-2 py-0.5 text-sm font-black text-slate-950 font-bengali tracking-wide">
              {highlightText}
            </span>
          </div>
        )}

        {/* Narrative Excerpt Text */}
        <p className="text-[11px] text-slate-700 font-serif leading-relaxed line-clamp-3 my-2 border-l-2 border-red-700 pl-2.5 italic">
          {caption || 'বাজারে মোটা চাল, সয়াবিন তেল এবং অন্যান্য অপরিহার্য নিত্যপণ্যের অব্যাহত মূল্যবৃদ্ধি সাধারণ মানুষের প্রকৃত ক্রয়ক্ষমতাকে সংকুচিত করে ফেলেছে...'}
        </p>

        {/* Official Document Footer Stamp */}
        <div className="mt-4 pt-2.5 border-t border-slate-300 flex items-center justify-between text-[9px] font-mono text-slate-500 font-bold">
          <span>SOURCE: BENGALI NATIONAL CENSUS</span>
          <span className="text-red-700 font-black border-2 border-red-700 px-1.5 py-0.5 rounded -rotate-3 uppercase tracking-wider">
            OFFICIAL
          </span>
        </div>
      </div>
    </div>
  );
}
