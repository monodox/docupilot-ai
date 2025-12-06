import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    const formData = new URLSearchParams();
    formData.append('token', token);
    
    const response = await fetch(`${process.env.CF_API_URL}/api/auth/verify-email.cfm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}