import Image from "next/image";
import Chevron from "@/assests/icons/chevron.svg";
import { AssignPhoneNumber } from "@/graphql/mutations/phoneAccount";
import { useMutation, useReactiveVar } from "@apollo/react-hooks";
import { motion } from "framer-motion";
import { FC, useEffect, useRef, useState } from "react";
import { CityOption } from "./AddPhoneModal";
import { selectedCityVar } from "./state";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  city: CityOption | null;
  orgMembers: any[];
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  // hidden: { opacity: 0, y: "-100vh" },
  // visible: { opacity: 1, y: "0" },
};

const AssignModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  city,
  orgMembers,
  refetch,
}) => {
  const selectedCity = useReactiveVar(selectedCityVar);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    profile_img: string;
  } | null>(null);
  const [selectedMember, setSelectedMember] = useState("Select an option");
  const [selectedMemberDropdown, setSelectedMemberDropdown] = useState(false);
  const [selectedRoleDropdown, setSelectedRoleDropdown] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const selectUserbuttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectUserbuttonRef.current &&
        !selectUserbuttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedMemberDropdown(false);
        setIsRotated(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectOptionStyle: React.CSSProperties = {
    color: selectedMember === "Select an option" ? "#696970" : "#282833",
  };

  const toggleUserDropdown = () => {
    setIsRotated(!isRotated);
    setSelectedMemberDropdown(!selectedMemberDropdown);
    if (selectedRoleDropdown) {
      setSelectedRoleDropdown(false);
      setRotated(false);
    }
  };

  const [assignPhoneNumber, { loading, error }] = useMutation(
    AssignPhoneNumber,
    {
      onCompleted: async (data) => {
        await refetch();
        onClose();
      },
      onError: (error) => {
        console.error("Error assigning phone number:", error);
      },
    }
  );

  if (!isOpen || !city) return null;

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
        className="flex flex-col items-center justify-center p-[1.35vw_1.09vw_1.15vw_1.09vw] absolute w-[26.98vw] h-fit h-[16.35vw] rounded-[1.56vw] bg-[#ffffff] z-10"
        style={modalStyle}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="w-full flex flex-col items-start justify-center">
          <h2 className="text-[1.25vw] font-semibold text-[#282833] mb-[0.78vw] mb-[0.94vw]">
            Assign This Number
          </h2>

          <div className="flex flex-col items-start justify-center text-left opacity-[70%} gap-[0.26vw] text-[#696970]">
            <p className="text-[#696970] text-[0.94vw] font-normal">
              {city.number}
            </p>
            <p className="text-[#696970] text-[0.83vw] font-normal text-left">
              {city.city}
            </p>
          </div>
        </div>

        <div className="mt-[1.59vw] w-full relative">
          <button
            type="button"
            ref={selectUserbuttonRef}
            onClick={toggleUserDropdown}
            className="outline-none w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-normal text-[0.83vw] text-[#282833] border-[0.983536px] border-solid border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer grow-0 relative"
          >
            <div
              className="pointer-events-none text-center h-[2.55vw] flex items-center text-[##6F6F76]"
              style={selectOptionStyle}
            >
              <div className="flex items-center justify-start w-full">
                {selectedUser ? (
                  <>
                    <Image
                      className="w-[1.56vw] h-[1.56vw] rounded-full"
                      width={30}
                      height={30}
                      src={selectedUser.profile_img}
                      alt=""
                    />
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
              className="absolute top-12 left-0 w-full flex flex-col items-center p-[0.52vw] gap-[0.52vw] max-h-[10vw] bg-[#ffffff] rounded-[0.78vw] font-normal text-[0.94vw] leading-[120%] flex-none grow-0 order-1 z-[1] overflow-y-auto scrollbar-gutter-stable z-[999]"
              style={selectStyle}
            >
              {orgMembers?.map((member) => (
                <li
                  key={member.value}
                  onClick={() => handleUserSelect(member)}
                  className="w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] font-normal text-[#282833B2] text-start flex items-center text-[0.94vw] cursor-pointer hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue hover:w-full"
                >
                  <Image
                    className="w-[1.56vw] h-[1.56vw] rounded-full"
                    width={30}
                    height={30}
                    src={
                      member?.user?.profile_img &&
                      /\.(png|jpe?g)$/i.test(member?.user?.profile_img)
                        ? member?.user?.profile_img
                        : "https://zwilt.s3.amazonaws.com/42orqxXf_1695110728039650955aaef4301a49705a551.jpeg"
                    }
                    alt=""
                  />
                  <span className="ml-[0.26vw] text-[0.83vw] font-medium text-[#282833]">
                    {member?.user?.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-[1.04vw] justify-between w-full mt-[2.08vw]">
          <span
            className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#696970] text-[0.94vw] font-normal w-full h-[2.60vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue"
            onClick={onClose}
          >
            Cancel
          </span>
          <span
            onClick={() =>
              assignPhoneNumber({
                variables: {
                  input: {
                    // userId: selectedUser,
                    userId: selectedUser?.id,
                    msisdn: selectedCity?.msisdn,
                    organizationId: "65e626aafeb174009ffcd74c",
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
      </motion.div>
    </motion.div>
  );
};

export default AssignModal;

const modalStyle: React.CSSProperties = {
  boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
};

const selectStyle: React.CSSProperties = {
  boxShadow: "0px 0px 20px rgba(80, 88, 159, 0.1)",
  zIndex: 1,
};
