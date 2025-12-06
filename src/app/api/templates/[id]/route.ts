import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${process.env.CF_API_URL}/api/templates.cfm?id=${params.id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
