if (!process.env.ELEVENLABS_API_KEY) {
  console.warn('Missing ELEVENLABS_API_KEY - will use browser fallback');
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Default voice ID (Rachel - friendly female voice)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

export async function textToSpeech(text: string, voiceId: string = DEFAULT_VOICE_ID) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}

// Get available voices
export async function getVoices() {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('ElevenLabs get voices error:', error);
    throw error;
  }
}

// Client-side browser fallback (Web Speech API)
export function browserTextToSpeech(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    throw new Error('Speech synthesis not supported');
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}
