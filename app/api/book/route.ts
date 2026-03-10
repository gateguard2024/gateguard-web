import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { parse, format, addMinutes } from 'date-fns';

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

    // 1. Timezone Fix: Parse the exact local time the user clicked
    const cleanDate = selectedDate.split('T')[0];
    const localStartObj = parse(`${cleanDate} ${selectedTime}`, 'yyyy-MM-dd hh:mm a', new Date());
    
    // 2. Set the duration
    const durationMap: Record<string, number> = { intro: 30, lunch: 60, onsite: 120 };
    const duration = durationMap[meetingType.id] || 30;
    const localEndObj = addMinutes(localStartObj, duration);

    // 3. Format it cleanly without UTC markers so Google handles the timezone perfectly
    const googleStartTime = format(localStartObj, "yyyy-MM-dd'T'HH:mm:ss");
    const googleEndTime = format(localEndObj, "yyyy-MM-dd'T'HH:mm:ss");

    const event = {
      summary: `GateGuard ${meetingType.title}: ${formData.name} (${formData.company})`,
      description: `New meeting booked via GateGuard website.\n\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPhone: ${formData.phone || 'N/A'}`,
      start: { dateTime: googleStartTime, timeZone: timezone },
      end: { dateTime: googleEndTime, timeZone: timezone },
      attendees: [{ email: formData.email }],
    };

    const response = await calendar.events.insert({
      calendarId: process.env.SALES_REP_EMAIL,
      requestBody: event,
      sendUpdates: 'all',
    });

    return NextResponse.json({ success: true, eventLink: response.data.htmlLink });

  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to book meeting' }, { status: 500 });
  }
}
