// Speech-to-Text Service: Auto-transcribes uploaded audio using Google Gemini API
// Handles v1beta and v1 stable endpoints with auto-fallbacks

export async function transcribeAudio(audioFile, geminiApiKey) {
  if (!audioFile) {
    return { transcript: '', error: 'কোনো অডিও ফাইল পাওয়া যায়নি।' };
  }

  if (!geminiApiKey || geminiApiKey.trim().length < 8) {
    return {
      transcript: '',
      error: 'দয়া করে Settings থেকে আপনার Google Gemini API Key দিন।'
    };
  }

  try {
    const base64Data = await fileToBase64(audioFile);
    let mimeType = audioFile.type || 'audio/mp3';
    if (!mimeType || mimeType === 'application/octet-stream') {
      mimeType = 'audio/mp3';
    }

    // List of models to try in order of speed and stability
    const modelsToTry = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest',
      'gemini-pro'
    ];

    const cleanKey = geminiApiKey.trim();
    let lastError = null;

    for (const model of modelsToTry) {
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
                    text: `তুমি একজন দক্ষ বাংলা স্পিচ ট্রান্সক্রাইবার। এই অডিওর কথাগুলো শুনে হুবহু শুদ্ধ বাংলায় প্রতিটি বাক্য দাঁড়ি (।) দিয়ে ট্রান্সক্রাইব করো। অন্য কোনো ভূমিকা বা মন্তব্য লিখবে না।`
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
            return { transcript: text, error: null };
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
      error: `Gemini এরর: ${lastError || 'মডেল পাওয়া যায়নি'}। আপনি সরাসরি ডানদিকের বক্সে স্ক্রিপ্ট পেস্ট করে 'সিন তৈরি করুন' চাপতে পারেন।` 
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
      const base64 = res.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
