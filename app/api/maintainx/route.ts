import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, description, contactInfo, propertyName, locationId } = await req.json();

    const apiKey = process.env.MAINTAINX_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Build the payload
    const payload: any = {
      title: `[${propertyName}] ${title}`,
      description: description,
      creatorContactInfo: contactInfo
    };

    // If a location ID is provided from Supabase, attach it as an integer!
    if (locationId) {
      payload.locationId = parseInt(locationId, 10);
    }

    // Ping the official MaintainX API endpoint for Work Requests
    const response = await fetch('https://api.getmaintainx.com/v1/workrequests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("MaintainX API Error:", errorData);
      return NextResponse.json({ error: "Failed to submit to MaintainX" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
