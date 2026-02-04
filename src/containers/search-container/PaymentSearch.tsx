import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

import paymentImage from "@/assests/icons/payment.svg"
import Image from 'next/image';



interface securityProps{
    searchQuery: string;
    setIsFocus: any;
    setSearchQuery: any;
    setEmpty: any

}
const PaymentSearch:React.FC<securityProps> = ({searchQuery, setIsFocus, setSearchQuery, setEmpty}) => {
const [searchable, setSearchable] = useState([
    {
        title: "Payment and Billing",
        locate: "Payment and Billing",
        href: "/payment"
    },
    {
        title: "Bill Summary",
        locate: "Payment and Billing > Billing Summary",
        href: "/payment?tab=Billing+Summary"
    },
    {
        title: "Estimated Billing Sumary",
        locate: "Payment and Billing",
        href: "/payment?tab=Billing+Summary"
    },
    {
        title: "Product / Services",
        locate: "Payment and Billing",
        href: "/payment?tab=Billing+Summary"
    },
    {
        title: "Payment Method",
        locate: "Payment and Billing > Payment Method",
        href: "/payment?tab=Payment+Methods"
    },
    {
        title: "Billing and invoices",
        locate: "Payment and Billing > Billing and invoices",
        href: "/payment?tab=Invoices"
    },
    {
        title: "Card Details",
        locate: "Payment and Billing > Payment Method",
        href: "/payment?tab=Payment+Methods"
    },
    {
        title: "Add New Payment Method",
        locate: "Payment and Billing > Payment Method",
        href: "/payment?tab=Payment+Methods"
    },
  

])


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
        <p className=' font-[600] text-[0.93vw] '>Payment & Billing</p>
      {searchItems?.map((item: any, index: number) => (
        <div
        onClick={() => handleNavigate(item.href)}
            key={index} className='flex gap-4 h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]'>
            <Image src={paymentImage} alt="email" />
              <div>
                <p className='font-[500] text-[0.93vw] '>{item.title}</p>
                <p className='text-[0.73vw] text-gray-500' >{item.locate}</p>
                
              </div>
        </div>
      ))}
    </div>
  )
}

export default PaymentSearch