import React from 'react';

/**
 * Code-generated Procedural Motion Graphics
 * Covers topics like: military/submarines (sonar), finance (crash chart), statistics (counter),
 * ocean/waves, medicine (heartbeat), or floating particles.
 */
export default function ProceduralMotion({ motionType = 'sonar', headline = '', highlightText = '', isPlaying = false, progress = 0 }) {
  // Render specific animated SVG based on motionType
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white select-none">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />

      {/* 1. SONAR / RADAR / MILITARY SUBMARINE WAVES */}
      {(motionType === 'sonar' || motionType === 'military') && (
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Concentric Sonar Rings */}
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

            {/* Radar Sweeper Line */}
            <div
              className="absolute w-32 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 origin-left"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${isPlaying ? progress * 720 : 45}deg)`,
                boxShadow: '0 0 12px #22d3ee'
              }}
            />

            {/* Submarine / Target Pulse Blip */}
            <div className="w-5 h-5 rounded-full bg-cyan-400 animate-ping absolute" />
            <div className="w-3 h-3 rounded-full bg-cyan-200 absolute shadow-[0_0_15px_#22d3ee]" />

            {/* Compass / Degree ring */}
            <div className="absolute inset-2 rounded-full border border-cyan-500/30 border-dashed" />
          </div>

          <div className="mt-4 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider">
            SONAR FREQUENCY: 24.5 kHz • DETECTING
          </div>
        </div>
      )}

      {/* 2. OCEAN WAVES / MARINE ACOUSTIC DISRUPTION */}
      {motionType === 'waves' && (
        <div className="relative z-10 w-full px-6 flex flex-col items-center">
          <svg viewBox="0 0 400 160" className="w-full h-36">
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#083344" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Wave 1 */}
            <path
              d={`M0 80 Q100 ${60 + Math.sin(progress * 15) * 20} 200 80 T400 80 L400 160 L0 160 Z`}
              fill="url(#waveGrad)"
            />
            {/* Wave 2 Sound Blast Interruption */}
            <path
              d={`M0 90 Q100 ${100 - Math.cos(progress * 20) * 25} 200 90 T400 90`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
          </svg>
          <div className="text-xs font-bengali text-sky-300 mt-2 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-600/30">
            সমুদ্রের তীব্র শব্দদূষণ তরঙ্গ (Acoustic Shockwave)
          </div>
        </div>
      )}

      {/* 3. FINANCIAL CRASH / DOWNWARD LOSS GRAPH */}
      {motionType === 'chart' && (
        <div className="relative z-10 w-full px-8 flex flex-col items-center">
          <div className="w-full h-44 bg-red-950/30 border border-red-500/30 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-red-400 font-mono">
              <span>MARKET CRASH INDEX</span>
              <span className="text-red-500 font-bold animate-pulse">▼ -78.4%</span>
            </div>
            {/* Downward Line */}
            <svg viewBox="0 0 300 100" className="w-full h-24 stroke-red-500 fill-none stroke-[3.5]">
              <path d="M0,20 L60,35 L120,25 L180,65 L240,55 L300,95" />
            </svg>
            <div className="text-center text-red-300 text-lg font-black font-sans">
              -$2,000,000,000 LOSS
            </div>
          </div>
        </div>
      )}

      {/* 4. RAPID STATISTICAL COUNTER */}
      {motionType === 'counter' && (
        <div className="relative z-10 text-center px-6">
          <div className="text-xs text-amber-400 font-mono uppercase tracking-widest mb-2">
            সর্বমোট আক্রান্ত বা মৃতের সংখ্যা
          </div>
          <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
            +{Math.min(120000, Math.floor(progress * 120000 + 4500)).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 font-bengali mt-3">
            কৃষ্ণসাগর উপকূলবর্তী অঞ্চল জুড়ে নজিরবিহীন বিপর্যয়
          </div>
        </div>
      )}

      {/* 5. ECG HEARTBEAT / CRISIS */}
      {motionType === 'heartbeat' && (
        <div className="relative z-10 w-full px-6 flex flex-col items-center">
          <div className="text-xs text-rose-400 font-mono mb-3 animate-pulse">CRITICAL CONDITION MONITOR</div>
          <svg viewBox="0 0 300 80" className="w-full h-20 stroke-rose-500 fill-none stroke-[3]">
            <path d="M0,40 L90,40 L100,10 L115,70 L130,25 L145,55 L155,40 L300,40" />
          </svg>
        </div>
      )}

      {/* 6. GENERIC PARTICLES / MAP / COSMIC (Default Fallback) */}
      {(motionType === 'particles' || motionType === 'map') && (
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-full border border-indigo-500/30 flex items-center justify-center animate-spin-slow">
            <div className="w-32 h-32 rounded-full border border-purple-500/40" />
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 animate-pulse" />
          </div>
          <div className="text-xs font-bengali text-indigo-300 mt-4">তথ্যচিত্র অ্যানিমেশন মোশন</div>
        </div>
      )}

      {/* Headline & Highlight Overlay at Bottom */}
      {(headline || highlightText) && (
        <div className="relative z-10 mt-6 text-center max-w-xs px-4">
          {highlightText && (
            <span className="inline-block px-2.5 py-1 rounded bg-yellow-400 text-black font-extrabold text-xs font-bengali mb-1.5 shadow-lg">
              {highlightText}
            </span>
          )}
          {headline && (
            <p className="text-xs text-gray-300 font-bengali leading-relaxed">{headline}</p>
          )}
        </div>
      )}
    </div>
  );
}
