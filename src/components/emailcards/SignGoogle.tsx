import React, { useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import Image from 'next/image'
import google from '../../assests/icons/google.svg'
import head from '../../assests/icons/smilingface.svg'
import { CgProfile } from "react-icons/cg";
import { addEmailType } from '@/types/GeneralType'
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/client'
import { AddAndConnectEmailAccount, UnAssignEmailAccount } from '@/graphql/mutations/emailAccount'
import { notifyErrorFxn, notifyInfoFxn, notifySuccessFxn } from '../../../utils/toast-fxn'
import useEmailAccountService from '@/hooks/use-email-account'



const SignGoogle: React.FC<addEmailType> = ({ activeEmail, setActiveEmail, setShow }) => {
    const { emailAccountRefetch} = useEmailAccountService();


    const [googleDetails, setGoogleDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        appPassword: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setGoogleDetails((prevData) => ({
            ...prevData, [name]: value
        }))
    }

    const [addAndConnectEmailAccount] = useMutation(AddAndConnectEmailAccount, {
        onCompleted: (data) => {
            notifySuccessFxn('Gmail added successfully')
            emailAccountRefetch()
        },
        onError: (error) => {
           // console.log(`error adding email: ${error.message}`)
           notifyErrorFxn(error.message)
        }
    })


    const handleSubmit = () => {
        if (googleDetails.email !=="" || googleDetails.appPassword !== ""){

            addAndConnectEmailAccount({
                variables: {
                  input: {
                    email:googleDetails.email,
                    googleAppPassword:googleDetails.appPassword,
                    serviceProvider:"GMAIL"
                   
                  },
                },
              })
    
              setShow(false)
              setActiveEmail("")
        }else {
            notifyInfoFxn('please fill the field')
        }
    }

  return (
    <AnimatePresence>

    {activeEmail === "signgoogle" && (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 0.5,  }}
    className={` absolute bg-white flex flex-col gap-[1.6vh]  h-fit w-[26.04vw] z-50 py-[1.6vh] text-[#282833] rounded-[1.56vw] shadow-lg`}>
       <div className='px-[0.83vw] pb-[2.8vh] flex gap-[1.25vw] items-center'>
                <div onClick={() => setActiveEmail("signgoogletozwilt")} className='cursor-pointer border border-[#E0E0E9] hover:border-[#B8B8CD] w-fit rounded-[0.625vw] py-[0.8vh] px-[0.42vw] text-[0.83vw] hover:bg-[#F4F4FA]'><IoMdArrowBack /></div>
                <p className='font-[600] text-[1.25vw]'> Connect Your Google Account</p>
        </div>

        
        <div className=' px-[0.83vw] flex flex-col gap-[2.4vh]'>
                    <div className=' grid grid-cols-2 gap-2'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="firstname" className='font-[600] text-[#282833] text-[0.93vw]'>First Name</label>
                            <input placeholder='Enter first name' id="firstname" value={googleDetails.firstName} onChange={handleChange}  type="text" name="firstName" className='border-[1px] hover:border-[#667085] px-2 text-[0.83vw] border-[#E0E0E9] outline-none rounded-[0.78vw] h-[5vh]'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="lastname" className='font-[600] text-[#282833] text-[0.93vw]'>Last Name</label>
                            <input placeholder='Enter last name' id='lastname'value={googleDetails.lastName} onChange={handleChange} type="text" name="lastName" className='border-[1px] hover:border-[#667085] px-2 border-[#E0E0E9] text-[0.83vw] outline-none rounded-[0.78vw] h-[5vh]'/>
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-2'>
                            <label htmlFor="email" className='font-[600] text-[#282833] text-[0.93vw]'>Email</label>
                            <input placeholder='Enter Email here' id='email' value={googleDetails.email} onChange={handleChange} type="email" name="email" className='border-[1px] hover:border-[#667085] px-2 border-[#E0E0E9] text-[0.83vw] outline-none rounded-[0.78vw] h-[5vh]'/>
                    </div>
                    <div className='flex flex-col gap-2'>
                            <label htmlFor="email" className='font-[600] text-[#282833] text-[0.93vw]'>App Password</label>
                            <input placeholder='Enter password here' id='password' value={googleDetails.appPassword} onChange={handleChange} type="password" name="appPassword" className='border-[1px] px-2 text-[0.83vw] hover:border-[#667085] border-[#E0E0E9] outline-none rounded-[0.78vw] h-[5vh]'/>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4 px-[0.83vw] pt-2'>
                    <div onClick={() => {
                        setActiveEmail("signgoogletozwilt")
                    }}  
                    className='cursor-pointer h-[5vh] border border-[#E0E0E9] hover:bg-[#F4F4FA]  hover:border-[#B8B8CD] rounded-[0.78vw] flex items-center justify-center text-[0.83vw]'>Back</div>
                    <div
                    onClick={handleSubmit}
                    className='cursor-pointer h-[5vh] border bg-[#50589F] hover-button text-white rounded-[0.78vw] flex items-center justify-center text-[0.83vw]'>Connect</div>
        </div>

        {/* <div className='flex flex-col items-center gap-4 border-b-[1px] border-[#E0E0E9] pb-4 pt-2'>
            <span> <Image src={google} alt="google" /> </span>
            <div className='flex flex-col text-center '>
                <p className=' text-[14px] text-[#6F6F76]'>Google /  G-Suite</p>
                <p className=' text-[24px] text-[#000000] font-[600]'> Connect your google account</p>
            </div>
        </div>
        
        <div onClick={() => setActiveEmail("signgoogletozwilt")} className=' px-4 flex gap-4  items-center  border-b-[1px] border-[#E0E0E9] pb-4 cursor-pointer'>
            <div>
                <Image src={head} alt="head"  />
            </div>
            <div>
                <p className=' font-[600] text-[16px] text-[#282833]'>James Charles</p>
                <p className=' text-[14px] font-[500] text-[#6F6F76]'>jamescharles@gmail.com</p>
            </div>
        </div>

        <div className='flex gap-4 items-center px-4 border-b-[1px] border-[#E0E0E9] pb-4 cursor-pointer '>
            <div>
                <CgProfile size={24}/>
            </div>
            <div>
                <p className=' text-[16px] font-[600] text-[#282833]'>Use a different account</p>
            </div>
        </div>

        <div className='px-4 text-[14px] text-[#667085] font-[500]'> 
            <p>To continue, Google will share your name, email address, language preference, and profile picture with Adobe.
                 Before using this app, you can review Adobe’s privacy policy and terms of service.</p>
        </div> */}

    </motion.div>
    )}
    </AnimatePresence>
  )
}

export default SignGoogle