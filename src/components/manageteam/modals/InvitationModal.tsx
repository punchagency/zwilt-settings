import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client";
import { GET_INVITED_USERS, GET_ORG_BILLING_PREVIEW } from "@/graphql/queries/manageTeam";
import { INVITE_USER } from "@/graphql/mutations/manageTeam";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";
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

const APP_OPTIONS = [
  { id: "recruitment", label: "Recruitment" },
  { id: "tracker", label: "Tracker" },
];

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
  const [appAccess, setAppAccess] = useState<string[]>([]);
  const [rotated, setRotated] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const { data } = useQuery(GET_INVITED_USERS);
  const { data: billingData } = useQuery(GET_ORG_BILLING_PREVIEW);
  const currentSeats: number = billingData?.getOrgBillingPreview?.data?.seats ?? 0;
  const [billingConfirm, setBillingConfirm] = useState(false);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOptionStyle: React.CSSProperties = {
    color: selectedUser === "Select an option" ? "#9b9ba0" : "#282833",
  };

  const selectRoleOptionStyle: React.CSSProperties = {
    color: selectedRole === "Select an option" ? "#9b9ba0" : "#282833",
  };

  const [inviteUser] = useMutation(INVITE_USER, {
    update(cache, _) {
      try {
        const existingData = cache.readQuery<any>({ query: GET_INVITED_USERS });
        const newInvitedUser = {
          __typename: "InvitedUser",
          _id: `temp-${Date.now()}`,
          user: {
            __typename: "User",
            email,
            name: email.split("@")[0],
            profile_img: null,
            createdAt: null,
          },
          role: selectedRole,
          clientAccountType: selectedUser === "Admin User" ? "ADMIN" : "MEMBER",
          profileStatus: "pending",
          appAccess,
          isBilledSeat: true,
          seatStatus: "ACTIVE",
        };
        cache.writeQuery({
          query: GET_INVITED_USERS,
          data: {
            getInvitedUsers: {
              success: true,
              data: [...(existingData?.getInvitedUsers?.data || []), newInvitedUser],
            },
          },
        });
      } catch (err) {
        console.error("Cache update error:", err);
      }
    },
    onCompleted: () => {
      notifySuccessFxn("Invitation sent successfully!");
      setCurrentModal(null);
    },
    onError: (error) => {
      notifyErrorFxn(error.message || "Failed to send invitation");
    },
    refetchQueries: [{ query: GET_INVITED_USERS }, { query: GET_ORG_BILLING_PREVIEW }],
  });

  const toggleAppAccess = (appId: string) => {
    setAppAccess((prev) =>
      prev.includes(appId) ? prev.filter((a) => a !== appId) : [...prev, appId]
    );
  };

  const validateInviteForm = (): boolean => {
    if (
      selectedUser === "Select an option" ||
      selectedRole === "Select an option"
    ) {
      notifyErrorFxn("Please select both user type and role");
      return false;
    }
    if (appAccess.length === 0) {
      notifyErrorFxn("Please select at least one app");
      return false;
    }
    if (filteredInvitedUsers.some((user) => user.user.email === email)) {
      notifyErrorFxn("User already invited");
      setCurrentModal(null);
      return false;
    }
    return true;
  };

  const doInvite = async () => {
    try {
      await inviteUser({
        variables: {
          input: {
            email,
            role: selectedRole,
            clientAccountType: selectedUser === "Admin User" ? "ADMIN" : "MEMBER",
            appAccess,
          },
        },
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };

  const handleSendInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInviteForm()) return;
    if (selectedUser === "Admin User") {
      setBillingConfirm(true);
    } else {
      doInvite();
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

  return (
    <section className="flex items-center justify-center fixed max-w-full w-[100vw] h-screen left-0 top-0 bg-[#28283333] z-50">
      <div
        className="p-[1.35vw_1.09vw_1.15vw_1.09vw] absolute w-[32.29vw] rounded-[1.56vw] bg-[#ffffff] z-10"
        style={modalStyle}
      >
        <div className="flex items-center w-full justify-between">
          <h3 className="font-semibold text-[1.25vw] leading-[1.67vw] text-[#282833]">
            {billingConfirm ? "Billing Impact" : "Invite User"}
          </h3>
          <a
            onClick={handleCloseModal}
            className="flex items-center justify-center p-0 gap-[0.21vw] isolate w-[2.08vw] h-[2.08vw] bg-[#ffffff] border-[0.04vw] border-solid border-[#e0e0e9] rounded-[0.63vw] cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd]"
          >
            <Image src={Close} className="w-[0.83vw] h-[0.83vw]" width={16} alt="" />
          </a>
        </div>

        {billingConfirm ? (
          <div className="flex flex-col w-full mt-[2.08vw] space-y-[1.04vw]">
            <p className="text-[0.83vw] text-[#6F6F76]">
              Inviting <span className="font-semibold text-[#282833]">{email}</span> as an Admin User will add 1 billed seat.
            </p>
            <div className="w-full border border-[#e0e0e9] rounded-[0.78vw] overflow-hidden">
              <div className="flex items-center justify-between px-[1.04vw] py-[0.78vw] border-b border-[#e0e0e9] bg-[#f4f4fa]">
                <span className="text-[0.78vw] text-[#6F6F76]">Current</span>
                <span className="text-[0.83vw] font-medium text-[#282833]">
                  {currentSeats} seat{currentSeats !== 1 ? "s" : ""} — ${(currentSeats * 99.99).toFixed(2)}/mo
                </span>
              </div>
              <div className="flex items-center justify-between px-[1.04vw] py-[0.78vw]">
                <span className="text-[0.78vw] text-[#6F6F76]">After inviting</span>
                <span className="text-[0.83vw] font-semibold text-[#50589F]">
                  {currentSeats + 1} seat{currentSeats + 1 !== 1 ? "s" : ""} — ${((currentSeats + 1) * 99.99).toFixed(2)}/mo
                </span>
              </div>
            </div>
            <p className="text-[0.73vw] text-[#98A2B3]">
              Billing will apply when payments are enabled.
            </p>
            <div className="w-full mt-[1.04vw] space-x-[1.04vw] flex items-center justify-center">
              <button
                type="button"
                onClick={() => setBillingConfirm(false)}
                className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#696970] text-[0.94vw] w-full h-[2.60vw] bg-[#ffffff] border border-[#e0e0e9] rounded-[0.78vw] cursor-pointer outline-none hover:bg-[#f4f4fa]"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={doInvite}
                className="flex justify-center items-center p-[0.52vw_1.25vw] w-full h-[2.60vw] bg-[#50589F] text-[#ffffff] text-[0.94vw] border border-[#e0e0e9] rounded-[0.78vw] cursor-pointer outline-none hover:bg-[#42498B]"
              >
                Confirm & Invite
              </button>
            </div>
          </div>
        ) : (

        <form
          className="flex flex-col items-center justify-center w-full mt-[1.56vw] relative"
          onSubmit={handleSendInvite}
        >
          <div className="flex flex-col w-full space-y-[1.04vw]">
            {/* Email */}
            <div className="flex flex-col space-y-[0.73vw]">
              <label className="p-[0vw_0.26vw]">
                <span className="font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833]">
                  Email
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[2.55vw] p-[0.51vw_0.77vw] text-[0.83vw] text-[#282833] border border-[#e0e0e9] rounded-[0.78vw] focus:outline-none placeholder:text-[#9b9ba0]"
                placeholder="Enter email here"
                required
              />
            </div>

            {/* User Type */}
            <div className="flex flex-col space-y-[0.73vw] relative">
              <label className="p-[0vw_0.26vw]">
                <span className="font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833]">
                  Select User
                </span>
              </label>
              <button
                type="button"
                ref={selectUserbuttonRef}
                onClick={toggleUserDropdown}
                className="outline-none w-full h-[2.55vw] p-[0.51vw_0.77vw] text-[0.83vw] text-[#282833] border border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer"
              >
                <span style={selectOptionStyle}>{selectedUser}</span>
                <Image
                  className="w-[0.83vw] h-[0.83vw] transition-transform duration-300"
                  width={16}
                  src={Chevron}
                  style={{ transform: isRotated ? "rotate(-180deg)" : "rotate(0deg)" }}
                  alt=""
                />
              </button>
              {selectedUserDropdown && (
                <ul
                  ref={dropdownRef}
                  className="absolute top-full left-0 w-full flex flex-col p-[0.52vw] gap-[0.52vw] bg-[#ffffff] rounded-[0.78vw] text-[0.94vw] z-10"
                  style={selectStyle}
                >
                  {memberType.map((member) => (
                    <li
                      key={member.value}
                      onClick={() => handleOptionClick(member.value)}
                      className="w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] text-[#696970] flex items-center cursor-pointer hover:bg-[#f4f4fa]"
                    >
                      {member.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col space-y-[0.73vw] relative">
              <label className="p-[0vw_0.26vw]">
                <span className="font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833]">
                  Team Role
                </span>
              </label>
              <button
                type="button"
                ref={roleButtonRef}
                onClick={toggleRoleDropdown}
                className="outline-none w-full h-[2.55vw] p-[0.51vw_0.77vw] text-[0.83vw] text-[#282833] border border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer"
              >
                <span style={selectRoleOptionStyle}>{selectedRole}</span>
                <Image
                  className="w-[0.83vw] h-[0.83vw] transition-transform duration-300"
                  width={16}
                  src={Chevron}
                  style={{ transform: rotated ? "rotate(-180deg)" : "rotate(0deg)" }}
                  alt=""
                />
              </button>
              {selectedRoleDropdown && (
                <ul
                  ref={dropdownRef}
                  className="absolute top-full left-0 w-full flex flex-col p-[0.52vw] gap-[0.52vw] max-h-[10vw] bg-[#ffffff] rounded-[0.78vw] text-[0.94vw] z-10 overflow-y-auto"
                  style={selectStyle}
                >
                  {memberRoles.map((role) => (
                    <li
                      key={role.value}
                      onClick={() => handleRoleClick(role.value)}
                      className="w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] text-[#696970] flex items-center cursor-pointer hover:bg-[#f4f4fa]"
                    >
                      {role.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* App Access */}
            <div className="flex flex-col space-y-[0.73vw]">
              <label className="p-[0vw_0.26vw]">
                <span className="font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833]">
                  App Access
                </span>
                <span className="ml-[0.4vw] text-[0.78vw] text-[#9b9ba0]">
                  $99.99/seat/month
                </span>
              </label>
              <div className="flex items-center gap-[1.04vw]">
                {APP_OPTIONS.map((app) => (
                  <label
                    key={app.id}
                    className="flex items-center gap-[0.42vw] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={appAccess.includes(app.id)}
                      onChange={() => toggleAppAccess(app.id)}
                      className="w-[0.94vw] h-[0.94vw] accent-[#50589F] cursor-pointer"
                    />
                    <span className="text-[0.83vw] text-[#282833]">{app.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full mt-[2.08vw] space-x-[1.04vw] flex items-center justify-center">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#696970] text-[0.94vw] w-full h-[2.60vw] bg-[#ffffff] border border-[#e0e0e9] rounded-[0.78vw] cursor-pointer outline-none hover:bg-[#f4f4fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex justify-center items-center p-[0.52vw_1.25vw] w-full h-[2.60vw] bg-[#50589F] text-[#ffffff] text-[0.94vw] border border-[#e0e0e9] rounded-[0.78vw] cursor-pointer outline-none hover:bg-[#42498B]"
            >
              Invite
            </button>
          </div>
        </form>
        )}
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
};
