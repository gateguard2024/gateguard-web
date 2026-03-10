import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { addMinutes, format, isBefore, isAfter, parseISO, setHours, setMinutes } from 'date-fns';

// 1. Authenticate with Google using Service Account credentials from your .env.local
const CREDENTIALS = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  // This replace fixes an issue where Vercel/Next.js misreads the newline characters in the private key
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
};

const calendar = google.calendar('v3');
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  undefined,
  CREDENTIALS.private_key,
  ['https://www.googleapis.com/auth/calendar.readonly'] // Read-only access for safety
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, meetingType, timezone = 'America/New_York' } = body;

    // Map meeting type to duration in minutes
    const durations: Record<string, number> = {
      intro: 15,
      technical: 45,
      onsite: 60,
    };
    const durationMinutes = durations[meetingType] || 30;

    // Define the full 24-hour window for the day requested
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // 2. Query Google Calendar to see when your team is BUSY
    const targetCalendarId = process.env.SALES_REP_EMAIL; // e.g., sales@gateguard.co
    
    const freeBusyResponse = await calendar.freebusy.query({
      auth: auth,
      requestBody: {
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        timeZone: timezone,
        items: [{ id: targetCalendarId }],
      },
    });

    const busySlots = freeBusyResponse.data.calendars?.[targetCalendarId as string]?.busy || [];

    // 3. The Rules Engine: Set your business hours (e.g., 9:00 AM to 5:00 PM)
    const workDayStart = setMinutes(setHours(new Date(date), 9), 0);
    const workDayEnd = setMinutes(setHours(new Date(date), 17), 0);

    // 4. Calculate Available Slots
    const availableSlots: string[] = [];
    let currentSlot = workDayStart;

    // Walk through the day in 30-minute increments
    while (isBefore(addMinutes(currentSlot, durationMinutes), workDayEnd)) {
      const slotEnd = addMinutes(currentSlot, durationMinutes);

      // Check if this specific slot overlaps with any busy blocks from Google
      const isOverlapping = busySlots.some((busy) => {
        if (!busy.start || !busy.end) return false;
        const busyStart = parseISO(busy.start);
        const busyEnd = parseISO(busy.end);
        
        // True if the proposed meeting overlaps a busy block
        return isBefore(currentSlot, busyEnd) && isAfter(slotEnd, busyStart);
      });

      // If no overlap, add it to our available times!
      if (!isOverlapping) {
        availableSlots.push(format(currentSlot, 'hh:mm a'));
      }

      currentSlot = addMinutes(currentSlot, 30); 
    }

    return NextResponse.json({ success: true, availableSlots });

  } catch (error) {
    console.error('Calendar API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' }, 
      { status: 500 }
    );
  }
}
