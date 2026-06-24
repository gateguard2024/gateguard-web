import { redirect } from 'next/navigation';

// The booking app has moved into the portal (portal.gateguard.co/schedule), where it
// connects to the Nexus calendar + Google Calendar. This page just forwards there.
export default function Schedule() {
  redirect('https://portal.gateguard.co/schedule');
}
