import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini (free tier!)
const genAI = process.env.GOOGLE_AI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null;

// Vision API - Extract code from screenshot using Gemini
export async function extractCodeFromImageGemini(base64Image: string) {
  if (!genAI) {
    throw new Error('Google AI API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Extract all code from this screenshot. Return JSON format:
{
  "code": "extracted code as string",
  "language": "javascript|typescript|python|etc",
  "file_name": "best guess at file name",
  "has_code": true/false
}
If no code is visible, return {"has_code": false, "code": null}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { has_code: false, code: null };
  } catch (error) {
    console.error('Gemini Vision API error:', error);
    throw error;
  }
}

// Check if Gemini is available
export function isGeminiAvailable(): boolean {
  return !!process.env.GOOGLE_AI_API_KEY;
}
