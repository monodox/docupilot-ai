import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await request.json();
    
    const response = await fetch(`${process.env.CF_API_URL}/api/user/password.cfm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, currentPassword, newPassword })
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
