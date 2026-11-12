import React, { useState } from 'react';
import { X, Settings, Link2, Key, Check, FolderSync } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storage';

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setLocalSettings] = useState(getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
            <Settings className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-bengali">
              স্টুডিও সেটিংস
            </h3>
            <p className="text-xs text-gray-400 font-bengali">
              গুগল ড্রাইভ ও এআই এপিআই কনফিগারেশন
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Google Drive Folder URL */}
          <div>
            <label className="text-xs font-semibold text-gray-300 font-bengali flex items-center gap-1.5 mb-1.5">
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>গুগল ড্রাইভ ফোল্ডার লিংক (ব্যক্তিগত ফুটেজের জন্য):</span>
            </label>
            <input
              type="text"
              value={settings.driveFolderUrl || ''}
              onChange={(e) => setLocalSettings({ ...settings, driveFolderUrl: e.target.value })}
              placeholder="https://drive.google.com/drive/folders/your-folder-id"
              className="w-full bg-gray-800/90 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 font-sans focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-gray-500 mt-1 font-bengali">
              এই ফোল্ডারে আপনার ৫-১০ সেকেন্ডের কথা বলার ক্লিপ রাখা থাকলে সিস্টেম স্বয়ংক্রিয়ভাবে ভিডিওর শুরুতে তা জুড়ে দেবে।
            </p>
          </div>

          {/* Gemini API Key */}
          <div>
            <label className="text-xs font-semibold text-gray-300 font-bengali flex items-center gap-1.5 mb-1.5">
              <Key className="w-3.5 h-3.5 text-pink-400" />
              <span>Gemini API Key (ঐচ্ছিক):</span>
            </label>
            <input
              type="password"
              value={settings.geminiApiKey || ''}
              onChange={(e) => setLocalSettings({ ...settings, geminiApiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full bg-gray-800/90 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-gray-500 mt-1 font-bengali">
              ফাঁকা রাখলেও সমস্যা নেই; বিল্ট-ইন ফ্রি সিন এনালাইজার স্বয়ংক্রিয়ভাবে কাজ করবে।
            </p>
          </div>

          {/* Auto-save toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/40 border border-gray-800">
            <div>
              <span className="text-xs font-semibold text-gray-200 font-bengali block">
                রিয়েল-টাইম অটো-সেভ
              </span>
              <span className="text-[10px] text-gray-400 font-bengali">
                প্রতিটি পরিবর্তন স্বয়ংক্রিয়ভাবে সেভ হবে
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => setLocalSettings({ ...settings, autoSave: e.target.checked })}
              className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 font-bengali transition"
          >
            বাতিল
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white font-bengali transition shadow-lg shadow-indigo-600/20"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : null}
            <span>{savedSuccess ? 'সংরক্ষিত হয়েছে' : 'সেটিংস সেভ করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
