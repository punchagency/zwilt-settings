import { CreateEmailType } from '@/types/GeneralType'
import React from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import Image from 'next/image'
import smtplogo from '../../assests/icons/smtp.svg'
import { motion, AnimatePresence } from 'framer-motion';


const CreateEmail: React.FC<CreateEmailType> = ({
    setShow, activeEmail, setActiveEmail, customEmail, setCustomEmail
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCustomEmail((prevData) => ({
            ...prevData, [name]: value
        }))
    }

  return (
    <AnimatePresence>
    {activeEmail === "Any Provider" && (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 0.8  }} 
    className={` absolute  bg-white flex flex-col gap-[1.6vh]  h-fit w-[27.6vw] z-50 py-[1.6vh] text-[#282833] rounded-[1.565vw] shadow-lg `}>
       <div className='flex gap-[1.25vw] items-center px-[0.83vw]'>
                <div onClick={() => setActiveEmail("addemail")} className='cursor-pointer border border-[#E0E0E9] hover:border-[#B8B8CD] w-fit rounded-[0.63vw] px-[0.42vw] py-[0.8vh] text-[0.83vw] hover:bg-[#F4F4FA]'><IoMdArrowBack /></div>
                <p className='font-[600] text-[0.93vw]'>Connect a new Email Account</p>
        </div>

        <div className='flex flex-col items-center gap-[0.8vh] border-b-[1px] border-[#E0E0E9] px-[0.83vw] pb-[2.4vh]'>
            <span> <Image src={smtplogo} alt="google" className='h-[3.33vh] w-[2.4vw]' /> </span>
            <div className='flex flex-col text-center'>
                <p className=' text-[0.73vw] text-[#6F6F76]'>Any Provider</p>
                <p className=' text-[1.042vw] text-[#000000] font-[600]'>IAMP/SMTP</p>
            </div>
        </div>

        <div className=' px-[0.83vw] flex flex-col gap-[2.4vh]'>
            <div className=' grid grid-cols-2 gap-[0.8vh]'>
                <div className='flex flex-col gap-[1vh]'>
                    <label htmlFor="firstname" className='font-[600] text-[#282833] text-[0.93vw]'>First Name</label>
                    <input placeholder='Enter first name' id="firstname" value={customEmail.firstName} onChange={handleChange} type="text" name="firstName" className='border-[1px] hover:border-[#667085] text-[0.83vw] px-[0.42vw] border-[#E0E0E9] hover:border-[#B8B8CD] outline-none rounded-[0.78vw] h-[4.9vh]'/>
                </div>

                <div className='flex flex-col gap-[1vh]'>
                    <label htmlFor="lastname" className='font-[600] text-[#282833] text-[0.93vw]'>Last Name</label>
                    <input placeholder='Enter last name' id='lastname' value={customEmail.lastName} onChange={handleChange} type="text" name="lastName" className='border-[1px] hover:border-[#667085] text-[0.83vw] px-[0.42vw] border-[#E0E0E9] hover:border-[#B8B8CD]  outline-none rounded-[0.78vw] h-[4.9vh]'/>
                </div>
            </div>
            
            <div className='flex flex-col gap-[1vh]'>
                    <label htmlFor="email" className='font-[600] text-[#282833] text-[0.93vw]'>Email</label>
                    <input placeholder='Enter Email here' id='email' value={customEmail.email} onChange={handleChange} type="email" name="email" className='border-[1px] hover:border-[#667085] text-[0.83vw] px-[0.42vw] border-[#E0E0E9]  hover:border-[#B8B8CD] outline-none rounded-[0.78vw] h-[4.9vh]'/>
            </div>
        </div>

        <div className='grid grid-cols-2 gap-[1.6vh] px-[0.83vw] pt-[0.8vh]'>
            <div onClick={() => {
                setActiveEmail("")
                setShow(false)
            }}  
            className='cursor-pointer h-[5vh] border border-[#E0E0E9] hover:border-[#B8B8CD] rounded-[0.78vw] flex items-center justify-center text-[0.93vw] hover:bg-[#F4F4FA]'>Cancel</div>

            <div
              onClick={() => {
                setActiveEmail("connectnewemail")
                
            }}
              className='cursor-pointer h-[5vh] border bg-[#50589F]  text-white rounded-[0.78vw] flex items-center justify-center text-[0.93vw] bg-opacity-[90%] hover:bg-opacity-[100%]'>Next</div>
        </div>

    </motion.div>
    )}
    </AnimatePresence>
  )
}

export default CreateEmail