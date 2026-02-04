import React from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import logo from '../../assests/icons/zwiltlogo.svg'
import Image from 'next/image'
import head from '../../assests/icons/smilingface.svg'
import { addEmailType } from '@/types/GeneralType'
import { motion, AnimatePresence } from 'framer-motion';
import google from '../../assests/icons/google.svg'
import { IoSettingsOutline } from 'react-icons/io5'
import { setActive } from '@material-tailwind/react/components/Tabs/TabsContext'



const SignGoogleToZwilt: React.FC<addEmailType> = ({ setActiveEmail, activeEmail, setShow}) => {
  return (
    <AnimatePresence>
      {activeEmail === "signgoogletozwilt" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white absolute flex flex-col gap-[2.4vh]  h-fit w-[26.04vw] z-50 py-[1.6vh] text-[#282833] rounded-[1.56vw] shadow-lg`}
        >
          <div className="px-[0.83vw] flex gap-[1.25vw] items-center ">
            <div
              onClick={() => {
                setActiveEmail("Google");
              }}
              className="cursor-pointer border border-[#E0E0E9] hover:border-[#B8B8CD] w-fit rounded-[0.63vw] py-[0.8vh] px-[0.42vw] hover:bg-[#F4F4FA] text-[0.83vw]"
            >
              <IoMdArrowBack />
            </div>
            <p className="font-[600] text-[1.25vw]">
              {" "}
              Connect a New Email Account
            </p>
          </div>

          <div className="flex flex-col items-center gap-[1.6vh] border-b-[1px] border-[#E0E0E9] pb-[2.4vh]">
            <span>
              {" "}
              <Image
                src={google}
                alt="google"
                className="h-[4vh] w-[2.08vw]"
              />{" "}
            </span>
            <div className="flex flex-col text-center gap-[0.8vh]">
              <p className=" text-[0.73vw] text-[#6F6F76]">Google / G-Suite</p>
              <p className=" text-[1.25vw] text-[#000000] font-[600]">
                {" "}
                Connect your google account
              </p>
              <p className=" text-[0.83vw] text-[#6F6F76]">
                Enable 2-step verification & generate App password{" "}
              </p>
            </div>
          </div>

          <div className="px-[1.25vw] pb-[2.4vh]">
            <ol className=" flex flex-col gap-[0.8vh]">
              <li className=" font-[500] text-[#6F6F76] text-[0.83vw] cursor-pointer">
                1. Go to your Google Account&apos;s{" "}
                <span className=" text-[#50589F] border-b-[1px] border-[#50589F]">
                  Security Settings
                </span>
              </li>
              <li className=" font-[500] text-[#6F6F76] text-[0.83vw]">
                2. Enable{" "}
                <a
                  href="https://myaccount.google.com/signinoptions/two-step-verification"
                  target="_blank"
                  className=" text-[#50589F] border-b-[1px] border-[#50589F]"
                >
                  2-Step Verification
                </a>
              </li>
              <li className=" font-[500] text-[#6F6F76] text-[0.83vw] cursor-pointer">
                3. Create an{" "}
                <span className=" text-[#50589F] border-b-[1px] border-[#50589F]">
                  App Password
                </span>
              </li>
            </ol>
          </div>
          <div className="grid grid-cols-2 mx-[1.25vw] gap-[0.521vw] text-center ">
            <div
              onClick={() => setActiveEmail("Google")}
              className="py-[1vh] border rounded-[0.78vw] text-[0.93vw] hover:border-[#B8B8CD] hover:bg-[#F4F4FA] cursor-pointer font-[500]"
            >
              Back
            </div>
            <div
              onClick={() => setActiveEmail("signgoogle")}
              className=" bg-[#50589F] hover-button py-[1vh] text-white  text-center rounded-[0.78vw] text-[0.93vw] font-[500] cursor-pointer"
            >
              Next
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SignGoogleToZwilt