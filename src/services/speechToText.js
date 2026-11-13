// Speech-to-Text Service: Auto-transcribes uploaded audio using Gemini 1.5 Flash
// Robust error handling, format normalization, and clear feedback

export async function transcribeAudio(audioFile, geminiApiKey) {
  if (!audioFile) {
    return { transcript: '', error: 'কোনো অডিও ফাইল পাওয়া যায়নি।' };
  }

  if (!geminiApiKey || geminiApiKey.trim().length < 10) {
    return {
      transcript: '',
      error: 'দয়া করে উপরের Settings থেকে আপনার Google Gemini API Key দিন।'
    };
  }

  try {
    const base64Data = await fileToBase64(audioFile);
    let mimeType = audioFile.type || 'audio/mp3';
    if (!mimeType || mimeType === 'application/octet-stream') {
      mimeType = 'audio/mp3';
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`,
      {
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
                  text: `তুমি একজন দক্ষ বাংলা ট্রান্সক্রাইবার। এই অডিও ফাইলটি শুনে সম্পূর্ণ বাংলায় নিখুঁত ও হুবহু ট্রান্সক্রাইব করো।
নিয়ম:
১. প্রতিটি বাক্য বাংলা দাঁড়ি (।) দিয়ে শেষ করবে।
২. কোনো বাড়তি কথা বা ভূমিকা লিখবে না। শুধুমাত্র অডিওর ভেতরের কথাগুলো লিখবে।`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192
          }
        })
      }
    );

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({}));
      const msg = errRes?.error?.message || `API Error: ${response.status}`;
      return { transcript: '', error: `Gemini এরর: ${msg}` };
    }

    const data = await response.json();
    const transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!transcript) {
      return { transcript: '', error: 'অডিও থেকে কোনো কথা সনাক্ত করা যায়নি।' };
    }

    return { transcript, error: null };
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
