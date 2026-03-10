import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { meetingType, selectedDate, selectedTime, formData, timezone = 'America/New_York' } = body;

    // 1. Authenticate with Google (We use .events scope here so we have permission to write)
    const CREDENTIALS = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    const auth = new google.auth.JWT(
      CREDENTIALS.client_email,
      undefined,
      CREDENTIALS.private_key,
      ['https://www.googleapis.com/auth/calendar.events'],
      process.env.SALES_REP_EMAIL // 🚨 THE IMPERSONATION LINE: This tells the bot to act exactly as the sales rep
    );
    const calendar = google.calendar({ version: 'v3', auth });

    // 2. Format the Date and Time properly (Hardcoded to March 2026 to match your UI)
    const dateString = `2026-03-${selectedDate.toString().padStart(2, '0')} ${selectedTime}`;
    const startTime = new Date(dateString); 
    
    // Map meeting type to duration
    const durations: Record<string, number> = { intro: 15, technical: 45, onsite: 60 };
    const duration = durations[meetingType.id] || 30;
    
    // Calculate end time
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // 3. Create the Event payload
    const targetCalendarId = process.env.SALES_REP_EMAIL;

    const event = {
      summary: `GateGuard ${meetingType.title}: ${formData.name} (${formData.company})`,
      description: `New meeting booked via GateGuard website.\n\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}`,
      start: { dateTime: startTime.toISOString(), timeZone: timezone },
      end: { dateTime: endTime.toISOString(), timeZone: timezone },
      attendees: [{ email: formData.email }], // This tells Google who to invite
    };

    // 4. Push to Google Calendar
    const response = await calendar.events.insert({
      calendarId: targetCalendarId,
      requestBody: event,
      sendUpdates: 'all', // 🚨 THIS IS THE MAGIC LINE! It tells Google to send the email invitation immediately.
    });

    return NextResponse.json({ success: true, eventLink: response.data.htmlLink });

  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to book meeting' }, { status: 500 });
  }
}
