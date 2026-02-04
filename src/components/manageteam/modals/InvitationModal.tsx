import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client";
import { GET_INVITED_USERS } from "@/graphql/queries/manageTeam";
import { INVITE_USER } from "@/graphql/mutations/manageTeam";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";
import { toast } from "react-toastify";
import Close from "@/assests/icons/close.svg";
import Chevron from "@/assests/icons/chevron.svg";
import { memberRoles, memberType } from "./OrganizationRoles";

interface User {
  __typename: string;
  _id: string;
  user: {
    __typename: string;
    email: string;
    name?: string;
    profile_img: string;
    createdAt: null;

  };
  role: string;
  clientAccountType: string;
  profileStatus: string;
}
interface addTeamProps {
  setCurrentModal: React.Dispatch<React.SetStateAction<string | null>>;
  handleCloseModal: () => void;
  filteredInvitedUsers: User[];
}

interface InviteUserInput {
  email: string;
  role: string;
  clientAccountType: string;
}


const InvitationModal: React.FC<addTeamProps> = ({
  setCurrentModal,
  handleCloseModal,
  filteredInvitedUsers,
}) => {
  const [email, setEmail] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState("Select an option");
  const [selectedUserDropdown, setSelectedUserDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Select an option");
  const [selectedRoleDropdown, setSelectedRoleDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rotated, setRotated] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const { data, loading, error } = useQuery(GET_INVITED_USERS);

  const selectUserbuttonRef = useRef<HTMLButtonElement>(null);
  const roleButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectUserbuttonRef.current &&
        !selectUserbuttonRef.current.contains(event.target as Node) &&
        roleButtonRef.current &&
        !roleButtonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedRoleDropdown(false);
        setSelectedUserDropdown(false);
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
    color: selectedUser === "Select an option" ? "#9b9ba0" : "#282833",
  };

  const selectRoleOptionStyle: React.CSSProperties = {
    color: selectedRole === "Select an option" ? "#9b9ba0" : "#282833",
  };

  const user = data?.getInvitedUsers?.data.find(
    (member: any) => member?.user?.email === email
  );

  const [inviteUser] = useMutation(INVITE_USER, {
    update(cache, { data }) {
      try {
        const existingData = cache.readQuery<any>({
          query: GET_INVITED_USERS
        });
  
        const newInvitedUser = {
          __typename: "InvitedUser",
          _id: `temp-${Date.now()}`,
          user: {
            __typename: "User",
            email: email,
            name: email.split('@')[0],
            profile_img: null,
            createdAt: null
          },
          role: selectedRole,
          clientAccountType: selectedUser === "Admin User" ? "ADMIN" : "MEMBER",
          profileStatus: "pending"
        };
  
        // Match the query structure with success and data fields
        cache.writeQuery({
          query: GET_INVITED_USERS,
          data: {
            getInvitedUsers: {
              success: true,
              data: [...existingData?.getInvitedUsers?.data || [], newInvitedUser]
            }
          }
        });
      } catch (error) {
        console.error('Cache update error:', error);
      }
    },
    onCompleted: () => {
      notifySuccessFxn("Invitation sent successfully!");
      setCurrentModal(null);
    },
    onError: (error) => {
      notifyErrorFxn(error.message || "Failed to send invitation");
    },
    refetchQueries: [{ query: GET_INVITED_USERS }]
  });

  const handleSendInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedUser === "Select an option" || selectedRole === "Select an option") {
      notifyErrorFxn("Please select both user type and role");
      return;
    }
    if (filteredInvitedUsers.some((user) => user.user.email === email)) {
      notifyErrorFxn("User already invited");
      setCurrentModal(null);
      return;
    }

    try {
      await inviteUser({
        variables: { 
          input: {
            email,
            role: selectedRole,
            clientAccountType: selectedUser === "Admin User" ? "ADMIN" : "MEMBER"
          }
        }
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  const toggleUserDropdown = () => {
    setIsRotated(!isRotated);
    setSelectedUserDropdown(!selectedUserDropdown);
    if (selectedRoleDropdown) {
      setSelectedRoleDropdown(false);
      setRotated(false);
    }
  };

  const toggleRoleDropdown = () => {
    setRotated(!rotated);
    setSelectedRoleDropdown(!selectedRoleDropdown);
    if (selectedUserDropdown) {
      setSelectedUserDropdown(false);
      setIsRotated(false);
    }
  };

  const handleOptionClick = (option: React.SetStateAction<string>) => {
    setSelectedUser(option);
    setSelectedUserDropdown(false);
    setIsRotated(false);
  };

  const handleRoleClick = (option: React.SetStateAction<string>) => {
    setSelectedRole(option);
    setSelectedRoleDropdown(false);
    setRotated(false);
  };

  // Handle click outside the modal
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <section
      className="flex items-center justify-center fixed max-w-full w-[100vw] h-screen left-0 top-0 bg-[#28283333] z-50"
      // onClick={handleContainerClick}
    >
      <div
        className="p-[1.35vw_1.09vw_1.15vw_1.09vw] absolute w-[32.29vw] min-h-[25.99vw] rounded-[1.56vw] bg-[#ffffff] z-10"
        style={modalStyle}
      >
        <div className="flex items-center w-full justify-between">
          <h3 className="font-normal font-semibold text-[1.25vw] leading-[1.67vw] text-left text-[#282833]">
            Invite User
          </h3>

          <a
            onClick={handleCloseModal}
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

        <form
          className="flex flex-col items-center justify-center w-full mt-[1.56vw] relative"
          onSubmit={handleSendInvite}
        >
          <legend className="flex flex-col items-start justify-center w-full h-[15.68vw] relative">
            <div className="flex flex-col items-start justify-center space-y-[0.73vw] w-full">
              <label
                htmlFor="name"
                className="p-[0vw_0.26vw] text-[0.94vw] flex-none grow-0"
              >
                <span className="font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833] flex-none grow-0">
                  Email
                </span>
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[2.55vw] p-[0.51225vw_0.768vw] text-[0.83vw] font-normal leading-[1vw] text-[#282833] border-[0.983536px] border-solid border-[#e0e0e9] rounded-[0.78vw] flex-none grow-0 focus:outline-none placeholder:text-[#9b9ba0]"
                placeholder="Enter email here"
                required
              />
            </div>

            <div className="flex flex-col items-start justify-center mt-[1.04vw] space-y-[0.73vw] w-full relative">
              <label
                htmlFor="name"
                className="p-[0vw_0.26vw] text-[0.94vw] flex-none grow-0"
              >
                <span className="font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833] flex-none grow-0">
                  Select User
                </span>
              </label>

              <button
                type="button"
                ref={selectUserbuttonRef}
                onClick={toggleUserDropdown}
                className="outline-none w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-normal text-[0.83vw] text-[#282833] border-[0.051226vw] border-solid border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer grow-0 relative"
              >
                <span
                  className="pointer-events-none text-center flex items-center text-[#9b9ba0]"
                  style={selectOptionStyle}
                >
                  {selectedUser}
                </span>

                <Image
                  className="cursor-pointer w-[0.83vw] h-[0.83vw] h-[0.42vw] transition-transform duration-300"
                  width={16}
                  src={Chevron}
                  style={{
                    transform: isRotated ? "rotate(-180deg)" : "rotate(0deg)",
                  }}
                  alt=""
                />
              </button>

              {selectedUserDropdown && (
                <ul
                  ref={dropdownRef}
                  className="absolute top-full left-0 w-full flex flex-col items-center justify-center p-[0.52vw] gap-[0.52vw] max-h-[6.145vw] h-fit bg-[#ffffff] rounded-[0.78vw] font-normal text-[0.94vw] leading-[120%] flex-none grow-0 order-1 z-[1]"
                  style={selectStyle}
                >
                  {memberType.map((member) => (
                    <li
                      key={member.value}
                      onClick={() => handleOptionClick(member.value)}
                      className="w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] font-normal text-[#696970] text-start flex items-center text-[0.94vw] cursor-pointer hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue"
                    >
                      {member.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col items-start justify-center mt-[1.04vw] space-y-[0.73vw] w-full relative">
              <label
                htmlFor="name"
                className="p-[0vw_0.26vw] text-[0.94vw] flex-none grow-0"
              >
                <span className="font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833] flex-none grow-0">
                  Team Role
                </span>
              </label>

              <button
                type="button"
                ref={roleButtonRef}
                onClick={toggleRoleDropdown}
                className="outline-none w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-normal text-[0.83vw] text-[#282833] border-[0.051226vw] border-solid border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer grow-0 relative"
              >
                <span
                  className="pointer-events-none text-center flex items-center text-[#363641]"
                  style={selectRoleOptionStyle}
                >
                  {selectedRole}
                </span>

                <Image
                  className="cursor-pointer w-[0.83vw] h-[0.83vw] h-[0.42vw] transition-transform duration-300"
                  width={16}
                  src={Chevron}
                  style={{
                    transform: rotated ? "rotate(-180deg)" : "rotate(0deg)",
                  }}
                  alt=""
                />
              </button>

              {selectedRoleDropdown && (
                <ul
                  ref={dropdownRef}
                  className="absolute top-full left-0 w-full flex flex-col items-center p-[0.52vw] gap-[0.52vw] max-h-[6.145vw] max-h-[10vw] bg-[#ffffff] rounded-[0.78vw] font-normal text-[0.94vw] leading-[120%] flex-none grow-0 order-1 z-[1] overflow-y-auto scrollbar-gutter-stable"
                  style={selectStyle}
                >
                  {memberRoles.map((role) => (
                    <li
                      key={role.value}
                      onClick={() => handleRoleClick(role.value)}
                      className="w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] font-normal text-[#696970] text-start flex items-center text-[0.94vw] cursor-pointer hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue hover:w-full"
                    >
                      {role.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </legend>

          <div className="w-full mt-[2.08vw] space-x-[1.04vw] flex items-center justify-center">
            <button
              onClick={handleCloseModal}
              className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#696970] text-[0.94vw] font-normal w-full h-[2.60vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex justify-center items-center p-[0.52vw_1.25vw] w-full h-[2.60vw] bg-[#50589F] text-[#ffffff] text-[0.94vw] font-normal border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#42498B]"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InvitationModal;

const modalStyle: React.CSSProperties = {
  boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
};

const selectStyle: React.CSSProperties = {
  boxShadow: "0px 0px 20px rgba(80, 88, 159, 0.1)",
  zIndex: 1,
};
