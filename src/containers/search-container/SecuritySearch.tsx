import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

import securityImage from "@/assests/icons/security.svg"
import Image from 'next/image';



interface securityProps{
    searchQuery: string;
    setIsFocus: any;
    setSearchQuery: any;
    setEmpty: any

}
const SecuritySearch:React.FC<securityProps> = ({searchQuery, setIsFocus, setSearchQuery, setEmpty}) => {
const [searchable, setSearchable] = useState([
    {
        title: "Passsword & security",
        locate: "Password & Security",
        href: "/securitysettings"
    },
    {
        title: "Basic",
        locate: "Password & Security",
        href: "/securitysettings"
    },
    {
        title: "Turn on Two Factor Authentication",
        locate: "Password & Security > Basic",
        href: "/securitysettings"
    },
    {
        title: "Browsers and Devices",
        locate: "Password & Security > Basic",
        href: "/securitysettings"
    },
    {
        title: "Change Password",
        locate: "Password & Security",
        href: "/securitysettings?tab=change-password"
    },
    {
        title: "Two factor Authentication",
        locate: "Password & Security",
        href: "/securitysettings?tab=two-factor-auth"
    },
    {
        title: "Add Phone Number",
        locate: "Password & Security > Two Factor Authentication",
        href: "/securitysettings?tab=two-factor-auth"
    },
    {
        title: "Add Authentication",
        locate: "Password & Security > Two Factor Authentication",
        href: "/securitysettings?tab=two-factor-auth"
    },

])


const searchItems = searchable?.filter((item: any) =>
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const router  = useRouter()
useEffect(() => {
  if(searchItems.length === 0){
    setEmpty(true)
  } else{
    setEmpty(false)
  }
}, [searchItems])

  const handleNavigate = (route: any) => {
    router.push(route)
    setIsFocus(false)
    setSearchQuery("")

  }

  if (!searchItems?.length) {
    return null
  }

  if (searchQuery.length === 0){
    return null
  }

  
  return (
    <div className='pt-[0.83vw] border-t'>
        <p className=' font-[600] text-[0.93vw] '>Password & Security</p>
      {searchItems?.map((item: any, index: number) => (
        <div
        onClick={() => handleNavigate(item.href)}
            key={index} className='flex gap-4 h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]'>
           <Image src={securityImage} alt="email" />
              <div>
                <p className='font-[500] text-[0.93vw] '>{item.title}</p>
                <p className='text-[0.73vw] text-gray-500' >{item.locate}</p>
                
              </div>
        </div>
      ))}
    </div>
  )
}

export default SecuritySearch