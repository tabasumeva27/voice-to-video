import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX
} from 'lucide-react';
import { soundEffects } from '../services/audioSynthesizer';
import SceneRenderer from './visuals/SceneRenderer';

export default function ReelPreviewPlayer({ scenes, currentSceneIndex, onSceneChange, audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const previousSceneIndexRef = useRef(null);
  const audioElementRef = useRef(null);

  const totalDuration = scenes && scenes.length > 0
    ? scenes.reduce((acc, s) => acc + (s.duration || (s.endTime - s.startTime)), 0)
    : 10;

  // Sync with real Audio Element if audioUrl exists
  useEffect(() => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.play().catch(() => {});
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = isMuted;
    }
  }, [isMuted]);

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
            if (audioElementRef.current) {
              audioElementRef.current.pause();
              audioElementRef.current.currentTime = 0;
            }
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
      if (audioElementRef.current) {
        audioElementRef.current.currentTime = t + 0.1;
      }
    }
  }, [currentSceneIndex]);

  const togglePlay = () => {
    soundEffects.init();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeScene) {
    return (
      <div className="w-full aspect-[9/16] max-w-[340px] mx-auto bg-gray-950 rounded-3xl border border-gray-800 flex items-center justify-center p-6 text-center text-gray-500 font-bengali">
        রিল প্রিভিউ দেখতে উপরে একটি ভয়েস ফাইল দিন
      </div>
    );
  }

  // Calculate word-level kinetic captions
  const words = (activeScene.caption || '').split(/\s+/).filter(Boolean);
  const sceneDuration = activeScene.duration || (activeScene.endTime - activeScene.startTime) || 5;
  const sceneStartTime = accumulatedTime - sceneDuration;
  const sceneProgress = Math.max(0, Math.min(1, (currentTime - sceneStartTime) / sceneDuration));
  const activeWordIndex = Math.min(words.length - 1, Math.floor(sceneProgress * words.length));

  return (
    <div className="flex flex-col items-center">
      {/* Hidden Real Voice Audio Element */}
      {audioUrl && (
        <audio
          ref={audioElementRef}
          src={audioUrl}
          preload="auto"
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* 9:16 Mobile Phone Frame */}
      <div className="relative w-full aspect-[9/16] max-w-[340px] bg-black rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-4 border-slate-800 select-none group">
        
        {/* Dynamic 4-Layer Visual Engine */}
        <div className="absolute inset-0 overflow-hidden">
          <SceneRenderer
            scene={activeScene}
            sceneIndex={activeIndex}
            isPlaying={isPlaying}
            progress={sceneProgress}
          />
        </div>

        {/* Paper texture and subtle film grain overlay */}
        <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none"></div>

        {/* Top Header Information in Reel */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-white">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-bengali font-bold tracking-wide">HD 1080p</span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-slate-300 font-mono">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>
        </div>

        {/* Ultra-Bold Kinetic Captions (World-Class YouTube Shorts / Reels Style) */}
        {/* Placed at the golden-ratio lower third with no bulky container */}
        <div className="absolute bottom-16 inset-x-3 z-30 text-center pointer-events-none px-2">
          <p className="text-lg sm:text-xl font-black font-bengali leading-relaxed text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)] tracking-wide">
            {words.map((word, wIdx) => {
              const isCurrentWord = wIdx === activeWordIndex;
              return (
                <span
                  key={wIdx}
                  className={`inline-block mx-1 transition-all duration-150 ${
                    isCurrentWord
                      ? 'text-yellow-300 scale-125 font-black drop-shadow-[0_0_20px_rgba(253,224,71,1)] underline decoration-amber-400 decoration-4 -translate-y-1'
                      : 'text-slate-100 opacity-90'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>

        {/* Timeline Progress Bar at bottom of reel */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400 transition-all duration-100 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>

        {/* Click to Play/Pause overlay */}
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/25"
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
          className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition shadow-md shadow-indigo-600/30"
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
            const val = parseFloat(e.target.value);
            setCurrentTime(val);
            if (audioElementRef.current) {
              audioElementRef.current.currentTime = val;
            }
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
