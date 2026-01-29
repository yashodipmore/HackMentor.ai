import { NextRequest, NextResponse } from 'next/server';
import { analyzeCode, generateMentorResponse } from '@/lib/groq';
import { getCached, setCache } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { image, code } = await request.json();

    // For now, we'll analyze code directly
    // In production, you'd extract code from image using Vision AI
    
    if (!code && !image) {
      return NextResponse.json(
        { error: 'No code or image provided' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `analysis:${code?.substring(0, 50)}`;
    const cached = await getCached(cacheKey);
    
    if (cached) {
      return NextResponse.json(cached);
    }

    // For demo: Use sample code if image is provided
    const sampleCode = code || `
function UserList() {
  const [users, setUsers] = useState();
  
  fetch('/api/users')
    .then(res => setUsers(res.json()));
  
  return users.map(user => (
    <div onClick={() => deleteUser(user.id)}>
      {user.name}
    </div>
  ));
}
    `;

    // Analyze code with Groq
    const issues = await analyzeCode(sampleCode, 'javascript');

    // Generate mentor response
    const feedback = await generateMentorResponse(issues);

    const result = {
      issues,
      feedback,
      codeQuality: calculateCodeQuality(issues),
      timestamp: new Date().toISOString(),
    };

    // Cache for 1 hour
    await setCache(cacheKey, result, 3600);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}

function calculateCodeQuality(issues: any[]): number {
  let score = 10;
  
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 2;
    else if (issue.severity === 'warning') score -= 1;
    else score -= 0.5;
  });

  return Math.max(0, Math.min(10, score));
}
