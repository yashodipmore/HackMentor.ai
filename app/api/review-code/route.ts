import { NextResponse } from 'next/server';
import { analyzeCode, generateMentorResponse } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'No code provided' },
        { status: 400 }
      );
    }

    // Analyze the code
    const issues = await analyzeCode(code, language || 'javascript');

    // Generate friendly mentor response
    const message = await generateMentorResponse(
      issues,
      `Language: ${language || 'javascript'}`
    );

    // Calculate code quality score
    const criticalIssues = issues.filter((i) => i.severity === 'critical').length;
    const warningIssues = issues.filter((i) => i.severity === 'warning').length;
    const score = Math.max(0, 10 - criticalIssues * 2 - warningIssues * 0.5);

    return NextResponse.json({
      success: true,
      review: {
        message,
        issues,
        score: Math.round(score * 10) / 10,
        language: language || 'javascript',
        criticalCount: criticalIssues,
        warningCount: warningIssues,
        infoCount: issues.filter((i) => i.severity === 'info').length,
      },
    });
  } catch (error: any) {
    console.error('Code review error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to review code',
      },
      { status: 500 }
    );
  }
}
