import React, { useState } from 'react';
import { X, Download, Cloud, CheckCircle2, Film, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper: Resolve stock image URL matching StockVisual.jsx logic
function resolveStockImageForScene(scene, sceneIndex) {
  if (scene.imageUrl && !scene.imageUrl.includes('placeholder')) {
    return scene.imageUrl;
  }
  const text = ((scene.searchQuery || '') + ' ' + (scene.caption || '')).toLowerCase();
  const pools = {
    garments: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1080&q=80'
    ],
    market: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1080&q=80'
    ],
    money: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1080&q=80'
    ],
    tech: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1080&q=80'
    ],
    nature: [
      'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1080&q=80'
    ]
  };

  let pool = pools.money;
  if (text.includes('পোশাক') || text.includes('শ্রমিক') || text.includes('গার্মেন্ট') || text.includes('মজুরি')) pool = pools.garments;
  else if (text.includes('বাজার') || text.includes('চাল') || text.includes('তেল') || text.includes('দাম')) pool = pools.market;
  else if (text.includes('প্রযুক্তি') || text.includes('এআই') || text.includes('বিজ্ঞান')) pool = pools.tech;
  else if (text.includes('ডলফিন') || text.includes('সমুদ্র') || text.includes('সাবমেরিন')) pool = pools.nature;

  return pool[sceneIndex % pool.length];
}

function loadCorsImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}

export default function ExportModal({ isOpen, onClose, scenes, projectTitle, audioUrl }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFileName, setDownloadFileName] = useState('');

  if (!isOpen) return null;

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || (s.endTime - s.startTime) || 5), 0);

  /**
   * Real Client-Side 1080x1920 HD Video Renderer (HTML5 Canvas + MediaRecorder)
   * Renders all 4 visual layers + word-by-word kinetic Bengali captions + real audio track.
   */
  const handleClientRender = async () => {
    if (!scenes || scenes.length === 0) return;

    setIsExporting(true);
    setProgress(0);
    setDownloadUrl(null);
    setStatusText('ভিজ্যুয়াল অ্যাসেট লোড হচ্ছে...');

    // Preload stock images for stock_visual scenes
    const preloadedImages = {};
    await Promise.all(
      scenes.map(async (s, idx) => {
        const vType = s.visualType || s.type || 'stock_visual';
        if (vType === 'stock_visual' || !['avatar_explainer', 'personal_hook', 'personal_face', 'procedural_motion', 'paper_collage', 'news_headline'].includes(vType)) {
          const url = resolveStockImageForScene(s, idx);
          preloadedImages[idx] = await loadCorsImage(url);
        }
      })
    );

    setStatusText('এইচডি ভিডিও রেন্ডার হচ্ছে...');

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream(30);

    // Mix real voice audio track
    let audioContext = null;
    let audioElement = null;
    if (audioUrl) {
      try {
        audioElement = new Audio(audioUrl);
        audioElement.crossOrigin = 'anonymous';
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioSource = audioContext.createMediaElementSource(audioElement);
        const audioDest = audioContext.createMediaStreamDestination();
        audioSource.connect(audioDest);
        audioSource.connect(audioContext.destination);
        const audioTrack = audioDest.stream.getAudioTracks()[0];
        if (audioTrack) stream.addTrack(audioTrack);
      } catch (err) {
        console.warn('Audio mix fallback:', err);
      }
    }

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      ? 'video/webm;codecs=vp8'
      : 'video/webm';

    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 6000000 // 6 Mbps crisp HD
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoFileUrl = URL.createObjectURL(blob);
      setDownloadUrl(videoFileUrl);
      setDownloadFileName(`${(projectTitle || 'voice-reel').replace(/\s+/g, '_')}_HD.webm`);
      setIsExporting(false);
      setProgress(100);
      if (audioContext) audioContext.close().catch(() => {});
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    };

    mediaRecorder.start(200);
    if (audioElement) audioElement.play().catch(() => {});

    const fps = 30;
    const totalFrames = Math.max(30, Math.floor(totalDuration * fps));
    let frame = 0;

    const renderInterval = setInterval(() => {
      frame++;
      const currentSec = frame / fps;
      setProgress(Math.min(99, Math.floor((frame / totalFrames) * 100)));

      // Determine active scene & scene progress
      let acc = 0;
      let activeIndex = 0;
      let activeScene = scenes[0];
      let sceneDur = 5;
      for (let i = 0; i < scenes.length; i++) {
        const d = scenes[i].duration || (scenes[i].endTime - scenes[i].startTime) || 5;
        if (currentSec >= acc && currentSec < acc + d) {
          activeIndex = i;
          activeScene = scenes[i];
          sceneDur = d;
          break;
        }
        acc += d;
        if (i === scenes.length - 1) {
          activeIndex = i;
          activeScene = scenes[i];
          sceneDur = d;
        }
      }
      const sceneProgress = Math.max(0, Math.min(1, (currentSec - acc) / sceneDur));
      const vType = activeScene?.visualType || activeScene?.type || 'stock_visual';

      // Clear background
      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, 1080, 1920);

      // LAYER RENDERING
      if (vType === 'avatar_explainer' || vType === 'personal_hook' || vType === 'personal_face') {
        drawAvatarScene(ctx, sceneProgress, activeScene);
      } else if (vType === 'paper_collage' || vType === 'news_headline') {
        drawPaperCollageScene(ctx, sceneProgress, activeScene);
      } else if (vType === 'procedural_motion') {
        drawProceduralMotionScene(ctx, sceneProgress, activeScene);
      } else {
        drawStockScene(ctx, sceneProgress, activeIndex, preloadedImages[activeIndex], activeScene);
      }

      // KINETIC BENGALI CAPTIONS (Word-by-word Golden Highlight)
      drawKineticCaptions(ctx, activeScene?.caption || '', sceneProgress);

      // Top HD Badge + Bottom Progress Bar
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(0, 1908, 1080, 12);
      const barGrad = ctx.createLinearGradient(0, 0, 1080, 0);
      barGrad.addColorStop(0, '#6366f1');
      barGrad.addColorStop(0.5, '#ec4899');
      barGrad.addColorStop(1, '#fbbf24');
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, 1908, (frame / totalFrames) * 1080, 12);

      if (frame >= totalFrames) {
        clearInterval(renderInterval);
        if (audioElement) audioElement.pause();
        mediaRecorder.stop();
      }
    }, 1000 / fps);
  };

  function drawStockScene(ctx, p, idx, img) {
    if (img) {
      const scale = idx % 2 === 1 ? 1 + p * 0.14 : 1.14 - p * 0.1;
      const imgRatio = img.width / img.height;
      const canvasRatio = 1080 / 1920;
      let drawW, drawH;
      if (imgRatio > canvasRatio) {
        drawH = 1920 * scale;
        drawW = drawH * imgRatio;
      } else {
        drawW = 1080 * scale;
        drawH = drawW / imgRatio;
      }
      ctx.drawImage(img, (1080 - drawW) / 2, (1920 - drawH) / 2, drawW, drawH);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);
    }
    const vig = ctx.createLinearGradient(0, 0, 0, 1920);
    vig.addColorStop(0, 'rgba(0,0,0,0.45)');
    vig.addColorStop(0.45, 'rgba(0,0,0,0.1)');
    vig.addColorStop(1, 'rgba(0,0,0,0.92)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, 1080, 1920);
  }

  function drawAvatarScene(ctx, p) {
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    const bob = Math.sin(p * 20) * 10;
    const cx = 540;
    const cy = 760 + bob;

    // Shoulders
    ctx.fillStyle = '#4338ca';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 280, 220, 170, 0, Math.PI, 0);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 130, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy - 35, 132, Math.PI, 0);
    ctx.fill();

    // Glasses & Eyes
    const blink = Math.sin(p * 40) > 0.92;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.strokeRect(cx - 95, cy - 35, 75, 52);
    ctx.strokeRect(cx + 20, cy - 35, 75, 52);
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 10);
    ctx.lineTo(cx + 20, cy - 10);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    if (!blink) {
      ctx.beginPath();
      ctx.arc(cx - 58, cy - 10, 10, 0, Math.PI * 2);
      ctx.arc(cx + 58, cy - 10, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Talking mouth
    const mouthH = Math.abs(Math.sin(p * 70)) * 24 + 6;
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 80, 28, mouthH, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPaperCollageScene(ctx, p, scene) {
    ctx.fillStyle = '#0d0f12';
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.save();
    ctx.translate(540, 780);
    ctx.rotate((-1.5 + p * 1.2) * (Math.PI / 180));
    const s = 1 + p * 0.06;
    ctx.scale(s, s);

    // Paper sheet
    ctx.fillStyle = '#faf8f2';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 50;
    drawRoundedRect(ctx, -450, -340, 900, 680, 28);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Header
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 28px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('দৈনিক অনুসন্ধান বার্তা  •  VERIFIED REPORT', -400, -260);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-400, -240, 800, 4);

    // Headline
    ctx.fillStyle = '#020617';
    ctx.font = '800 46px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    wrapCanvasText(ctx, scene?.headline || 'বিশেষ প্রতিবেদন', -400, -165, 800, 62, 'left');

    // Animated Yellow Highlighter
    if (scene?.highlightText) {
      const drawW = Math.min(1, p * 1.6) * 760;
      ctx.fillStyle = 'rgba(253, 224, 71, 0.9)';
      ctx.fillRect(-400, 30, drawW, 64);
      ctx.fillStyle = '#020617';
      ctx.font = '900 40px "Hind Siliguri", sans-serif';
      ctx.fillText(scene.highlightText, -385, 76);
    }

    // Excerpt
    ctx.fillStyle = '#475569';
    ctx.font = '500 28px "Hind Siliguri", sans-serif';
    wrapCanvasText(ctx, (scene?.caption || '').slice(0, 120), -400, 160, 800, 42, 'left');

    ctx.restore();
  }

  function drawProceduralMotionScene(ctx, p, scene) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle grid
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.25)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 1080; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1920); ctx.stroke();
    }
    for (let y = 0; y < 1920; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke();
    }

    const mType = scene?.motionType || 'counter';
    if (mType === 'sonar' || mType === 'military') {
      for (let r = 1; r <= 4; r++) {
        const sc = ((p * 3 + r * 0.25) % 1) * 320;
        ctx.strokeStyle = `rgba(34, 211, 238, ${Math.max(0, 1 - sc / 320)})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(540, 720, sc, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (mType === 'chart') {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(140, 560);
      ctx.lineTo(320, 620);
      ctx.lineTo(500, 580);
      ctx.lineTo(680, 740);
      ctx.lineTo(940, 860);
      ctx.stroke();
    }

    // Highlight stat text
    ctx.fillStyle = '#fde047';
    ctx.font = '900 76px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(scene?.highlightText || 'মূল তথ্য', 540, 980);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 36px "Hind Siliguri", sans-serif';
    wrapCanvasText(ctx, scene?.headline || '', 540, 1070, 860, 50, 'center');
  }

  function drawKineticCaptions(ctx, caption, p) {
    const words = caption.split(/\s+/).filter(Boolean);
    if (words.length === 0) return;
    const activeIdx = Math.min(words.length - 1, Math.floor(p * words.length));
    // Show a sliding window of up to 10 words around active word so captions stay crisp & never overflow
    const startW = Math.max(0, Math.floor(activeIdx / 8) * 8);
    const visibleWords = words.slice(startW, startW + 8);

    ctx.save();
    ctx.font = '900 54px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.98)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 5;

    // Break into lines of ~3-4 words
    const lines = [];
    for (let i = 0; i < visibleWords.length; i += 3) {
      lines.push(visibleWords.slice(i, i + 3).map((w, k) => ({ word: w, globalIdx: startW + i + k })));
    }

    const baseY = 1480;
    lines.forEach((lineWords, lineIdx) => {
      const y = baseY + lineIdx * 82;
      const lineText = lineWords.map((o) => o.word).join(' ');
      const totalW = ctx.measureText(lineText).width;
      let cursorX = 540 - totalW / 2;

      lineWords.forEach((item) => {
        const isCurrent = item.globalIdx === activeIdx;
        const wWidth = ctx.measureText(item.word + ' ').width;
        ctx.fillStyle = isCurrent ? '#fde047' : '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(item.word, cursorX, y);
        cursorX += wWidth;
      });
    });

    ctx.restore();
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, align = 'center') {
    ctx.textAlign = align;
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, y);
  }

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
              {projectTitle} • মোট সময়কাল {Math.round(totalDuration)} সেকেন্ড
            </p>
          </div>
        </div>

        {/* Option 1: Real Instant Browser HD Render */}
        <div className="bg-gray-800/50 border border-gray-700/80 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-white font-bengali">
                ১. ইনস্ট্যান্ট এইচডি ভিডিও এক্সপোর্ট (1080x1920 9:16)
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              HD 6Mbps
            </span>
          </div>

          <p className="text-xs text-gray-400 font-bengali mb-4">
            আপনার আসল ভয়েস, ৪-লেয়ার সিন (অবতার, পেপার কোলাজ, চার্ট, স্টক ভিজ্যুয়াল) ও কাইনেটিক ক্যাপশনসহ সরাসরি ভিডিও (.webm) ডাউনলোড করুন।
          </p>

          {isExporting ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-300 font-bengali">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  {statusText || 'এইচডি ভিডিও রেন্ডার হচ্ছে...'}
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
            রিপোজিটরিতে `.github/workflows/render-reel.yml` যুক্ত আছে। GitHub Actions ট্যাব থেকে ক্লাউডে বিল্ড/রেন্ডার চালাতে পারবেন।
          </p>
        </div>
      </div>
    </div>
  );
}
