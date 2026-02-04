import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Jobs from "@/components/jobs";
import Interview from "@/components/interview";
import Candidate from "@/components/candidate";
import TeamActivity from "@/components/teamactivity";
import BillingAndPayment from "@/components/billing";
import UserAccount from "@/components/useracc";
import { motion } from "framer-motion";
import BasicNotification from "@/components/BasicNotification";
import SalesNotification from "@/components/sales";
import TrackerNotification from "@/components/tracker";
import { useRouter } from "next/router";
import useUser from "utils/recoil_store/hooks/use-user-state";

const NotificationSettingsComponent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { updateUser, userState } = useUser();
  // console.log({ userState });

  const isAdmin = userState?.currentUser?.clientAccountType === "ADMIN";

  const router = useRouter();
  const { tab } = router.query;

  const headArray = [
    {
      name: "Basic",
      link: "basic",
      component: <BasicNotification />,
    },
    { name: "Jobs", link: "jobs", component: <Jobs /> },
    {
      name: "Interview",
      link: "interview",
      component: <Interview />,
    },
    {
      name: "Candidate",
      link: "candidate",
      component: <Candidate />,
    },
    {
      name: "Team Activity",
      link: "team-activity",
      component: <TeamActivity />,
    },
    {
      name: "Billing & Payment",
      link: "billing-and-payment",
      component: <BillingAndPayment />,
    },
    {
      name: "User Account",
      link: "user-account",
      component: <UserAccount />,
    },
  ];

  if (isAdmin) {
    headArray.push({
      name: "Sales",
      link: "sales",
      component: <SalesNotification />,
    });
    headArray.push({
      name: "Tracker",
      link: "tracker",
      component: <TrackerNotification />,
    });
  }

  const getTabMap = () => {
    let obj: any = {};
    for (let i = 0; i < headArray.length; i++) {
      obj[headArray[i].link] = i;
    }
    return obj;
  };

  useEffect(() => {
    if (tab) {
      const tabMap = getTabMap();
      // const tabMap = {
      //   basic: 0,
      //   jobs: 1,
      //   interview: 2,
      //   candidate: 3,
      //   "team-activity": 4,
      //   "billing-&-payment": 5,
      //   "user-account": 6,
      // };
      setSelectedTab(tabMap[tab as keyof typeof tabMap] || 0);
    }
  }, [tab]);

  return (
    <div className='flex flex-col gap-[2.4vh] py-[1.6vh] text-[#282833] pb-10'>
      <div className='px-[1.25vw] flex flex-col gap-[1.25vw]'>
        <p className='font-[600] text-[1.25vw]  text-[#282833]'>
          Notification Settings
        </p>
        <h1 className=' font-[400] text-[0.83vw] -mt-[0.9vw] text-[#6F6F76]'>
          We may still send you important notifications about your account
          outside of your notification settings.
        </h1>
      </div>

      <div className='border -mt-[0.2vw] flex gap-[1.67vw] px-[1.25vw] '>
        {headArray.map((item, index: number) => (
          <motion.div
            key={index}
            className={`py-[0.9vh]  relative cursor-pointer`}
            onClick={() => {
              setSelectedTab(index);
              router.push(`/notifications?tab=${item.link}`);
            }}
          >
            <p
              className={`${
                selectedTab === index
                  ? " font-[600] text-opacity-[100%]"
                  : "text-opacity-[65%]"
              } text-[#282833] hover:text-[#282833] py-[0.5208vw] text-[0.93vw] font-[500]`}
            >
              {item.name}
            </p>
            {selectedTab === index && (
              <motion.div
                layoutId='underline'
                className='absolute left-0 right-0 bottom-0 h-[0.2vh] bg-[#282833]'
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <Box className=' mx-[1.25vw] '>{headArray[selectedTab]?.component}</Box>
    </div>
  );
};

export default NotificationSettingsComponent;
