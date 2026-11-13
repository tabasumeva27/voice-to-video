import React, { useState } from 'react';
import { 
  Layers, Plus, Trash2, Volume2, MoveUp, MoveDown, 
  Image as ImageIcon, Sparkles, User, Activity, FileText, Film
} from 'lucide-react';
import { SCENE_TYPES, PRESET_VISUALS } from '../constants/presets';
import { soundEffects } from '../services/audioSynthesizer';
import SceneRenderer from './visuals/SceneRenderer';

export default function StoryboardEditor({
  scenes,
  onUpdateScene,
  onAddScene,
  onDeleteScene,
  onReorderScenes,
  activeSceneIndex,
  onSelectScene
}) {
  const [editingImageSceneId, setEditingImageSceneId] = useState(null);

  if (!scenes || scenes.length === 0) {
    return (
      <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-2xl p-10 text-center my-6">
        <Layers className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-300 font-bengali">
          এখনো কোনো সিন তৈরি করা হয়নি
        </h3>
        <p className="text-xs text-gray-500 font-bengali mt-1 max-w-md mx-auto">
          উপরে আপনার ভয়েস ফাইল দিন বা ডেমো বাটনে ক্লিক করুন। সিস্টেম স্বয়ংক্রিয়ভাবে ৪-লেয়ার সিন বানাবে।
        </p>
      </div>
    );
  }

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || (s.endTime - s.startTime)), 0);

  return (
    <div className="my-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-bengali">
            <Layers className="w-5 h-5 text-indigo-400" />
            ২. ডাইনামিক স্টোরিবোর্ড এডিটর (৪-লেয়ার ইঞ্জিন)
          </h2>
          <p className="text-xs text-gray-400 font-bengali mt-0.5">
            মোট দৃশ্য: {scenes.length} টি | মোট সময়কাল: {totalDuration} সেকেন্ড (অটো-সেভ সক্রিয়)
          </p>
        </div>

        <button
          onClick={onAddScene}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-indigo-300 border border-indigo-500/30 transition font-bengali self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> নতুন দৃশ্য যোগ করুন
        </button>
      </div>

      {/* Scene Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenes.map((scene, index) => {
          const visualKey = (scene.visualType || scene.type || 'stock_visual').toUpperCase();
          const typeMeta = SCENE_TYPES[visualKey] || SCENE_TYPES.STOCK_VISUAL;
          const isActive = index === activeSceneIndex;

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(index)}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-gray-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-gray-900/70 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
              }`}
            >
              {/* Scene Card Header */}
              <div className="p-3.5 border-b border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center font-sans">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-200 font-bengali">
                    দৃশ্য {index + 1}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono px-2 py-0.5 rounded bg-gray-800">
                    {scene.startTime}s - {scene.endTime}s ({scene.duration || scene.endTime - scene.startTime}s)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderScenes(index, index - 1);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-300"
                      title="উপরে নিন"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {index < scenes.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderScenes(index, index + 1);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-300"
                      title="নিচে নিন"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {scenes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScene(index);
                      }}
                      className="p-1 text-gray-500 hover:text-red-400"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Visual Preview Box */}
              <div className="relative h-44 bg-gray-950 overflow-hidden group">
                <SceneRenderer scene={scene} isPlaying={false} progress={0.5} />

                {/* Dark bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                {/* Type Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white shadow-md font-bengali backdrop-blur-md"
                    style={{ backgroundColor: typeMeta.color + 'dd' }}
                  >
                    {typeMeta.name}
                  </span>
                </div>

                {/* Change visual / image button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingImageSceneId(editingImageSceneId === scene.id ? null : scene.id);
                  }}
                  className="absolute bottom-2.5 right-2.5 z-10 px-2.5 py-1 rounded-lg bg-gray-900/80 hover:bg-black text-[11px] text-gray-200 border border-gray-700 backdrop-blur-md font-bengali flex items-center gap-1 transition"
                >
                  <ImageIcon className="w-3 h-3 text-indigo-400" />
                  <span>দৃশ্য পরিবর্তন</span>
                </button>
              </div>

              {/* Quick Image Picker Modal Dropdown */}
              {editingImageSceneId === scene.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 bg-gray-950 border-b border-gray-800 text-xs space-y-2 animate-fadeIn"
                >
                  <p className="text-[11px] font-medium text-gray-400 font-bengali">
                    পছন্দের ছবি নির্বাচন করুন:
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(PRESET_VISUALS).map(([key, url]) => (
                      <img
                        key={key}
                        src={url}
                        alt={key}
                        onClick={() => {
                          onUpdateScene(index, { imageUrl: url, visualType: 'stock_visual' });
                          setEditingImageSceneId(null);
                        }}
                        className="w-full h-12 object-cover rounded cursor-pointer border border-gray-700 hover:border-indigo-400 transition hover:scale-105"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Scene Settings Controls */}
              <div className="p-3.5 space-y-3">
                {/* Scene Visual Type Selector */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-bengali block mb-1">
                    দৃশ্যের ধরণ (Visual Mode):
                  </label>
                  <select
                    value={scene.visualType || scene.type || 'stock_visual'}
                    onChange={(e) => {
                      const newType = e.target.value;
                      onUpdateScene(index, { visualType: newType });
                    }}
                    className="w-full bg-gray-800/90 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bengali focus:outline-none focus:border-indigo-500"
                  >
                    <option value="avatar_explainer">🎙️ অবতার এক্সপ্লেনার (SVG Avatar)</option>
                    <option value="procedural_motion">⚡ কোড-মোশন (Sonar/Chart/Counter)</option>
                    <option value="paper_collage">📰 নিউজপেপার ও মার্কার হাইলাইট</option>
                    <option value="stock_visual">🖼️ প্রাসঙ্গিক ডাইনামিক সিন</option>
                    <option value="personal_hook">👤 ব্যক্তিগত হুক ফুটেজ</option>
                  </select>
                </div>

                {/* Sub-type for procedural motion */}
                {(scene.visualType === 'procedural_motion') && (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider font-bengali block mb-1">
                      মোশন ধরণ (Motion Pattern):
                    </label>
                    <select
                      value={scene.motionType || 'sonar'}
                      onChange={(e) => onUpdateScene(index, { motionType: e.target.value })}
                      className="w-full bg-cyan-950/40 border border-cyan-800 rounded-lg px-2.5 py-1 text-xs text-cyan-200 font-sans"
                    >
                      <option value="sonar">Sonar Radar (সাবমেরিন/মিলিটারি তরঙ্গ)</option>
                      <option value="waves">Ocean Acoustic Waves (সমুদ্রের ঢেউ)</option>
                      <option value="counter">Rapid Statistical Counter (সংখ্যা গণনা)</option>
                      <option value="chart">Downward Loss Chart (অর্থনৈতিক ধস)</option>
                      <option value="heartbeat">ECG Heartbeat Pulse (সংকট)</option>
                    </select>
                  </div>
                )}

                {/* Caption Text Field */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-bengali block mb-1">
                    ক্যাপশন (Narration):
                  </label>
                  <textarea
                    rows={2}
                    value={scene.caption || ''}
                    onChange={(e) => onUpdateScene(index, { caption: e.target.value })}
                    className="w-full bg-gray-800/90 border border-gray-700 rounded-lg p-2 text-xs text-gray-200 font-bengali focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Highlight Keyword & Sound Effect */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-bengali block mb-1">
                      হাইলাইট শব্দ:
                    </label>
                    <input
                      type="text"
                      value={scene.highlightText || ''}
                      onChange={(e) => onUpdateScene(index, { highlightText: e.target.value })}
                      placeholder="যেমন: ১,২০,০০০ ডলফিন"
                      className="w-full bg-gray-800/90 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white font-bengali focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-bengali flex items-center justify-between mb-1">
                      <span>সাউন্ড ইফেক্ট:</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEffects.playSoundForType(scene.soundFx);
                        }}
                        className="text-indigo-400 hover:text-indigo-300"
                        title="সাউন্ড শুনুন"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </label>
                    <select
                      value={scene.soundFx || 'whoosh'}
                      onChange={(e) => {
                        const sfx = e.target.value;
                        onUpdateScene(index, { soundFx: sfx });
                        soundEffects.playSoundForType(sfx);
                      }}
                      className="w-full bg-gray-800/90 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white font-sans focus:outline-none focus:border-indigo-500"
                    >
                      <option value="whoosh">Whoosh (সুইশ)</option>
                      <option value="boom">Boom (ড্রাম/যুদ্ধ)</option>
                      <option value="camera">Camera (শাটার ক্লিক)</option>
                      <option value="cash">Cash (টাকা/কয়েন)</option>
                      <option value="pop">Pop (বাউন্স)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
