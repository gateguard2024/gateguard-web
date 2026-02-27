import React, { useState, useEffect } from 'react';

export default function BillingTab({ qboCustomerId }: { qboCustomerId: string | null | undefined }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!qboCustomerId) {
      setError("No QuickBooks ID linked to this account.");
      setLoading(false);
      return;
    }

    const fetchInvoices = async () => {
      try {
        const makeUrl = `https://hook.us2.make.com/wn74ht8m6qg1uspf3cquhe894qebclmn?qbo_customer_id=${qboCustomerId}`;
        const response = await fetch(makeUrl);
        
        if (!response.ok) {
          throw new Error("Failed to load billing data.");
        }
        
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(`Could not load invoices: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [qboCustomerId]);

  const totalDue = invoices.reduce((sum, inv) => sum + (inv.Balance || 0), 0);

  const handlePaymentClick = (invoiceId: string, paymentLink: string) => {
    setProcessingId(invoiceId);
    // Simulate a secure redirect sequence for premium feel
    setTimeout(() => {
      if (paymentLink) {
        window.open(paymentLink, '_blank');
      } else {
        alert("Payment link not yet configured in accounting system.");
      }
      setProcessingId(null);
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="text-cyan-500/50 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Financials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
        <span className="text-3xl">⚠️</span>
        <div>
          <h4 className="text-red-400 font-black tracking-wide text-sm uppercase">Connection Error</h4>
          <p className="text-red-300/80 text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* --- TOP SUMMARY WIDGETS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Total Outstanding Card */}
        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500 opacity-50"></div>
          <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-2">Total Outstanding</p>
          <h3 className="text-5xl font-black text-white">${totalDue.toFixed(2)}</h3>
          {totalDue > 0 && (
             <button className="mt-6 w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
               Pay Full Balance
             </button>
          )}
        </div>

        {/* Read-Only Notice Card */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl flex items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-30"></div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              <h4 className="text-cyan-400 text-xs font-black tracking-widest uppercase">Live QuickBooks Sync</h4>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
              This dashboard is securely synced with our accounting department in real-time. You can view, download, and pay your invoices directly through this secure terminal.
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN INTERACTIVE TABLE CARD --- */}
      <div className="bg-[#0a0a0a] shadow-2xl rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
          <h2 className="text-lg font-black text-white tracking-wide">Invoice History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#050505] text-zinc-500 text-[10px] uppercase tracking-widest">
                <th className="p-5 font-bold border-b border-white/5">Invoice #</th>
                <th className="p-5 font-bold border-b border-white/5">Date</th>
                <th className="p-5 font-bold border-b border-white/5">Total</th>
                <th className="p-5 font-bold border-b border-white/5">Balance Due</th>
                <th className="p-5 font-bold border-b border-white/5">Status</th>
                <th className="p-5 font-bold border-b border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-600 font-medium">
                    No invoices found on this account.
                  </td>
                </tr>
              ) : (
                invoices.map((inv, index) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5 font-bold text-white">
                      {inv.DocNumber || 'N/A'}
                    </td>
                    <td className="p-5 text-zinc-400 text-sm">
                      {inv.TxnDate ? new Date(inv.TxnDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-5 text-zinc-400 text-sm">
                      ${inv.TotalAmt?.toFixed(2)}
                    </td>
                    <td className="p-5 font-black text-white">
                      ${inv.Balance?.toFixed(2)}
                    </td>
                    <td className="p-5">
                      {inv.Balance > 0 ? (
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded text-[10px] font-black uppercase tracking-widest">
                          Unpaid
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-black uppercase tracking-widest">
                          Paid
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      
                      {/* View PDF Button */}
                      <a 
                        href={inv.pdfLink || "#"} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        title="Download PDF"
                      >
                        <span>📄</span> PDF
                      </a>

                      {/* Pay Now Button (Only shows if balance > 0) */}
                      {inv.Balance > 0 && (
                        <button 
                          onClick={() => handlePaymentClick(inv.DocNumber, inv.paymentLink)}
                          disabled={processingId === inv.DocNumber}
                          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {processingId === inv.DocNumber ? (
                             <span className="animate-spin h-3 w-3 border-b-2 border-white rounded-full"></span>
                          ) : (
                             <span>💳</span>
                          )}
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
