import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, 
  Sparkles, TrendingDown, Radio, Activity, Newspaper, Rocket
} from 'lucide-react';
import { soundEffects } from '../services/audioSynthesizer';

export default function ReelPreviewPlayer({ scenes, currentSceneIndex, onSceneChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const previousSceneIndexRef = useRef(null);

  const totalDuration = scenes && scenes.length > 0
    ? scenes.reduce((acc, s) => acc + (s.duration || (s.endTime - s.startTime)), 0)
    : 10;

  // Find active scene based on currentTime
  let accumulatedTime = 0;
  let activeIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    const d = scenes[i].duration || (scenes[i].endTime - scenes[i].startTime);
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + d) {
      activeIndex = i;
      break;
    }
    accumulatedTime += d;
    if (i === scenes.length - 1) activeIndex = i;
  }

  const activeScene = scenes && scenes[activeIndex] ? scenes[activeIndex] : null;

  // Trigger sound effect on scene change
  useEffect(() => {
    if (isPlaying && activeIndex !== previousSceneIndexRef.current && activeScene) {
      soundEffects.playSoundForType(activeScene.soundFx || 'whoosh');
      previousSceneIndexRef.current = activeIndex;
      if (onSceneChange) onSceneChange(activeIndex);
    }
  }, [activeIndex, isPlaying, activeScene, onSceneChange]);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const updateTimer = (timestamp) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const delta = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        setCurrentTime((prev) => {
          if (prev + delta >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + delta;
        });

        animationFrameRef.current = requestAnimationFrame(updateTimer);
      };

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      lastTimeRef.current = null;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, totalDuration]);

  // Jump to specific scene when clicked in parent
  useEffect(() => {
    if (currentSceneIndex !== undefined && currentSceneIndex !== null) {
      let t = 0;
      for (let i = 0; i < currentSceneIndex; i++) {
        t += scenes[i]?.duration || (scenes[i]?.endTime - scenes[i]?.startTime) || 0;
      }
      setCurrentTime(t + 0.1);
    }
  }, [currentSceneIndex]);

  const togglePlay = () => {
    soundEffects.init();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeScene) {
    return (
      <div className="w-full aspect-[9/16] max-w-[340px] mx-auto bg-gray-950 rounded-3xl border border-gray-800 flex items-center justify-center p-6 text-center text-gray-500 font-bengali">
        রিল প্রিভিউ দেখতে উপরে একটি স্টোরি বা ভয়েস আপলোড করুন
      </div>
    );
  }

  // Calculate word-level highlighted captions
  const words = (activeScene.caption || '').split(/\s+/).filter(Boolean);
  const sceneStart = accumulatedTime - (activeScene.duration || 5);
  const sceneProgress = Math.max(0, Math.min(1, (currentTime - (accumulatedTime - (activeScene.duration || 5))) / (activeScene.duration || 5)));
  const activeWordIndex = Math.min(words.length - 1, Math.floor(sceneProgress * words.length));

  return (
    <div className="flex flex-col items-center">
      {/* 9:16 Mobile Phone Frame */}
      <div className="relative w-full aspect-[9/16] max-w-[340px] bg-black rounded-[36px] overflow-hidden shadow-2xl border-4 border-gray-800/90 select-none group">
        
        {/* Background Visual Layer with Ken Burns Zoom */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={activeScene.imageUrl}
            alt="Scene background"
            className="w-full h-full object-cover transition-all duration-1000 ease-out"
            style={{
              transform: isPlaying ? `scale(${activeScene.zoomScale || 1.15})` : 'scale(1)',
              filter: activeScene.type === 'medical_crisis' ? 'grayscale(40%) contrast(120%)' : 'contrast(105%)'
            }}
          />
        </div>

        {/* Paper texture and subtle film grain overlay */}
        <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none"></div>

        {/* Top Header Information in Reel */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-bengali font-semibold">HD REEL</span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-gray-300 font-mono">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>
        </div>

        {/* Dynamic Scene Type Visual Overlays */}
        
        {/* 1. PERSONAL FACE HOOK OVERLAY */}
        {activeScene.type === 'personal_face' && (
          <div className="absolute top-16 left-4 right-4 z-20 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/90 text-white text-xs font-bengali shadow-lg backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>উপস্থাপকের ভয়েস হুক</span>
            </div>
            {/* Audio Waveform simulation */}
            <div className="mt-2 flex items-center gap-1 h-4">
              {[40, 80, 60, 100, 70, 90, 50, 85, 65, 95].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-400 rounded-full transition-all duration-150"
                  style={{
                    height: isPlaying ? `${Math.random() * 80 + 20}%` : '30%'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. FINANCIAL LOSS OVERLAY */}
        {activeScene.type === 'financial_loss' && (
          <div className="absolute inset-x-4 top-1/4 z-20 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bengali mb-2 shadow-lg">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>আর্থিক ক্ষতি ও পতন</span>
            </div>
            <div className="text-3xl font-extrabold text-red-400 font-sans tracking-tight drop-shadow-[0_4px_12px_rgba(239,68,68,0.6)]">
              -$2,000,000,000
            </div>
            <p className="text-xs text-red-200/90 font-bengali mt-1">
              {activeScene.headline || 'বিশাল অর্থনৈতিক ধাক্কা'}
            </p>
          </div>
        )}

        {/* 3. SPACE EXPLORATION OVERLAY */}
        {activeScene.type === 'space_exploration' && (
          <div className="absolute inset-x-4 top-1/4 z-20 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/90 text-white text-xs font-bengali mb-2 shadow-lg">
              <Rocket className="w-3.5 h-3.5 text-purple-200" />
              <span>মিশন মার্স ২০২৬</span>
            </div>
            <div className="text-xl font-bold text-purple-200 font-bengali drop-shadow-[0_2px_8px_rgba(168,85,247,0.7)]">
              {activeScene.highlightText || 'মঙ্গল গ্রহে মানব বসতি'}
            </div>
          </div>
        )}

        {/* 4. NEWS HEADLINE WITH HIGHLIGHTER OVERLAY */}
        {activeScene.type === 'news_headline' && (
          <div className="absolute inset-x-4 top-1/4 z-20 animate-fadeIn">
            <div className="bg-white/95 text-gray-900 rounded-xl p-3 shadow-2xl border-2 border-gray-300">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-red-600 border-b border-gray-300 pb-1 mb-2 font-bengali">
                <Newspaper className="w-3 h-3" />
                <span>দৈনিক সংবাদ • শীর্ষ শিরোনাম</span>
              </div>
              <p className="text-sm font-extrabold text-gray-900 font-bengali leading-snug">
                {activeScene.headline}
              </p>
              <div className="mt-2 text-xs font-bold text-gray-950 font-bengali">
                <span className="marker-highlight-yellow px-1 py-0.5">
                  {activeScene.highlightText || 'দেউলিয়ার পথে শত প্রতিষ্ঠান'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5. MEDICAL CRISIS OVERLAY */}
        {activeScene.type === 'medical_crisis' && (
          <div className="absolute inset-x-4 top-1/4 z-20 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-600/90 text-white text-xs font-bengali mb-2 shadow-lg">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>শারীরিক জরুরি অবস্থা</span>
            </div>
            {/* ECG Heartbeat pulse line simulation */}
            <div className="w-48 mx-auto h-8 flex items-center justify-center my-2">
              <svg viewBox="0 0 100 24" className="w-full h-full stroke-pink-400 fill-none stroke-[2.5]">
                <path d="M0,12 L30,12 L35,2 L42,22 L48,8 L52,16 L56,12 L100,12" />
              </svg>
            </div>
          </div>
        )}

        {/* Central Kinetic Captions (Word-by-word highlighted) */}
        <div className="absolute bottom-16 inset-x-4 z-30 text-center pointer-events-none">
          <div className="bg-black/75 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 shadow-2xl">
            <p className="text-base sm:text-lg font-extrabold font-bengali leading-relaxed text-white">
              {words.map((word, wIdx) => {
                const isCurrentWord = wIdx === activeWordIndex;
                return (
                  <span
                    key={wIdx}
                    className={`inline-block mx-1 transition-all duration-150 ${
                      isCurrentWord
                        ? 'text-yellow-300 scale-110 drop-shadow-[0_2px_10px_rgba(253,224,71,0.8)] font-black'
                        : 'text-gray-200'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        {/* Timeline Progress Bar at bottom of reel */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-100"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>

        {/* Click to Play/Pause overlay */}
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
        >
          <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xl">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </div>
        </div>
      </div>

      {/* External Player Control Bar */}
      <div className="mt-4 flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-2 rounded-2xl shadow-lg">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition"
          title={isPlaying ? 'বিরতি (Pause)' : 'চালান (Play)'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <button
          onClick={handleReset}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          title="শুরু থেকে চালান"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Timeline Slider */}
        <input
          type="range"
          min="0"
          max={totalDuration}
          step="0.1"
          value={currentTime}
          onChange={(e) => {
            setCurrentTime(parseFloat(e.target.value));
          }}
          className="w-32 sm:w-44 accent-indigo-500 cursor-pointer"
        />

        <span className="text-xs font-mono text-gray-400">
          {formatTime(currentTime)}
        </span>

        {/* Mute toggle */}
        <button
          onClick={() => {
            soundEffects.muted = !isMuted;
            setIsMuted(!isMuted);
          }}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          title={isMuted ? 'আনমিউট' : 'মিউট'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
