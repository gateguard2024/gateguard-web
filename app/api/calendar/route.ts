import { NextResponse } from 'next/server';
import { google } from 'googleapis';

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

// Helper function to safely force Vercel to read times in YOUR timezone
const formatLocal = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map(p => [p.type, p.value]));
  const h = p.hour === '24' ? '00' : p.hour;
  return `${p.year}-${p.month}-${p.day} ${h}:${p.minute}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, meetingType, timezone = 'America/New_York' } = body;

    const mt = typeof meetingType === 'string' ? meetingType : meetingType?.id;
    const cleanDate = date.split('T')[0]; // e.g. "2026-03-10"
    
    // Get Day of Week safely
    const [year, month, day] = cleanDate.split('-').map(Number);
    const baseDate = new Date(Date.UTC(year, month - 1, day)); 
    const dayOfWeek = baseDate.getUTCDay();

    // 1. The Rules
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

    // 2. Fetch Free/Busy from Google (checking a wide 3-day window to catch timezone bleeds)
    const queryStart = new Date(Date.UTC(year, month - 1, day - 1));
    const queryEnd = new Date(Date.UTC(year, month - 1, day + 2));
    const targetCalendarId = process.env.SALES_REP_EMAIL;

    const freeBusyResponse = await calendar.freebusy.query({
      auth,
      requestBody: {
        timeMin: queryStart.toISOString(),
        timeMax: queryEnd.toISOString(),
        timeZone: timezone,
        items: [{ id: targetCalendarId }],
      },
    });
    
    const busySlots = freeBusyResponse.data.calendars?.[targetCalendarId as string]?.busy || [];

    // 3. Convert Google's Busy blocks into pure math (Minutes from Midnight on the selected day)
    const busyBlocks = busySlots.map(busy => {
      const startLocalStr = formatLocal(new Date(busy.start!), timezone);
      const endLocalStr = formatLocal(new Date(busy.end!), timezone);

      const getMinutesOnTargetDay = (localStr: string) => {
         const [dPart, tPart] = localStr.split(' ');
         if (dPart < cleanDate) return 0; // Event started before today
         if (dPart > cleanDate) return 24 * 60; // Event ends after today
         const [h, m] = tPart.split(':').map(Number);
         return h * 60 + m;
      };

      return {
         startMins: getMinutesOnTargetDay(startLocalStr),
         endMins: getMinutesOnTargetDay(endLocalStr)
      };
    }).filter(b => b.startMins < b.endMins);

    // 4. Generate potential slots in pure math
    const slotsToCheck: number[] = [];
    if (fixedSlots.length > 0) {
      fixedSlots.forEach(hour => slotsToCheck.push(hour * 60));
    } else {
      let currentMins = startHour * 60;
      const endMins = endHour * 60;
      while (currentMins + durationMinutes <= endMins) {
        slotsToCheck.push(currentMins);
        currentMins += 30; // 30 min increments
      }
    }

    // 5. Block times that have already passed today
    const nowLocalStr = formatLocal(new Date(), timezone);
    const [nowDateStr, nowTimeStr] = nowLocalStr.split(' ');
    let currentLocalMins = 0;
    
    if (nowDateStr === cleanDate) {
       const [nh, nm] = nowTimeStr.split(':').map(Number);
       currentLocalMins = nh * 60 + nm;
    } else if (nowDateStr > cleanDate) {
       currentLocalMins = 24 * 60; // Entire day is in the past
    }

    // 6. Compare proposed slots against Google's blocks
    const availableSlots: string[] = [];

    for (const slotStartMins of slotsToCheck) {
       // Skip if it's in the past
       if (slotStartMins < currentLocalMins) continue;

       const meetingStart = slotStartMins;
       const meetingEnd = slotStartMins + durationMinutes;
       const checkStart = meetingStart - bufferBefore;
       const checkEnd = meetingEnd + bufferAfter;

       // Overlap check
       const isOverlapping = busyBlocks.some(busy => {
          return checkStart < busy.endMins && checkEnd > busy.startMins;
       });

       if (!isOverlapping) {
          // Math -> "09:00 AM" String conversion
          const h = Math.floor(slotStartMins / 60);
          const m = slotStartMins % 60;
          const ampm = h >= 12 ? 'PM' : 'AM';
          const h12 = h % 12 === 0 ? 12 : h % 12;
          const timeStr = `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
          availableSlots.push(timeStr);
       }
    }

    return NextResponse.json({ success: true, availableSlots });
  } catch (error) {
    console.error('Calendar Rules Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch slots' }, { status: 500 });
  }
}
