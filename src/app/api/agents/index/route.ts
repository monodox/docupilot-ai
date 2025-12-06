import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/lib/agents';

export async function POST(request: NextRequest) {
  try {
    const { documentId, content } = await request.json();

    if (!documentId || !content) {
      return NextResponse.json(
        { error: 'Document ID and content are required' },
        { status: 400 }
      );
    }

    const orchestrator = new AgentOrchestrator();
    await orchestrator.indexDocument(documentId, content);

    return NextResponse.json({ 
      success: true,
      message: 'Document indexed successfully' 
    });
  } catch (error: any) {
    console.error('Indexing error:', error);
    return NextResponse.json(
      { error: error.message || 'Indexing failed' },
      { status: 500 }
    );
  }
}
