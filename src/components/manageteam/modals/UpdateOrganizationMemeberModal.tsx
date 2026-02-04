import React, { useEffect, useRef, useState } from "react";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";
import { awsUpload } from "@/aws/awsUpload";
import useUser from "utils/recoil_store/hooks/use-user-state";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import Close from "@/assests/icons/close.svg";
import Chevron from "@/assests/icons/chevron.svg";
import Profile from "@/assests/images/img-placeholder.png";
import { GET_ORGANIZATION_MEMBERS } from "@/graphql/queries/manageTeam";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_MEMBER_PROFILE } from "@/graphql/mutations/manageTeam";
import { User } from "../manageteam-role/user.interface";
import { memberRoles, memberType } from "./OrganizationRoles";
import { CiSquareRemove } from "react-icons/ci";

interface addTeamProps {
  user: User;
  role: string;
  setCurrentModal: React.Dispatch<React.SetStateAction<string | null>>;
  handleCloseModal: () => void;
  setUserToEdit: React.Dispatch<
    React.SetStateAction<{
      user: User;
      role: string;
    } | null>
  >;
}

const UpdateOrganizationMemeberModal: React.FC<addTeamProps> = ({
  user,
  role,
  setCurrentModal,
  handleCloseModal,
  setUserToEdit,
}) => {
  // Function to split full name into first and last names
  const splitFullName = (fullName: string) => {
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    return { firstName, lastName };
  };

  // Extract first and last names from user name
  const { firstName: initialFirstName, lastName: initialLastName } =
    splitFullName(user.name);

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(user.email);
  const [selectedUser, setSelectedUser] = useState("Select an option");
  const [selectedUserDropdown, setSelectedUserDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role);
  const [selectedRoleDropdown, setSelectedRoleDropdown] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const { userState } = useUser();
  const [submitting, setIsSubmitting] = useState(false);
  const curruser = userState?.currentUser;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.profile_img ||
      "https://zwilt.s3.amazonaws.com/42orqxXf_1695110728039650955aaef4301a49705a551.jpeg"
  );
  const [imageError, setImageError] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_ORGANIZATION_MEMBERS);

  // Set selectedUser based on clientAccountType when the modal opens
  useEffect(() => {
    if (data) {
      const currentUser = data?.getOrganizationMembers?.data?.find(
        (member: any) => member?.user?._id === user._id
      );

      if (currentUser) {
        const accountType = currentUser.clientAccountType;
        setSelectedUser(
          accountType === "ADMIN" ? "Admin User" : "Account User"
        );
      }
    }
  }, [data, user._id]);

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

  const selectUserOptionStyle: React.CSSProperties = {
    color: selectedUser === "Select an option" ? "#9b9ba0" : "#282833",
  };

  const selectRoleOptionStyle: React.CSSProperties = {
    color: selectedRole === "Select an option" ? "#9b9ba0" : "#282833",
  };

  const [updateMemberProfile] = useMutation(UPDATE_MEMBER_PROFILE, {
    update(cache, { data: { updateMemberProfile } }) {
      try {
        const existingMembers: any = cache.readQuery({
          query: GET_ORGANIZATION_MEMBERS,
        });

        const newMembers = existingMembers.getOrganizationMembers.data.filter(
          (member: User) => member._id !== user._id
        );

        cache.writeQuery({
          query: GET_ORGANIZATION_MEMBERS,
          data: { getOrganizationMembers: { data: newMembers } },
        });

        setUserToEdit(null);
        setCurrentModal(null); // Close the modal
      } catch (error) {
        console.error("Error updating the cache:", error);
      }
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !selectedImage || !selectedRole) {
      notifyErrorFxn("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateMemberProfile({
        variables: {
          input: {
            userId: user._id,
            firstName,
            lastName,
            email,
            accountType: selectedUser === "Admin User" ? "ADMIN" : "MEMBER",
            profile_img: selectedImage,
            role: selectedRole,
          },
        },
      });

      notifySuccessFxn("Profile updated successfully!");

      //reset all fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setSelectedImage("");
      setSelectedRole("");

      setCurrentModal(null);
    } catch (error) {
      notifyErrorFxn(
        "An error occurred while updating the profile. Please try again."
      );
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      notifyErrorFxn("No file selected");
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setImageError("Invalid file type. Only jpg, jpeg, png are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("File size exceeds 2MB.");
      return;
    }

    try {
      const data = await awsUpload({
        file,
        fileName: file.name,
        dirName: `profile_images/`,
      });
      notifySuccessFxn("Image uploaded successfully!");
      setSelectedImage(data?.location); // Set the URL of the uploaded image
      setImageError(null); // Clear any previous error
    } catch (error) {
      notifyErrorFxn("Error uploading image!");
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null); // Reset the image to default
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
      className='flex items-center justify-center fixed max-w-full w-[100vw] h-screen left-0 top-0 bg-[#28283333] z-50'
      //  onClick={handleContainerClick}
    >
      <div
        className='flex flex-col items-center justify-center absolute w-[32.29vw] h-[41.56vw] rounded-[1.56vw] bg-[#ffffff] z-10'
        style={modalStyle}
      >
        <div className='w-full h-fit p-[1.35vw_1.09vw_1.15vw_1.09vw] pt-[1.35vw] px-[1.09vw] pb-[1.15vw]'>
          <div className='flex items-center w-full justify-between'>
            <h3 className='font-normal font-semibold text-[1.25vw] leading-[1.67vw] text-left text-[#282833]'>
              Update User Infromation
            </h3>
            <a
              onClick={handleCloseModal}
              className='flex items-center justify-center p-0 gap-[0.21vw] isolate w-[2.08vw] h-[2.08vw] bg-[#ffffff] border-[0.04vw] border-solid border-[#e0e0e9] rounded-[0.63vw] cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd]'
            >
              <Image
                src={Close}
                className='text-[#282833] w-[0.83vw] h-[0.83vw]'
                width={16}
                alt=''
              />
            </a>
          </div>

          <form
            className='flex flex-col items-center justify-center w-full mt-[2.19vw] relative'
            onSubmit={onSubmit}
          >
            <div className='flex flex-col items-center justify-center w-full max-h-[30.52vw]'>
              <div className='flex flex-col justify-center items-start w-full'>
                <div
                  className='w-[5.21vw] h-[5.21vw] rounded-full bg-cover bg-center relative cursor-pointer group'
                  style={{
                    backgroundImage: `url(${selectedImage || Profile.src})`,
                    backgroundPosition: "center center",
                    objectFit: "contain",
                  }}
                >
                  {selectedImage && (
                    <button
                      type='button'
                      onClick={handleImageRemove}
                      className='hidden w-[5.21vw] h-[5.21vw] group-hover:flex items-center justify-center text-[#2424d1b2] hover:border-[#b4b4c8] hover:bg-[#f4f4fa00] p-2 rounded-full cursor-pointer border-[#E0E0E9] border hover:text-[#282833] absolute inset-0'
                    >
                      <CiSquareRemove className='text-2xl' />
                    </button>
                  )}
                </div>

                <div className='flex items-center justify-start w-full mt-[1.04vw] space-x-[0.58vw] space-x-[0.32vw]'>
                  <a
                    onClick={handleUploadClick}
                    className='p-[0.52vw_1.04vw] text-[#282833B2] font-normal text-[0.83vw] leading-[1vw] w-[4.79vw] h-[2.08vw] mx-[0.25vw] bg-[#ffffff] border-[0.05vw] border-solid border-[#e0e0e9] rounded-[0.78vw] flex-none grow-0 outline-none capitalize cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue'
                  >
                    <span className='text-center text-[#696970] font-normal w-full'>
                      upload
                    </span>
                  </a>
                  <input
                    type='file'
                    accept='image/*'
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <span className='font-normal text-[0.73vw] leading-normal text-[#98A2B3]'>
                    Only use jpg, jpeg, png ({"<"} 2mb)
                  </span>
                </div>
                {imageError && (
                  <p className='text-red-500 text-[0.73vw] mt-2'>
                    {imageError}
                  </p>
                )}
              </div>

              <legend className='flex flex-col justify-center items-start w-full mt-[1.56vw] relative'>
                <div className='flex items-center space-x-[1.04vw] w-full'>
                  <div className='flex flex-col items-start justify-center space-y-[0.73vw] w-full'>
                    <label
                      htmlFor='name'
                      className='p-[0vw_0.26vw] text-[0.94vw] flex-none grow-0'
                    >
                      <span className='font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833] flex-none grow-0'>
                        First Name
                      </span>
                    </label>

                    <input
                      type='name'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className='w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-[1vw] text-[0.83vw] font-normal text-[#282833] border-[0.051226vw] border-solid border-[#e0e0e9] rounded-[0.78vw] flex-none grow-0 focus:outline-none placeholder:text-[#9b9ba0]'
                      placeholder='Enter first name'
                      required
                    />
                  </div>

                  <div className='flex flex-col items-start justify-center space-y-[0.73vw] w-full'>
                    <label
                      htmlFor='name'
                      className='p-[0vw_0.26vw] flex-none grow-0'
                    >
                      <span className='font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833] flex-none grow-0'>
                        Last Name
                      </span>
                    </label>

                    <input
                      type='name'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className='w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-[1vw] text-[0.83vw] font-normal text-[#282833] border-[0.051226vw] border-solid border-[#e0e0e9] rounded-[0.78vw] flex-none grow-0 focus:outline-none placeholder:text-[#9b9ba0]'
                      placeholder='Enter last name'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col items-start justify-center mt-[1.04vw] w-full'>
                  <div className='flex flex-col items-start justify-center space-y-[0.73vw] w-full'>
                    <label
                      htmlFor='name'
                      className='p-[0vw_0.26vw] text-[0.94vw] flex-none grow-0'
                    >
                      <span className='font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833] flex-none grow-0'>
                        Email
                      </span>
                    </label>

                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='w-full h-[2.55vw] p-[0.51225vw_0.768vw] text-[0.83vw] font-normal leading-[1vw] text-[#282833] border-[0.983536px] border-solid border-[#e0e0e9] rounded-[0.78vw] flex-none grow-0 focus:outline-none placeholder:text-[#9b9ba0]'
                      placeholder='Enter email here'
                      required
                    />
                  </div>
                  {/* Select User */}
                  <div className='flex flex-col items-start justify-center mt-[1.04vw] space-y-[0.73vw] w-full relative'>
                    <label
                      htmlFor='name'
                      className='p-[0vw_0.26vw] text-[0.94vw] flex-none grow-0'
                    >
                      <span className='font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833] flex-none grow-0'>
                        Select User
                      </span>
                    </label>

                    <button
                      type='button'
                      ref={selectUserbuttonRef}
                      onClick={toggleUserDropdown}
                      disabled={curruser.clientAccountType !== "ADMIN"}
                      className='outline-none w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-normal text-[0.83vw] text-[#282833] border-[0.051226vw] border-solid border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer grow-0 relative'
                    >
                      <span
                        className='pointer-events-none text-center flex items-center text-[#9b9ba0]'
                        style={selectUserOptionStyle}
                      >
                        {selectedUser}
                      </span>

                      <Image
                        className='cursor-pointer w-[0.83vw] h-[0.42vw] transition-transform duration-300'
                        width={16}
                        src={Chevron}
                        style={{
                          transform: isRotated
                            ? "rotate(-180deg)"
                            : "rotate(0deg)",
                        }}
                        alt=''
                      />
                    </button>

                    {selectedUserDropdown && (
                      <ul
                        ref={dropdownRef}
                        className='absolute top-full left-0 w-full flex flex-col items-center justify-center p-[0.52vw] gap-[0.52vw] max-h-[6.145vw] h-fit bg-[#ffffff] rounded-[0.78vw] font-normal text-[0.94vw] leading-[120%] flex-none grow-0 order-1 z-[1]'
                        style={selectStyle}
                      >
                        {memberType.map((member) => (
                          <li
                            key={member.value}
                            onClick={() => handleOptionClick(member.value)}
                            className='w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] font-normal text-[#696970] text-start flex items-center text-[0.94vw] cursor-pointer hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue'
                          >
                            {member.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Team Role Option*/}
                  <div className='flex flex-col items-start justify-center mt-[1.04vw] space-y-[0.73vw] w-full relative'>
                    <label
                      htmlFor='name'
                      className='p-[0vw_0.26vw] text-[0.94vw] flex-none grow-0'
                    >
                      <span className='font-semibold text-[0.94vw] leading-[1.25vw] text-[#282833] flex-none grow-0'>
                        Team Role
                      </span>
                    </label>

                    <button
                      type='button'
                      ref={roleButtonRef}
                      onClick={toggleRoleDropdown}
                      className='outline-none w-full h-[2.55vw] p-[0.51225vw_0.768vw] leading-normal text-[0.83vw] text-[#282833] border-[0.051226vw] border-solid border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer grow-0 relative'
                    >
                      <span
                        className='pointer-events-none text-center flex items-center text-[#9b9ba0]'
                        style={selectRoleOptionStyle}
                      >
                        {selectedRole}
                      </span>

                      <Image
                        className='cursor-pointer w-[0.83vw] h-[0.42vw] transition-transform duration-300'
                        width={16}
                        src={Chevron}
                        style={{
                          transform: rotated
                            ? "rotate(-180deg)"
                            : "rotate(0deg)",
                        }}
                        alt=''
                      />
                    </button>

                    {selectedRoleDropdown && (
                      <ul
                        ref={dropdownRef}
                        className='absolute top-full left-0 w-full flex flex-col items-center p-[0.52vw] gap-[0.52vw] max-h-[6.145vw] max-h-[10vw] bg-[#ffffff] rounded-[0.78vw] font-normal text-[0.94vw] leading-[120%] flex-none grow-0 order-1 z-[1] overflow-y-auto scrollbar-gutter-stable'
                        style={selectStyle}
                      >
                        {memberRoles.map((role) => (
                          <li
                            key={role.value}
                            onClick={() => handleRoleClick(role.value)}
                            className='w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] font-normal text-[#696970] text-start flex items-center text-[0.94vw] cursor-pointer hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue hover:w-full'
                          >
                            {role.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </legend>
            </div>

            <div className='w-full mt-[2.08vw] space-x-[1.04vw] flex items-center justify-center'>
              <button
                onClick={handleCloseModal}
                className='flex justify-center items-center p-[0.52vw_1.25vw] text-[#696970] text-[0.94vw] font-normal w-full h-[2.60vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='flex justify-center items-center p-[0.52vw_1.25vw] w-full h-[2.60vw] bg-[#50589F] text-[#ffffff] text-[0.94vw] font-normal border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#42498B]'
              >
                {submitting ? <ClipLoader size={18} color='#ffffff' /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateOrganizationMemeberModal;

const modalStyle: React.CSSProperties = {
  boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
};

const selectStyle: React.CSSProperties = {
  boxShadow: "0px 0px 20px rgba(80, 88, 159, 0.1)",
  zIndex: 1,
};
