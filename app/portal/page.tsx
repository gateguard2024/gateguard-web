import { redirect } from 'next/navigation';

// The customer portal lives in ONE place: portal.gateguard.co. Same rule as the
// dealer portal. gateguard.co is the marketing front door and nothing more.
//
// This route previously hosted a second, parallel customer portal wired
// directly to Supabase and MaintainX from the browser. It was unreachable (no
// nav link anywhere, and the auth middleware in this repo was never loaded —
// proxy.ts / proxfile.ts are inert because Next only reads middleware.ts) and
// it had started drifting from the portal's version. Forwarding instead.
//
// The old implementation is in git history at d7f7353 if anything needs porting
// into the portal — BillingTab.tsx and the RMS intake form are the parts worth
// keeping.
export default function Portal() {
  redirect('https://portal.gateguard.co');
}
