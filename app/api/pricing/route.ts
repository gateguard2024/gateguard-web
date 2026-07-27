// Superseded by /api/pricing/estimate, which owns the implementation.
//
// This path briefly proxied the portal's pricing engine. The marketing site no
// longer depends on the portal for pricing — the math lives here in
// lib/pricing-public.ts and runs server-side. Re-exporting the handler so the
// older path keeps working with identical clamping, rate limiting, and response
// allow-listing rather than sitting here as a stale second implementation.
//
// Route segment config can't be re-exported (Next parses it statically), so
// runtime/dynamic are declared here to match the estimate route.
//
// Safe to delete once nothing calls /api/pricing directly.
export { POST } from '../pricing/estimate/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
