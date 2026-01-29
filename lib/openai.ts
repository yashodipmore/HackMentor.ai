import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Vision API - Extract code from screenshot
export async function extractCodeFromImage(base64Image: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: `Extract all code from this screenshot. Return JSON format:
{
  "code": "extracted code as string",
  "language": "javascript|typescript|python|etc",
  "file_name": "best guess at file name",
  "has_code": true/false
}
If no code is visible, return {"has_code": false, "code": null}`,
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.1, // Low for accuracy
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { has_code: false, code: null };
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI Vision API error:', error);
    throw error;
  }
}

// Code analysis using GPT-4o-mini
export async function analyzeCodeWithGPT(code: string, language: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are HackMentor, a senior software engineer reviewing code.

Focus on:
1. Bugs and errors (syntax, logic, type errors)
2. Security vulnerabilities (XSS, injection, exposed secrets)
3. Performance issues (unnecessary re-renders, memory leaks, inefficient algorithms)
4. Best practices (naming, structure, patterns)
5. Accessibility (a11y issues)

For each issue found:
- severity: "critical" | "warning" | "info"
- line: line number (if identifiable)
- type: "bug" | "security" | "performance" | "best-practice" | "accessibility"
- description: concise, helpful description
- fix: code example of the fix
- explanation: why it matters

Response format: JSON array of issues`,
        },
        {
          role: "user",
          content: `Analyze this ${language} code:\n\n${code}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { issues: [] };
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI Code Analysis error:', error);
    throw error;
  }
}
