import { NumberCard } from '@/types/GeneralType'
import React from 'react'
import AddNumber from './AddNumber'
import VerifyNumber from './VerifyNumber'

const BaseNumberCard: React.FC<NumberCard> = ({
    openCard,
    setOpenCard,
    verifyOpen,
    setVerifyOpen,
    phone,
    setPhone,
    setVerifiedNumber,
    setNumberVerified
}) => {

     // adding spaces between the phone number
  const addSpaces = (str: string) => {
    return str.replace(/.{3}/g, '$& ')
  }
    

  return (
    <div
     className={`z-[100]  ${openCard ? "fixed" :"hidden"}  top-0 left-0 h-screen w-[100%] bg-[#282833] bg-opacity-[30%]   flex items-center justify-center`}>    
            <AddNumber 
            setOpenCard={setOpenCard} 
            verifyOpen={verifyOpen} 
            setVerifyOpen={setVerifyOpen} 
            phone={phone.replace(/.{3}/g, '$& ')} 
            setPhone={setPhone}/>

            <div className={` ${ verifyOpen ? "block" : "hidden"}`}>

              <VerifyNumber 
                setOpenCard={setOpenCard} 
                verifyOpen={verifyOpen} 
                setVerifyOpen={setVerifyOpen}  
                head="Verify This Phone Number"
                text={`Zwitl sent a verification code to ${addSpaces(phone)}.`}
                setVerified={setVerifiedNumber}
                setItemVerified={setNumberVerified}
                item ={addSpaces(phone)}

              />
            </div>
         </div>
  )
}

export default BaseNumberCard