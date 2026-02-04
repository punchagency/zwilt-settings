import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

import NotificationImage from "@/assests/icons/Notifications.svg"
import Image from 'next/image';


interface securityProps{
    searchQuery: string;
    setIsFocus: any;
    setSearchQuery: any;
    setEmpty: any

}
const NotificationSearch:React.FC<securityProps> = ({searchQuery, setIsFocus, setSearchQuery,setEmpty}) => {
const [searchable, setSearchable] = useState([
    {
        title: "Basic Notification Settings",
        locate: "Notification Setiings",
        href: "/notifications?tab=basic"
    },
    {
        title: "Job Notification Settings",
        locate: "Notification Setiings",
        href: "/notifications?tab=jobs"
    },
    {
        title: "Interview Notification Settings",
        locate: "Notification Setiings",
        href: "/notifications?tab=interview"
    },
    {
        title: "Candidate Notification Settings",
        locate: "Notification Setiings",
        href: "/notifications?tab=candidate"
    },
    {
        title: "Team Activity Notification Settings",
        locate: "Notification Setiings",
        href: "/notifications?tab=team-activity"
    },
    {
        title: "Billing and Payment Notification Settings",
        locate: "Notification Setiings",
        href: "/notifications?tab=billing-&-payment"
    },
    {
        title: "User Account Notification Settings",
        locate: "Notification Setiings",
        href: "/notifications?tab=user-account"
    },
 

])


const searchItems = searchable?.filter((item: any) =>
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const router  = useRouter()


  const handleNavigate = (route: any) => {
    router.push(route)
    setIsFocus(false)
    setSearchQuery("")

  }

  useEffect(() => {
    if(searchItems.length === 0){
      setEmpty(true)
    } else{
      setEmpty(false)
    }
  }, [searchItems])

  if (!searchItems?.length) {
    return null
  }

  if (searchQuery.length === 0){
    return null
  }


  
  return (
    <div className='pt-[0.83vw] border-t'>
        <p className=' font-[600] text-[0.93vw] '>Notification Settings</p>
      {searchItems?.map((item: any, index: number) => (
        <div
        onClick={() => handleNavigate(item.href)}
            key={index} className='flex gap-4 h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]'>
           <Image src={NotificationImage} alt="email" />
              <div>
                <p className='font-[500] text-[0.93vw] '>{item.title}</p>
                <p className='text-[0.73vw] text-gray-500' >{item.locate}</p>
                
              </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationSearch