export async function GET() {
  try {
    const response = await fetch(`${process.env.CF_API_URL}/api/dashboard.cfm`);
    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
