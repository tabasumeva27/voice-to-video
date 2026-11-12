import React, { useState } from 'react';
import { Video, Sparkles, FolderSync, Settings, Plus, Download, Trash2, CheckCircle2 } from 'lucide-react';

export default function Navbar({
  currentProject,
  projectsList,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onOpenSettings,
  onOpenExport,
  isAutoSaving
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-gray-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Project Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Voice2Reel
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                স্মার্ট স্টুডিও
              </span>
            </div>
            <p className="text-xs text-gray-400 font-bengali hidden sm:block">
              ভয়েস থেকে স্বয়ংক্রিয় প্রামাণ্যচিত্র রিল জেনারেটর
            </p>
          </div>
        </div>

        {/* Project Switcher */}
        <div className="relative ml-2 sm:ml-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-sm text-gray-200 transition"
          >
            <span className="font-bengali max-w-[140px] sm:max-w-[180px] truncate">
              {currentProject?.title || 'রিল প্রজেক্ট'}
            </span>
            <span className="text-xs text-gray-400">▾</span>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-800">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-bengali">
                  আপনার প্রজেক্টসমূহ
                </span>
                <button
                  onClick={() => {
                    onNewProject();
                    setDropdownOpen(false);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> নতুন রিল
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto py-1">
                {projectsList.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-800/60 transition ${
                      p.id === currentProject?.id ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500' : 'text-gray-300'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectProject(p.id);
                        setDropdownOpen(false);
                      }}
                      className="flex-1 text-left truncate font-bengali text-xs"
                    >
                      {p.title}
                    </button>
                    {projectsList.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('এই প্রজেক্টটি মুছে ফেলতে চান?')) {
                            onDeleteProject(p.id);
                          }
                        }}
                        className="text-gray-500 hover:text-red-400 p-1"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons & Status */}
      <div className="flex items-center gap-3">
        {/* Real-time Auto-save Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bengali">অটো-সেভ সক্রিয়</span>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition"
          title="সেটিংস ও গুগল ড্রাইভ"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Export / Render Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition transform active:scale-95 font-bengali"
        >
          <Download className="w-4 h-4" />
          <span>রেন্ডার ও ডাউনলোড</span>
        </button>
      </div>
    </header>
  );
}
