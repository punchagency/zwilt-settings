import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

import supportImage from "@/assests/icons/support.svg"


interface securityProps{
    searchQuery: string;
    setIsFocus: any;
    setSearchQuery: any;

}
const SuppportSearch:React.FC<securityProps> = ({searchQuery, setIsFocus, setSearchQuery}) => {
const [searchable, setSearchable] = useState([
    {
        title: "Support",
        locate: "Support",
        href: "/support"
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

  if (!searchItems?.length) {
    return null
  }

  if (searchQuery.length === 0){
    return null
  }

  
  return (
    <div className='pt-[0.83vw] border-t'>
        <p className=' font-[600] text-[0.93vw] '>Support</p>
      {searchItems?.map((item: any, index: number) => (
        <div
        onClick={() => handleNavigate(item.href)}
            key={index} className='flex gap-4 h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]'>
            <Image src={supportImage} alt="email" />
              <div>
                <p className='font-[500] text-[0.93vw] '>{item.title}</p>
                <p className='text-[0.73vw] text-gray-500' >{item.locate}</p>
                
              </div>
        </div>
      ))}
    </div>
  )
}

export default SuppportSearch