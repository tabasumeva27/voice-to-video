import React, { useState, useRef } from 'react';
import { X, Download, Cloud, CheckCircle2, Film, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportModal({ isOpen, onClose, scenes, projectTitle, audioUrl }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  if (!isOpen) return null;

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || (s.endTime - s.startTime)), 0);

  /**
   * Real Client-Side HD Video Recorder (HTML5 Canvas + MediaRecorder API)
   * Produces an actual downloadable WebM/MP4 video file directly in the browser!
   */
  const handleClientRender = async () => {
    setIsExporting(true);
    setProgress(0);
    setDownloadUrl(null);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30); // 30 fps HD vertical stream

    // Attach audio track if audioUrl exists
    let audioContext = null;
    let audioSource = null;
    let audioDest = null;
    let audioElement = null;

    if (audioUrl) {
      try {
        audioElement = new Audio(audioUrl);
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioSource = audioContext.createMediaElementSource(audioElement);
        audioDest = audioContext.createMediaStreamDestination();
        audioSource.connect(audioDest);
        audioSource.connect(audioContext.destination);

        const audioTrack = audioDest.stream.getAudioTracks()[0];
        if (audioTrack) stream.addTrack(audioTrack);
      } catch (err) {
        console.warn('Audio stream mix fallback:', err);
      }
    }

    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm'
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoFileUrl = URL.createObjectURL(blob);
      setDownloadUrl(videoFileUrl);
      setDownloadFileName(`${projectTitle || 'voice-reel'}_HD.webm`);
      setIsExporting(false);
      setProgress(100);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    };

    mediaRecorder.start();
    if (audioElement) audioElement.play().catch(() => {});

    // Render loop across scenes
    const fps = 30;
    const totalFrames = Math.max(30, Math.floor(totalDuration * fps));
    let frame = 0;

    const renderInterval = setInterval(() => {
      frame++;
      const currentSec = frame / fps;
      const pct = Math.min(99, Math.floor((frame / totalFrames) * 100));
      setProgress(pct);

      // Find current scene
      let acc = 0;
      let activeScene = scenes[0];
      for (let s of scenes) {
        const d = s.duration || s.endTime - s.startTime || 5;
        if (currentSec >= acc && currentSec < acc + d) {
          activeScene = s;
          break;
        }
        acc += d;
      }

      // Draw background on HD Canvas
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, 1080, 1920);

      // Gradient overlay
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#090d16');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Central Decorative Graphic
      ctx.save();
      ctx.strokeStyle = activeScene?.visualType === 'procedural_motion' ? '#06b6d4' : '#6366f1';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(540, 800, 240 + Math.sin(frame * 0.1) * 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(activeScene?.headline || 'HD DOCUMENTARY REEL', 540, 780);

      if (activeScene?.highlightText) {
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 52px sans-serif';
        ctx.fillText(activeScene.highlightText, 540, 860);
      }
      ctx.restore();

      // Lower Third Big Caption Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.roundRect ? ctx.roundRect(80, 1400, 920, 320, 36) : ctx.fillRect(80, 1400, 920, 320);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Caption text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 46px sans-serif';
      ctx.textAlign = 'center';
      const captionText = activeScene?.caption || '';
      wrapText(ctx, captionText, 540, 1520, 840, 64);

      if (frame >= totalFrames) {
        clearInterval(renderInterval);
        mediaRecorder.stop();
        if (audioElement) audioElement.pause();
      }
    }, 1000 / fps);
  };

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  const copyYaml = () => {
    navigator.clipboard.writeText(`name: 4K Cloud Render\nrun: npx remotion render`);
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
                ১. ইনস্ট্যান্ট এইচডি ভিডিও এক্সপোর্ট (1080x1920 9:16)
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              HD ভিডিও ফাইল
            </span>
          </div>

          <p className="text-xs text-gray-400 font-bengali mb-4">
            সরাসরি ব্রাউজারের ভেতর থেকে আপনার অরিজিনাল ভয়েসসহ সম্পূর্ণ এইচডি রিল ভিডিও ফাইল (.webm) তৈরি করুন।
          </p>

          {isExporting ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-300 font-bengali">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  এইচডি ভিডিও রেন্ডার হচ্ছে...
                </span>
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
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bengali">
                <CheckCircle2 className="w-4 h-4" />
                <span>আপনার এইচডি ভিডিও প্রস্তুত! নিচের বাটনে ক্লিক করে সেভ করুন:</span>
              </div>
              <a
                href={downloadUrl}
                download={downloadFileName || 'my_voice_reel.webm'}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm font-bengali transition shadow-lg shadow-emerald-600/30 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>এইচডি ভিডিও ফাইল ডাউনলোড করুন (.webm)</span>
              </a>
            </div>
          ) : (
            <button
              onClick={handleClientRender}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs font-bengali transition shadow-lg shadow-indigo-600/20"
            >
              <Download className="w-4 h-4" />
              <span>এইচডি ভিডিও রেন্ডার শুরু করুন</span>
            </button>
          )}
        </div>

        {/* Option 2: Cloud Render Info */}
        <div className="bg-gray-800/50 border border-gray-700/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-bold text-white font-bengali">
                ২. ক্লাউড রেন্ডার (GitHub Actions)
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              ফ্রি ২,০০০ মিনিট
            </span>
          </div>

          <p className="text-xs text-gray-400 font-bengali">
            আপনার গিটহাব অ্যাকশনস ওয়ার্কফ্লো ক্লাউডে যুক্ত আছে। আপনি চাইলে স্বয়ংক্রিয়ভাবে ক্লাউড থেকেও 4K রেন্ডার করতে পারেন।
          </p>
        </div>
      </div>
    </div>
  );
}
