import React, { useState, useEffect } from 'react';

export default function BillingTab({ qboCustomerId }: { qboCustomerId: string | null | undefined }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    // 1. WHAT DID SUPABASE GIVE US?
    console.log("1. Supabase gave us QBO ID:", qboCustomerId);

    if (!qboCustomerId) {
      setError("No QuickBooks ID linked to this account.");
      setLoading(false);
      return;
    }

    const fetchInvoices = async () => {
      try {
        const makeUrl = `https://hook.us1.make.com/YOUR_LONG_STRING_HERE?qbo_customer_id=${qboCustomerId}`;
        
        // 2. WHAT EXACTLY ARE WE PINGING?
        console.log("2. Attempting to ping Make.com at:", makeUrl);

        const response = await fetch(makeUrl);
        
        if (!response.ok) {
          // 3. IF MAKE.COM REJECTS IT, WHY?
          console.log("3. Make.com rejected the request. Status:", response.status);
          throw new Error("Failed to load billing data.");
        }
        
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        // 4. IF IT CRASHES COMPLETELY (LIKE A BROWSER BLOCK)
        console.error("4. CRITICAL FETCH ERROR:", err);
        setError(`Could not load invoices: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [qboCustomerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Billing & Invoices</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm">
              <th className="p-4 font-medium">Invoice #</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Balance Due</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((inv, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">
                    {inv.DocNumber || 'N/A'}
                  </td>
                  <td className="p-4 text-gray-600">
                    {inv.TxnDate ? new Date(inv.TxnDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4 text-gray-600">
                    ${inv.TotalAmt?.toFixed(2)}
                  </td>
                  <td className="p-4 font-semibold text-gray-800">
                    ${inv.Balance?.toFixed(2)}
                  </td>
                  <td className="p-4">
                    {inv.Balance > 0 ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        Unpaid
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
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
  );
}
