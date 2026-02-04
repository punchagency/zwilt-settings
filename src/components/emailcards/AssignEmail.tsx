import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import asif from "../../assests/icons/asifImage.svg";
import { assignEmailType } from "@/types/GeneralType";
import smilingface from "../../assests/icons/smilingface.svg";
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/react-hooks";
import { GetOrganizationMembers } from "@/graphql/queries/getOrganizationMember";
import face from "../../../src/assests/images/avatar-PH.jpeg";
import { useRecoilValue } from "recoil";
import { userEmailToAssign } from "../../../utils/recoil_store/atoms/emailToAssign";
import { useMutation } from "@apollo/react-hooks";
import { AssignEmailAccount } from "@/graphql/mutations/emailAccount";
import { assignEmail } from "@/graphql/queries/emailAccount";
import useEmailAccountService from "@/hooks/use-email-account";
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";

const AssignEmail: React.FC<assignEmailType> = ({
  setShow,
  users,
  setUsers,
  emailForCompare,
  setEmailForCompare,
  activeEmail,
  setActiveEmail,
}) => {
  interface user {
    _id: string;
    name: string;
    profile_img: string;
  }

  interface member {
    _id: string;
    user: user;
  }

  interface emailCheck {
    _id: string;
    email: string;
  }

  const [dropDownImage, setDropDownImage] = useState(smilingface);
  const [staffShow, setStaffShow] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const emailAssign = useRecoilValue(userEmailToAssign);
  const [idToAssign, setIdToAssign] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<emailCheck[]>([
    {
      _id: "",
      email: "",
    },
  ]);

  const { data, loading, error } = useQuery(GetOrganizationMembers, {
    onCompleted: (data) => {
      if (data !== null) {
        setStaffs(data.getOrganizationMembers.data);
      }
    },
  });

  const [staffs, setStaffs] = useState<member[]>([
    {
      _id: "",
      user: {
        _id: "",
        name: "",
        profile_img: "",
      },
    },
  ]);

  const {} = useQuery(assignEmail, {
    onCompleted: (data) => {
      setEmailCheck(data.getEmailAccounts.data);
    },
  });

  const { emailAccountRefetch } = useEmailAccountService();

  //handle assign
  const [assignEmailAccount] = useMutation(AssignEmailAccount, {
    onCompleted: (data) => {
      notifySuccessFxn(`assign successful `);
      emailAccountRefetch();
    },
    onError: (error) => {
      notifyErrorFxn(`error assigning user`);
    },
  });

  const handleSelect = (name: any, image: string, id: string) => {
    setSelectedImage(image);
    setSelectedText(name);
    setIdToAssign(id);
    setStaffShow(false);
  };
  console.log(idToAssign);

  // assign email
  const handleAssign = () => {
    emailCheck.forEach((item) => {
      //const id = item._id
      if (item.email === emailAssign) {
        if (selectedText === "") {
          notifyErrorFxn("select a user to assign");
        } else {
          setShow(false);
          setActiveEmail("");
          assignEmailAccount({
            variables: {
              input: {
                assignTo: idToAssign,
                emailToAssign: item.email,
              },
            },
          });
          return; // Exit the loop after the first match
        }
      }
    });

    // setUsers(users.map(user =>
    //     user.email === emailForCompare ? {...user, img: selectedImage } : user
    // ));
  };

  return (
    <div
      className={`bg-white ${
        activeEmail === "assign" ? "flex" : "hidden"
      }  flex-col gap-6  h-fit w-[33%] z-50 p-4 text-[#282833] rounded-[30px] shadow-lg`}
    >
      <div className=" flex justify-between items-center">
        <p className="font-[600] text-[1.25vw]"> Assign This Email</p>
        <div
          onClick={() => {
            setShow(false);
            setActiveEmail("");
          }}
          className="cursor-pointer border border-[#E0E0E9] hover:border-[#B8B8CD] hover:bg-[#F4F4FA] w-fit rounded-[12px] p-2 text-[0.83vw]"
        >
          <IoMdClose size={16} />
        </div>
      </div>

      <div className=" h-fit w-full px-4 bg-[#F2F4F7] border-[1px] border-[#E0E0E9] rounded-[15px]">
        <input
          value={emailAssign}
          readOnly
          type="text"
          className="h-[4.9vh] w-[100%] bg-transparent outline-none text-[#6F6F76] text-[0.83vw]"
        />
      </div>

      <div className=" flex flex-col gap-6">
        <p className=" text-[0.94vw] font-[600]">Assign to</p>

        <div
          onClick={() => setStaffShow(!staffShow)}
          className="flex items-center justify-between cursor-pointer h-[4.9vh] px-4 w-full  bg-white border-[1px] border-[#E0E0E9] hover:border-[#B8B8CD] rounded-[15px]"
        >
          <div>
            {selectedImage === "" || selectedText === "" ? (
              <p className="text-[0.83vw]">Select</p>
            ) : (
              <span className="flex items-center gap-6">
                <Image
                  src={selectedImage === null ? face : selectedImage}
                  alt="selected"
                  width={30}
                  height={30}
                  className="rounded-[50%] h-[3vh] w-[1.6vw]"
                />
                <p>{selectedText}</p>
              </span>
            )}
          </div>
          <span>
            <IoIosArrowDown className=" text-[#282833] text-[0.83vw]" />
          </span>
        </div>
        <AnimatePresence>
          {staffShow && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -100 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -100 }}
              transition={{ duration: 0.3, type: "Inertia", stiffness: 100 }}
              className={` bg-white w-[100%] relative  `}
            >
              <ul className="absolute bg-white z-50 w-[100%] flex flex-col gap-2 px-2 shadow-lg  rounded-lg h-fit max-h-[250px] overflow-y-scroll slim-scrollbar">
                {staffs !== null &&
                  staffs?.map((staff, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleSelect(
                          staff?.user?.name,
                          staff?.user?.profile_img,
                          staff?.user?._id
                        )
                      }
                      className="flex items-center gap-6 cursor-pointer hover:bg-[#F4F4FA] px-4 py-2 rounded-[15px]"
                    >
                      <Image
                        src={
                          staff?.user?.profile_img === null
                            ? face
                            : staff?.user?.profile_img
                        }
                        alt="staff"
                        width={30}
                        height={30}
                        className="rounded-[50%] h-[3vh] w-[1.6vw]"
                      />
                      <p className="text-[0.83vw]">{staff?.user?.name}</p>
                    </li>
                  ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 ">
        <div
          onClick={() => {
            setShow(false);
            setActiveEmail("");
          }}
          className="cursor-pointer h-[5vh] border border-[#E0E0E9] hover:border-[#B8B8CD] hover:bg-[#F4F4FA] rounded-[15px] text-[0.93vw] flex items-center justify-center"
        >
          Cancel
        </div>
        <div
          onClick={handleAssign}
          className="cursor-pointer h-[5vh] border bg-[#50589F] hover-button text-[0.93vw] text-white rounded-[0.78125vw] flex items-center justify-center"
        >
          Assign
        </div>
      </div>
    </div>
  );
};

export default AssignEmail;
