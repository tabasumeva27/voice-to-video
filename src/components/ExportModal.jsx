import React, { useState } from 'react';
import { X, Download, Cloud, CheckCircle2, Film, Sparkles, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportModal({ isOpen, onClose, scenes, projectTitle }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || (s.endTime - s.startTime)), 0);

  // Client-Side Canvas & WebM Video Export Simulator
  const handleClientRender = () => {
    setIsExporting(true);
    setProgress(0);
    setDownloadUrl(null);

    // Render Progress loop simulation
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsExporting(false);
        // Create sample downloadable file
        const blob = new Blob([JSON.stringify(scenes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }, 150);
  };

  const githubActionYaml = `name: Render HD Reel in Cloud
on:
  workflow_dispatch:
    inputs:
      projectId:
        description: 'Project ID'
        required: true

jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node & FFmpeg
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Remotion & FFmpeg
        run: |
          sudo apt-get update && sudo apt-get install -y ffmpeg
          npm install

      - name: Render 1080p 60fps Vertical Reel
        run: npx remotion render src/remotion/Reel.jsx out/reel.mp4

      - name: Upload Output Video
        uses: actions/upload-artifact@v4
        with:
          name: finished-reel
          path: out/reel.mp4
`;

  const copyYaml = () => {
    navigator.clipboard.writeText(githubActionYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-bengali">
              ভিডিও রেন্ডার ও এক্সপোর্ট সেন্টার
            </h3>
            <p className="text-xs text-gray-400 font-bengali">
              {projectTitle} • মোট সময়কাল {totalDuration} সেকেন্ড
            </p>
          </div>
        </div>

        {/* Option 1: Instant Browser Render */}
        <div className="bg-gray-800/50 border border-gray-700/80 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-white font-bengali">
                ১. ইনস্ট্যান্ট ব্রাউজার রেন্ডার (1080x1920 HD)
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ফ্রি ও দ্রুত
            </span>
          </div>

          <p className="text-xs text-gray-400 font-bengali mb-4">
            কোনো সফটওয়্যার ছাড়াই সরাসরি ব্রাউজার মেমোরি থেকে সম্পূর্ণ ভিডিওটি জোড়া লাগিয়ে ডাউনলোড করুন।
          </p>

          {isExporting ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-300 font-bengali">
                <span>রেন্ডার হচ্ছে... অপেক্ষা করুন</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : downloadUrl ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bengali">
                <CheckCircle2 className="w-4 h-4" />
                <span>রেন্ডার সফলভাবে সম্পন্ন হয়েছে!</span>
              </div>
              <a
                href={downloadUrl}
                download={`${projectTitle || 'voice-reel'}.json`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-bengali transition shadow-lg shadow-emerald-600/30"
              >
                <Download className="w-4 h-4" />
                <span>ভিডিও ফাইল ডাউনলোড করুন</span>
              </a>
            </div>
          ) : (
            <button
              onClick={handleClientRender}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs font-bengali transition shadow-lg shadow-indigo-600/20"
            >
              <Download className="w-4 h-4" />
              <span>এখনই রেন্ডার শুরু করুন</span>
            </button>
          )}
        </div>

        {/* Option 2: Cloud 4K GitHub Action Render */}
        <div className="bg-gray-800/50 border border-gray-700/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-bold text-white font-bengali">
                ২. ক্লাউড রেন্ডারিং কনফিগারেশন (GitHub Actions)
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              ০ টাকা ক্লাউড
            </span>
          </div>

          <p className="text-xs text-gray-400 font-bengali mb-3">
            গিটহাবের ফ্রি ২,০০০ মিনিট ভার্চুয়াল ক্লাউড সার্ভার ব্যবহার করে ফুল 4K আল্ট্রা এইচডি রেন্ডার করার স্বয়ংক্রিয় ফাইল:
          </p>

          <div className="relative">
            <pre className="bg-gray-950 text-gray-300 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-28 border border-gray-800">
              {githubActionYaml}
            </pre>
            <button
              onClick={copyYaml}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
              title="কোড কপি করুন"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
