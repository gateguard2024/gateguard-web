import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get('locationId');

  if (!locationId) {
    return NextResponse.json({ error: "Location ID required" }, { status: 400 });
  }

  const apiKey = process.env.MAINTAINX_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.getmaintainx.com/v1/workorders?locationId=${locationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      // THIS IS THE UPGRADE: We are forcing the server to read the exact error message
      const errorText = await response.text();
      console.error(`🔥 MAINTAINX REJECTION: Status ${response.status} | Details:`, errorText);
      throw new Error(`MaintainX rejected request: Status ${response.status}`);
    }

    const data = await response.json();
    
    const activeJobs = (data.workOrders || []).filter((job: any) => job.status !== 'DONE' && job.status !== 'COMPLETED');

    return NextResponse.json({ activeJobs });

  } catch (error) {
    console.error("MaintainX GET Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
