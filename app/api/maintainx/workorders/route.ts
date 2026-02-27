import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Grab the locationId from the URL (e.g., ?locationId=852)
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
    // Ping the official MaintainX API to get Work Orders for this specific property
    const response = await fetch(`https://api.getmaintainx.com/v1/workorders?locationId=${locationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from MaintainX");
    }

    const data = await response.json();
    
    // Filter out jobs that are already "DONE" so we only show active ones
    const activeJobs = (data.workOrders || []).filter((job: any) => job.status !== 'DONE' && job.status !== 'COMPLETED');

    return NextResponse.json({ activeJobs });

  } catch (error) {
    console.error("MaintainX GET Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
