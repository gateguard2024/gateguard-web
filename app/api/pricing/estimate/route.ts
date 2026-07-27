import { NextRequest, NextResponse } from 'next/server'
import { estimateCustomerPrice, type SmartPackage, type Cellular } from '@/lib/pricing-public'

// Public pricing estimator. Two rules govern this file:
//   1. The response is an explicit allow-list — customerMonthly, perUnit, empty.
//      Never spread the compute result; the internal fields must not leak.
//   2. Inputs are clamped. An un-clamped calculator is a probe: a sweep of unit
//      counts lets someone back-solve the cost sheet. Rate limiting is a speed
//      bump on top of that, not the protection itself.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_UNITS = 2000, MAX_ENTRY = 40, MAX_CAM = 200
const WINDOW_MS = 60_000, MAX_PER_WINDOW = 30

// In-memory and therefore per-instance. Good enough to stop a casual script.
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const r = hits.get(ip)
  if (!r || now > r.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k)
    }
    return false
  }
  r.count++
  return r.count > MAX_PER_WINDOW
}

const clamp = (v: unknown, max: number) => {
  const n = Number(v)
  return !Number.isFinite(n) || n < 0 ? 0 : Math.min(Math.round(n), max)
}

const SMART: SmartPackage[] = ['none', 'lock', 'full']
const CELL: Cellular[] = ['none', 'relay', 'full']

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const r = estimateCustomerPrice({
    livingUnits: clamp(b.livingUnits, MAX_UNITS),
    entryPoints: clamp(b.entryPoints, MAX_ENTRY),
    camerasMonitored: clamp(b.camerasMonitored, MAX_CAM),
    camerasNonMonitored: clamp(b.camerasNonMonitored, MAX_CAM),
    smartPackage: SMART.includes(b.smartPackage as SmartPackage)
      ? (b.smartPackage as SmartPackage)
      : 'none',
    cellular: CELL.includes(b.cellular as Cellular) ? (b.cellular as Cellular) : 'none',
    dealerMaintainsEntry: b.dealerMaintainsEntry === true,
  })

  // Allow-list ONLY. Never spread the result.
  return NextResponse.json(
    { customerMonthly: r.customerMonthly, perUnit: r.perUnit, empty: r.empty },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
