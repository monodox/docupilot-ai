import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const response = await fetch(`${process.env.CF_API_URL}/api/auth/login.cfm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}