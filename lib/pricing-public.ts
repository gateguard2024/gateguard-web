// lib/pricing-public.ts — SERVER ONLY. Do not import into a client component.
//
// Public estimator for gateguard.co. This computes the FULL bill internally —
// the customer price is the sum of our cost plus every party's cut — but it
// returns only the two customer-facing numbers. The cost sheet, the dealer /
// sales / distributor splits, and Gate Guard net are computed here and thrown
// away. They are a trade secret: anyone holding them can back-solve our margins.
//
// Keep-in-sync note: these constants mirror the portal's lib/pricing-model.ts,
// which is the source of truth. If the portal's cost sheet changes, update this
// file to match. This is a deliberate copy so the marketing site carries zero
// dependency on the portal.

export type SmartPackage = 'none' | 'lock' | 'full'
export type Cellular = 'none' | 'relay' | 'full'

export interface EstimatorInputs {
  livingUnits: number
  entryPoints: number
  camerasMonitored: number
  camerasNonMonitored: number
  smartPackage: SmartPackage
  cellular: Cellular
  dealerMaintainsEntry: boolean
}

// ── Cost sheet (v2) ──────────────────────────────────────────────────────────
const BRIVO_SITE = 90
const ENTRY_T1 = 10, ENTRY_T2 = 8, ENTRY_T3 = 5
const LARGE_THRESHOLD = 350, LARGE_BLOCK = 75, LARGE_FEE = 25
const CAM_BASE = 60, CAM_BASE_CAP = 20, CAM_EACH = 20, CAM_CALL = 25, CAM_SMALL = 50
const CELL_RELAY = 6, CELL_FULL = 60
const SMART_COST = 2.5
// ── Distribution ─────────────────────────────────────────────────────────────
const DEALER_PER_UNIT = 3, SALES_PER_UNIT = 1, DIST_PER_UNIT = 1
const DEALER_MIN_PER_ENTRY = 150
const GG_MIN_NET_PER_UNIT = 2
const SMART_DEALER_ADD = 0.25, SMART_PARTY_ADD = 0.10

const round2 = (n: number) => Math.round(n * 100) / 100
const smartMult = (p: SmartPackage) => (p === 'full' ? 2 : p === 'lock' ? 1 : 0)

/** Returns ONLY the customer-facing numbers. All internal margins stay in here. */
export function estimateCustomerPrice(
  input: EstimatorInputs,
): { customerMonthly: number; perUnit: number; empty: boolean } {
  const u = Math.max(0, Math.round(input.livingUnits || 0))
  const ep = Math.max(0, Math.round(input.entryPoints || 0))
  const mon = Math.max(0, Math.round(input.camerasMonitored || 0))
  const non = Math.max(0, Math.round(input.camerasNonMonitored || 0))
  const mult = smartMult(input.smartPackage)
  const su = mult > 0 ? u : 0

  const costBrivo = ep > 0 || su > 0 ? BRIVO_SITE : 0
  let costEntry = 0
  for (let i = 1; i <= ep; i++) costEntry += i <= 2 ? ENTRY_T1 : i <= 6 ? ENTRY_T2 : ENTRY_T3
  const costLarge =
    u > LARGE_THRESHOLD ? Math.floor((u - LARGE_THRESHOLD) / LARGE_BLOCK) * LARGE_FEE : 0

  const totCam = mon + non
  let costCameras = 0
  if (totCam > 0 && totCam <= 2) costCameras = mon * CAM_SMALL + non * CAM_EACH
  else if (totCam > 0)
    costCameras = Math.ceil(totCam / CAM_BASE_CAP) * CAM_BASE + totCam * CAM_EACH + mon * CAM_CALL

  const costCellular =
    input.cellular === 'relay' ? CELL_RELAY : input.cellular === 'full' ? CELL_FULL : 0
  const costSmart = SMART_COST * mult * su
  const ggCost = round2(costBrivo + costEntry + costLarge + costCameras + costCellular + costSmart)

  const dealerMin = DEALER_PER_UNIT * u
  const dealerFloor = input.dealerMaintainsEntry ? DEALER_MIN_PER_ENTRY * ep : 0
  const dealerBase = Math.max(dealerMin, dealerFloor)
  const scale = dealerMin > 0 ? dealerBase / dealerMin : 1
  const dealerAdd = SMART_DEALER_ADD * mult * su
  const partyAdd = SMART_PARTY_ADD * mult * su

  const dealer = round2(dealerBase + dealerAdd)
  const sales = round2(SALES_PER_UNIT * u * scale + partyAdd)
  const dist = round2(DIST_PER_UNIT * u * scale + partyAdd)
  const ggNet = round2(GG_MIN_NET_PER_UNIT * u * scale + partyAdd) // public = locked 'min2' model

  const customerMonthly = round2(ggCost + dealer + sales + dist + ggNet)
  const perUnit = u > 0 ? round2(customerMonthly / u) : 0
  const empty = u === 0 && ep === 0 && totCam === 0

  return { customerMonthly, perUnit, empty }
}
