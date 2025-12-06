import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${process.env.CF_API_URL}/api/ai/generate.cfm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ 
      success: false, 
      message: error?.message || 'AI generation failed' 
    }, { status: 500 });
  }
}
