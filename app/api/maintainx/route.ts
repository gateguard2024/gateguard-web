import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, description, contactInfo, propertyName } = await req.json();

    const apiKey = process.env.MAINTAINX_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Ping the official MaintainX API endpoint for Work Requests
    const response = await fetch('https://api.getmaintainx.com/v1/workrequests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[${propertyName}] ${title}`, // Automatically tags the property name!
        description: description,
        creatorContactInfo: contactInfo
      })
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
