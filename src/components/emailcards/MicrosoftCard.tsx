import { MicrosoftType } from "@/types/GeneralType";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import microsofticon from "../../assests/icons/microsofticon.svg";

const MicrosoftCard: React.FC<MicrosoftType> = ({
  setShow,
  activeEmail,
  setActiveEmail,
}) => {
  const router = useRouter();
  const serverUrl = process.env.NEXT_PUBLIC_APP_SERVER;

  const Array = [
    {
      head: "Microsoft accounts purchased directly from Microsoft",
      text1: [
        "On your computer, log in to your Microsoft Admin center.",
        "Open Active Users.",
        "In the side window, click on Mail tab, and then on Manage email app",
      ],
    },
    {
      head: "Microsoft accounts purchased from GoDaddy",
      text1: [
        "On your computer, log in to your GoDaddy account.",
        "Go to My Products page.",
        "Scroll down and go to Email and Office section.",
      ],
    },
  ];

  const hadndleNavigate = () => {
    router.push(serverUrl + "/api/auth/azure");
    setActiveEmail("");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {activeEmail === "Microsoft" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute flex px-[1.25vw] bg-white flex-col gap-[1.6vh] h-fit w-[41.6vw]  z-50 py-[1.6vh] text-[#282833] rounded-[1.56vw] shadow-lg"
        >
          <div className="flex items-center justify-between pb-[0.8vh]">
            <div className="flex gap-[1.25vw] items-center">
              <div
                onClick={() => setActiveEmail("addemail")}
                className="cursor-pointer border text-[0.83vw] hover:bg-[#F4F4FA] border-[#E0E0E9] hover:border-[#B8B8CD] w-fit rounded-[0.63vw] py-[0.8vh] px-[0.417vw]"
              >
                <IoMdArrowBack />
              </div>
              <p className="font-[600] text-[1.25vw]">
                Connect a new Email Account
              </p>
            </div>
            <div
              onClick={() => {
                setActiveEmail("");
                setShow(false);
              }}
              className="cursor-pointer border border-[#E0E0E9] hover:border-[#B8B8CD] w-fit rounded-[0.625vw] py-[0.8vh] px-[0.417vw] hover:bg-[#F4F4FA]"
            >
              <IoMdClose size={14} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-[0.8vh] border-b-[1px] border-[#E0E0E9]  pb-[2.4vh]">
            <span>
              <Image
                src={microsofticon}
                alt="microsoft"
                width={33}
                height={40}
                className="h-[5vh] w-[1.72vw]"
              />
            </span>
            <div className="flex flex-col text-center ">
              <p className="text-[0.63vw] text-[#6F6F76]">Microsoft</p>
              <p className="text-[1.042vw] text-[#000000] font-[600]">
                Office 365 / Outlook
              </p>
              <p className="text-[0.73vw] text-[#6F6F76]">
                First lets enable{" "}
                <span className="text-[#50589F] border-b-[1px] cursor-pointer border-[#50589F]">
                  SMTP access
                </span>{" "}
                for your Microsoft account.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[0.83vw]">
            {Array.map((item, index) => (
              <div
                key={index}
                className="border-[1px] border-[#E0E0E9] rounded-[15px] px-[1.25vw] py-[1.6vh]"
              >
                <p className="text-center font-[600] text-[1.042vw] text-[#282833] pb-[1.6vh]">
                  {item.head}
                </p>
                <ol className="list-decimal flex flex-col gap-[0.8vh]">
                  {item.text1.map((text, idx) => (
                    <li key={idx} className="text-[0.83vw] text-[#6F6F76]">
                      {text}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="flex w-[100%] justify-center">
            <div
              onClick={hadndleNavigate}
              className="cursor-pointer h-[5vh] text-[0.93vw] w-[14.53vw] border bg-[#50589F] hover-button text-white rounded-[0.78vw] flex items-center justify-center"
            >
              Yes, IMAP has been enabled
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MicrosoftCard;
