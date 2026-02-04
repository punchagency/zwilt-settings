"use client";

import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Chevron from "@/assests/icons/chevron.svg";
import Close from "@/assests/icons/close.svg";
import Verdi from "@/assests/images/admin-user-one.png";
import { UpdatePhoneAccountRecord } from "@/graphql/mutations/phoneAccount";
import { useMutation } from "@apollo/react-hooks";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { CityOption } from "./AddPhoneModal";
import CustomSelect from "./custom-select";
import ProfileAvatar from "../profileAvatar/ProfileAvatar";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  city: CityOption;
  orgMembers: any[];
  assignedNumbers?: any[];
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  // hidden: { opacity: 0, y: "-100vh" },
  // visible: { opacity: 1, y: "0" },
};

const EditModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  city,
  orgMembers,
  refetch,
  assignedNumbers,
}) => {
 
  // const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    profile_img: string;
  } | null>(null);
  
  const [currentValue, setCurrentValue] = useState("");
  const [selectedMember, setSelectedMember] = useState("Select an option");
  const [selectedMemberDropdown, setSelectedMemberDropdown] = useState(false);
  const [selectedRoleDropdown, setSelectedRoleDropdown] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const [updatePhoneAccountRecord, { loading }] = useMutation(
    UpdatePhoneAccountRecord,
    {
      onCompleted: async (data) => {
        await refetch();
        onClose();
      },
    } 
  );

  const selectUserbuttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);


  useEffect(() => {
    const assignedNumber = assignedNumbers?.filter((number) => number.phoneNumber === city.msisdn);
    console.log(assignedNumber, "assignedNumber");
    setSelectedUser({
      id: assignedNumber?.[0]?.userId,
      name: assignedNumber?.[0]?.user?.name,
      profile_img: assignedNumber?.[0]?.user?.profile_img,
    });
  }, [assignedNumbers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectUserbuttonRef.current &&
        !selectUserbuttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedMemberDropdown(false);
        setRotated(false);
        setIsRotated(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectOptionStyle: React.CSSProperties = {
    color: selectedMember === "" ? "#363641" : "#282833",
  };

  const toggleUserDropdown = () => {
    setIsRotated(!isRotated);
    setSelectedMemberDropdown(!selectedMemberDropdown);
    if (selectedRoleDropdown) {
      setSelectedRoleDropdown(false);
      setRotated(false);
    }
  };

  // const handleUserSelect = (selectedOption: any) => {
  //   console.log("Selected Recruiter:", selectedOption, city);
  //   setSelectedUser(selectedOption.userId);
  // };

  const handleUserSelect = (member: any) => {
    setSelectedUser({
      id: member?.user?._id,
      name: member?.user?.name,
      profile_img:
        member?.user?.profile_img ??
        "https://zwilt.s3.amazonaws.com/42orqxXf_1695110728039650955aaef4301a49705a551.jpeg",
    });
    setSelectedMemberDropdown(false);
    setIsRotated(false);
  };

  return (
    <motion.div
      className="flex items-center justify-center fixed max-w-full w-[100vw] h-screen left-0 top-0 bg-[#28283333] z-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="flex flex-col items-center justify-center pt-[1.35vw] px-[1.09vw] pb-[1.04vw] absolute w-[32.29vw] h-[20.94vw] rounded-[1.56vw] bg-[#ffffff] z-10"
        style={modalStyle}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex items-center w-full justify-between">
          <h3 className="font-semibold text-[1.25vw] leading-[1.67vw] text-left text-[#282833]">
            Edit Information
          </h3>
          <a
            onClick={onClose}
            className="flex items-center justify-center p-0 gap-[0.21vw] isolate w-[2.08vw] h-[2.08vw] bg-[#ffffff] border-[0.04vw] border-solid border-[#e0e0e9] rounded-[0.63vw] cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue"
          >
            <Image
              src={Close}
              className="text-[#282833] w-[0.83vw] h-[0.83vw]"
              width={16}
              alt=""
            />
          </a>
        </div>

        <div className="mt-[1.56vw] flex flex-col w-full h-[15.31vw] relative">
          <form className=" flex flex-col gap-4 w-full h-[10.63vw] relative">
            {/* <AutoComplete
            defaultValue={currentValue}
            onValueChange={handleValueChange}
          /> */}
            <>
              <span className="font-semibold text-[0.93vw] leading-[1.25vw] text-[#282833] flex-none grow-0">
                Enter Area Code
              </span>
              <div className="w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-[1vw] text-[0.83vw] text-[#282833] border-[0.051226vw] border-solid border-[#e0e0e9] rounded-[0.78vw] flex-none grow-0 flex justify-between items-center">
                <span className="text-[0.93vw] font-normal text-[#282833">
                  {city.number}
                </span>
                <span className="text-[0.73vw] font-normal text-[#6F6F76]">
                  {city.city}
                </span>
              </div>
            </>
            <>
              <span className="font-semibold text-[0.93vw] leading-[1.25vw] text-[#282833] flex-none grow-0">
                Assigned to
              </span>

              <button
                type="button"
                ref={selectUserbuttonRef}
                onClick={toggleUserDropdown}
                className="outline-none w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-normal text-[0.83vw] text-[#282833] border-[0.983536px] border-solid border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer grow-0 relative"
              >
                <div
                  className="pointer-events-none text-center h-[2.55vw] flex items-center"
                  style={selectOptionStyle}
                >
                  <div className="flex items-center justify-start w-full">
                    {selectedUser ? (
                      <>
                        <ProfileAvatar name={selectedUser.name} imageUrl={selectedUser?.profile_img} size="1.60vw" />
                        <span className="ml-[0.26vw] text-[0.83vw] font-medium text-[#282833]">
                          {selectedUser.name}
                        </span>
                      </>
                    ) : (
                      "Select an option"
                    )}
                  </div>
                </div>
                <Image
                  className="cursor-pointer w-[0.83vw] h-[0.83vw] transition-transform duration-300"
                  width={16}
                  src={Chevron}
                  style={{
                    transform: isRotated ? "rotate(-180deg)" : "rotate(0deg)",
                  }}
                  alt=""
                />
              </button>

              {selectedMemberDropdown && (
                <ul
                  ref={dropdownRef}
                  className="relative top-[-4px] left-0 w-full flex flex-col items-center p-[0.52vw] gap-[0.52vw] max-h-[10vw] bg-[#ffffff] rounded-[0.78vw] font-normal text-[0.94vw] leading-[120%] flex-none grow-0 order-1 z-[1] overflow-y-auto scrollbar-gutter-stable z-[999]"
                  style={selectStyle}
                >
                  {orgMembers?.filter((member) => member.user).map((member) => (
                    <li
                      key={member.value}
                      onClick={() => handleUserSelect(member)}
                      className="w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] font-normal text-[#282833B2] text-start flex items-center text-[0.94vw] cursor-pointer hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue hover:w-full"
                    >
                      <ProfileAvatar name={member?.user?.name} imageUrl={member?.user?.profile_img} size="1.60vw" />
                      <span className="ml-[0.26vw] text-[0.83vw] font-medium text-[#282833]">
                        {member?.user?.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* <CustomSelect
              data={orgMembers}
              getOptionLabel={(recruiter: any) => recruiter.user.name}
              getOptionValue={(recruiter: any) => recruiter.user.name}
              getImageUrl={(recruiter: any) => recruiter?.user?.profile_img}
              onChange={handleUserSelect}
            />  */}
            </>
          </form>

          <div className="w-full mt-[2.08vw] space-x-[1.04vw] flex items-center justify-center">
            <span
              className="flex justify-center items-center p-[0.52vw_1.25vw] hover:border-[#B8B8CD] text-[#696970] text-[0.94vw] font-normal w-full h-[2.60vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue"
              onClick={onClose}
            >
              Cancel
            </span>
            <span
              onClick={() =>
                updatePhoneAccountRecord({
                  variables: {
                    input: {
                      phoneRecordId: city.phoneRecordId,
                      // newUserId: selectedUser,
                      newUserId: selectedUser?.id,
                    },
                  },
                })
              }
              className="flex justify-center items-center p-[0.52vw_1.25vw] w-full h-[2.60vw] bg-[#50589F] text-[#ffffff] text-[0.94vw] font-normal border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#42498B]"
            >
              Assign
              {/* {loading ? "Assigning..." : "Assign"} */}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditModal;

const modalStyle: React.CSSProperties = {
  boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
};

const selectStyle: React.CSSProperties = {
  boxShadow: "0px 0px 20px rgba(80, 88, 159, 0.1)",
  zIndex: 1,
};
