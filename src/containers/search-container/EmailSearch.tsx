import useEmailAccountService from '@/hooks/use-email-account';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import emailImage from "@/assests/icons/email.svg"
import Image from 'next/image';


interface EmailSearchProps {
  searchQuery: string;
  setIsFocus: any;
  setSearchQuery: any;
  setEmpty: any

}

const EmailSearch: React.FC<EmailSearchProps> = ({ searchQuery, setIsFocus, setSearchQuery, setEmpty }) => {
  const router = useRouter();
  const [searchable, setSearchable] = useState([
    {
      title: "Email Account",
      locate: "Email Account",
      href: "/emailaccount"
    },
    {
      title: "Manage Email",
      locate: "Email Account",
      href: "/emailaccount"
    },
    {
      title: "Add Email",
      locate: "Email Account",
      href: "/emailaccount"
    },
    {
      title: "Assign Email to user",
      locate: "Email Account",
      href: "/emailaccount"
    },
    {
      title: "Delete Email Account",
      locate: "Email Account",
      href: "/emailaccount"
    },
  ]);

  const searchItems = searchable?.filter((item: any) =>
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if(searchItems.length === 0){
      setEmpty(true)
    } else{
      setEmpty(false)
    }
  }, [searchItems])

  // Handle loading and empty state
  const handleNavigate = (route: any) => {
    router.push(route);
    setIsFocus(false);
    setSearchQuery("");
  };

  if (!searchItems?.length) {
    return null;
  }

  if (searchQuery.length === 0) {
    return null;
  }

  return (
    <div className='pt-[0.83vw] border-t'>
      <p className='font-[600] text-[0.93vw] sticky top-0 bg-white z-[1000]'>Email Account</p>
      {searchItems?.map((item: any, index: number) => (
        <div
          onClick={() => handleNavigate(item.href)}
          key={index}
          className='flex gap-2 h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]'
        >
          <Image src={emailImage} alt="email" />
          <div>
            <p className='font-[500] text-[0.93vw]'>{item.title}</p>
            <p className='text-[0.73vw] text-gray-500'>{item.locate}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailSearch;
