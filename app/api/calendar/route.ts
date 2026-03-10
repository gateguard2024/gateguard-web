import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { addMinutes, subMinutes, format, setHours, setMinutes, parseISO } from 'date-fns';

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

    const mt = typeof meetingType === 'string' ? meetingType : meetingType?.id;
    const cleanDate = date.split('T')[0];
    const [year, month, day] = cleanDate.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day);
    const dayOfWeek = baseDate.getDay();

    let validDays = [1, 2, 3, 4, 5];
    let durationMinutes = 30;
    let bufferBefore = 0;
    let bufferAfter = 0;
    let startHour = 9;
    let endHour = 17;
    let fixedSlots: number[] = [];

    if (mt === 'intro') {
      durationMinutes = 30;
      bufferBefore = 15;
    } else if (mt === 'lunch') {
      durationMinutes = 60;
      bufferBefore = 15;
      bufferAfter = 15;
      validDays = [2, 4];
      startHour = 11;
      endHour = 13;
    } else if (mt === 'onsite') {
      durationMinutes = 120;
      validDays = [1, 3, 5];
      fixedSlots = [10, 14];
    }

    if (!validDays.includes(dayOfWeek)) {
      return NextResponse.json({ success: true, availableSlots: [] });
    }

    // 🔥 FOOLPROOF TIMEZONE FIX 🔥
    // Get the exact current time in your specific timezone formatted as YYYY-MM-DD HH:mm
    const formatter = new Intl.DateTimeFormat('en-CA', { 
      timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', hour12: false 
    });
    const currentLocalTimeStr = formatter.format(new Date()).replace(', ', ' ');

    const startOfDay = new Date(baseDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(baseDate.setHours(23, 59, 59, 999));
    const targetCalendarId = process.env.SALES_REP_EMAIL;

    const freeBusyResponse = await calendar.freebusy.query({
      auth,
      requestBody: {
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        timeZone: timezone,
        items: [{ id: targetCalendarId }],
      },
    });
    const busySlots = freeBusyResponse.data.calendars?.[targetCalendarId as string]?.busy || [];

    const availableSlots: string[] = [];
    const slotsToCheck: Date[] = [];

    if (fixedSlots.length > 0) {
      fixedSlots.forEach(hour => slotsToCheck.push(setMinutes(setHours(baseDate, hour), 0)));
    } else {
      let current = setMinutes(setHours(baseDate, startHour), 0);
      const endLimit = setMinutes(setHours(baseDate, endHour), 0);
      while (addMinutes(current, durationMinutes).getTime() <= endLimit.getTime()) {
        slotsToCheck.push(current);
        current = addMinutes(current, 30);
      }
    }

    for (const slot of slotsToCheck) {
      // Create a string like "2026-03-10 09:00" to compare against current time
      const slotTimeStr = `${cleanDate} ${format(slot, 'HH:mm')}`;
      
      // If the slot is earlier than right now in your local time, skip it!
      if (slotTimeStr < currentLocalTimeStr) continue;

      const meetingStart = slot;
      const meetingEnd = addMinutes(slot, durationMinutes);
      const checkStart = subMinutes(meetingStart, bufferBefore);
      const checkEnd = addMinutes(meetingEnd, bufferAfter);

      const isOverlapping = busySlots.some((busy) => {
        if (!busy.start || !busy.end) return false;
        return checkStart.getTime() < parseISO(busy.end).getTime() && checkEnd.getTime() > parseISO(busy.start).getTime();
      });

      if (!isOverlapping) {
        availableSlots.push(format(slot, 'hh:mm a'));
      }
    }

    return NextResponse.json({ success: true, availableSlots });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch slots' }, { status: 500 });
  }
}
