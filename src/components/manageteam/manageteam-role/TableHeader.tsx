import React from "react";
import Checkbox from "./CheckedBox";
import useUser from "utils/recoil_store/hooks/use-user-state";

interface TableHeaderProps {
  columns: string[];
  selectAllId: string;
  selectAllChecked: boolean;
  onSelectAllChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedUserCount: number;
  showDeleteModal: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  selectAllId,
  selectAllChecked,
  onSelectAllChange,
  selectedUserCount,
  showDeleteModal,
}) => {
  const { userState } = useUser();
  const isAdmin = userState?.currentUser?.clientAccountType === "ADMIN";

  return (
    <thead className="w-full relative">
      <tr className="w-full relative border-b w-full border-[#e0e0e9]">
        <th className="pb-[1.35vw] w-6/12 w-[48%]">
          <div className="flex items-center">
            <Checkbox
              id={selectAllId}
              checked={selectAllChecked}
              onChange={onSelectAllChange}
              disabled={!isAdmin}
            />
            <div className="text-[0.94vw] font-semibold leading-[1.13vw] text-center ml-[0.52vw] text-very-dark-grayish-blue">
              {columns[0]}
            </div>

            <div className="ml-[0.52vw] w-[4.53vw] h-[2.08vw] flex items-center justify-center">
              {isAdmin && selectedUserCount > 1 && (
                <span
                  onClick={showDeleteModal}
                  className="flex items-center justify-center w-full h-full text-center p-[0.52vw] bg-[#fee4e2] border border-solid border-[#fecdca] rounded-[0.78vw] text-[0.83vw] font-medium text-[#f97066] cursor-pointer hover:bg-[#fecdca] hover:border-[#fda29b] hover:text-[#f04438]"
                >
                  Delete
                </span>
              )}
            </div>
          </div>
        </th>
        {columns.slice(1).map((column, index) => (
          <th
            key={index}
            className="text-[0.94vw] pb-[1.35vw] font-semibold leading-[1.12vw] text-center text-very-dark-grayish-blue w-1/5"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
