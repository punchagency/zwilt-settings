import EmailTable from '@/components/email-account/EmailTable';
import { emailPageType } from '@/types/GeneralType';
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from 'recoil';
import { phraseToSearch } from '../../../utils/recoil_store/atoms/email-account-atom';
import { calculatePxToPercentage } from '../../../utils/cssHelper';
import { styled } from '@mui/material';
import { AiOutlinePlus } from "react-icons/ai";
import BaseCard from '@/components/emailcards/BaseCard';
import { UserArray } from "@/arrays/UserArray";


const Page: React.FC = () => {

  const [searchTerm, setSearchTerm] = useRecoilState(phraseToSearch)
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState(UserArray);
  const [emailForCompare, setEmailForCompare] = useState("");
  const [activeEmail, setActiveEmail] = useState("");

const searchItems = users.filter(user => 
  user.email.toLowerCase().includes(searchTerm.toLowerCase())
)

console.log(calculatePxToPercentage(24))

//sizes
const custom24: string = calculatePxToPercentage(4)


  return (
    <div className='py-[1.6vh] w-[100%] '>
      <ToastContainer />
      <div className='flex  items-center w-[100%] justify-between px-[1.25vw] border-b-[1px] pb-[1.6vh]'>
        <div className='text-[#282833] w-[21vw] flex flex-col gap-[0.521vw]'>
            <p className="text-[1.25vw] font-[600] " >Email Account</p>
            <p className={` text-[0.83vw] font-normal text-[#667085]`}>You can manage your email account here</p>
        </div>

        <div className='flex items-center gap-[0.83vw]  '> 
          <div className=' border-[1px] border-[#E0E0E9] w-[32vw] flex h-fit rounded-[0.781vw] items-center justify-center px-[0.83vw] gap-[0.42vw] hover:border-[#667085]  '>
            <CiSearch className='text-[1.23vw]'/>
            <input type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  placeholder='Search Here' className='w-[32vw] h-[4.96vh] outline-none  text-[#363641] text-[0.92vw]' required />
          </div>
          <div 
          onClick={() => {
            setShow(true)
            
            setActiveEmail("addemail")
          }}  
          className=' bg-[#50589F]  hover-button text-white w-[8.64vw] h-[2.604vw] text-[0.94vw] flex gap-[0.83vw] items-center justify-center rounded-[0.781vw] cursor-pointer'>
            <AiOutlinePlus />
            Add Email
          </div>
        </div>
      </div>


    <EmailTable  
    users={searchTerm === "" ?users : searchItems } setUsers={setUsers} setShow={setShow}
    emailForCompare={emailForCompare}
    setEmailForCompare={setEmailForCompare}
    activeEmail={activeEmail}
    setActiveEmail={setActiveEmail}
    />

    <BaseCard
      setShow={setShow}
      show={show}
      users={users}
      setUsers={setUsers}
      emailForCompare={emailForCompare}
      setEmailForCompare={setEmailForCompare}
      activeEmail={activeEmail}
      setActiveEmail={setActiveEmail}
      />
    </div>
  )
}



export default Page