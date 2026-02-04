import React, { useState } from "react";
import BillingSummary from "./billingsummary";
import PaymentMethods from "./paymentmethod";
import Invoices from "./invoice";

const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Billing Summary");

  const renderContent = () => {
    switch (activeTab) {
      case "Billing Summary":
        return <BillingSummary />;
      case "Payment Methods":
        return <PaymentMethods />;
      case "Invoices":
        return <Invoices />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h1>Payment & Billing</h1>
      <p>Manage your payment & billing information here.</p>
      <div className="tab-container">
        <div
          className={`tab ${
            activeTab === "Billing Summary" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("Billing Summary")}
        >
          Billing Summary
        </div>
        <div
          className={`tab ${
            activeTab === "Payment Methods" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("Payment Methods")}
        >
          Payment Methods
        </div>
        <div
          className={`tab ${activeTab === "Invoices" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("Invoices")}
        >
          Invoices
        </div>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Navbar;
