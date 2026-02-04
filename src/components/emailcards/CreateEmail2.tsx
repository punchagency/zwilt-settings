import { CreateEmailType } from '@/types/GeneralType'
import React from 'react'
import Image from 'next/image'
import smtplogo from "../../assests/icons/smtp.svg"
import { IoMdArrowBack } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/react-hooks'
import { AddAndConnectEmailAccount } from '@/graphql/mutations/emailAccount'
import { notifyErrorFxn, notifySuccessFxn } from '../../../utils/toast-fxn'

const CreateEmail2: React.FC<CreateEmailType> = ({
    setShow, activeEmail, setActiveEmail, customEmail, setCustomEmail
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCustomEmail((prevData) => ({
            ...prevData, [name]: value
        }))
    }


    // const [addAndConnectEmailAccount] = useMutation(AddAndConnectEmailAccount, {
    //     variables: {
    //         data: {
    //             email: customEmail.email,
    //             firstName: customEmail.firstName,
    //             lastName: customEmail.lastName,
    //             serviceProvider: null,
    //             imapHost: customEmail.host,
    //             imapPassword: customEmail.password,
    //             imapPort: customEmail.port,
    //             imapUsername: customEmail.userName,
    //             smtpHost: null,
    //             smtpPort: null,
                
    //           },
    //     },
    //     onCompleted: (data) => {
    //         setActiveEmail("")
    //         setShow(false)
    //       console.log("Profile updated successully")
    //     },
    //     onError: (error) => {
    //       console.log(`Error updating profile ${error}`);
    //     },
    //   });

    const [addAndConnectEmailAccount] = useMutation(AddAndConnectEmailAccount, {
        onCompleted: (data) => {
            setActiveEmail("");
            setShow(false);
            notifySuccessFxn(`Profile updated successfully`);
        },
        onError: (error) => {
            notifyErrorFxn(error.message);
        },
    });


    const handleSubmit =  () => {
             addAndConnectEmailAccount({
                variables: {
                    input: {
                        email: customEmail.email,
                        firstName: customEmail.firstName,
                        lastName: customEmail.lastName,
                        imapHost: customEmail.host,
                        imapPassword: customEmail.password,
                        imapPort: customEmail.port,
                        imapUsername: customEmail.userName,
                        serviceProvider: "CUSTOM",
                    }
                }
            });
        
    };

  return (
    <AnimatePresence>
    {activeEmail === "connectnewemail" && (
    <motion.div 
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 0.8,  }}
    className={` absolute  bg-white flex flex-col gap-[1.6vh]  h-fit w-[27.6vw] z-50 py-[1.6vh] text-[#282833] rounded-[1.565vw] shadow-lg `}>
       <div className='flex gap-[1.25vw] items-center px-[0.83vw]'>
                <div onClick={() => setActiveEmail("Any Provider")} className='cursor-pointer border border-[#E0E0E9] w-fit rounded-[0.63vw] px-[0.42vw] py-[0.8vh] text-[0.83vw] hover:bg-[#F4F4FA]'><IoMdArrowBack size={14}/></div>
                <p className='font-[600] text-[0.93vw]'>Connect a new Email Account</p>
        </div>

        <div className='flex flex-col items-center gap-[0.8vh] border-b-[1px] border-[#E0E0E9] px-[0.83vw] pb-[2.4vh]'>
            <span> <Image src={smtplogo} alt="google" className='h-[3.33vh] w-[2.4vw]'/> </span>
            <div className='flex flex-col text-center '>
                <p className=' text-[0.73vw] text-[#6F6F76]'>Any Provider</p>
                <p className=' text-[1.042vw] text-[#000000] font-[600]'>IAMP/SMTP</p>
            </div>
        </div>

        <div className=' px-[0.83vw] flex flex-col gap-[2.4vh]'>

            <div className='flex flex-col gap-[1vh]'>
                    <label htmlFor="username" className='font-[600] text-[#282833]  text-[0.93vw]'>Username</label>
                    <input placeholder='Enter username' id='username' value={customEmail.userName} onChange={handleChange} type="text" name="userName" className='border-[1px] hover:border-[#667085] text-[0.83vw] px-[0.42vw] border-[#E0E0E9] outline-none rounded-[0.78vw] h-[4.9vh]'/>
            </div>

            <div className='flex flex-col gap-[1vh]'>
                    <label htmlFor="password" className='font-[600] text-[#282833] text-[0.93vw]'>Password</label>
                    <input placeholder='Enter Password here' id='password' value={customEmail.password} onChange={handleChange} type="password" name="password" className='border-[1px] hover:border-[#667085] text-[0.83vw] px-[0.42vw] border-[#E0E0E9] outline-none rounded-[0.78vw] h-[4.9vh]'/>
            </div>

            <div className=' grid grid-cols-2 gap-[1vh]'>
                <div className='flex flex-col gap-[1vh]'>
                    <label htmlFor="host" className='font-[600] text-[#282833] text-[0.93vw]'>IAMP Host</label>
                    <input placeholder='Enter Host ' id='host' value={customEmail.host} onChange={handleChange} type="number" name="host" className='border-[1px] px-[0.42vw] hover:border-[#667085] text-[0.83vw] border-[#E0E0E9] outline-none rounded-[0.78vw] h-[4.9vh]'/>
                </div>

                <div className='flex flex-col gap-[1vh]'>
                    <label htmlFor="port" className='font-[600] text-[#282833] text-[0.93vw]'>IAMP PORT</label>
                    <input placeholder='Enter PORT ' id='port' value={customEmail.port} onChange={handleChange} type="number" name="port" className='border-[1px] px-[0.42vw] hover:border-[#667085] text-[0.83vw] border-[#E0E0E9] outline-none rounded-[0.78vw] h-[4.9vh]'/>
                </div>
            </div>
            
           
        </div>

        <div className='grid grid-cols-2 gap-[0.83vw] px-[0.83vw] pt-[0.8vh]'>
            <div onClick={() => {
                setActiveEmail("")
                setShow(false)
            }}  
            className='cursor-pointer h-[5vh] border border-[#E0E0E9] rounded-[0.78vw] flex items-center justify-center text-[0.93vw] hover:bg-[#F4F4FA]'>Cancel</div>
            <div
              onClick={handleSubmit}
              className='cursor-pointer h-[5vh] border bg-[#50589F] hover-button text-white rounded-[0.78vw] flex items-center justify-center text-[0.93vw] '>Submit</div>
        </div>

    </motion.div>
    )}
    </AnimatePresence>
  )
}

export default CreateEmail2