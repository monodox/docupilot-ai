import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/lib/agents';

export async function POST(request: NextRequest) {
  try {
    const { prompt, category, userId } = await request.json();

    if (!prompt || !category) {
      return NextResponse.json(
        { error: 'Prompt and category are required' },
        { status: 400 }
      );
    }

    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.generateDocument({
      prompt,
      category,
      userId
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Agent generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
