import { NextResponse } from 'next/server';

// Same-origin endpoint for the homepage forms. Forwards to the Nexus portal's
// public intake (/api/public/website-lead), which writes the lead into Nexus →
// Leads with source 'website'. Nexus owns the lead data; this only forwards.
export const dynamic = 'force-dynamic';

const PORTAL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.gateguard.co';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.WEBSITE_LEAD_KEY) headers['x-website-lead-key'] = process.env.WEBSITE_LEAD_KEY;

    const res = await fetch(`${PORTAL}/api/public/website-lead`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => null);
    // Only a real confirmation from Nexus counts as saved (a redirect to a sign-in
    // page or an HTML error must never look like success to the visitor).
    if (!res.ok || !data || data.ok !== true) {
      return NextResponse.json(
        { ok: false, error: (data && data.error) || 'We couldn’t send that just now.' },
        { status: res.ok ? 502 : res.status },
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not reach Nexus.' }, { status: 502 });
  }
}
