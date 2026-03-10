import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { addMinutes, subMinutes, format, isBefore, setHours, setMinutes, parseISO } from 'date-fns';

const CREDENTIALS = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const calendar = google.calendar('v3');
const auth = new google.auth.JWT(
  CREDENTIALS.client_email, undefined, CREDENTIALS.private_key,
  ['https://www.googleapis.com/auth/calendar.readonly'],
  process.env.SALES_REP_EMAIL
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, meetingType, timezone = 'America/New_York' } = body;

    // 1. Safely parse the requested date
    const cleanDate = date.split('T')[0];
    const [year, month, day] = cleanDate.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day);
    const dayOfWeek = baseDate.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, etc.

    // 2. The Rules Engine
    let validDays = [1, 2, 3, 4, 5]; // Default M-F
    let durationMinutes = 30;
    let bufferBefore = 0;
    let bufferAfter = 0;
    let startHour = 9;  // 9 AM
    let endHour = 17;   // 5 PM
    let fixedSlots: number[] = []; // Empty means every 30 mins

    if (meetingType === 'intro') {
      durationMinutes = 30;
      bufferBefore = 15;
    } else if (meetingType === 'lunch') {
      durationMinutes = 60;
      bufferBefore = 15;
      bufferAfter = 15;
      validDays = [2, 4]; // Tuesdays and Thursdays only
      startHour = 11;
      endHour = 13; // 11 AM to 1 PM window
    } else if (meetingType === 'onsite') {
      durationMinutes = 120; // 2 hours
      validDays = [1, 3, 5]; // Mon, Wed, Fri only
      fixedSlots = [10, 14]; // Exactly 10 AM and 2 PM
    }

    // Fast-fail: If they click a day that isn't allowed, return no slots
    if (!validDays.includes(dayOfWeek)) {
      return NextResponse.json({ success: true, availableSlots: [] });
    }

    // 3. Query Google for busy times
    const startOfDay = new Date(baseDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(baseDate.setHours(23, 59, 59, 999));
    const targetCalendarId = process.env.SALES_REP_EMAIL;

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

    // 4. Generate possible time slots
    const availableSlots: string[] = [];
    const slotsToCheck: Date[] = [];

    if (fixedSlots.length > 0) {
      fixedSlots.forEach(hour => slotsToCheck.push(setMinutes(setHours(baseDate, hour), 0)));
    } else {
      let current = setMinutes(setHours(baseDate, startHour), 0);
      const endLimit = setMinutes(setHours(baseDate, endHour), 0);
      // Generate 30-min increments until the end of the window
      while (addMinutes(current, durationMinutes).getTime() <= endLimit.getTime()) {
        slotsToCheck.push(current);
        current = addMinutes(current, 30);
      }
    }

    // 5. Check against Google (including our custom buffers!)
    for (const slot of slotsToCheck) {
      const meetingStart = slot;
      const meetingEnd = addMinutes(slot, durationMinutes);
      const checkStart = subMinutes(meetingStart, bufferBefore);
      const checkEnd = addMinutes(meetingEnd, bufferAfter);

      const isOverlapping = busySlots.some((busy) => {
        if (!busy.start || !busy.end) return false;
        const busyStart = parseISO(busy.start);
        const busyEnd = parseISO(busy.end);
        // Overlaps if our buffered meeting starts before they are free, and ends after they get busy
        return checkStart.getTime() < busyEnd.getTime() && checkEnd.getTime() > busyStart.getTime();
      });

      if (!isOverlapping) {
        availableSlots.push(format(slot, 'hh:mm a'));
      }
    }

    return NextResponse.json({ success: true, availableSlots });
  } catch (error) {
    console.error('Calendar Rules Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch slots' }, { status: 500 });
  }
}
