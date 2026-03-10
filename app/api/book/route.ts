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

    // Format the time flexibly (h:mm a handles both "9:00 AM" and "09:00 AM")
    const cleanDate = selectedDate.split('T')[0];
    const localStartObj = parse(`${cleanDate} ${selectedTime}`, 'yyyy-MM-dd h:mm a', new Date());
    
    // Safely extract meeting type details
    const mt = typeof meetingType === 'string' ? meetingType : meetingType?.id;
    const meetingTitle = typeof meetingType === 'string' ? 'Meeting' : meetingType?.title;
    
    const durationMap: Record<string, number> = { intro: 30, lunch: 60, onsite: 120 };
    const duration = durationMap[mt] || 30;
    const localEndObj = addMinutes(localStartObj, duration);

    const googleStartTime = format(localStartObj, "yyyy-MM-dd'T'HH:mm:ss");
    const googleEndTime = format(localEndObj, "yyyy-MM-dd'T'HH:mm:ss");

    const event = {
      summary: `GateGuard ${meetingTitle}: ${formData.name} (${formData.company})`,
      description: `New meeting booked via GateGuard website.\n\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPhone: ${formData.phone || 'N/A'}`,
      start: { dateTime: googleStartTime, timeZone: timezone },
      end: { dateTime: googleEndTime, timeZone: timezone },
      attendees: [{ email: formData.email }],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary', // THIS IS THE KEY FIX FOR DOMAIN-WIDE DELEGATION
      requestBody: event,
      sendUpdates: 'all',
    });

    return NextResponse.json({ success: true, eventLink: response.data.htmlLink });

  } catch (error: any) {
    // If it fails, log the EXACT reason Google rejected it
    console.error('Booking Error Details:', error.message);
    return NextResponse.json({ success: false, error: error.message || 'Failed to book meeting' }, { status: 500 });
  }
}
