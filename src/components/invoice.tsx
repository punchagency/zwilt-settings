import React, { useEffect, useState } from 'react';
import pdf from "@/assests/icons/pdf.png";
import download from "@/assests/images/Plus.svg";
import Image from "next/image";

interface Invoice {
  id: string;
  date: string;
  status: string;
  amount: string;
  card: string;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
}

interface InvoicesProps {
  rawInvoices?: any[];
  loading?: boolean;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const mapRawInvoice = (inv: any): Invoice => ({
  id: inv._id,
  date: formatDate(inv.billingDate),
  status: inv.status,
  // amount is stored in dollars by the webhook
  amount: `USD $${Number(inv.amount ?? 0).toFixed(2)}`,
  card: inv.stripeInvoiceId ? `INV-${inv.stripeInvoiceId.slice(-4)}` : "N/A",
  hostedInvoiceUrl: inv.hostedInvoiceUrl ?? null,
  invoicePdf: inv.invoicePdf ?? null,
});

const statusStyle = (status: string) => {
  const s = status?.toLowerCase();
  if (s === 'paid') return 'text-[#17B26A] border-[#abefc6] bg-[#dcfae6] font-normal px-[0.7vw]';
  if (s === 'failed' || s === 'overdue') return 'text-[#F04438] border-[#fda29b] bg-[#fef3f2] font-normal px-[0.7vw]';
  return 'bg-gray-100 text-[#98A2B3] border-gray-300 font-normal px-[0.7vw]';
};

const Invoices: React.FC<InvoicesProps> = ({ rawInvoices, loading }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (rawInvoices) {
      setInvoices(rawInvoices.map(mapRawInvoice));
    }
  }, [rawInvoices]);

  const handleDownloadAll = () => {
    const csvRows: string[] = [];
    csvRows.push(['Invoice', 'Billing Date', 'Status', 'Amount', 'Card'].join(','));
    for (const invoice of invoices) {
      csvRows.push([invoice.id, invoice.date, invoice.status, invoice.amount, invoice.card].join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'invoices_summary.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSingle = (invoice: Invoice) => {
    if (invoice.invoicePdf) {
      window.open(invoice.invoicePdf, '_blank', 'noopener,noreferrer');
      return;
    }
    // Fallback: CSV for this invoice
    const rows = [
      ['Invoice ID', 'Billing Date', 'Status', 'Amount', 'Card'].join(','),
      [invoice.id, invoice.date, invoice.status, invoice.amount, invoice.card].join(','),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `invoice_${invoice.id}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="invoices-main-container">
      <div className="invoices-header flex items-center justify-between">
        <h2
          className="h-[1.19vw] text-[#282833] mt-[2vw] ml-[1.7vw]"
          style={{ fontWeight: 600, fontSize: '0.9375vw', lineHeight: '1.21vw' }}
        >
          Billing &amp; Invoices
        </h2>

        <button
          className="download-all-button w-[7.9vw] h-[2.6vw] rounded-[0.78vw] border border-[#E0E0E9] text-[#282833B2] -mb-[3.25vw] mr-[1.5vw] text-[0.83vw] bg-white hover:bg-[#f4f4fa] hover:border-[#A6A6A6] hover:text-[#282833]"
          style={{ fontWeight: '500' }}
          onClick={handleDownloadAll}
        >
          Download All
        </button>
      </div>

      <p
        className="w-[18.29vw] h-[1.09vw] mb-[1.5vw] mt-[0.25vw] text-left text-[#98A2B3] ml-[1.7vw]"
        style={{ fontWeight: 400, lineHeight: '1.08vw', fontSize: '0.83vw' }}
      >
        Your organization&apos;s billing history.
      </p>

      <div className="table-container border rounded-[1.04vw] ml-[1.5vw] mr-[1.5vw] mb-[1.5vw] border-[#E0E0E9] overflow-hidden">
        <table className="invoices-table w-[72.14vw] h-[1vw]" style={{ fontFamily: 'Switzer' }}>
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 bg-white">
              <th className="px-[1vw] py-[0.83vw] text-left text-[0.9375vw]">Invoice</th>
              <th className="text-center text-[0.9375vw]">Billing Date</th>
              <th className="text-center text-[0.9375vw]">Status</th>
              <th className="text-center text-[0.9375vw]">Amount</th>
              <th className="px-[1.25vw] text-center text-[0.9375vw]">Ref</th>
              <th className="text-center text-[0.9375vw]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-[2vw] text-center text-[0.83vw] text-[#98A2B3]">
                  Loading invoices…
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-[2vw] text-center text-[0.83vw] text-[#98A2B3]">
                  No invoices yet.
                </td>
              </tr>
            ) : (
              invoices.map((invoice, index) => (
                <tr
                  key={invoice.id}
                  className={index === invoices.length - 1 ? "" : "border-b border-gray-200"}
                >
                  {/* Invoice label */}
                  <td className="px-[0.625vw] py-[0.83vw] text-left">
                    <div className="flex items-center">
                      <Image src={pdf} alt="pdf icon" className="w-[1.25vw] h-[1.56vw]" />
                      <span className="font-medium text-[0.83vw] ml-[0.5vw]">
                        {`Zwilt Invoice #${invoice.id.slice(-6)}`}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="text-center font-medium text-[0.83vw]">{invoice.date}</td>

                  {/* Status */}
                  <td className="text-center">
                    <div className="flex justify-center items-center">
                      <span
                        className={`status px-[0.41vw] py-[0.20vw] text-[0.83vw] border rounded-[2.60vw] font-medium ${statusStyle(invoice.status)}`}
                      >
                        {invoice.status ?? '—'}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="font-medium text-[0.83vw] text-center">{invoice.amount}</td>

                  {/* Ref */}
                  <td className="font-medium text-[0.83vw] text-center">{invoice.card}</td>

                  {/* Actions */}
                  <td>
                    <div className="flex items-center justify-center gap-[0.8vw]">
                      {/* View invoice in browser */}
                      {invoice.hostedInvoiceUrl && (
                        <a
                          href={invoice.hostedInvoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.75vw] text-[#50589F] hover:underline font-medium whitespace-nowrap"
                        >
                          View
                        </a>
                      )}
                      {/* Download PDF or CSV fallback */}
                      <button
                        onClick={() => handleDownloadSingle(invoice)}
                        className="text-[0.75vw] text-[#6F6F76] hover:text-[#282833] font-medium whitespace-nowrap"
                        title={invoice.invoicePdf ? 'Download PDF' : 'Download CSV'}
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
