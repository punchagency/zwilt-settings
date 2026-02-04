"use client";

import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";

import { AnimatePresence } from "framer-motion";

// import SearchBar from "@/components/SearchBar";
import Table from "@/components/Table";
import Modal from "@/components/phone_account/AddNumberModal";
import AddPhoneNumberModal from "@/components/phone_account/AddPhoneModal";
import AssignModal from "@/components/phone_account/assign-number-modal";
import { useEdit } from "@/store/phone-account-store";

import EditModal from "@/components/phone_account/edit-modal";
import {
  selectedCityVar,
  shouldRefetchVar,
} from "@/components/phone_account/state";
import Image from "next/image";
import {
  GetAllAssignedPhoneNumbers,
  GetAvailableVirtualNumbers,
  GetOrganizationMembers,
} from "@/graphql/queries/phoneAccount";
import { useQuery, useReactiveVar } from "@apollo/react-hooks";
import { columns } from "../../components/phone_account/tableInfo";

import PlusIcon from "@/assests/icons/plus.svg";
import SearchBar from "@/components/manageteam/SearchBar";
import SearchIcon from "@/assests/icons/search-icon.svg";
import { useAdminStatus } from "utils/recoil_store/hooks/use-admin-status";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { dummydata } from "../../../utils";

const PhoneAccount: React.FC = () => {
  const [hasMore, setHasMore] = useState(true);
  const [assignedNumbers, setAssignedNumbers] = useState([]);
  const [virtualNumbers, setVirtualNumbers] = useState<any>([]);
  const [virtualNumbersCount, setVirtualNumbersCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [orgMembers, setOrgMembers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const city = useReactiveVar(selectedCityVar);
  const shouldRefetch = useReactiveVar(shouldRefetchVar);

  const showEdit = useEdit((state) => state.showEdit);
  const setShowEdit = useEdit((state) => state.setShowEdit);
  const { checkAdminStatus } = useAdminStatus();
  const { fetchMore } = useQuery(GetAvailableVirtualNumbers, {
    variables: {
      input: {
        search: debouncedSearchTerm,
        pageSize: 20,
        pageNumber,
      },
    },
    skip: Boolean(virtualNumbers.length > 0),
    onCompleted: (data) => {
      setVirtualNumbers(data?.getAvailableVirtualNumbers?.numbers);
      setVirtualNumbersCount(data?.getAvailableVirtualNumbers?.count);
      setHasMore(
        data?.getAvailableVirtualNumbers?.numbers.length <
          data?.getAvailableVirtualNumbers?.count
      );
      // setPageNumber(pageNumber + 1);
    },
  });

  const {} = useQuery(GetOrganizationMembers, {
    onCompleted: (data) => {
      setOrgMembers(data?.getOrganizationMembers?.data);
      checkAdminStatus(data?.getOrganizationMembers?.data);
    },
  });

  const { refetch } = useQuery(GetAllAssignedPhoneNumbers, {
    // variables: {
    //   organizationId: "65e626aafeb174009ffcd74c",
    // },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setAssignedNumbers(data?.getAllAssignedPhoneNumbers?.data);
    },
  });

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleAssign = () => {
    handleCloseModal();
    setOpenAssignModal(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const loadMoreItems = async () => {
    if (!hasMore) return;
    setPageNumber((prev) => prev + 1);
    const results = await fetchMore({
      variables: {
        input: {
          search: "",
          pageSize: 20,
          pageNumber,
        },
      },
    });
    const numbers = results.data?.getAvailableVirtualNumbers?.numbers;
    const count = results.data?.getAvailableVirtualNumbers?.count;
    setVirtualNumbers((prev: any) => [...prev, ...numbers]);
    setHasMore(virtualNumbers.length < count);
    setVirtualNumbersCount(count);
  };

  useEffect(() => {
    (async () => {
      if (shouldRefetch) {
        const res = await refetch();
        setAssignedNumbers(res?.data?.getAllAssignedPhoneNumbers?.data);
        shouldRefetchVar(false);
      }
    })();
  }, [shouldRefetch, refetch]);

  useEffect(() => {
    console.log("assignedNumbers!!!", assignedNumbers);
  }, [assignedNumbers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredData = assignedNumbers.filter((item: any) =>
    item?.user?.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="max-w-full w-full relative">
      <nav className="flex items-center w-full py-[1.04vw] pl-[1.56vw] pr-[1.30vw] border-b-[0.05vw] border-[#E0E0E9]">
        <div className="flex items-center w-full justify-between">
          <div className="flex flex-col items-start p-0 w-[17.60vw]">
            <h2 className="text-[1.25vw] font-switzer font-semibold text-left text-very-dark-grayish-blue leading-[1.63vw]">
              Phone Settings
            </h2>
            <p className="text-[0.83vw] font-normal leading-[1.08vw] text-left text-grayish-blue mt-[0.52vw]">
              You can manage your phone settings here.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <form className="flex items-center p-0 w-[25.52vw] h-[2.55vw] relative p-[0.51vw_0.76vw] gap-[0.51vw] border-[0.05vw] border-[#E0E0E9] rounded-[0.78vw] hover:border-very-dark-grayish-blue">
              <Image
                src={SearchIcon}
                className="w-[1.23vw] h-[1.23vw]"
                alt="search icon"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="font-normal flex justify-center items-start w-full h-[1.23vw] text-[#282833] text-[0.92vw] focus:outline-none placeholder:text-[#9a9aa0] text-[0.92vw]"
                placeholder="Search here"
              />
            </form>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex justify-center items-center p-[0.52vw_1.25vw] gap-[0.52vw] w-[11.77vw] h-[2.55vw] bg-[#50589F] rounded-[0.78vw] ml-[0.82vw] cursor-pointer hover:bg-[#42498B]">
              <Image
                src={PlusIcon}
                className="w-[0.63vw] h-[0.63vw]"
                alt="add a phone number"
              />
              <span className="flex whitespace-nowrap text-[0.94vw] font-normal leading-[1.24vw] text-left text-[#ffffff]">
                Add a Phone Number
              </span>
            </button>
          </div>
        </div>
      </nav>

      <form className="flex items-center justify-between py-[1.56vw] pr-[0.99vw] pl-[1.7vw] w-full">
        <Table columns={columns} Tdata={filteredData} statusType={""} />
      </form>
      <AnimatePresence>
        {isModalOpen && (
          <AddPhoneNumberModal
            isOpen={isModalOpen}
            virtualNumbers={virtualNumbers}
            openPhoneNumber={() => setIsOpen(true)}
            onClose={() => setIsModalOpen(false)}
            hasMore={hasMore}
            loadMoreItems={loadMoreItems}
            virtualNumbersCount={virtualNumbersCount}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            city={city}
            handleAssign={handleAssign}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openAssignModal && (
          <AssignModal
            isOpen={openAssignModal}
            onClose={() => setOpenAssignModal(false)}
            city={city}
            orgMembers={orgMembers}
            refetch={async () => {
              const res = await refetch();
              setAssignedNumbers(res?.data?.getAllAssignedPhoneNumbers?.data);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEdit && (
          <EditModal
            isOpen={showEdit}
            onClose={() => setShowEdit(false)}
            city={city}
            orgMembers={orgMembers}
            refetch={async () => {
              const res = await refetch();
              setAssignedNumbers(res?.data?.getAllAssignedPhoneNumbers?.data);
            }}
            assignedNumbers={assignedNumbers}
          />
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default PhoneAccount;
