import React, { useEffect, useState } from "react";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Checkbox from "./CheckedBox";
import { OrganizationMember, User } from "./user.interface";
import DeleteIcon from "./DeleteIcon";
import EditIcon from "./EditIcon";
import { notifyErrorFxn } from "utils/toast-fxn";
import ProfileAvatar from "@/components/profileAvatar/ProfileAvatar";

export interface TableBodyProps {
  user: {
    _id: string;
    name: string;
    email: string;
    profile_img?: string;
    lastActive?: string;
  };
  role: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  isFirstItem: boolean;
  deleteSingleTeamMember: (user: OrganizationMember["user"]) => void;
  onUpdateUser: (user: User, role: string) => void;
  isAdmin?: boolean;
}

const TableBody: React.FC<TableBodyProps> = ({
  user,
  role,
  isChecked,
  onChange,
  isFirstItem,
  deleteSingleTeamMember,
  onUpdateUser,
  isAdmin,
}) => {
  
  // Determine padding class
  const paddingClass = isFirstItem ? "pt-[0.95vw]" : "pt-[0.75vw]";

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format the lastActive date
  const datePart = new Date(user?.lastActive || new Date()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.map((part) => part[0]).join("").toUpperCase();
  };

  return (
  
      <tr className='w-full'>
        {/* className="pt-[1.04vw]" */}
        <td className={paddingClass}>
          <div className='flex items-center'>
            <Checkbox
              id={`user-${user._id}`}
              checked={isChecked}
              onChange={handleCheckboxChange}
              disabled={!isAdmin}
            />
            <div className='flex items-center ml-[0.78vw]'>
              <div className="flex-shrink-0">
                <ProfileAvatar 
                  name={user.name} 
                  imageUrl={user.profile_img} 
                  size="2.60vw" 
                />
              </div>
              <div className='flex flex-col items-start justify-center p-0 pl-[0.52vw] py-[0.42vw] w-full leading-normal'>
                <h3 className='text-[0.83vw] font-semibold text-left text-very-dark-grayish-blue'>
                  {user.name}
                </h3>
                <p className='text-[0.83vw] font-normal text-left text-grayish-blue'>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </td>
        {/* pt-[1.04vw] */}
        <td
          className={`text-[0.83vw] font-medium leading-[1vw] text-center text-very-dark-grayish-blue ${paddingClass}`}
        >
          {capitalizeFirstLetter(role)}
        </td>
        {/* pt-[1.04vw] */}
        <td
          className={`text-[0.83vw] font-medium leading-[1vw] text-center text-very-dark-grayish-blue ${paddingClass}`}
        >
          {datePart}
        </td>
        {/* pt-[1.04vw] */}
        <td className={`text-[0.83vw] ${paddingClass}`}>
          <div className='flex items-center justify-start space-x-[1.04vw]'>
            <BootstrapTooltip title='Delete' placement='top'>
              <button
                type='button'
                className={`outline-none border-0 ${isAdmin ? 'cursor-pointer' : 'cursor-no-drop opacity-30'}`}
                onClick={() => {
                  if (isAdmin) {
                    deleteSingleTeamMember(user);
                  } else {
                    notifyErrorFxn("Only Admins can delete");
                  }
                }}
              >
                <DeleteIcon />
              </button>
            </BootstrapTooltip>

            <BootstrapTooltip title='Edit' placement='top'>
              <button
                type='button'
                className={`outline-none border-0 ${isAdmin ? 'cursor-pointer' : 'cursor-no-drop opacity-30'}`}
                onClick={() => {
                  if (isAdmin) {
                    onUpdateUser(user, role);
                  } else {
                    notifyErrorFxn("Only Admins can edit");
                  }
                }}
              >
                <EditIcon />
              </button>
            </BootstrapTooltip>
          </div>
        </td>
      </tr>
    
  );
};

export default TableBody;

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