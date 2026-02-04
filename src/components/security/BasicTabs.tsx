import { PageProps } from "@/types/GeneralType";
import React, { useEffect, useMemo, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaCircleXmark } from "react-icons/fa6";
import { UPDATE_PASSWORD } from "@/graphql/mutations/settings";
import { useMutation } from "@apollo/client";
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";
import UpdatePasswordModal from "./UpdatePasswordModal";
import useAuth from "@/hooks/useAuth";
import ClipLoader from "react-spinners/ClipLoader";

const BasicTabs: React.FC = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { handleLogout } = useAuth();
  const [allConditionsMet, setAllConditionsMet] = useState(false);

  const [changePassword, { loading }] = useMutation(UPDATE_PASSWORD, {
    onCompleted: (data) => {
      setOpenModal(false);
      handleLogout();
      notifySuccessFxn("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      notifyErrorFxn(error.message);
    },
  });

  function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentPassword !== "" && newPassword !== "") {
      if (allConditionsMet) {
        if (newPassword === confirmPassword) {
          changePassword({
            variables: {
              newPassword: newPassword,
              currentPassword: currentPassword,
            },
          });
        } else {
          notifyErrorFxn("Passwords do not match");
        }
      } else {
        notifyErrorFxn("Your password is not strong enough");
      }
    } else {
      notifyErrorFxn("No field must be empty");
    }
  }

  const conditions = useMemo(() => [
    {
      test: (password: string) => password.length >= 8,
      message: "Minimum 8 Characters",
    },
    {
      test: (password: string) => /[A-Z]/.test(password),
      message: "Must be one uppercase letter",
    },
    {
      test: (password: string) => /[a-z]/.test(password),
      message: "Must be one lowercase letter",
    },
    {
      test: (password: string) => /[0-9]/.test(password),
      message: "Must be one number",
    },
    {
      test: (password: string) =>
        /[!@#$%^&*(){}_+={};:,<.>\[\]]/.test(password),
      message: "Must be one special character",
    },
  ], []);

  useEffect(() => {
    const areAllConditionsMet = conditions.every((condition) =>
      condition.test(newPassword)
    );
    setAllConditionsMet(areAllConditionsMet);
  }, [conditions, newPassword]);
  return (
    <div>
      <form onSubmit={updatePassword}>
        <div className="flex flex-col gap-[3vh] px-[1.25vw]">
          <div className="flex flex-col gap-[1.4vh]">
            <label
              htmlFor=""
              className="font-[600] text-[0.94vw] text-[#282833]"
            >
              Current Password
            </label>
            <div className="flex border border-[#E0E0E9] w-[32.08vw] items-center hover:border-[#50589F] h-[4.9vh] rounded-[0.78vw] px-[0.42vw]">
              <input
                value={currentPassword}
                placeholder="Enter Current Password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                type={showCurrent ? "text" : "password"}
                className={`outline-none w-[95%] pl-[0.42vw] placeholder:text-[0.83vw] font-bold ${
                  showCurrent ? "text-[0.83vw]" : "text-[1.25vw]"
                } text-[#282833] text-opacity-[60%]`}
              />
              <div
                className={`cursor-pointer text-[1.25vw]`}
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[1.4vh]">
            <label
              htmlFor=""
              className="font-[600] text-[0.94vw] text-[#282833]"
            >
              New Password
            </label>
            <div className="flex border border-[#E0E0E9] w-[32.08vw] hover:border-[#50589F] items-center h-[4.9vh] rounded-[0.78vw] px-[0.42vw]">
              <input
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type={showNew ? "text" : "password"}
                className={`outline-none w-[95%] pl-[0.42vw] placeholder:text-[0.83vw] font-bold ${
                  showNew ? "text-[0.83vw]" : "text-[1.25vw]"
                } text-[#282833] text-opacity-[60%]`}
              />
              <div
                className={`cursor-pointer text-[1.25vw]`}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
            <div className="flex flex-col gap-[0.8vh]">
              {conditions.map((condition, index) => (
                <span key={index} className="flex gap-[0.83vw] items-center">
                  {condition.test(newPassword) ? (
                    <IoIosCheckmarkCircle className="text-[#17B26A] text-[0.83vw]" />
                  ) : (
                    <FaCircleXmark className="text-[#DD2025] text-[0.83vw]" />
                  )}
                  <p className="text-[0.73vw] text-[#6F6F76]">
                    {condition.message}
                  </p>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[1.4vh]">
            <label
              htmlFor=""
              className="font-[600] text-[0.94vw] text-[#282833] "
            >
              Confirm Password
            </label>
            <div
              className={`flex border ${
                confirmPassword !== "" && newPassword !== confirmPassword
                  ? "border-red-700"
                  : "border-[#E0E0E9]"
              } w-[32.08vw] hover:border-[#50589F] items-center h-[4.9vh] rounded-[0.8vw] px-[0.42vw]`}
            >
              <input
                value={confirmPassword}
                placeholder="Confirm New Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirm ? "text" : "password"}
                className={`outline-none pl-[0.42vw] placeholder:text-[0.83vw]  w-[95%] font-bold ${
                  showConfirm ? "text-[0.83vw]" : "text-[1.25vw]"
                }  text-[#282833] text-opacity-[60%] `}
              />
              <div
                className={`cursor-pointer text-[1.25vw]`}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
            {confirmPassword !== "" && (
              <span className="flex gap-[0.83vw] items-center">
                {newPassword !== confirmPassword && (
                  <FaCircleXmark className="text-[#DD2025] text-[0.83vw]" />
                )}
                <p className="text-[0.73vw] text-[#6F6F76]">
                  {newPassword !== confirmPassword && "Passwords do not match"}
                </p>
              </span>
            )}
          </div>

          <button className="bg-[#50589F] hover-button w-[10.63vw] text-[0.93vw] text-white h-[5vh] rounded-[0.78vw]">
            {loading ? (
              <ClipLoader size={20} color="#ffffff" />
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
      <UpdatePasswordModal
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};

export default BasicTabs;
