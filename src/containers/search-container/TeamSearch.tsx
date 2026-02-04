import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

import teamImage from "@/assests/icons/team.svg"



interface securityProps{
    searchQuery: string;
    setIsFocus: any;
    setSearchQuery: any;
    setEmpty: any

}
const TeamSearch:React.FC<securityProps> = ({searchQuery, setIsFocus, setSearchQuery, setEmpty}) => {
const [searchable, setSearchable] = useState([
    {
        title: "Manage Team",
        locate: "Manage Team",
        href: "/manageteam"
    },
    {
      title: "Add Team Member",
      locate: "Manage Team",
      href: "/manageteam"
    },
    {
      title: "My Team",
      locate: "Manage Team",
      href: "/manageteam"
    },
    {
      title: "Admin Users",
      locate: "Manage Team",
      href: "/manageteam"
    },
    {
      title: "Account Users",
      locate: "Manage Team",
      href: "/manageteam"
    },
    {
      title: "Sent Invitation",
      locate: "Manage Team",
      href: "/manageteam"
    },
    {
      title: "Sent Invitation",
      locate: "Manage Team",
      href: "/manageteam"
    },
    {
      title: "Edit Team User",
      locate: "Manage Team",
      href: "/manageteam"
    },
    {
      title: "Delete Team User",
      locate: "Manage Team",
      href: "/manageteam"
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
        <p className=' font-[600] text-[0.93vw] '>Manage Team</p>
      {searchItems?.map((item: any, index: number) => (
        <div
        onClick={() => handleNavigate(item.href)}
            key={index} className='flex gap-4 h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]'>
           <Image src={teamImage} alt="email" />
              <div>
                <p className='font-[500] text-[0.93vw] '>{item.title}</p>
                <p className='text-[0.73vw] text-gray-500' >{item.locate}</p>
                
              </div>
        </div>
      ))}
    </div>
  )
}

export default TeamSearch