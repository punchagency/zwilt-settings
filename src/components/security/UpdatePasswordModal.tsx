import { UPDATE_PASSWORD } from '@/graphql/mutations/settings';
import useAuth from '@/hooks/useAuth';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react'
import { notifyErrorFxn, notifySuccessFxn } from 'utils/toast-fxn';

interface Updateprops {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    setCurrentPassword: any;
    setNewPassword: any
    setConfirmPassword: any;
    openModal: boolean;
    setOpenModal: any

}

const UpdatePasswordModal: React.FC<Updateprops> = ({currentPassword, newPassword, confirmPassword, openModal, setOpenModal, setConfirmPassword, setCurrentPassword, setNewPassword}) => {
    const [logOut, setLogOut] = useState(false)
    const { handleLogout, showSuccessMessage } = useAuth();



    const [changePassword, {loading}] = useMutation(UPDATE_PASSWORD, {
        onCompleted: (data) => {
            notifySuccessFxn("Password updated successfully")
            setOpenModal(false)
            if(logOut){
                handleLogout()

            } else {
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')

            }
        },
        onError: (error)=> {
            notifyErrorFxn(error.message)
        }
    });


    function updatePassword(e: any) {
        e?.preventDefault()
        setLogOut(false)
        if(currentPassword !== "" && newPassword !== ""){
            if(newPassword === confirmPassword ){
                    changePassword({
                        variables: {
                            newPassword: newPassword,
                            currentPassword: currentPassword
                        }
                    })
            } 
        } else {
            notifyErrorFxn("No field must be empty")
        }
    }

    function updatePasswordAndLogOut(e: any) {
        e?.preventDefault()
        setLogOut(true)
        if(currentPassword !== "" && newPassword !== ""){
            if(newPassword === confirmPassword ){
                    changePassword({
                        variables: {
                            newPassword: newPassword,
                            currentPassword: currentPassword
                        }
                    })
            } 
        } else {
            notifyErrorFxn("No field must be empty")
        }
    }





if(openModal)
  return (
    
    <div className='fixed top-0 left-0 bg-black bg-opacity-[25%] h-full w-full flex items-center justify-center'>
        <div className='bg-white w-[20vw] h-[6vw] rounded-[1.25vw] flex items-center justify-center flex-col'>
            <div>
                <p className='text-[0.83vw] font-bold px-[0.83vw]'>Do you want to log out of this account ?</p>
            </div>
            <div className='grid grid-cols-2 w-full pt-[0.83vw] gap-[0.73vw] px-[0.83vw] '>
                <div 
                onClick={updatePassword}
                className='w-full cursor-pointer h-[4vh] border border-[#E0E0E9] hover:bg-[#F4F4FA] rounded-[0.781vw] text-[0.93vw] flex items-center justify-center'>NO</div>

                <div
                onClick={updatePasswordAndLogOut}
                className='w-full cursor-pointer h-[4vh] border bg-[#50589F] hover-button text-[0.93vw] text-white rounded-[0.78125vw] flex items-center justify-center'>YES</div>
            </div>
        </div>
    </div>
  )
}

export default UpdatePasswordModal