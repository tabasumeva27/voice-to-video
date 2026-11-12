import React, { useState, useRef } from 'react';
import { Upload, Mic, MicOff, Sparkles, Wand2, FileAudio, Play, CheckCircle2, Link2 } from 'lucide-react';
import { SAMPLE_STORIES } from '../constants/presets';

export default function AudioUploader({
  onGenerateScenes,
  currentTranscript,
  onUpdateTranscript,
  driveHookUrl,
  onUpdateDriveUrl,
  isGenerating
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFileName, setAudioFileName] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      // Create local object URL for preview
      const url = URL.createObjectURL(file);
      
      // Auto-extract or suggest sample transcript if empty
      if (!currentTranscript) {
        onUpdateTranscript('এ বছর বাংলাদেশের অর্থনীতিতে প্রায় দুই বিলিয়ন ডলারের ক্ষতি হয়েছে। গতকাল যে ব্যবসাগুলো সগৌরবে দাঁড়িয়ে ছিল, আজ তারা দেউলিয়ার পথে। এই বিশাল সংকটের আসল কারণ কী?');
      }
    }
  };

  // Live Microphone Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioFileName(`রেকর্ডকৃত_ভয়েস_${Date.now()}.webm`);
        if (!currentTranscript) {
          onUpdateTranscript('মহাকাশচারীরা আজ অনন্ত মহাবিশ্ব ঘুরে বেরিয়ে মঙ্গল গ্রহে মানবজাতির বসবাসের স্বপ্ন দেখছে। পৃথিবী ছাড়িয়ে বহু দূর গ্যালাক্সিতে আমাদের দ্বিতীয় ঠিকানার সন্ধান শুরু হয়েছে।');
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হচ্ছে। ব্রাউজারে পারমিশন অন আছে কি না দেখুন।');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // 1-Click Load Sample Story
  const loadSampleStory = (sample) => {
    onUpdateTranscript(sample.audioText);
    setAudioFileName(`${sample.title}.mp3`);
    onGenerateScenes(sample.audioText, sample.scenes);
  };

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5 lg:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-gray-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-bengali">
            <FileAudio className="w-5 h-5 text-indigo-400" />
            ১. অডিও ও স্ক্রিপ্ট ইনপুট
          </h2>
          <p className="text-xs text-gray-400 font-bengali mt-0.5">
            আপনার ভয়েস ফাইল আপলোড করুন বা সরাসরি রেকর্ড করুন
          </p>
        </div>

        {/* 1-Click Demo Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-bengali hidden md:inline">
            দ্রুত ডেমো টেস্ট:
          </span>
          {SAMPLE_STORIES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSampleStory(sample)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 font-bengali transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {sample.title.slice(0, 16)}...
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload or Record Block */}
        <div className="flex flex-col gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 hover:border-indigo-500/60 rounded-xl p-5 text-center cursor-pointer bg-gray-800/30 hover:bg-gray-800/60 transition flex flex-col items-center justify-center min-h-[130px]"
          >
            <Upload className="w-7 h-7 text-indigo-400 mb-2 animate-bounce-subtle" />
            <p className="text-sm font-medium text-gray-200 font-bengali">
              {audioFileName ? audioFileName : 'অডিও ফাইল এখানে ড্রপ বা সিলেক্ট করুন'}
            </p>
            <p className="text-xs text-gray-400 mt-1">MP3, WAV, M4A, AAC (সর্বোচ্চ ৫ মিনিট)</p>
          </div>

          {/* Live Mic Recorder */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm text-gray-200 border border-gray-700 font-bengali transition"
              >
                <Mic className="w-4 h-4 text-red-400" />
                <span>লাইভ ভয়েস রেকর্ড করুন</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-sm text-red-300 font-bengali transition animate-pulse"
              >
                <MicOff className="w-4 h-4 text-red-400" />
                <span>রেকর্ডিং থামান ({recordingTime}s)</span>
              </button>
            )}
          </div>
        </div>

        {/* Script & Google Drive Hook Settings */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-300 font-bengali flex items-center justify-between mb-1.5">
              <span>ভয়েসের বাংলা স্ক্রিপ্ট (Narration Text):</span>
              <span className="text-[10px] text-gray-500">শব্দ সংখ্যা: {currentTranscript.split(/\s+/).filter(Boolean).length}</span>
            </label>
            <textarea
              rows={4}
              value={currentTranscript}
              onChange={(e) => onUpdateTranscript(e.target.value)}
              placeholder="আপনি ভয়েসে যা যা বলছেন এখানে লিখুন বা পেস্ট করুন... (যেমন: এ বছর বাংলাদেশের অর্থনীতিতে প্রায় দুই বিলিয়ন ডলার লস হয়েছে...)"
              className="w-full bg-gray-800/90 border border-gray-700 rounded-xl p-3 text-sm text-white placeholder-gray-500 font-bengali focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          {/* Drive Hook URL Field */}
          <div>
            <label className="text-xs font-medium text-gray-300 font-bengali flex items-center gap-1.5 mb-1.5">
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>গুগল ড্রাইভ হুক ফুটেজ লিংক (প্রথম ৫-৭ সেকেন্ডের জন্য):</span>
            </label>
            <input
              type="text"
              value={driveHookUrl}
              onChange={(e) => onUpdateDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/your-video-id/view (ঐচ্ছিক)"
              className="w-full bg-gray-800/90 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 font-sans focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-5 pt-4 border-t border-gray-800/80 flex items-center justify-between">
        <p className="text-xs text-gray-400 font-bengali hidden sm:block">
          💡 টিপস: ভয়েসে সংখ্যা বা মহাকাশ বা চিকিৎসার কথা থাকলে সিস্টেম নিজে থেকে সঠিক দৃশ্য তৈরি করবে।
        </p>

        <button
          onClick={() => onGenerateScenes(currentTranscript)}
          disabled={!currentTranscript.trim() || isGenerating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition active:scale-95 font-bengali"
        >
          <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'সিন বিশ্লেষণ চলছে...' : 'স্মার্ট স্টোরিবোর্ড সিন তৈরি করুন'}</span>
        </button>
      </div>
    </div>
  );
}
