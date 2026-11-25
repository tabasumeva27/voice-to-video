// Speech-to-Text Service: Auto-transcribes uploaded audio using Google Gemini API
// Uses current Gemini 2.5 / 2.0 Flash models with automatic fallback

const GEMINI_AUDIO_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash-latest'
];

function resolveAudioMimeType(file) {
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }
  const ext = (file.name || '').split('.').pop()?.toLowerCase();
  const map = {
    mp3: 'audio/mp3',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    webm: 'audio/webm',
    flac: 'audio/flac'
  };
  return map[ext] || 'audio/mp3';
}

export async function transcribeAudio(audioFile, geminiApiKey) {
  if (!audioFile) {
    return { transcript: '', error: 'কোনো অডিও ফাইল পাওয়া যায়নি।' };
  }

  if (!geminiApiKey || geminiApiKey.trim().length < 8) {
    return {
      transcript: '',
      error: 'দয়া করে উপরের Settings থেকে আপনার Google Gemini API Key দিন।'
    };
  }

  try {
    const base64Data = await fileToBase64(audioFile);
    const mimeType = resolveAudioMimeType(audioFile);
    const cleanKey = geminiApiKey.trim();
    let lastError = null;

    for (const model of GEMINI_AUDIO_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Data
                    }
                  },
                  {
                    text: `তুমি একজন দক্ষ বাংলা স্পিচ ট্রান্সক্রাইবার। এই অডিওর কথাগুলো শুনে হুবহু শুদ্ধ বাংলায় প্রতিটি বাক্য দাঁড়ি (।) দিয়ে আলাদা করে ট্রান্সক্রাইব করো। কোনো ভূমিকা, ব্যাখ্যা বা ইংরেজি অনুবাদ লিখবে না — শুধুমাত্র অডিওতে যা বলা হয়েছে তা লিখবে।`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 8192
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) {
            return { transcript: text, error: null, model };
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
        }
      } catch (e) {
        lastError = e.message;
      }
    }

    return {
      transcript: '',
      error: `Gemini এরর: ${lastError || 'মডেল পাওয়া যায়নি'}। আপনি ডানদিকের বক্সে স্ক্রিপ্ট পেস্ট করে 'এই স্ক্রিপ্ট অনুযায়ী নতুন সিন তৈরি করুন' চাপতে পারেন।`
    };
  } catch (err) {
    console.error('Audio transcription error:', err);
    return { transcript: '', error: `ট্রান্সক্রিপশন ব্যর্থ হয়েছে: ${err.message}` };
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result;
      resolve(res.split(',')[1]);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
