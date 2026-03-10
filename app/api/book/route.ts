import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { meetingType, selectedDate, selectedTime, formData, timezone = 'America/New_York' } = body;

    const CREDENTIALS = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    const auth = new google.auth.JWT(
      CREDENTIALS.client_email, undefined, CREDENTIALS.private_key,
      ['https://www.googleapis.com/auth/calendar.events'],
      process.env.SALES_REP_EMAIL
    );
    const calendar = google.calendar({ version: 'v3', auth });

    const cleanDate = selectedDate.split('T')[0]; // "2026-03-10"
    
    // Manual time parsing: Converts "09:00 AM" into 24-hour variables
    const timeMatch = selectedTime.match(/(\d+):(\d+)\s+(AM|PM)/i);
    let startHour = parseInt(timeMatch[1]);
    const startMin = parseInt(timeMatch[2]);
    if (timeMatch[3].toUpperCase() === 'PM' && startHour < 12) startHour += 12;
    if (timeMatch[3].toUpperCase() === 'AM' && startHour === 12) startHour = 0;

    const startHourStr = startHour.toString().padStart(2, '0');
    const startMinStr = startMin.toString().padStart(2, '0');
    const googleStartTime = `${cleanDate}T${startHourStr}:${startMinStr}:00`;

    // Calculate end time manually
    const mt = typeof meetingType === 'string' ? meetingType : meetingType?.id;
    const meetingTitle = typeof meetingType === 'string' ? 'Meeting' : meetingType?.title;
    const durationMap: Record<string, number> = { intro: 30, lunch: 60, onsite: 120 };
    const duration = durationMap[mt] || 30;
    
    const endObj = new Date(`2000-01-01T${startHourStr}:${startMinStr}:00`);
    endObj.setMinutes(endObj.getMinutes() + duration);
    const endHourStr = endObj.getHours().toString().padStart(2, '0');
    const endMinStr = endObj.getMinutes().toString().padStart(2, '0');
    const googleEndTime = `${cleanDate}T${endHourStr}:${endMinStr}:00`;

    const event = {
      summary: `GateGuard ${meetingTitle}: ${formData.name} (${formData.company})`,
      description: `New meeting booked via GateGuard website.\n\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}`,
      start: { dateTime: googleStartTime, timeZone: timezone },
      end: { dateTime: googleEndTime, timeZone: timezone },
      attendees: [{ email: formData.email }],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all',
    });

    return NextResponse.json({ success: true, eventLink: response.data.htmlLink });

  } catch (error: any) {
    console.error('Full Error:', error);
    // This sends the EXACT Google error text to your screen!
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown Booking Error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
