import React from 'react';
import { Newspaper } from 'lucide-react';

/**
 * Paper Collage / Document with animated marker highlight (Vox & Abdullah style)
 */
export default function PaperCollage({ headline = '', highlightText = '', caption = '', isPlaying = false }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-5 bg-[#1a1715] overflow-hidden select-none">
      {/* Background vintage texture */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px]" />

      {/* Floating Paper Document Frame */}
      <div className="relative z-10 w-full max-w-[280px] bg-[#fbf9f4] text-gray-900 rounded-xl p-4 shadow-2xl border border-[#e5e0d4] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
        {/* Newspaper Masthead */}
        <div className="border-b-2 border-black/80 pb-2 mb-3">
          <div className="flex items-center justify-between text-[9px] uppercase font-serif tracking-widest text-gray-700">
            <span>Special Report</span>
            <span>Issue #48</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Newspaper className="w-4 h-4 text-red-700" />
            <h4 className="font-serif font-black text-xs tracking-wider uppercase text-black">
              দৈনিক অনুসন্ধান বার্তা
            </h4>
          </div>
        </div>

        {/* Article Headline */}
        <div className="my-2">
          <h3 className="font-serif font-extrabold text-sm text-gray-950 font-bengali leading-snug">
            {headline || 'কৃষ্ণসাগরে যুদ্ধজাহাজ ও সাবমেরিনের ধ্বংসাত্মক প্রভাব'}
          </h3>
        </div>

        {/* Marker Highlight Effect on Highlight Text */}
        {highlightText && (
          <div className="my-2.5">
            <span className="relative inline-block px-1 py-0.5 text-xs font-bold text-gray-950 font-bengali">
              <span className="absolute inset-0 bg-yellow-300/85 -rotate-1 rounded-sm -z-0 transition-all duration-500" />
              <span className="relative z-10">{highlightText}</span>
            </span>
          </div>
        )}

        {/* Dummy/Real Document Excerpt */}
        <p className="text-[10px] text-gray-600 font-serif leading-relaxed line-clamp-3">
          {caption || 'সামরিক রাডার এবং তীব্র শব্দতরঙ্গের প্রভাবে অবোলা সামুদ্রিক প্রাণীদের জীবন চরম ঝুঁকির মুখে পতিত হয়েছে...'}
        </p>

        {/* Document Stamp */}
        <div className="mt-3 pt-2 border-t border-gray-300 flex items-center justify-between text-[8px] font-mono text-gray-500">
          <span>CLASSIFIED EVIDENCE</span>
          <span className="text-red-600 font-bold border border-red-500 px-1 py-0.2 rounded uppercase">VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
