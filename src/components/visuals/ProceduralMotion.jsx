import React from 'react';

/**
 * Universal High-End Procedural Motion Graphics (Vox / Johnny Harris Data Journalism Style)
 * 100% dynamic — adapts to any topic via highlightText, headline, metrics, and motionType.
 */
export default function ProceduralMotion({
  motionType = 'counter',
  headline = '',
  highlightText = '',
  metrics = [],
  isPlaying = false,
  progress = 0
}) {
  const safeHighlight = highlightText || 'মূল তথ্য';
  const safeHeadline = headline || 'তথ্যচিত্র বিশ্লেষণ';
  const metricList = Array.isArray(metrics) && metrics.length > 0 ? metrics.slice(0, 2) : [];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white select-none">
      {/* Ambient radial glow & subtle isometric grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950 to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* 1. ODOMETER COUNTER / STATISTIC SPOTLIGHT */}
      {(motionType === 'counter' || motionType === 'inflation') && (
        <div className="relative z-10 w-full px-6 flex flex-col items-center text-center">
          <div className="px-3.5 py-1 rounded-full bg-indigo-950/90 border border-indigo-400/50 text-indigo-200 text-[10px] font-mono uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            KEY STATISTIC • মূল পরিসংখ্যান
          </div>

          <div
            className="text-3xl sm:text-4xl font-black text-amber-300 font-bengali tracking-tight drop-shadow-[0_0_30px_rgba(251,191,36,0.75)] transition-transform duration-300"
            style={{ transform: isPlaying ? `scale(${1 + Math.sin(progress * Math.PI) * 0.08})` : 'scale(1)' }}
          >
            {safeHighlight}
          </div>

          {metricList.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bengali text-slate-200">
              {metricList.map((m, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-md font-bold border ${
                    idx === 0
                      ? 'bg-red-900/50 border-red-500/60 text-red-200'
                      : 'bg-sky-900/50 border-sky-500/60 text-sky-200'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
          )}

          <div className="w-60 h-2 bg-slate-800 rounded-full mt-5 p-0.5 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-full transition-all duration-150 shadow-[0_0_12px_rgba(249,115,22,0.8)]"
              style={{ width: `${Math.min(100, Math.max(15, progress * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. DYNAMIC DATA / TREND CHART */}
      {motionType === 'chart' && (
        <div className="relative z-10 w-full px-6 flex flex-col items-center">
          <div className="w-full max-w-[300px] bg-slate-900/85 border border-rose-500/45 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between text-[10px] text-rose-300 font-mono border-b border-slate-800 pb-2">
              <span className="font-bold tracking-wider">TREND ANALYTICS</span>
              <span className="text-amber-300 font-bold animate-pulse">LIVE DATA</span>
            </div>

            <svg viewBox="0 0 300 120" className="w-full h-28 my-2">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,25 L50,40 L100,32 L150,65 L200,58 L250,92 L300,108 L300,120 L0,120 Z" fill="url(#chartGlow)" />
              <path
                d="M0,25 L50,40 L100,32 L150,65 L200,58 L250,92 L300,108"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="420"
                strokeDashoffset={isPlaying ? Math.max(0, 420 - progress * 480) : 0}
              />
            </svg>

            <div className="text-center text-slate-200 text-xs font-bold font-bengali line-clamp-1">
              {safeHeadline}
            </div>
          </div>
        </div>
      )}

      {/* 3. SONAR RADAR / ACOUSTIC WAVE OSCILLATOR */}
      {(motionType === 'sonar' || motionType === 'military' || motionType === 'waves') && (
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {[1, 2, 3, 4].map((ring) => {
              const scale = ((progress * 3 + ring * 0.25) % 1) * 1.45;
              const opacity = Math.max(0, 1 - scale);
              return (
                <div
                  key={ring}
                  className="absolute inset-0 rounded-full border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  style={{
                    transform: isPlaying ? `scale(${scale})` : `scale(${ring * 0.28})`,
                    opacity: isPlaying ? opacity : 0.45,
                    transition: 'transform 0.05s linear'
                  }}
                />
              );
            })}
            <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping absolute" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-200 absolute shadow-[0_0_20px_#22d3ee]" />
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono">
            SIGNAL & WAVE MONITOR
          </div>
        </div>
      )}

      {/* 4. ECG HEARTBEAT / CRISIS PULSE */}
      {motionType === 'heartbeat' && (
        <div className="relative z-10 w-full px-6 flex flex-col items-center">
          <div className="text-[11px] text-rose-400 font-mono mb-3 animate-pulse">CRITICAL PULSE MONITOR</div>
          <svg viewBox="0 0 300 80" className="w-full h-20 stroke-rose-500 fill-none stroke-[3]">
            <path d="M0,40 L85,40 L98,10 L114,72 L130,22 L146,56 L158,40 L300,40" />
          </svg>
        </div>
      )}

      {/* 5. GENERIC PARTICLES / COSMIC ORBIT */}
      {(motionType === 'particles' || motionType === 'map') && (
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="relative w-44 h-44 rounded-full border border-indigo-500/40 flex items-center justify-center"
            style={{ transform: `rotate(${progress * 180}deg)` }}
          >
            <div className="w-28 h-28 rounded-full border border-purple-500/50" />
            <div className="w-12 h-12 rounded-full bg-indigo-500/30 animate-pulse" />
          </div>
        </div>
      )}

      {/* Bottom Kinetic Headline Anchor */}
      <div className="relative z-10 mt-5 text-center max-w-xs px-4">
        <span className="inline-block px-3 py-1 rounded-lg bg-yellow-400 text-slate-950 font-black text-xs font-bengali mb-1.5 shadow-lg">
          {safeHighlight}
        </span>
        <p className="text-xs text-slate-300 font-bengali leading-relaxed font-medium line-clamp-2">
          {safeHeadline}
        </p>
      </div>
    </div>
  );
}
