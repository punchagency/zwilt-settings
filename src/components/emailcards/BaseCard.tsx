import React, { useState } from 'react'
import AssignEmail from './AssignEmail'
import { baseCardType } from '@/types/GeneralType'
import AddEmail from './AddEmail'
import ConnectGoogle from './ConnectGoogle'
import SignGoogle from './SignGoogle'
import SignGoogleToZwilt from './SignGoogleToZwilt'
import MicrosoftCard from './MicrosoftCard'
import CreateEmail from './CreateEmail'
import CreateEmail2 from './CreateEmail2'
import { AnimatePresence , motion} from "framer-motion";
import { useFormik } from 'formik'
import * as Yup from "yup";
import { useMutation } from '@apollo/react-hooks'
import { AddAndConnectEmailAccount } from '@/graphql/mutations/emailAccount'
import { useRecoilValue } from 'recoil'
import { confirmDeleteIcon } from '../../../utils/recoil_store/atoms/emailToAssign'
import DeleteEmail from './DeleteEmail'



const BaseCard: React.FC<baseCardType> = ({
    setShow, 
    show, 
    users, 
    setUsers, 
    emailForCompare, 
    setEmailForCompare, 
    setActiveEmail, 
    activeEmail}) => {

    const [customEmail, setCustomEmail] = useState({
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      host: "",
      port: 0
    })

    const deleteEmail = useRecoilValue(confirmDeleteIcon)


      //mutation
      const [addAndConnectEmailAccount] = useMutation(AddAndConnectEmailAccount, {
        variables: {

        },
        onCompleted: (data) => {
        
          console.log("Profile updated successully")
        },
        onError: (error) => {
          console.log("Error updating profile");
        },
      });



  return (
    <AnimatePresence>
    {show  && (
      <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      exit={{ opacity: 0}}
      transition={{ duration: 0.5,  }}
    className={`  fixed top-0 left-0 h-screen w-[100vw] z-[100] bg-[#282833] bg-opacity-[30%] flex  items-center justify-center `}>
       <AssignEmail 
            setShow={setShow}
            users={users}
            setUsers={setUsers}
            emailForCompare={emailForCompare}
            setEmailForCompare={setEmailForCompare}
            activeEmail={activeEmail}
            setActiveEmail={setActiveEmail}
        />
 
        <AddEmail 
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        setShow={setShow}
        /> 

        {/* googlee cards */}
       <ConnectGoogle
            activeEmail={activeEmail}
            setActiveEmail={setActiveEmail}
            setShow={setShow}
        />

         <SignGoogle 
         activeEmail={activeEmail}
         setActiveEmail={setActiveEmail}
         setShow={setShow}
         />

        <SignGoogleToZwilt
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        setShow={setShow}
        />

        {/* microsoft card */}

        <MicrosoftCard
          activeEmail={activeEmail}
          setActiveEmail={setActiveEmail}
          setShow={setShow}
        />

        {/* SMTP CARD */}
        <CreateEmail 
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        setShow={setShow}
        customEmail={customEmail}
        setCustomEmail={setCustomEmail}
        />

        <CreateEmail2 
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        setShow={setShow}
        customEmail={customEmail}
        setCustomEmail={setCustomEmail}

        />
        <DeleteEmail
        setShow={setShow}
        />
    </motion.div>
    )}
    </AnimatePresence>
   
  )
}

export default BaseCard