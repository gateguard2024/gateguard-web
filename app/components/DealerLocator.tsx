"use client";

import { useState } from "react";

type Dealer = { id: string; name: string; city: string | null; state: string | null; zip: string | null; phone: string | null; email: string | null; corporate?: boolean };

// Gate Guard corporate is always listed (last), for every state, even if the
// directory can't be reached — so a visitor never sees an empty result.
const CORPORATE: Dealer = {
  id: "gateguard-corporate", name: "Gate Guard, LLC", city: "Atlanta", state: "GA", zip: null,
  phone: "844-469-4283", email: "info@gateguard.co", corporate: true,
};
const MAIN_TEL = "+18444694283";

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function DealerLocator() {
  const [state, setState] = useState("");
  const [dealers, setDealers] = useState<Dealer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState("");

  async function search() {
    setLoading(true);
    try {
      const r = await fetch(`/api/dealers${state ? `?state=${state}` : ""}`, { cache: "no-store" });
      const d = await r.json();
      const list: Dealer[] = Array.isArray(d.dealers) ? d.dealers : [];
      setDealers(list.some(x => x.corporate) ? list : [...list, CORPORATE]);
    } catch { setDealers([CORPORATE]); }
    finally { setSearched(state); setLoading(false); }
  }

  return (
    <div className="mt-10 max-w-2xl mx-auto text-left">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-center">
        <select
          value={state}
          onChange={e => setState(e.target.value)}
          className="bg-white/5 border border-white/15 text-white rounded-full px-5 py-3 text-sm outline-none focus:border-cyan-400"
        >
          <option value="" className="bg-zinc-900">Find a dealer — any state</option>
          {STATES.map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
        </select>
        <button
          onClick={search}
          className="px-8 py-3 bg-white/10 border border-white/15 text-white font-bold rounded-full hover:bg-white/20 transition-all text-sm tracking-wide whitespace-nowrap"
        >
          {loading ? "Searching…" : "Find a Dealer"}
        </button>
      </div>

      {dealers !== null && (
        <div className="mt-6 space-y-3">
          {dealers.map(d => (
            <div key={d.id} className={`rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3 border ${d.corporate ? "bg-cyan-500/5 border-cyan-500/30" : "bg-white/5 border-white/10"}`}>
              <div>
                <p className="text-white font-semibold flex items-center gap-2 flex-wrap">
                  {d.name}
                  {d.corporate && <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black bg-cyan-400 rounded-full px-2 py-0.5">Gate Guard Direct</span>}
                </p>
                <p className="text-zinc-400 text-xs">
                  {d.corporate
                    ? `Serving ${searched || "all states"} · HQ Atlanta, GA`
                    : [d.city, d.state].filter(Boolean).join(", ") || "—"}
                </p>
              </div>
              <div className="flex gap-4 text-xs">
                {d.corporate
                  ? <a href={`tel:${MAIN_TEL}`} className="text-cyan-400 hover:text-cyan-300">844-4MY-GATE</a>
                  : d.phone && <a href={`tel:${d.phone}`} className="text-cyan-400 hover:text-cyan-300">{d.phone}</a>}
                {d.email && <a href={`mailto:${d.email}`} className="text-cyan-400 hover:text-cyan-300">Email</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
