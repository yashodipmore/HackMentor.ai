import { NextResponse } from 'next/server';
import { groq } from '@/lib/groq';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const results = {
    supabase: false,
    groq: false,
    gemini_vision: false,
    voyage: false,
    redis: false,
    elevenlabs: false,
    errors: [] as string[],
  };

  // Test Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.from('users').select('count').limit(1);
    if (!error || error.message.includes('relation')) {
      results.supabase = true;
    }
  } catch (error: any) {
    results.errors.push(`Supabase: ${error.message}`);
  }

  // Test Groq (Text)
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Say "test"' }],
      max_tokens: 10,
    });
    if (response.choices[0].message.content) {
      results.groq = true;
    }
  } catch (error: any) {
    results.errors.push(`Groq: ${error.message}`);
  }

  // Test Gemini Vision
  try {
    if (process.env.GOOGLE_AI_API_KEY) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const result = await model.generateContent(['Say hello']);
      const response = await result.response;
      
      if (response.text()) {
        results.gemini_vision = true;
      }
    }
  } catch (error: any) {
    results.errors.push(`Gemini Vision: ${error.message}`);
  }

  // Test Voyage AI
  try {
    if (process.env.VOYAGE_API_KEY) {
      const response = await fetch('https://api.voyageai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'voyage-code-2',
          input: 'test',
        }),
      });
      if (response.ok) {
        results.voyage = true;
      }
    }
  } catch (error: any) {
    results.errors.push(`Voyage: ${error.message}`);
  }

  // Test Redis
  try {
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const response = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/ping`,
        {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
        }
      );
      if (response.ok) {
        results.redis = true;
      }
    }
  } catch (error: any) {
    results.errors.push(`Redis: ${error.message}`);
  }

  // Test ElevenLabs
  try {
    if (process.env.ELEVENLABS_API_KEY) {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      });
      if (response.ok) {
        results.elevenlabs = true;
      }
    }
  } catch (error: any) {
    results.errors.push(`ElevenLabs: ${error.message}`);
  }

  const allWorking = Object.entries(results)
    .filter(([key]) => key !== 'errors')
    .every(([_, value]) => value === true);

  return NextResponse.json({
    success: allWorking,
    results,
    message: allWorking
      ? '🎉 All services are working!'
      : '⚠️ Some services need attention',
  });
}
