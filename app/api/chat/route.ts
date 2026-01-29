import { NextResponse } from 'next/server';
import { groq, analyzeCode, generateMentorResponse } from '@/lib/groq';

// Detect if message contains code
function containsCode(message: string): boolean {
  const codePatterns = [
    /```[\s\S]*```/,  // Code blocks
    /function\s+\w+\s*\(/,  // Function declarations
    /const\s+\w+\s*=/,  // Variable declarations
    /class\s+\w+/,  // Class declarations
    /import\s+.*from/,  // Imports
    /export\s+(default|const|function)/,  // Exports
    /<\w+.*>/,  // JSX/HTML tags
    /def\s+\w+\s*\(/,  // Python functions
  ];
  
  return codePatterns.some(pattern => pattern.test(message));
}

// Extract code from message
function extractCode(message: string): string | null {
  // Try to extract from code blocks first
  const codeBlockMatch = message.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  
  // If no code block but contains code patterns, return whole message
  if (containsCode(message)) {
    return message;
  }
  
  return null;
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'No message provided' },
        { status: 400 }
      );
    }

    // Check if message contains code for review
    const code = extractCode(message);
    
    if (code && (message.toLowerCase().includes('review') || 
                 message.toLowerCase().includes('check') ||
                 message.toLowerCase().includes('analyze') ||
                 code.length > 50)) {
      // Perform code analysis
      const issues = await analyzeCode(code, 'javascript');
      const reviewMessage = await generateMentorResponse(issues);
      
      return NextResponse.json({
        success: true,
        response: reviewMessage,
        isCodeReview: true,
        issues: issues.length,
      });
    }

    // Regular chat response
    const messages = [
      {
        role: 'system' as const,
        content: `You are HackMentor, a friendly and helpful AI pair programmer.

Your role:
- Help developers write better code
- Explain concepts clearly
- Provide code examples when helpful
- Be encouraging and supportive
- Keep responses concise (under 150 words)
- If user shares code, offer to review it

Tone: Friendly mentor, not robotic. Use emojis occasionally.`,
      },
      // Add previous messages for context (last 5)
      ...(history || [])
        .slice(-5)
        .map((msg: any) => ({
          role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: msg.content,
        })),
      {
        role: 'user' as const,
        content: message,
      },
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      success: true,
      response: aiResponse,
      isCodeReview: false,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process chat',
      },
      { status: 500 }
    );
  }
}
