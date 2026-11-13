// Speech-to-Text Service: Auto-transcribes uploaded audio using Gemini API (Free Tier)
// No manual script typing needed — just upload voice and the system understands everything

/**
 * Main entry: transcribe an audio file automatically
 */
export async function transcribeAudio(audioFile, geminiApiKey) {
  if (!audioFile) return { transcript: '', error: 'কোনো অডিও ফাইল পাওয়া যায়নি' };

  // Primary: Use Gemini API (free tier) for accurate Bengali transcription
  if (geminiApiKey && geminiApiKey.trim().length > 5) {
    try {
      return await transcribeWithGemini(audioFile, geminiApiKey);
    } catch (err) {
      console.error('Gemini transcription failed:', err);
      return { transcript: '', error: 'Gemini API দিয়ে ট্রান্সক্রিপশন ব্যর্থ হয়েছে। API Key সঠিক কি না দেখুন।' };
    }
  }

  return {
    transcript: '',
    error: 'অটো ট্রান্সক্রিপশনের জন্য সেটিংসে আপনার ফ্রি Gemini API Key দিন।'
  };
}

/**
 * Transcribe using Google Gemini 1.5 Flash (Free Tier: 15 RPM, 1M tokens/day)
 */
async function transcribeWithGemini(audioFile, apiKey) {
  const base64Data = await fileToBase64(audioFile);
  const mimeType = audioFile.type || 'audio/mpeg';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            },
            {
              text: `তুমি একজন বাংলা স্পিচ ট্রান্সক্রাইবার। এই অডিও ফাইলটি সম্পূর্ণ বাংলায় হুবহু ট্রান্সক্রাইব করো।

নিয়ম:
- শুধু ট্রান্সক্রিপ্ট লিখবে, অন্য কোনো মন্তব্য, শিরোনাম বা ব্যাখ্যা দেবে না।
- বাক্যগুলো বাংলা দাঁড়ি (।) দিয়ে আলাদা করবে।
- কোনো ইংরেজি অনুবাদ করবে না, বাংলায় যা শুনবে তাই লিখবে।`
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096
        }
      })
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  const transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

  if (!transcript) {
    throw new Error('Gemini থেকে কোনো ট্রান্সক্রিপ্ট পাওয়া যায়নি');
  }

  return { transcript, error: null };
}

/**
 * Convert File to base64 string (without data URI prefix)
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Remove the "data:audio/mpeg;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
