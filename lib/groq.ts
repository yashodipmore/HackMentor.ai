import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export { groq };

// Vision API - Extract code from screenshot
// Priority: Gemini (free) > OpenAI (paid) > Fallback
export async function extractCodeFromImageGroq(base64Image: string) {
  // Try Gemini first (FREE!)
  if (process.env.GOOGLE_AI_API_KEY) {
    try {
      const { extractCodeFromImageGemini } = await import('./gemini');
      return await extractCodeFromImageGemini(base64Image);
    } catch (error: any) {
      console.log('Gemini Vision failed, trying OpenAI:', error.message);
    }
  }

  // Try OpenAI as fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = require('openai').default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
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
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        return { has_code: false, code: null };
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error: any) {
      console.log('OpenAI Vision failed, using fallback:', error.message);
    }
  }

  // Fallback: Return a helpful message
  return {
    has_code: true,
    code: `// Vision AI temporarily unavailable
// Please paste your code in the chat and ask for review
// Example: "Review this code: [paste your code here]"`,
    language: 'javascript',
    file_name: 'code.js',
  };
}

export interface CodeIssue {
  type: 'security' | 'performance' | 'bug' | 'best-practice' | 'accessibility';
  severity: 'critical' | 'warning' | 'info';
  line?: number;
  description: string;
  fix?: string;
  explanation?: string;
}

export async function analyzeCode(code: string, language: string = 'javascript'): Promise<CodeIssue[]> {
  try {
    const systemPrompt = `You are HackMentor, a senior software engineer reviewing code.

Analyze the code and return a JSON array of issues found.

Focus on:
1. Bugs and errors (syntax, logic, type errors)
2. Security vulnerabilities (XSS, injection, exposed secrets)
3. Performance issues (unnecessary re-renders, memory leaks, inefficient algorithms)
4. Best practices (naming, structure, patterns)
5. Accessibility (a11y issues)

For each issue:
{
  "type": "security|performance|bug|best-practice|accessibility",
  "severity": "critical|warning|info",
  "line": number (if identifiable),
  "description": "concise description",
  "fix": "code example of fix",
  "explanation": "why it matters"
}

Return ONLY valid JSON array. If no issues, return empty array [].`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this ${language} code:\n\n${code}` }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || '[]';
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : '[]';
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Groq analysis error:', error);
    return [];
  }
}

export async function generateMentorResponse(
  issues: CodeIssue[],
  context?: string
): Promise<string> {
  try {
    const systemPrompt = `You are HackMentor, a friendly AI pair programmer.

Generate a helpful, encouraging response about the code issues found.

Guidelines:
1. Prioritize by severity (critical first)
2. Explain WHY each issue matters
3. Provide code examples for fixes
4. Be conversational and supportive
5. Keep under 200 words

Tone: Friendly mentor, not robotic.`;

    const userPrompt = `Issues found:\n${JSON.stringify(issues, null, 2)}\n\n${context ? `Context: ${context}` : ''}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Unable to generate response.';
  } catch (error) {
    console.error('Groq response generation error:', error);
    return 'Sorry, I encountered an error generating feedback.';
  }
}
