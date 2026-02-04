import React, { Dispatch, SetStateAction, useState } from 'react'
import { useRecoilState } from 'recoil'
import { confirmDeleteIcon, userEmailToDelete } from '../../../utils/recoil_store/atoms/emailToAssign'
import { IoMdClose } from 'react-icons/io'
import Image from 'next/image'
import face from '../../assests/images/account-user-four.png'
import useEmailAccountService from '@/hooks/use-email-account'
import { DeleteEmailAccount } from '@/graphql/mutations/emailAccount'
import { useMutation } from '@apollo/client'
import { notifySuccessFxn, notifyErrorFxn } from '../../../utils/toast-fxn'

interface deleteType{
    setShow: Dispatch<SetStateAction<boolean>>;
}

const DeleteEmail: React.FC<deleteType> = ({setShow}) => {
    const { emailAcccountData,  emailAccountRefetch} = useEmailAccountService();
    const [emailInput, setEmailInput] = useState("")

    const [deleteEmailAccount] = useMutation(DeleteEmailAccount, {
        onCompleted: (data) => {
            notifySuccessFxn("Email deleted successfully")
            emailAccountRefetch()
        },
        onError: (error) =>{
            notifyErrorFxn(`error deleting user ${error}`)
        }
    })



    const [deleteEmail, setDeleteEmail] = useRecoilState(confirmDeleteIcon)
    const [emailToDelete, setEmailTodelete] = useRecoilState(userEmailToDelete)



    const handleDelete = () => {
        emailAcccountData?.getEmailAccounts?.data?.map((item:any) => {
            if(item.email === emailToDelete){
                if(emailInput !== emailToDelete){
                notifyErrorFxn("email does not match!!")
                }else{
                    deleteEmailAccount({
                        variables: {
                            input: {
                                emailToDelete: emailToDelete
                            }
                        }
                    })
    
                    setShow(false)
                    setDeleteEmail(false)

                }
            }
            
        })


    }



  return (
    <>
    { deleteEmail && (

        <div className="absolute bg-white flex flex-col gap-4  h-fit w-[27vw] z-50 py-4 text-[#282833] rounded-[30px] shadow-lg">
            <div className='px-6 flex justify-between items-center'>
                    <p className='font-[600] text-[18px]'> Delete this Email</p>
                    <div
                    onClick={() => {
                       setShow(false)
                       setDeleteEmail(false)
                    }}
                    className='cursor-pointer border border-[#E0E0E9] w-fit rounded-[12px] p-2 hover:bg-[#F4F4FA]'><IoMdClose size={14}/></div>
            </div>

            <div className='flex gap-2 border-t-[1px] border-b-[1px] border-[#E0E0E9] py-4 px-6'>
                
                    <p className=' text-[16px] font-[600]'>{emailToDelete}</p>
            
            </div>

            <div className='px-6'>
                <p className=' font-[600] text-[16px]'>Confirm Delete</p>
                <p className=' text-[12px] text-[#667085] font-[500]'>Complete the delete process by entering the email you want to delete</p>
            </div>
            <div className=' border-[1px] border-[#E0E0E9] rounded-[15px] mx-6 px-4 hover:border-[#282833]'>
                <input type="email" name="" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder='Eneter Email' id="" className=' w-full h-[39px] outline-none'/>
            </div>

            <div className='grid grid-cols-2 gap-4 px-4 pt-2'>
                    <div  
                    onClick={() => {
                        setShow(false)
                        setDeleteEmail(false)
                     }} 
                    className='cursor-pointer h-[40px] border border-[#E0E0E9] hover:bg-[#F4F4FA] rounded-[15px] flex items-center justify-center'>Cancel</div>

                    <div
                    onClick={handleDelete}
                    className='cursor-pointer h-[40px] border bg-[#50589F] hover-button text-white rounded-[15px] flex items-center justify-center'>Continue</div>
            </div>


        </div>
    )

    }
    </>
  )
}

export default DeleteEmail