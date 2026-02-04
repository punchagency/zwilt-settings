import React from "react";
import { Progress } from "@material-tailwind/react";
import type { ProgressProps } from "@material-tailwind/react";
import ProgressBar from "./progress-bar";

interface PlanUpgradeProps {
  currentUsers: number;
  maxUsers: number;
  setDismiss: () => void;
}

const BasicPlan: React.FC<PlanUpgradeProps> = ({
  currentUsers,
  maxUsers,
  setDismiss,
}) => {
  // const progressValue: ProgressProps["value"] = 75;
  // const progressSize: ProgressProps["size"] = "lg";

  return (
    <div className="p-3 bg-[#F4F4FA]  rounded-2xl h-[17.4vh] gap-[0.4vh] flex flex-col   ">
      <div className="flex items-center gap-4">
        <div className="text-[0.83vw] leading-[2vh] font-semibold text-[#282833]">
          {currentUsers}/{maxUsers} User
        </div>
        <div className="px-2 py-1 bg-[#FCFCFD] text-[#667085] rounded-full text-sm border">
          Basics Plan
        </div>
      </div>
      <ProgressBar current={currentUsers} total={maxUsers}  />
      <p className="text-[#28283399] mt-2 text-[0.83vw] leading-[2.08vh]">
        You have almost reached to the end, would you like to upgrade your plan?
      </p>
      <div className="flex items-center  gap-[0.4vh] mt-1">
        <button
          onClick={setDismiss}
          className="text-[#282833] text-[0.83vw] leading-[2.08vh]"
        >
          Dismiss
        </button>
        <button className="text-[#50589F] text-[0.83vw] leading-[2.08vh]">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default BasicPlan;
