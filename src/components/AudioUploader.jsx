import React, { useState, useRef } from 'react';
import { Upload, Mic, MicOff, Sparkles, Wand2, FileAudio, Link2, ChevronDown, ChevronUp, Loader2, Play, Volume2 } from 'lucide-react';
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
  const [showScriptBox, setShowScriptBox] = useState(false);
  const [transcribeNotice, setTranscribeNotice] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto Voice Upload & Auto-Transcription
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create real blob audio URL for preview playback
    const audioBlobUrl = URL.createObjectURL(file);
    if (onSetAudioUrl) onSetAudioUrl(audioBlobUrl);

    setAudioFileName(file.name);
    setTranscribeNotice('🎙️ আপনার ভয়েস অডিও পড়া হচ্ছে...');
    setIsTranscribing(true);

    const settings = getSettings();
    const result = await transcribeAudio(file, settings?.geminiApiKey);

    setIsTranscribing(false);
    if (result.transcript) {
      setTranscribeNotice('✅ ভয়েস সফলভাবে ট্রান্সক্রাইব হয়েছে! সিন তৈরি হচ্ছে...');
      onUpdateTranscript(result.transcript);
      setShowScriptBox(true);
      onGenerateScenes(result.transcript);
    } else {
      setTranscribeNotice(result.error || 'অডিও যুক্ত হয়েছে। নিচের স্ক্রিপ্ট বক্সে টেক্সট কনফার্ম করতে পারেন।');
      setShowScriptBox(true);
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
          setShowScriptBox(true);
          onGenerateScenes(result.transcript);
        } else {
          setShowScriptBox(true);
          setTranscribeNotice(result.error || 'ভয়েস সেভ হয়েছে। প্রয়োজনে স্ক্রিপ্ট বক্স দেখে নিতে পারেন।');
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
    setShowScriptBox(true);
    onGenerateScenes(sample.audioText, sample.scenes);
  };

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5 lg:p-6 shadow-xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-gray-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-bengali">
            <FileAudio className="w-5 h-5 text-indigo-400" />
            ১. অরিজিনাল ভয়েস আপলোড
          </h2>
          <p className="text-xs text-gray-400 font-bengali mt-0.5">
            আপনার আসল ভয়েস আপলোড করুন — ভিডিও প্লে করার সময় আপনার কণ্ঠই লাউডস্পিকারে বাজবে
          </p>
        </div>

        {/* 1-Click Demo Button */}
        <div className="flex items-center gap-2">
          {SAMPLE_STORIES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSampleStory(sample)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 font-bengali transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              কৃষ্ণসাগর ডলফিন ডেমো
            </button>
          ))}
        </div>
      </div>

      {/* Primary Voice Box */}
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
                <span>সরাসরি মাইক্রোফোনে নিজের ভয়েস দিন</span>
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
        </div>

        {/* Secondary: Drive URL & Optional Script Viewer */}
        <div className="flex flex-col justify-between gap-3">
          {/* Drive Hook URL Field */}
          <div>
            <label className="text-xs font-medium text-gray-300 font-bengali flex items-center gap-1.5 mb-1.5">
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>গুগল ড্রাইভ পার্সোনাল ফুটেজ লিংক (ঐচ্ছিক):</span>
            </label>
            <input
              type="text"
              value={driveHookUrl}
              onChange={(e) => onUpdateDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/... (না থাকলে এভারটার কথা বলবে)"
              className="w-full bg-gray-800/90 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 font-sans focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Transcription Status Banner */}
          {isTranscribing && (
            <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl flex items-center gap-2.5 text-xs text-indigo-200 font-bengali animate-pulse">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>{transcribeNotice || 'ভয়েস থেকে স্বয়ংক্রিয়ভাবে স্ক্রিপ্ট পড়া হচ্ছে...'}</span>
            </div>
          )}

          {/* Toggle Optional Script Textarea */}
          <div className="border border-gray-800 rounded-xl p-3 bg-gray-800/30">
            <button
              type="button"
              onClick={() => setShowScriptBox(!showScriptBox)}
              className="w-full flex items-center justify-between text-xs text-gray-300 font-bengali hover:text-white"
            >
              <span>স্ক্রিপ্ট টেক্সট দেখুন বা ম্যানুয়ালি এডিট করুন (ঐচ্ছিক)</span>
              {showScriptBox ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showScriptBox && (
              <div className="mt-2.5">
                <textarea
                  rows={3}
                  value={currentTranscript}
                  onChange={(e) => onUpdateTranscript(e.target.value)}
                  placeholder="আপনার ভয়েসের কথাগুলো এখানে স্বয়ংক্রিয়ভাবে দেখাবে..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 font-bengali focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-5 pt-4 border-t border-gray-800/80 flex items-center justify-between">
        <p className="text-xs text-gray-400 font-bengali hidden sm:block">
          ✨ ৪-লেয়ার ইঞ্জিন: অবতার এক্সপ্লেনার + সোনার মোশন + পেপার কোলাজ + ডাইনামিক সিন।
        </p>

        <button
          onClick={() => onGenerateScenes(currentTranscript)}
          disabled={!currentTranscript.trim() || isGenerating || isTranscribing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition active:scale-95 font-bengali"
        >
          <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? '৪-লেয়ার রিল তৈরি হচ্ছে...' : 'ডাইনামিক রিল তৈরি করুন'}</span>
        </button>
      </div>
    </div>
  );
}
