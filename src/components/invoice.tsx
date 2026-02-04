import React, { useState } from 'react';
import pdf from "@/assests/icons/pdf.png"
import deleteicon from "@/assests/icons/delete.svg"
import download from "@/assests/icons/download.png"
import deletetooltip from "@/assests/icons/deletetool.svg"
import downloadtooltip from "@/assests/icons/downloadtooltip.svg"
import Image from "next/image"

interface Invoice {
  id: number;
  date: string;
  status: string;
  amount: string;
  card: string;
}

const invoicesData: Invoice[] = [
  { id: 1, date: 'June 1, 2024', status: 'Pending', amount: 'USD $94.00', card: '1234' },
  { id: 2, date: 'May 1, 2024', status: 'Paid', amount: 'USD $30.00', card: '5896' },
  { id: 3, date: 'April 1, 2024', status: 'Paid', amount: 'USD $30.00', card: '5896' },
  { id: 4, date: 'March 1, 2024', status: 'Paid', amount: 'USD $30.00', card: '5896' },
  { id: 5, date: 'February 1, 2024', status: 'Paid', amount: 'USD $30.00', card: '5896' },
  { id: 6, date: 'June 1, 2024', status: 'Pending', amount: 'USD $94.00', card: '1234' },
];


const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(invoicesData);
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState<boolean>(false);


const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(invoice => invoice.id));
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(invoiceId => invoiceId !== id) : [...prev, id]
    );
  };
  const handleDelete = (id: number) => {
    setInvoiceToDelete(id);
    setShowConfirm(true);
  };
  

  const confirmDeleteInvoice = () => {
    if (invoiceToDelete !== null) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceToDelete));
      setSelectedInvoices(prev => prev.filter(invoiceId => invoiceId !== invoiceToDelete));
      setInvoiceToDelete(null);
      setShowConfirm(false);
    }
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirm(true); // Show the confirmation modal
  };
  
  const confirmDeleteAll = () => {
    setInvoices([]);
    setSelectedInvoices([]);
    setShowDeleteAllConfirm(false);
  };

  const handleCancelDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setInvoiceToDelete(null);
  };

  const handleCancelDeleteAllConfirm = () => {
    setShowDeleteAllConfirm(false);
  };

  const handleDownload = (invoice: Invoice) => {
    const csvRows = [];
    const headers = ['Invoice ID', 'Billing Date', 'Status', 'Amount', 'Card'];
    csvRows.push(headers.join(',')); // Add headers to the CSV
    const values = [invoice.id, invoice.date, invoice.status, invoice.amount, invoice.card];
    csvRows.push(values.join(','));

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `invoice_${invoice.id}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    const csvRows = [];
    const headers = ['Invoice', 'Billing Date', 'Status', 'Amount', 'Card'];
    csvRows.push(headers.join(',')); 

    for (const invoice of invoices) {
      const values = [invoice.id, invoice.date, invoice.status, invoice.amount, invoice.card];
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'invoices_summary.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="invoices-main-container ">
      <div className="invoices-header flex items-center justify-between  ">
      <h2 className=" h-[1.19vw] text-[#282833] mt-[2vw] ml-[1.7vw]" style={{  fontWeight: 600 , fontSize: '0.9375vw' ,lineHeight: '1.21vw' }}>Billing & Invoices</h2>


      <button
  className="download-all-button w-[7.9vw] h-[2.6vw] rounded-[0.78vw] border border-[#E0E0E9] text-[#282833B2] -mb-[3.25vw] mr-[1.5vw] text-[0.83vw] bg-white hover:bg-[#f4f4fa] hover:border-[#A6A6A6] hover:text-[#282833] "
  style={{ fontWeight: '500' }}
  onClick={handleDownloadAll}
>
  Download All
</button>

      </div>
      <p className=" w-[18.29vw] h-[1.09vw]  mb-[1.5vw]  mt-[0.25vw] text-left text-[#98A2B3] ml-[1.7vw]" style={{  fontWeight: 400 , lineHeight: '1.08vw' , fontSize: '0.83vw'}}>
  Adding related to billing & invoices goes here.
</p>

      <div className="table-container border rounded-[1.04vw] ml-[1.5vw] mr-[1.5vw] mb-[1.5vw]  border-[#E0E0E9] overflow-hidden ">
        <table className="invoices-table w-[72.14vw] h-[1vw]" style={{ fontFamily: 'Switzer' }}>
        <thead>
  <tr className="bg-gray-100 border-b border-gray-200 bg-white">
    <th className="px-[1vw] py-[0.83vw] mt-[0.625vw] relative">
      <input
        type="checkbox"
        checked={selectedInvoices.length === invoices.length && invoices.length > 0}
        onChange={handleSelectAll}
        className="invoice-checkbox"
        style={{
          width: '1.25vw',
          height: '1.25vw',
          borderRadius: '0.4vw',
          borderWidth: '0.05vw',
          borderColor: '#E0E0E9',
          cursor: 'pointer',
          verticalAlign: 'middle',
          position: 'absolute',
          top: '50%',
          left: '1vw', // Adjust as needed
          transform: 'translateY(-50%)',
        }}
      />
 <div className="invoices-container">
      <label className="ml-[1vw] -mr-[0.2vw] text-[0.938vw]">Invoice</label>
      
      {selectedInvoices.length === invoices.length && invoices.length > 0 && (
        <span
          onClick={handleDeleteAll}
          className="bg-[#FECDCA] text-[#F97066]  text-[0.8vw] px-[0.75vw] py-[0.25vw] cursor-pointer absolute top-1/2 transform left-[7.5vw] border-gray-500 px-2  p-[0.25vw] rounded-[0.6vw] px-[0.4vw]  font-medium -translate-y-1/2 border whitespace-nowrap hover:bg-[#FDA29B] hover:text-[#F04438] hover:border-gray-700"
        >
          Delete All
        </span>
      )}

        {/* Confirm Delete All Modal */}
        {showDeleteAllConfirm && (
  <div className="fixed inset-0 flex items-center justify-center z-50 ">
  <div className="bg-black opacity-40 absolute inset-0 "></div>
  <div className="bg-white p-[2vw] rounded-[1vw] z-10  h-[12vw] w-[22vw]">
    <h2 className="text-[1.3vw] font-bold -mt-[0.5vw] ">Confirm Deletion</h2>
   <div className="mt-[0.5vw]"> 
    <p
      className="confirmation-message text-[0.8vw] font-normal text-gray-800 mb-4"
      style={{
        fontFamily: "Switzer",
        fontWeight: 400,
        color: "#808080",
      }}
    >
      Are you sure you would like to delete this Invoice{" "}
      <span className="flex justify-center">
        {" "}
        from the database? This action cannot be{" "}
      </span>{" "}
      <span className="flex justify-center"><b>undone</b>.</span>
    </p>
    <div className="flex justify-end gap-[1vw]">
    <button
     className="confirm-button bg-white  text-gray-700 border-2 border-gray-300   rounded-[0.8vw] w-[5vw] h-[2.5vw]  text-[0.8vw]   rounded-[0.8vw]  t transition duration-300  ease-in-out hover:bg-gray-100 hover:border-gray-400 hover:shadow-md"
    onClick={handleCancelDeleteAllConfirm}
  >
    <span className="text-[0.9vw] font-normal">Close</span>
  </button>

              <button
                className="confirm-button bg-red-500 hover:bg-red-600 text-white border-none  w-[5vw] h-[2.5vw]  text-[0.8vw] mr-[3.5vw]  rounded-[0.8vw]  transition duration-300 ease-in-out hover:shadow-md font-Switzer font-normal"
                onClick={confirmDeleteAll}
              >
            <span className="text-[0.9vw] font-normal">Delete</span>
              </button>
        </div>
      </div>
    </div>
  </div>
)}




      </div>
    </th>

    <th className="text-[0.9375vw]"></th>

    <th className="text-center text-[0.9375vw]">Billing Date</th>
    <th className="text-center text-[0.9375vw]">Status</th>
    <th className="text-center text-[0.9375vw]">Amount</th>
    <th className="px-[1.25vw] text-center text-[0.9375vw]">Card (Ends on)</th>
    <th className="text-[0.9375vw]">Actions</th>
  </tr>
</thead>



          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={invoice.id} className={index === invoices.length - 1 ? "" : "border-b border-gray-200"}>
<td className="px-[0.625vw] py-[0.83vw] text-left ">
  <input
    type="checkbox"
    checked={selectedInvoices.includes(invoice.id)}
    onChange={() => handleCheckboxChange(invoice.id)}
    className="invoice-checkbox"
    style={{
      width: '1.25vw',
      height: '1.25vw',
      borderRadius: '0.4vw',
      borderWidth: '0.05vw',
      borderColor: '#E0E0E9',
      cursor: 'pointer',
      verticalAlign: 'middle',
      position: 'relative',
      marginLeft: '-5.4vw',
      marginTop: '-0.1vw',

    }}
  />
</td>


                <td className="flex items-center">
<Image
src={pdf}
alt="pdf icon"
className="-ml-[6.5vw]"
/>       
<div className="flex justify-center items-center">
  <td className="font-medium text-center  text-[0.83vw] -ml-[0.6vw]">{`Zwilt Invoice # ${invoice.id}`}</td>
</div>
      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-black opacity-10 absolute inset-0 "></div>
          <div className="bg-white p-[2vw] rounded-[1vw] z-10  h-[12vw] w-[22vw]">
            <h2 className="text-[1.3vw] font-bold -mt-[0.5vw] ">Confirm Deletion</h2>
           <div className="mt-[0.5vw]"> 
            <p
              className="confirmation-message text-[0.8vw] font-normal text-gray-800 mb-4"
              style={{
                fontFamily: "Switzer",
                fontWeight: 400,
                color: "#808080",
              }}
            >
              Are you sure you would like to delete this Invoice{" "}
              <span className="flex justify-center">
                {" "}
                from the database? This action cannot be{" "}
              </span>{" "}
              <span className="flex justify-center"><b>undone</b>.</span>
            </p>
            <div className="flex justify-end gap-[1vw]">
            <button
  className="confirm-button bg-white  text-gray-700 border-2 border-gray-300   rounded-[0.8vw] w-[5vw] h-[2.5vw]  text-[0.8vw]   rounded-[0.8vw]  t transition duration-300  ease-in-out hover:bg-gray-100 hover:border-gray-400 hover:shadow-md"
    onClick={() => setShowConfirm(false)}
  >
    <span className="text-[0.9vw] font-normal">Close</span>
  </button>
              <button
                className="confirm-button bg-red-500 hover:bg-red-600 text-white border-none  w-[5vw] h-[2.5vw]  text-[0.8vw]   rounded-[0.8vw]  mr-[3.5vw]  transition duration-300 ease-in-out hover:shadow-md font-Switzer font-normal"
                onClick={confirmDeleteInvoice}
              >
            <span className="text-[0.9vw] font-normal">Delete</span>
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
                </td>
                <td className=" text-center font-medium text-[0.83vw]">{invoice.date}</td>
                <td className="text-center  relative  ">
               <div className="flex justify-center items-center">    <span className={`status px-[0.41vw] py-[0.20vw]  text-[0.83vw] border rounded-[2.60vw] font-medium  ${invoice.status === 'Pending' ? ' bg-gray-100 text-[#98A2B3] border-gray-300 font-normal px-[0.7vw]' : 'font-normal bg-abefc6 text-abefc6 px-[0.7vw]'}`}>
                    {invoice.status}
                  </span></div>
                </td>
                <td className="font-medium text-[0.83vw]">{invoice.amount}</td>
                <td className="  font-medium text-[0.83vw]">{invoice.card}</td>
                <td>    
                <div className="flex relative items-center justify-center">
  {/* DeleteButton with Tooltip */}
  <div className="static group flex items-center justify-center w-[1.25vw] h-[1.25vw] overflow-hidden">
    <button onClick={() => handleDelete(invoice.id)}>
      <Image
        src={deleteicon}
        alt="Delete icon"
        height={24}
        width={24}
        className="relative z-10"
      />
        <span className="absolute  bottom-[80%] left-1/2 transform -translate-x-1/2   text-xs rounded-md px-2 py-1 w-[120px] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <Image src={deletetooltip} className="h-[2vw] ml-[0.1vw] mb-[0.1vw]" alt="alt" />
    </span>
    </button>
  </div>

  {/* Download Button with Tooltip */}
  <div className="static group flex items-center justify-center ml-[0.8vw] w-[1.25vw] h-[1.25vw] overflow-hidden">

  <button onClick={() => handleDownload(invoice)} className="flex   static items-center justify-center ">
    <Image
      src={download}
      alt="Download icon"
      height={24}
      width={24}
      className="-mt-[1.69vw]"
    />
      <span className="absolute  bottom-[80%] left-1/2 transform -translate-x-1/2   text-xs rounded-md px-2 py-1 w-[100px] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <Image src={downloadtooltip} className="h-[2vw] ml-[0.95vw]"  alt="alt" />
    </span>
  </button>

</div>

  </div>



                </td>
              </tr>
              
            ))}
          </tbody>
        </table>
        
      </div>
    </div>
    
  );
};

export default Invoices;
