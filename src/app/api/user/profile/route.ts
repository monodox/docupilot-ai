import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { firstName, lastName, email } = await request.json();
    
    const response = await fetch(`${process.env.CF_API_URL}/api/user/profile.cfm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email })
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
