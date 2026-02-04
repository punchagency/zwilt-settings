import { Key, SetStateAction, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import Chevron from "@/assests/icons/chevron.svg";
import Close from "@/assests/icons/close.svg";
import { usePhoneInfo } from "@/store/phone-account-store";
import { selectedCityVar } from "./state";
import { getCityByAreaCode } from "../../config/areaCodeToCity";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatPhoneNumber } from "../../../utils";
import { Box, styled, Skeleton } from "@mui/material";
import Image from "next/image";
import { notifyErrorFxn } from "utils/toast-fxn";

export type CityOption = {
  // id: number;
  phoneRecordId?: string;
  city: string;
  number: string;
  msisdn: string;
  cost: number;
};

const AddPhoneNumberModal = ({
  isOpen,
  virtualNumbers,
  virtualNumbersCount,
  hasMore,
  onClose,
  openPhoneNumber,
  loadMoreItems,
}: {
  virtualNumbersCount: any;
  virtualNumbers: any;
  hasMore: boolean;
  isOpen: boolean;
  onClose: () => void;
  loadMoreItems: () => void;
  openPhoneNumber: () => void;
}) => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchAreaCode, setSearchAreaCode] = useState<string>("");
  const [active, setActive] = useState<string>("By City");

  // State for filtered results
  const [filteredNumbers, setFilteredNumbers] = useState(virtualNumbers);

  // const setCity = usePhoneInfo((state) => state.setSelectedCity);
  // const filteredCities = cities.filter((city) =>
  //   city.city.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const array: { name: string; animate: boolean }[] = [
    {
      name: "By City",
      animate: true,
    },
    {
      name: "Area Code",
      animate: true,
    },
  ];

  // // Function to filter virtual numbers based on the active tab
  // const filterVirtualNumbers = () => {
  //   if (active === "By City") {
  //     // Filter by city
  //     const lowercasedSearchTerm = searchTerm.toLowerCase();
  //     return virtualNumbers.filter((item: any) => {
  //       const areaCode = formatPhoneNumber(item.msisdn)?.areaCode;
  //       if (!areaCode) return false;
  //       const city = getCityByAreaCode(areaCode);

  //       return city.toLowerCase().includes(lowercasedSearchTerm);
  //     });
  //   } else if (active === "Area Code") {
  //     // Filter by area code/MSISDN
  //     const formattedSearchTerm = searchAreaCode.replace(/\D/g, ""); // Remove non-numeric characters for better matching
  //     return virtualNumbers.filter((item: any) => {
  //       const msisdn = item.msisdn.replace(/\D/g, ""); // Remove non-numeric characters
  //       return msisdn.includes(formattedSearchTerm);
  //     });
  //   }
  // };

  const filterVirtualNumbers = () => {
    if (active === "By City") {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      return virtualNumbers.filter((item: any) => {
        const areaCode = formatPhoneNumber(item.msisdn)?.areaCode;
        if (!areaCode) return false;
        const city = getCityByAreaCode(areaCode);

        console.log("Lowercased City Search Term:", lowercasedSearchTerm);
        console.log("City for Item:", city);

        return city.toLowerCase().includes(lowercasedSearchTerm);
      });
    } else if (active === "Area Code") {
      const formattedSearchTerm = searchAreaCode.replace(/\D/g, ""); // Remove non-numeric characters for better matching

      console.log("Formatted Area Code Search Term:", formattedSearchTerm);

      return virtualNumbers.filter((item: any) => {
        const msisdn = item.msisdn.replace(/\D/g, ""); // Remove non-numeric characters
        console.log("Formatted MSISDN:", msisdn);
        return msisdn.includes(formattedSearchTerm);
      });
    }
  };

  const filteredVirtualNumbers = filterVirtualNumbers();

  // Check if no MSISDN is found and trigger a toast error
  useEffect(() => {
    if (filteredVirtualNumbers.length === 0) {
      notifyErrorFxn("No MSISDN number found for the search term.");
    }
  }, [filteredVirtualNumbers]);

  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center fixed max-w-full w-[100vw] h-screen left-0 top-0 bg-[#28283333] z-50">
      <motion.div
        // initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        // exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center absolute w-[32.29vw] h-[40.72vw] px-[1.14vw] pt-[1.35vw] pb-[1.04vw] rounded-[1.56vw] bg-[#ffffff] z-10"
        style={modalStyle}
      >
        <div className="flex items-center w-full justify-between">
          <h3 className="font-normal font-semibold text-[1.25vw] leading-[1.67vw] text-left text-[#282833]">
            Add Phone Number
          </h3>
          <a
            onClick={onClose}
            className="flex items-center justify-center p-0 gap-[0.21vw] isolate w-[2.08vw] h-[2.08vw] bg-[#ffffff] border-[0.04vw] border-solid border-[#e0e0e9] rounded-[0.63vw] cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd]"
          >
            <Image
              src={Close}
              className="text-[#282833] w-[0.83vw] h-[0.83vw]"
              width={16}
              alt=""
            />
          </a>
        </div>

        <div className="flex gap-[1.04vw] w-full mt-[2.08vw] w-full">
          {array.map((item) => (
            <motion.div
              key={item.name}
              className={`flex-1 relative text-center ${
                !item.animate
                  ? "cursor-not-allowed text-gray-400"
                  : "cursor-pointer"
              }`}
              onClick={() => item.animate && setActive(item.name)}
            >
              <p
                className={` text-[0.94vw] font-semibold pb-[1.20vw] ${
                  active === item.name ? "text-[#282833]" : "text-[#282833B2]"
                }`}
              >
                {item.name}
              </p>
              {active === item.name && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 w-full h-[2px] bg-[#282833]"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}

          {/* {active === "By City" && (
           
          )} */}
        </div>

        <div className="w-full h-full">
          <div className="Content">
            <AnimatePresence mode="wait">
              {active === "By City" && (
                <motion.div
                  key="Basics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="w-[100%] mt-4"
                >
                  <div className="space-y-[0.73vw] w-full">
                    <label
                      htmlFor=""
                      className="text-[0.94vw] font-semibold w-full"
                    >
                      Enter City
                    </label>
                    <input
                      type="text"
                      placeholder="Type your city here"
                      className="w-full h-[2.55vw] py-[0.51225vw] px-[0.768vw] leading-[1vw] text-[0.83vw] text-[#282833] border border-solid border-[#e0e0e9] rounded-[0.78vw] flex-none grow-0 focus:outline-none placeholder:text-[#7e7e85] leading-[1vw]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div
                    className="border p-[0.52vw] border-[#E0E0E9] rounded-[0.52vw] max-h-[25.52vw] overflow-y-scroll w-full mt-[0.52vw] scrollbar-gutter-stable"
                    id="scrollableDiv"
                  >
                    <InfiniteScroll
                      dataLength={filteredVirtualNumbers.length}
                      // dataLength={virtualNumbersCount}
                      next={loadMoreItems}
                      hasMore={hasMore}
                      loader={<VirtualNumberSkeleton />}
                      scrollThreshold={0.7}
                      scrollableTarget="scrollableDiv"
                    >
                      {filteredVirtualNumbers?.map(
                        (item: any, index: number) => {
                          // {virtualNumbers?.map((item: any, index: number) => {

                          const areaCode = formatPhoneNumber(
                            item.msisdn
                          )?.areaCode;
                          if (!areaCode) return null;
                          const city = getCityByAreaCode(areaCode);
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between hover:bg-[#F4F4FA] rounded-[0.52vw] p-[0.52vw] py-[0.68vw] px-[0.52vw] w-full h-[2.60vw] cursor-pointer w-full"
                              onClick={() => {
                                selectedCityVar({
                                  city,
                                  number: formatPhoneNumber(item.msisdn)
                                    ?.number as string,
                                  msisdn: item.msisdn,
                                });
                                onClose();
                                openPhoneNumber();
                              }}
                            >
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id={city}
                                  name="city"
                                  value={city}
                                  onChange={() => setSelectedCity(city)}
                                  checked={selectedCity === city}
                                  className="border border-[#E0E0E9] h-[1.25vw] w-[1.25vw]"
                                />
                                <span className="ml-[0.52vw] text-[0.94vw] text-[#282833] font-normal">
                                  {formatPhoneNumber(item.msisdn)?.number}
                                </span>
                              </div>
                              <label
                                htmlFor={city}
                                className="cursor-pointer text-[0.83vw] font-normal text-[#282833] text-right"
                              >
                                {city}
                              </label>
                            </div>
                          );
                        }
                      )}
                    </InfiniteScroll>
                  </div>
                </motion.div>
              )}
              {active === "Area Code" && (
                <motion.div
                  key="Change Password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="w-[100%] mt-4"
                >
                  <div className="space-y-[0.73vw] w-full">
                    <label
                      htmlFor=""
                      className="text-[0.94vw] font-semibold w-full"
                    >
                      Enter Area Code
                    </label>
                    <input
                      type="text"
                      placeholder="Type your area code here"
                      className="w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-[1vw] text-[0.83vw] text-[#282833] border border-solid border-[#e0e0e9] rounded-[0.78vw] flex-none grow-0 focus:outline-none placeholder:text-[#28283399] leading-[1vw]"
                      value={searchAreaCode}
                      onChange={(e) => setSearchAreaCode(e.target.value)}
                    />
                  </div>
                  <div
                    className="space-y-[0.52vw] border p-[0.52vw] border-[#E0E0E9] rounded-[0.52vw] max-h-[25.52vw] overflow-y-scroll w-full mt-[0.52vw] scrollbar-gutter-stable"
                    id="scrollableDiv"
                  >
                    <InfiniteScroll
                      // dataLength={virtualNumbersCount}
                      dataLength={filteredVirtualNumbers.length}
                      next={loadMoreItems}
                      hasMore={true}
                      loader={<VirtualNumberSkeleton />}
                      scrollThreshold={0.7}
                      scrollableTarget="scrollableDiv"
                    >
                      {filteredVirtualNumbers?.map(
                        (item: any, index: number) => {
                          const areaCode = formatPhoneNumber(
                            item.msisdn
                          )?.areaCode;
                          if (!areaCode) return null;
                          const city = getCityByAreaCode(areaCode);
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between hover:bg-[#F4F4FA] rounded-[0.52vw] p-[0.52vw] cursor-pointer w-full"
                              onClick={() => {
                                selectedCityVar({
                                  city,
                                  number: formatPhoneNumber(item.msisdn)
                                    ?.number as string,
                                  msisdn: item.msisdn,
                                });
                                onClose();
                                openPhoneNumber();
                              }}
                            >
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id={city}
                                  name="city"
                                  value={city}
                                  onChange={() => setSelectedCity(city)}
                                  checked={selectedCity === city}
                                  className="border border-[#E0E0E9] h-[1.25vw] w-[1.25vw]"
                                />
                                <span className="ml-[0.52vw] text-[0.94vw] text-[#282833] font-normal">
                                  {formatPhoneNumber(item.msisdn)?.number}
                                </span>
                              </div>
                              <label
                                htmlFor={city}
                                className="cursor-pointer text-[0.83vw] font-normal text-[#282833] text-right"
                              >
                                {city}
                              </label>
                            </div>
                          );
                        }
                      )}
                    </InfiniteScroll>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddPhoneNumberModal;

const VirtualNumberSkeleton = styled(Skeleton)(({ theme }) => ({
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  margin: "-5px 0",
  background: "#F4F4FA",
}));

const modalStyle: React.CSSProperties = {
  boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
};

const selectStyle: React.CSSProperties = {
  boxShadow: "0px 0px 20px rgba(80, 88, 159, 0.1)",
  zIndex: 1,
};
