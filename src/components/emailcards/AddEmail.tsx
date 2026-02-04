import React from 'react'
import { IoMdClose } from 'react-icons/io'
import google from "../../assests/icons/google.svg"
import microsoft from '../../assests/icons/office.svg'
import smtp from '../../assests/icons/smtp.svg'
import Image from 'next/image'
import { addEmailType } from '@/types/GeneralType'
import { motion, AnimatePresence } from 'framer-motion'

const AddEmail: React.FC<addEmailType> = ({ activeEmail, setActiveEmail, setShow}) => {

    const EmailTypeArray = [
        {
            name: "Google",
            head: "Gmail / G-Suite",
            image: google
        },
        {
            name: "Microsoft",
            head: "Office 365 / Outlook",
            image: microsoft
        },
        {
            name: "Any Provider",
            head: "IAMP/SMTP",
            image: smtp
        },
    ]



  return (
    <AnimatePresence> 
    {activeEmail === "addemail" && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            transition={{ duration: 0.5 }}
            className="bg-white absolute  flex flex-col gap-[2.4vh]  h-fit w-[26.04vw] z-50 py-[1.6vh] px-[1.25vw] text-[#282833] rounded-[1.6vw] shadow-lg"
        >
        <div className=' flex justify-between items-center'>
                <p className='font-[600] text-[1.25vw]'> Connect a new Email Account</p>
                <div
                onClick={() => {
                    setActiveEmail("")
                    setShow(false)
                }}
                className='cursor-pointer border border-[#E0E0E9] hover:border-[#B8B8CD]  w-fit rounded-[0.625vw] py-[0.8vh] px-[0.42vw] hover:bg-[#F4F4FA] text-[0.83vw]'><IoMdClose/></div>
        </div>

        <div className='flex flex-col gap-[1.6vh]'>
            {
                EmailTypeArray.map((item ) => (
                    <div key={item.name} onClick={() => setActiveEmail(item.name)} className='flex gap-[1.25vw] items-center w-full px-[1.25vw] h-[9vh] hover:border-[#B8B8CD] border-[#E0E0E9] border-[1px] rounded-[0.78vw] cursor-pointer '>
                        <div>
                             <Image src={item.image} alt={item.name} className='h-[4vh]  w-[1.71vw]' />
                        </div>
                        <div>
                            <p className=' text-[0.73vw] text-[#6F6F76] '>{item.name}</p>
                            <p className=' text-[#000000] font-[600] text-[1.25vw]'>{item.head}</p>
                        </div>

                    </div>
                ))
            }
        </div>



      

    </motion.div>
)}
</AnimatePresence>
  )
}

export default AddEmail