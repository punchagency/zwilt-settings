"use client";

import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";

import { AnimatePresence } from "framer-motion";

import SearchBar from "@/components/SearchBar";
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
import {
  GetAllAssignedPhoneNumbers,
  GetAvailableVirtualNumbers,
  GetOrganizationMembers,
} from "@/graphql/queries/phoneAccount";
import { useQuery, useReactiveVar } from "@apollo/react-hooks";
import { columns } from "../../components/phone_account/tableInfo";
import Loader from "@/components/manageteam/Loader";
import Error from "@/components/manageteam/Error";

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

  const { } = useQuery(GetOrganizationMembers, {
    onCompleted: (data) => {
      setOrgMembers(data?.getOrganizationMembers?.data);
    },
  });

  const { refetch, loading, error } = useQuery(GetAllAssignedPhoneNumbers, {
    variables: {
      organizationId: "65e626aafeb174009ffcd74c",
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setAssignedNumbers(data?.getAllAssignedPhoneNumbers?.data);
    },
  });

  const handleCloseModal = () => {
    setIsOpen(false);
    // setOpenAssignModal(true);
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
    // if (hasMore) setPageNumber(pageNumber + 1);
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


  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[24px] leading-[31.2px] font-semibold text-[#282833]">
            Phone Settings
          </h2>
          <p className="text-sm text-[#667085] mt-1">
            You can manage your phone settings here.
          </p>
        </div>
        <div className="flex items-center gap-5 ">
          <div>
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
          </div>
          <div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-[#50589F] py-2 text-[#fff] rounded-lg cursor-pointer px-4"
            >
              <GoPlus />
              <span className="text-sm font-light">Add a Phone Number</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="hori" />

      <div className="mt-10">
        <Table columns={columns} Tdata={filteredData} statusType={""} />
      </div>
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
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhoneAccount;
