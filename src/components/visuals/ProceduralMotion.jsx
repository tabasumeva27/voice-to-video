import React from 'react';

/**
 * Code-generated Procedural Motion Graphics
 * Covers topics like: 
 * - Garments & Inflation (percentage counter, inflation index)
 * - Military & Submarines (sonar radar)
 * - Financial loss / wage disparity (chart)
 * - Market prices & commodities (rice/oil counter)
 */
export default function ProceduralMotion({ motionType = 'counter', headline = '', highlightText = '', isPlaying = false, progress = 0 }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />

      {/* 1. PERCENTAGE / INFLATION / SALARY COUNTER */}
      {(motionType === 'counter' || motionType === 'inflation') && (
        <div className="relative z-10 w-full px-6 flex flex-col items-center text-center">
          <div className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-mono uppercase tracking-widest mb-3">
            মূল্যস্ফীতি বনাম মজুরি অনুপাত
          </div>
          
          <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]">
            {highlightText?.includes('%') || highlightText?.includes('শতাংশ') 
              ? (highlightText) 
              : `১২,৫০০ ৳`}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs font-mono text-gray-300">
            <span className="px-2 py-1 bg-red-900/40 border border-red-700/50 rounded">মূল্যস্ফীতি: ৮.৮%</span>
            <span className="px-2 py-1 bg-blue-900/40 border border-blue-700/50 rounded">মজুরি বৃদ্ধি: ৮.১%</span>
          </div>

          <div className="w-56 h-1.5 bg-gray-800 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-150"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. FINANCIAL / WAGE DISPARITY CHART */}
      {motionType === 'chart' && (
        <div className="relative z-10 w-full px-6 flex flex-col items-center">
          <div className="w-full max-w-[280px] bg-red-950/40 border border-red-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between text-xs text-red-400 font-mono">
              <span>WAGE DEFICIT GRAPH</span>
              <span className="text-red-400 font-bold animate-pulse">টানা ৫৬ মাস</span>
            </div>
            {/* Real SVG Loss / Disparity Curve */}
            <svg viewBox="0 0 300 120" className="w-full h-24 my-2 stroke-red-500 fill-none stroke-[4]">
              <path d="M0,20 L50,30 L100,50 L150,45 L200,85 L250,80 L300,110" />
            </svg>
            <div className="text-center text-red-300 text-sm font-bold font-bengali">
              মজুরি স্থির • নিত্যপণ্যের দাম ঊর্ধ্বমুখী
            </div>
          </div>
        </div>
      )}

      {/* 3. SONAR / RADAR / WAVES (For submarine/military topics) */}
      {(motionType === 'sonar' || motionType === 'military') && (
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {[1, 2, 3, 4].map((ring) => {
              const scale = ((progress * 3 + ring * 0.25) % 1) * 1.5;
              const opacity = Math.max(0, 1 - scale);
              return (
                <div
                  key={ring}
                  className="absolute inset-0 rounded-full border border-cyan-400"
                  style={{
                    transform: isPlaying ? `scale(${scale})` : `scale(${ring * 0.3})`,
                    opacity: isPlaying ? opacity : 0.4,
                    transition: 'transform 0.05s linear'
                  }}
                />
              );
            })}
            <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping absolute" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-200 absolute shadow-[0_0_15px_#22d3ee]" />
          </div>
        </div>
      )}

      {/* 4. MARKET COMMODITY METER */}
      {(motionType === 'market' || motionType === 'waves') && (
        <div className="relative z-10 w-full px-6 flex flex-col items-center text-center">
          <div className="text-xs text-amber-400 font-mono mb-2">নিত্যপ্রয়োজনীয় দ্রব্যমূল্য সূচক</div>
          <div className="text-2xl font-black text-white font-bengali">
            চাল: ৫৫-৭৫ ৳ • তেল: ১৬২-১৭০ ৳
          </div>
          <div className="mt-3 text-xs text-gray-400 font-bengali">
            কেনার ক্ষমতা ১২,৫০০ ৳ থেকে নেমে ১০,৫০০ ৳ সমমূল্যে
          </div>
        </div>
      )}

      {/* Bottom Context Badge */}
      <div className="relative z-10 mt-6 text-center max-w-xs px-4">
        {highlightText && (
          <span className="inline-block px-3 py-1 rounded bg-yellow-400 text-black font-black text-xs font-bengali mb-1.5 shadow-lg">
            {highlightText}
          </span>
        )}
        {headline && (
          <p className="text-xs text-gray-300 font-bengali leading-relaxed">{headline}</p>
        )}
      </div>
    </div>
  );
}
