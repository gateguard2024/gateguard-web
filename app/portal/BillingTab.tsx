import React, { useState, useEffect } from 'react';

export default function BillingTab({ qboCustomerId }: { qboCustomerId: string | null | undefined }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Automatically calculate the total amount owed
  const totalDue = invoices.reduce((sum, inv) => sum + (inv.Balance || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        {/* Updated spinner to match your teal brand color */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* --- TOP SUMMARY WIDGETS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Total Outstanding Card */}
        <div className="bg-[#0b131e] border border-gray-800/60 p-6 rounded-xl shadow-lg flex flex-col justify-center">
          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-1">Total Outstanding</p>
          <h3 className="text-4xl font-black text-white">${totalDue.toFixed(2)}</h3>
        </div>

        {/* Read-Only Notice Card */}
        <div className="lg:col-span-2 bg-[#0b131e] border border-gray-800/60 p-6 rounded-xl shadow-lg flex items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
              <h4 className="text-teal-400 text-xs font-bold tracking-widest uppercase">Live QuickBooks Sync</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              This is a read-only financial overview synced directly with our accounting department. 
              To process a payment or dispute a specific charge, please contact your account manager directly.
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN TABLE CARD --- */}
      <div className="bg-[#0b131e] shadow-xl rounded-xl border border-gray-800/60 overflow-hidden">
        <div className="p-6 border-b border-gray-800/60 bg-[#0d1826]">
          <h2 className="text-lg font-bold text-gray-100 tracking-wide">Invoice History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#080f18] text-gray-500 text-[10px] uppercase tracking-widest">
                <th className="p-5 font-bold">Invoice #</th>
                <th className="p-5 font-bold">Date</th>
                <th className="p-5 font-bold">Total</th>
                <th className="p-5 font-bold">Balance Due</th>
                <th className="p-5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-600 font-medium">
                    No invoices found on this account.
                  </td>
                </tr>
              ) : (
                invoices.map((inv, index) => (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-5 font-medium text-gray-300">
                      {inv.DocNumber || 'N/A'}
                    </td>
                    <td className="p-5 text-gray-500">
                      {inv.TxnDate ? new Date(inv.TxnDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-5 text-gray-400">
                      ${inv.TotalAmt?.toFixed(2)}
                    </td>
                    <td className="p-5 font-bold text-gray-200">
                      ${inv.Balance?.toFixed(2)}
                    </td>
                    <td className="p-5">
                      {inv.Balance > 0 ? (
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-md text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                          Unpaid
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-md text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(20,184,166,0.05)]">
                          Paid
                        </span>
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
