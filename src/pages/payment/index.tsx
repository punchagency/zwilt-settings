import PantreiIcon from "@/assests/icons/ZwiltTracker2.png";
import ZwiltIcon from "@/assests/icons/zwiltlogo.svg";
import AddIcon from "@/assests/images/add-icon.png";
import Recrowdly from "@/assests/images/recrowdly.png";
import CustomDropdown from "@/components/customdropdown"; // Import the CustomDropdown component
import Invoices from "@/components/invoice";
import PaymentMethods from "@/components/paymentmethod";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import useUser from "utils/recoil_store/hooks/use-user-state";
import { GetAIUsageDashboard } from "@/graphql/queries/aiCredits";
import SubscriptionTiers from "@/components/ai-credits/SubscriptionTiers";
import { Skeleton } from "@mui/material";

const customActiveUnderlineStyle: React.CSSProperties = {
  color: "#282833",
  borderBottom: "2px solid #282833",
};

const BillingSummary: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const [activeTab, setActiveTab] = useState("Billing Summary");
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("Billing-Period");

  const { getUserState } = useUser();
  const userState = getUserState();
  const org = userState?.currentUser?.organization;
  // @ts-ignore
  const organizationId = typeof org === "string" ? org : org?._id;

  const { data: dashboardData, loading: dashboardLoading } = useQuery(
    GetAIUsageDashboard,
    {
      variables: { organizationId },
      skip: !organizationId,
      fetchPolicy: "network-only",
      context: { clientName: "aiCredits" },
    },
  );

  const billingData = [
    {
      product: "Zwilt Tracker",
      amount: "USD $52.00",
      image: "https://picsum.photos/200/300",
    },
    {
      product: "Recrowdly",
      amount: "USD $32.00",
      image: "https://picsum.photos/200/300",
    },
    {
      product: "Pantrei",
      amount: "USD $18.00",
      image: "https://picsum.photos/200/300",
    },
  ];

  useEffect(() => {
    if (query.tab) {
      setActiveTab(query.tab as string);
    }
  }, [query.tab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleDownloadCSV = () => {
    const csvRows = [Object.keys(billingData[0]).join(",")];

    for (const row of billingData) {
      const values = Object.values(row);
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "billing_summary.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleProductExpansion = (product: string) => {
    setExpandedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((item) => item !== product)
        : [...prev, product],
    );
  };

  const periods = [
    { value: "may-2024", label: "May 1 - May 31, 2024" },
    { value: "april-2024", label: "April 1 - April 30, 2024" },
    { value: "march-2024", label: "Mar 1 - March 31, 2024" },
  ];

  const handleSelect = (selected: string) => {
    setSelectedPeriod(selected);
  };

  return (
    <div className="w-[100%] h-[100%] overflow-hidden border-box">
      <nav className="flex items-center w-[100%] py-[1.04vw] pl-[1.56vw] pr-[1.30vw] border-b-[0.05vw] border-[#E0E0E9]">
        <div className="flex flex-col items-start p-0">
          <h2 className="payment text-[1.25vw] font-switzer font-semibold text-left text-[#282833] leading-[1.63vw]">
            Payment & Billing
          </h2>
          <p className="text-[0.83vw] font-normal leading-[1.08vw] text-left text-[#6F6F76] mt-[0.52vw]">
            Manage your payment & billing information here.
          </p>
        </div>
      </nav>

      <ul className="flex items-center justify-start mt-[0.5vw] w-[100%] px-[1.56vw] space-x-[1.56vw] border-b-[0.05vw] border-[#E0E0E9]">
        <li
          className="flex items-center justify-center border-b-[2px] border-transparent font-semibold text-[0.94vw] leading-[1.24vw]  text-grayish-blue cursor-pointer "
          style={
            activeTab === "Billing Summary" ? customActiveUnderlineStyle : {}
          }
          onClick={() => handleTabClick("Billing Summary")}
        >
          <a className="text-[0.94vw] mt-[0.6vw] mb-[1vw]">
            {activeTab === "Billing Summary" ? (
              <span className="font-semibold">Billing Summary</span>
            ) : (
              <span className="font-medium">Billing Summary</span>
            )}
          </a>
        </li>

        <li
          className="flex items-center justify-center border-b-[2px] border-transparent font-semibold text-[0.94vw] leading-[1.24vw] text-grayish-blue cursor-pointer "
          style={
            activeTab === "Payment Methods" ? customActiveUnderlineStyle : {}
          }
          onClick={() => handleTabClick("Payment Methods")}
        >
          <a className="text-[0.94vw] mt-[0.6vw] mb-[1vw]">
            {activeTab === "Payment Methods" ? (
              <span className="font-semibold">Payment Methods</span>
            ) : (
              <span className="font-medium">Payment Methods</span>
            )}
          </a>
        </li>
        <li
          className={`flex items-center justify-center border-b-[2px] border-transparent text-[0.94vw] leading-[1.24vw] text-grayish-blue cursor-pointer  ${
            activeTab === "Invoices" ? "font-semibold" : "font-normal"
          }`}
          style={activeTab === "Invoices" ? customActiveUnderlineStyle : {}}
          onClick={() => handleTabClick("Invoices")}
        >
          <a className="text-[0.94vw] mt-[0.6vw] mb-[1vw]">
            {activeTab === "Invoices" ? (
              <span className="font-semibold">Invoices</span>
            ) : (
              <span className="font-medium">Invoices</span>
            )}
          </a>
        </li>
        <li
          className={`flex items-center justify-center border-b-[2px] border-transparent text-[0.94vw] leading-[1.24vw] text-grayish-blue cursor-pointer  ${
            activeTab === "AI Credits Plan" ? "font-semibold" : "font-normal"
          }`}
          style={
            activeTab === "AI Credits Plan" ? customActiveUnderlineStyle : {}
          }
          onClick={() => handleTabClick("AI Credits Plan")}
        >
          <a className="text-[0.94vw] mt-[0.6vw] mb-[1vw]">
            {activeTab === "AI Credits Plan" ? (
              <span className="font-semibold">AI Credits Plan</span>
            ) : (
              <span className="font-medium">AI Credits Plan</span>
            )}
          </a>
        </li>
      </ul>

      <div className="h-[65vh] overflow-y-scroll scrollbar-thin">
        {activeTab === "Billing Summary" && (
          <div className="max-w-full w-full pt-[2.08vw] pb-[1.04vw] px-[1.56vw] space-y-[1.93vw]">
            <div className="max-w-[72.14vw] w-full border border-[#e0e0e9] rounded-[0.70vw]">
              <div className="bg-[#f4f4fa] max-w-full w-full h-[4.48vw] flex items-center justify-between border-0 rounded-t-[0.6vw] p-[1.04vw_1.09vw]">
                <div className="flex flex-col items-start justify-center">
                  <h2 className="flex items-center text-center font-semibold text-[0.94vw] text-very-dark-grayish-blue">
                    Estimated Bill Summary
                    <span className="ml-[0.47vw] cursor-pointer flex items-center text-center text-[#667085] text-[0.73vw] font-medium justify-center p-[0.42vw_0.52vw] w-[3.75vw] h-[1.25vw] bg-[#fcfcfd] border border-[#d0d5dd] rounded-[2.60vw]">
                      Monthly
                    </span>
                  </h2>
                  <p className="mt-[0.36vw] font-medium text-[0.83vw] text-[#6F6F76]">
                    Estimated billing summary for all the apps.
                  </p>
                </div>

                <div className="flex items-center  justify-end space-x-[0.78vw]">
                  <button
                    className="flex items-center justify-center text-center text-[0.83vw] text-[#6F6F76] p-[0.93vw_0.78vw] hover:border-[#A6A6A6] w-[9.22vw] h-[2.55vw] hover:bg-[#e2e2f1] bg-[#ffffff] border-[0.05vw] border-[#e0e0e9] rounded-[0.78vw]"
                    onClick={handleDownloadCSV}
                  >
                    Download all to CSV
                  </button>

                  <CustomDropdown
                    className="appearance-none h-fit text-[0.83vw] flex items-center  !text-center text-[#282833] ml-[0.33vw] font-normal focus:outline-none placeholder:text-[#9b9ba0]"
                    options={periods}
                    onSelect={handleSelect}
                    selectedValue={selectedPeriod}
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="pt-[1vw] pb-[1vw] px-[1.19vw]">
                  <table className="w-full">
                    <thead className="w-full relative">
                      <tr className="w-full border-b border-[#E0E0E9]">
                        <th className="pb-[1.04vw] text-start">
                          <span className="font-semibold text-[0.94vw] text-start text-very-dark-grayish-blue w-full">
                            Billing Period Info
                          </span>
                        </th>

                        <th className="pb-[1.04vw] text-right">
                          <span className="font-semibold text-[0.94vw]  mr-[1vw] text-start text-very-dark-grayish-blue">
                            Status
                          </span>
                        </th>

                        <th className="pb-[1.04vw] text-right">
                          <span className="font-semibold text-[0.94vw] mr-[1.5vw]  text-start text-very-dark-grayish-blue">
                            Card
                          </span>
                        </th>

                        <th className="pb-[1.04vw] text-right ">
                          <span className="font-semibold text-[0.94vw] mr-[1.5vw]  text-start text-very-dark-grayish-blue">
                            Amount
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="w-full relative">
                      <tr className="w-full border-b border-[#E0E0E9]">
                        <td className="text-start py-[1.04vw]">
                          <span className="text-[0.83vw] font-medium text-left text-[#6F6F76]">
                            June 1 - June 30, 2024
                          </span>
                        </td>

                        <td className="flex items-center justify-end py-[1.04vw]">
                          <span className="cursor-pointer text-[#98A2B3] text-[0.83vw]   cursor-pointer text-[#17B26A]  -mr-[0.02vw] ml-[5vw] text-[0.83vw] flex items-center justify-center  w-[4.69vw] h-[1.56vw] border border-[#d0d5dd] bg-[#f2f4f7] rounded-[2.6vw] p-[0.78vw] ">
                            Pending
                          </span>
                        </td>

                        <td className="text-right py-[1.04vw]">
                          <span className="text-[0.83vw] font-medium text-very-dark-grayish-blue">
                            Ends on 9876
                          </span>
                        </td>

                        <td className="text-right py-[1.04vw]">
                          <span className="text-[0.83vw] mr-[1vw] font-medium text-very-dark-grayish-blue">
                            USD $94.32
                          </span>
                        </td>
                      </tr>
                      <tr className="w-full border-b border-[#E0E0E9]">
                        <td className="text-start py-[1.04vw]">
                          <span className="text-[0.83vw] font-medium text-left text-[#6F6F76]">
                            April 1 - June 30, 2024
                          </span>
                        </td>

                        <td className="flex items-center justify-end py-[1.04vw]">
                          <span className="cursor-pointer text-[#17B26A] text-[0.83vw] mr-[0.8vw] flex items-center justify-center text-center w-[3.28vw] h-[1.56vw] border border-[#abefc6]  bg-[#dcfae6] rounded-[2.6vw] p-[0.78vw]">
                            Paid
                          </span>
                        </td>

                        <td className="text-right py-[1.04vw]">
                          <span className="text-[0.83vw] font-medium text-very-dark-grayish-blue">
                            Ends on 5892
                          </span>
                        </td>

                        <td className="text-right  py-[1.04vw]">
                          <span className="text-[0.83vw] mr-[1vw] font-medium text-left text-very-dark-grayish-blue">
                            USD $63.20
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="w-full pl-[1.09vw] -mt-[0.5vw] pb-[0.8vw]">
                  <h2 className="text-[1.67vw] font-semibold text-very-dark-grayish-blue">
                    Grand Total: <span>USD $ 157.52 </span>
                  </h2>
                </div>
              </div>
            </div>

            {/*  */}

            <div
              className="max-w-[72.14vw] w-full border border-[#e0e0e9] rounded-[0.70vw]"
              style={{ marginBottom: "1.5rem" }}
            >
              <div className="bg-[#f4f4fa] max-w-full w-full h-[4.48vw] flex items-center justify-between border-0 rounded-t-[0.6vw] p-[1.04vw_1.09vw]">
                <div className="flex flex-col items-start justify-center">
                  <h2 className="flex items-center text-center font-semibold text-[0.94vw] text-very-dark-grayish-blue">
                    Total Active Services
                    <span className="ml-[0.36vw] cursor-pointer w-[1.56vw] font-normal h-[1.25vw] text-[0.83vw] py-[0.42vw] px-[0.52vw] rounded-[2.60vw] bg-very-dark-grayish-blue text-[#fff] text-center flex items-center justify-center">
                      3
                    </span>
                  </h2>
                  <p className="mt-[0.36vw] font-medium text-[0.83vw] text-[#6F6F76]">
                    Estimated billing summary for all the apps.
                  </p>
                </div>
              </div>

              <div className="w-full">
                <div className="pt-[1.61vw] pb-[0.25vw] px-[1.19vw]">
                  <table className="w-full">
                    <thead className="w-full relative">
                      <tr className="w-full border-b border-[#E0E0E9]">
                        <th className="pb-[1.04vw] text-start">
                          <span className="font-semibold text-[0.94vw] text-start text-very-dark-grayish-blue">
                            Products/Services
                          </span>
                        </th>

                        <th className="pb-[1.04vw] text-center w-[18%]">
                          <span className="font-semibold text-[0.94vw] ml-[5.5vw] text-start text-very-dark-grayish-blue">
                            Total
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="w-full relative">
                      <tr
                        className={`w-full ${
                          expandedProducts.includes("Zwilt Tracker")
                            ? ""
                            : "border-b"
                        } border-[#E0E0E9]`}
                      >
                        <td className="text-start py-[1.04vw]">
                          <div className="flex items-center justify-start">
                            <Image
                              className="cursor-pointer w-[1.25vw] h-[1.25vw]"
                              width={100}
                              height={100}
                              src={AddIcon}
                              quality={100}
                              alt=""
                              onClick={() =>
                                toggleProductExpansion("Zwilt Tracker")
                              }
                            />

                            <Image
                              className="cursor-pointer w-[1.82vw] h-[1.14vw] ml-[0.89vw]"
                              width={100}
                              height={100}
                              src={ZwiltIcon}
                              quality={100}
                              alt=""
                            />
                            <p className="text-[0.83vw] font-medium text-very-dark-grayish-blue ml-[0.89vw]">
                              Zwilt Tracker
                            </p>
                          </div>
                        </td>

                        <td className="text-center py-[1.04vw]">
                          <span className="text-[0.83vw] font-medium text-left  ml-[5.5vw]  text-very-dark-grayish-blue">
                            USD $82.00
                          </span>
                        </td>
                      </tr>
                      {expandedProducts.includes("Zwilt Tracker") && (
                        <tr>
                          <td colSpan={2} className="p-0">
                            <div className="w-[69.25vw]   border  border-t-1 border-[#E0E0E9] rounded-[1.041vw] overflow-x-auto">
                              <table className="w-full table-fixed">
                                <thead>
                                  <tr className="bg-[#F4F4FA] border-b border-[#E0E0E9] text-[0.83vw]">
                                    <th className="text-left py-[0.625vw] px-[1.5vw]">
                                      User
                                    </th>
                                    <th className="text-right py-[0.625vw]  ">
                                      Quantity
                                    </th>
                                    <th className="text-right py-[0.625vw] px-[1.5vw]">
                                      Price
                                    </th>
                                    <th className="text-right py-[0.625vw] px-[2.25vw]">
                                      Charges
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-[#E0E0E9] text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw]">
                                      Admin User
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      2
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $10/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $20.00
                                    </td>
                                  </tr>
                                  <tr className="border-b border-[#E0E0E9] text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw]">
                                      Recruiter
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      1
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $50/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $10.00
                                    </td>
                                  </tr>
                                  <tr className="text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw] ">
                                      Account User
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      5
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $20/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $25.00
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                      {/* recrowdly */}
                      <tr
                        className={`w-full ${
                          expandedProducts.includes("recrowdly")
                            ? ""
                            : "border-b border-[#E0E0E9]"
                        }`}
                      >
                        <td className="text-start py-[1.04vw]">
                          <div className="flex items-center justify-start">
                            <Image
                              className="cursor-pointer w-[1.25vw] h-[1.25vw]"
                              width={100}
                              height={100}
                              src={AddIcon}
                              quality={100}
                              alt=""
                              onClick={() =>
                                toggleProductExpansion("recrowdly")
                              }
                            />
                            <Image
                              className="cursor-pointer w-[1.67vw] h-[1.67vw] ml-[0.89vw]"
                              width={100}
                              height={100}
                              src={Recrowdly}
                              quality={100}
                              alt=""
                              onClick={() =>
                                toggleProductExpansion("recrowdly")
                              }
                            />
                            <p className="text-[0.83vw] font-medium text-very-dark-grayish-blue ml-[0.89vw]">
                              Recrowdly
                            </p>
                          </div>
                        </td>
                        <td className="text-center py-[1.04vw]">
                          <span className="text-[0.83vw] font-medium text-left ml-[5.5vw] text-very-dark-grayish-blue">
                            USD $32.00
                          </span>
                        </td>
                      </tr>
                      {expandedProducts.includes("recrowdly") && (
                        <tr>
                          <td colSpan={2} className="p-0">
                            <div className="w-[69.25vw] border border-[#E0E0E9] rounded-[1.041vw] overflow-x-auto">
                              <table className="w-full table-fixed">
                                <thead>
                                  <tr className="bg-[#F4F4FA] border-b border-[#E0E0E9] text-[0.83vw]">
                                    <th className="text-left py-[0.625vw] px-[1.5vw]">
                                      User
                                    </th>
                                    <th className="text-right py-[0.625vw]">
                                      Quantity
                                    </th>
                                    <th className="text-right py-[0.625vw] px-[1.5vw]">
                                      Price
                                    </th>
                                    <th className="text-right py-[0.625vw] px-[2.25vw]">
                                      Charges
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-[#E0E0E9] text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw]">
                                      Admin User
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      4
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $40/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $80.00
                                    </td>
                                  </tr>
                                  <tr className="border-b border-[#E0E0E9] text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw]">
                                      Recruiter
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      2
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $15/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $30.00
                                    </td>
                                  </tr>
                                  <tr className="text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw]">
                                      Account User
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      10
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $5/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $10.00
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* pantrei */}
                      <tr className="w-full">
                        <td className="text-end py-[1.04vw]">
                          <div className="flex items-center justify-start">
                            <Image
                              className="cursor-pointer w-[1.25vw] h-[1.25vw]"
                              width={100}
                              height={100}
                              src={AddIcon}
                              quality={100}
                              alt=""
                              onClick={() => toggleProductExpansion("pantrei")}
                            />

                            <Image
                              className="cursor-pointer w-[1.67vw] h-[1.67vw] ml-[0.89vw]"
                              width={100}
                              height={100}
                              src={PantreiIcon}
                              quality={100}
                              alt=""
                              onClick={() => toggleProductExpansion("pantrei")}
                            />
                            <p className="text-[0.83vw] font-medium text-very-dark-grayish-blue ml-[0.89vw]">
                              Pantrei
                            </p>
                          </div>
                        </td>

                        <td className="text-center py-[1.04vw]">
                          <span className="text-[0.83vw] font-medium text-left  ml-[5.5vw]  text-very-dark-grayish-blue">
                            USD $18.00
                          </span>
                        </td>
                      </tr>
                      {expandedProducts.includes("pantrei") && (
                        <tr>
                          <td colSpan={2} className="pb-[1vw]">
                            <div className="w-[69.25vw] border border-[#E0E0E9] rounded-[1.041vw] overflow-x-auto">
                              <table className="w-full table-fixed pb-[0.5vw]">
                                <thead>
                                  <tr className="bg-[#F4F4FA] border-b border-[#E0E0E9] text-[0.83vw]">
                                    <th className="text-left py-[0.625vw] px-[1.5vw]">
                                      User
                                    </th>
                                    <th className="text-right py-[0.625vw]">
                                      Quantity
                                    </th>
                                    <th className="text-right py-[0.625vw] px-[1.5vw]">
                                      Price
                                    </th>
                                    <th className="text-right py-[0.625vw] px-[2.25vw]">
                                      Charges
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-[#E0E0E9] text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw]">
                                      Admin User
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      6
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $70/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $35.00
                                    </td>
                                  </tr>
                                  <tr className="border-b border-[#E0E0E9] text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw]">
                                      Recruiter
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      4
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $50/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $60.00
                                    </td>
                                  </tr>
                                  <tr className="text-[0.83vw]">
                                    <td className="py-[0.83vw] px-[1.4vw]">
                                      Account User
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      15
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[0.8vw]">
                                      $40/Seat
                                    </td>
                                    <td className="text-right py-[0.83vw] px-[1.5vw]">
                                      USD $89.00
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Payment Methods" && <PaymentMethods />}
        {activeTab === "Invoices" && <Invoices />}
        {activeTab === "AI Credits Plan" && (
          <div className="pt-[2.08vw] pb-[1.04vw] px-[1.56vw]">
            {dashboardLoading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                className="rounded-xl"
              />
            ) : (
              <SubscriptionTiers
                currentTier={
                  dashboardData?.getAIUsageDashboard?.balance?.subscriptionTier
                }
                organizationId={organizationId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default BillingSummary;
