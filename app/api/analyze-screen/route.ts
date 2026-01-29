import { NextResponse } from 'next/server';
import { extractCodeFromImageGroq } from '@/lib/groq';
import { analyzeCode, generateMentorResponse } from '@/lib/groq';
import crypto from 'crypto';

// Simple hash function to detect code changes
function hashCode(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Step 1: Extract code from screenshot using Groq Vision
    const extraction = await extractCodeFromImageGroq(imageData);

    if (!extraction.has_code || !extraction.code) {
      return NextResponse.json({
        success: true,
        analysis: {
          message: "👋 Hi! I can't extract code from the screenshot right now.\n\n💡 Try this instead:\n1. Paste your code directly in the chat\n2. Ask me to 'review this code:' followed by your code\n3. I'll analyze it and give you feedback!\n\nExample:\n```\nreview this code:\nfunction hello() {\n  console.log('hi')\n}\n```",
          issues: [],
          score: 0,
          code_hash: null,
        },
      });
    }

    // Generate hash of extracted code
    const codeHash = hashCode(extraction.code);

    // Step 2: Analyze the extracted code
    const issues = await analyzeCode(extraction.code, extraction.language || 'javascript');

    // Step 3: Generate friendly mentor response
    const message = await generateMentorResponse(issues, `Language: ${extraction.language}`);

    // Step 4: Calculate code quality score
    const criticalIssues = issues.filter((i) => i.severity === 'critical').length;
    const warningIssues = issues.filter((i) => i.severity === 'warning').length;
    const score = Math.max(0, 10 - criticalIssues * 2 - warningIssues * 0.5);

    return NextResponse.json({
      success: true,
      analysis: {
        message,
        issues,
        score: Math.round(score * 10) / 10,
        language: extraction.language,
        file_name: extraction.file_name,
        code_hash: codeHash,
        code_context: extraction.code.substring(0, 200), // First 200 chars for comparison
      },
    });
  } catch (error: any) {
    console.error('Screen analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze screen',
      },
      { status: 500 }
    );
  }
}
