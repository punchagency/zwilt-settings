import React from 'react'
import { IoMdArrowBack } from "react-icons/io";
import google from '../../assests/icons/google.svg'
import Image from 'next/image';
import { IoSettingsOutline } from "react-icons/io5";
import { addEmailType } from '@/types/GeneralType';
import { motion, AnimatePresence } from 'framer-motion';




const ConnectGoogle: React.FC<addEmailType> = ({ activeEmail, setActiveEmail, setShow }) => {

 

  return (
<AnimatePresence>
    {activeEmail === "Google" && (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 0.5,  }}
    className={`bg-white absolute flex flex-col gap-[2.4vh]  h-fit w-[26.04vw] z-50 py-[1.6vh] text-[#282833] rounded-[1.56vw] shadow-lg`}
    >
       <div className='px-[0.83vw] flex gap-[1.25vw] items-center '>
                <div
                onClick={() => {
                    setActiveEmail("addemail")
                    
                }}
                className='cursor-pointer border border-[#E0E0E9] w-fit rounded-[0.63vw] hover:border-[#B8B8CD] py-[0.8vh] px-[0.42vw] hover:bg-[#F4F4FA] text-[0.83vw]'><IoMdArrowBack /></div>
                <p className='font-[600] text-[1.25vw]'> Connect a New Email Account</p>
        </div>
        
        <div className='flex flex-col items-center gap-[1.6vh] border-b-[1px] border-[#E0E0E9] pb-[2.4vh]'>
            <span> <Image src={google} alt="google" className='h-[4vh] w-[2.08vw]'/> </span>
            <div className='flex flex-col text-center gap-[0.8vh]'>
                <p className=' text-[0.73vw] text-[#6F6F76]'>Google /  G-Suite</p>
                <p className=' text-[1.25vw] text-[#000000] font-[600]'> Connect your google account</p>
                <p className=' text-[0.83vw] text-[#6F6F76]'>First lets’ enable <span className='text-[#50589F] border-b-[1px]  border-[#50589F]'> IAMP access</span> for your google account. </p>
            </div>
        </div>

        <div className='px-[1.25vw] pb-[2.4vh]'>
            <ol className=' flex flex-col gap-[0.8vh]'>
                <li className=' font-[500] text-[#6F6F76] text-[0.83vw]'>1. On your computer, open Gmail.</li>
                <li className=' font-[500] text-[#6F6F76] text-[0.83vw] flex items-center'>2. Click the <IoSettingsOutline className='text-[#323232] mx-[0.21vw]' /> gear icon in the top right corner.</li>
                <li className=' font-[500] text-[#6F6F76] text-[0.83vw]'>3. Click All Settings.</li>
                <li className=' font-[500] text-[#6F6F76] text-[0.83vw]'>4. Click the <a href='https://mail.google.com/mail/u/0/#settings/fwdandpop' target='_blank' className=' text-[#50589F] border-b-[1px] border-[#50589F]'>Forwarding and POP/IMAP</a>tab.</li>
                <li className=' font-[500] text-[#6F6F76] text-[0.83vw]'>5. In the IMAP access section, select Enable IMAP.</li>
                <li className=' font-[500] text-[#6F6F76] text-[0.83vw]'>6. Click Save Changes.</li>

            </ol>
        </div>

        <div onClick={() => setActiveEmail("signgoogletozwilt")} className=' bg-[#50589F] hover-button py-[1vh] text-white mx-[1.25vw] text-center rounded-[0.78vw] text-[.93vw] font-[500] cursor-pointer'>
                Yes, IAMP has been enabled
        </div>
    </motion.div>
    )}
</AnimatePresence>
  )
}

export default ConnectGoogle