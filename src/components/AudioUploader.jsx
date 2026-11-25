import React, { useState, useRef } from 'react';
import { Upload, Mic, MicOff, Sparkles, Wand2, FileAudio, Link2, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react';
import { SAMPLE_STORIES } from '../constants/presets';
import { transcribeAudio } from '../services/speechToText';
import { getSettings } from '../services/storage';

export default function AudioUploader({
  onGenerateScenes,
  currentTranscript,
  onUpdateTranscript,
  driveHookUrl,
  onUpdateDriveUrl,
  isGenerating,
  onSetAudioUrl
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFileName, setAudioFileName] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showScriptBox, setShowScriptBox] = useState(true);
  const [transcribeNotice, setTranscribeNotice] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  const getAudioDuration = (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        const d = audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) ? audio.duration : 0;
        resolve(d);
      };
      audio.onerror = () => resolve(0);
    });
  };

  // File Upload Handler with Audio Duration detection
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create real blob audio URL for preview playback
    const audioBlobUrl = URL.createObjectURL(file);
    if (onSetAudioUrl) onSetAudioUrl(audioBlobUrl);
    setAudioFileName(file.name);

    setTranscribeNotice('🎙️ আপনার ভয়েস পড়া হচ্ছে... অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন');
    setIsTranscribing(true);

    const settings = getSettings();
    const [detectedDuration, result] = await Promise.all([
      getAudioDuration(audioBlobUrl),
      transcribeAudio(file, settings?.geminiApiKey)
    ]);

    if (detectedDuration > 0) setAudioDuration(detectedDuration);

    setIsTranscribing(false);
    if (result.transcript) {
      setTranscribeNotice('✅ ভয়েস সফলভাবে ট্রান্সক্রাইব হয়েছে! সিন তৈরি হচ্ছে...');
      onUpdateTranscript(result.transcript);
      // Immediately generate brand new scenes with the exact audio duration!
      onGenerateScenes(result.transcript, null, detectedDuration);
    } else {
      setTranscribeNotice(result.error || 'অডিও সনাক্ত হয়েছে। প্রয়োজনে নিচের বক্সে স্ক্রিপ্ট পেস্ট করে বাটনে চাপুন।');
    }
  };

  // Live Microphone Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const recordName = `ভয়েস_${Date.now()}.webm`;
        setAudioFileName(recordName);

        const recordUrl = URL.createObjectURL(audioBlob);
        if (onSetAudioUrl) onSetAudioUrl(recordUrl);

        setIsTranscribing(true);
        setTranscribeNotice('🎙️ রেকর্ডকৃত ভয়েস বিশ্লেষণ করা হচ্ছে...');
        const settings = getSettings();
        const fileObj = new File([audioBlob], recordName, { type: 'audio/webm' });
        const result = await transcribeAudio(fileObj, settings?.geminiApiKey);
        setIsTranscribing(false);

        if (result.transcript) {
          onUpdateTranscript(result.transcript);
          onGenerateScenes(result.transcript, null, recordingTime);
        } else {
          setTranscribeNotice(result.error || 'ভয়েস সেভ হয়েছে। নিচে স্ক্রিপ্ট দিয়ে সিন তৈরি করতে পারেন।');
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

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5 lg:p-6 shadow-xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-gray-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-bengali">
            <FileAudio className="w-5 h-5 text-indigo-400" />
            ১. ভয়েস ও স্ক্রিপ্ট ইনপুট
          </h2>
          <p className="text-xs text-gray-400 font-bengali mt-0.5">
            ভয়েস ফাইল আপলোড করুন অথবা বক্সে স্ক্রিপ্ট পেস্ট করে ১-ক্লিকে নতুন সিন তৈরি করুন
          </p>
        </div>

        {audioFileName && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
            {audioFileName}
          </span>
        )}
      </div>

      {/* Primary Voice & Script Grid */}
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
            className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 rounded-xl p-5 text-center cursor-pointer bg-indigo-950/20 hover:bg-indigo-950/40 transition flex flex-col items-center justify-center min-h-[140px] group"
          >
            <Upload className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-bold text-gray-200 font-bengali">
              {audioFileName ? audioFileName : 'এখানে ক্লিক করে আপনার ভয়েস অডিও ফাইল দিন'}
            </p>
            <p className="text-xs text-gray-400 mt-1">MP3, WAV, M4A (যেকোনো দৈর্ঘ্যের অডিও)</p>
          </div>

          {/* Live Mic Recorder */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm text-gray-200 border border-gray-700 font-bengali transition"
              >
                <Mic className="w-4 h-4 text-red-400" />
                <span>সরাসরি মাইক্রোফোনে রেকর্ড করুন</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-sm text-red-300 font-bengali transition animate-pulse"
              >
                <MicOff className="w-4 h-4 text-red-400" />
                <span>রেকর্ডিং সম্পন্ন ({recordingTime}s)</span>
              </button>
            )}
          </div>

          {/* Status Banner */}
          {transcribeNotice && (
            <div className={`p-3 rounded-xl text-xs font-bengali flex items-center gap-2 ${
              isTranscribing 
                ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 animate-pulse'
                : 'bg-gray-800 border border-gray-700 text-gray-300'
            }`}>
              {isTranscribing && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
              <span>{transcribeNotice}</span>
            </div>
          )}
        </div>

        {/* Script Editor & Generate Block */}
        <div className="flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300 font-bengali">
                স্ক্রিপ্ট টেক্সট (ভয়েসের প্রতিটি বাক্য এখানে থাকবে):
              </label>
              <span className="text-[10px] text-gray-400 font-mono">
                {currentTranscript?.split(/\s+/).filter(Boolean).length || 0} শব্দ
              </span>
            </div>

            <textarea
              rows={5}
              value={currentTranscript || ''}
              onChange={(e) => onUpdateTranscript(e.target.value)}
              placeholder="আপনার ভয়েসের পুরো স্ক্রিপ্টটি এখানে পেস্ট করুন বা অটোমেটিক আসবে..."
              className="w-full bg-gray-800/90 border border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-gray-500 font-bengali focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none leading-relaxed"
            />
          </div>

          {/* Force Re-generate Scenes from Script Button */}
          <button
            onClick={() => onGenerateScenes(currentTranscript, null, audioDuration)}
            disabled={!currentTranscript?.trim() || isGenerating || isTranscribing}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-98 font-bengali"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'নতুন সিন তৈরি হচ্ছে...' : 'এই স্ক্রিপ্ট অনুযায়ী নতুন সিন তৈরি করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
