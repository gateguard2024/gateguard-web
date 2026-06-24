import { NextResponse } from 'next/server';

// Same-origin proxy to the portal's public dealer directory, so the marketing site
// can show "find a dealer" without cross-origin CORS issues. The Nexus portal owns
// the dealer data; this just forwards the query.
export const dynamic = 'force-dynamic';

const PORTAL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.gateguard.co';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    const res = await fetch(`${PORTAL}/api/dealers/locator${qs ? `?${qs}` : ''}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ dealers: [], error: 'Could not reach the dealer directory.' });
  }
}
