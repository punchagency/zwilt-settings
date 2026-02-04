// import DeleteIcon from "@/assests/icons/DeleteIcon";
import Pen from "@/assests/icons/Pen";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { Recruiter, formatPhoneNumber } from "../../../utils";

import { getCityByAreaCode } from "@/config/areaCodeToCity";
import { DeletePhoneRecord } from "@/graphql/mutations/phoneAccount";
import { useEdit } from "@/store/phone-account-store";
import { useMutation } from "@apollo/react-hooks";
import { selectedCityVar, shouldRefetchVar } from "./state";
import CustomTooltip from "@/components/global/CustomTooltip";
import DeleteIcon from "../manageteam/manageteam-role/DeleteIcon";
import EditIcon from "../manageteam/manageteam-role/EditIcon";
import { useAdminStatus } from "utils/recoil_store/hooks/use-admin-status";
import { notifyErrorFxn } from "utils/toast-fxn";
import { useState } from "react";
import DeletePhoneModal from "../manageteam/modals/DeletePhoneModal";
import ProfileAvatar from "../profileAvatar/ProfileAvatar";

const columnHelper = createColumnHelper<Recruiter>();

export const columns = [
  columnHelper.accessor((row) => row, {
    id: "assignTo",
    cell: (info) => {
      const user = info.cell.row.original.user;
      return (
        <div className="flex items-center gap-[0.52vw]">
          <ProfileAvatar
            name={info.cell.row.original.user.name}
            imageUrl={info.cell.row.original.user?.profile_img}
            size="2.60vw"
          />
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-[0.83vw] font-semibold text-left text-[#282833] leading-[1vw]">
              {info.cell.row.original.user.name}
            </h3>

            <p className="text-[0.74vw] font-normal leading-[1vw] text-left text-[#6F6F76] mt-[0.26vw]">
              {/* {info.cell.row.original.job} */}
              Recruiter
            </p>
          </div>
        </div>
      );
    },
    header: () => (
      <span>
        <span style={{ textTransform: "capitalize" }}>Assign</span>{" "}
        <span style={{ textTransform: "lowercase" }}>to</span>
      </span>
    ),
  }),
  columnHelper.accessor((row) => row.phoneNumber, {
    id: "phoneNumber",
    cell: (info) => (
      <div className="flex flex-col items-center justify-start w-full">
        <div className="flex flex-col items-center justify-start tex-left">
          <span className="whitespace-nowrap capitalize text-[0.83vw] text-left font-medium text-[#282833] w-full">
            {formatPhoneNumber(info.cell.row.original.phoneNumber)?.number}
          </span>
          <span className="whitespace-nowrap capitalize block text-[0.73vw] text-[#6F6F76] text-left font-normal mt-[0.26vw] w-full">
            {getCityByAreaCode(
              formatPhoneNumber(info.cell.row.original.phoneNumber)?.areaCode ||
                ""
            )}
          </span>
        </div>
      </div>
    ),
    header: () => <span>Phone Number</span>,
  }),

  columnHelper.accessor((row) => row, {
    id: "date",
    cell: (info) => (
      <span className="whitespace-nowrap text-[#282833] text-[0.83vw] font-medium">
        {format(new Date(info.cell.row.original.createdAt), "PP")}
      </span>
    ),
    header: () => <span>Date Assign</span>,
  }),

  columnHelper.accessor((row) => row, {
    id: "status",
    cell: (info) => statusColor(info.cell.row.original.status),
    header: () => <span>Status</span>,
  }),

  columnHelper.accessor((row) => row, {
    id: " ",
    cell: (info) => <ActionsCell row={info.cell.row.original} />,
    // header: () => <span>Actions</span>,
  }),
];

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return (
        <div className="inline-flex items-center justify-center gap-[0.26vw] rounded-[2.6vw] border border-[#ABEFC6] bg-[#DCFAE6] px-[0.78vw] py-[0.52vw] text-[0.83vw] text-[#17B26A] w-auto h-[1.56vw]">
          <span className="h-[0.42vw] w-[0.42vw] rounded-full bg-[#17B26A]"></span>
          <span className="text-[0.83vw] font-normal">Active</span>
        </div>
      );
    case "Inactive":
      return (
        <div className="inline-flex items-center justify-center py-[0.52vw] px-[0.78vw] gap-[0.52vw] bg-[#F2F4F7] border border-[#D0D5DD] rounded-full tex-[0.83v] text-[#98A2B3] w-[4.63vw] w-auto h-[1.56vw]">
          Inactive
        </div>
      );
    default:
      return;
  }
};

const ActionsCell = ({ row }: any) => {
  const setShowEdit = useEdit((state) => state.setShowEdit);
  const { isAdmin } = useAdminStatus();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const areaCode =
    formatPhoneNumber(row.phoneNumber)?.areaCode || ("" as string);
  const city = getCityByAreaCode(areaCode);

  const [deletePhoneRecord] = useMutation(DeletePhoneRecord, {
    onCompleted: () => {
      shouldRefetchVar(true);
      setShowDeleteModal(false);
    },
  });

  const handleDelete = () => {
    deletePhoneRecord({
      variables: { phoneRecordId: row._id },
    });
  };
  return (
    <>
      <div className="flex items-center justify-end gap-[1.56vw]">
        {isAdmin ? (
          <>
            <BootstrapTooltip title="Delete" placement="top">
              <button
                type="button"
                className="cursor-pointer outline-none border-0"
                onClick={() => setShowDeleteModal(true)}
              >
                <DeleteIcon />
              </button>
            </BootstrapTooltip>

            <BootstrapTooltip title="Edit" placement="top">
              <button
                type="button"
                className="cursor-pointer outline-none border-0"
                onClick={() => {
                  setShowEdit(true);
                  selectedCityVar({
                    phoneRecordId: row._id,
                    city,
                    number: formatPhoneNumber(row.phoneNumber)
                      ?.number as string,
                    msisdn: row.phoneNumber,
                  });
                }}
              >
                <EditIcon />
              </button>
            </BootstrapTooltip>
          </>
        ) : (
          <>
            <button
              type="button"
              className="cursor-no-drop outline-none border-0 opacity-30"
              onClick={() => notifyErrorFxn("Only Admins can delete")}
            >
              <DeleteIcon />
            </button>
            <button
              type="button"
              className="cursor-no-drop outline-none border-0 opacity-30"
              onClick={() => notifyErrorFxn("Only Admins can edit")}
            >
              <EditIcon />
            </button>
          </>
        )}
      </div>
      {showDeleteModal && (
        <DeletePhoneModal
          phoneNumber={formatPhoneNumber(row.phoneNumber)?.number as string}
          onDeletePhone={handleDelete}
          handleCloseModal={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};
export default ActionsCell;

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#282833",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#282833",
  },
}));
