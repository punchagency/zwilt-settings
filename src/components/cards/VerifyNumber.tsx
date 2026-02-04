import { cardProp } from '@/types/GeneralType'
import React, {useState} from 'react'
import { IoMdClose } from 'react-icons/io'
import { VERIFY_PHONE } from '@/graphql/mutations/settings';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { phoneVerificationRequestIdVar } from './state/index';
import { ClipLoader } from 'react-spinners';
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";
import useUser from 'utils/recoil_store/hooks/use-user-state';


const VerifyNumber: React.FC<cardProp> =  ({ setOpenCard, setVerifyOpen, head, text, setVerified, setItemVerified, item}) => {
    

    const requestId = useReactiveVar(phoneVerificationRequestIdVar);
    const [verifyPhone, {loading}] = useMutation(VERIFY_PHONE, {
        onCompleted: () => {
            notifySuccessFxn("verified")
            setOpenCard(false);
            setVerifyOpen(false);
        },
        onError: (error) => {
            notifyErrorFxn(error.message)
        }
    });
    const [userId, setUserId] = useState('')
    const [code, setCode] = useState('');
    const { userState } = useUser();







    function complete() {
        setOpenCard(false);
        setVerifyOpen(false);
        setVerified(true)
        setItemVerified(item);
        phoneVerificationRequestIdVar(null);
    }



    const handleClick =  () => {
            verifyPhone({
                variables: {
                    code: code,
                    requestId: requestId
                }
            });
    } 


  return (
    <div className={` "flex"  flex-col gap-[4vh]  bg-white h-fit w-[32vw] z-50 py-[1.6vh] px-[0.83vw] text-[#282833] rounded-[1.56vw] shadow-lg`}>
        <div className=' flex flex-col gap-[0.8vh] pb-[1.6vh]'>
            <div className=' flex justify-between items-center'>
                <p className='font-[600] text-[1.25vw]'> {head}</p>
                <div onClick={() => setOpenCard(false)}  className='cursor-pointer border border-[#E0E0E9] w-fit rounded-[0.63vw] py-[0.8vh] px-[0.42vw] text-[0.83vw] hover:border-[#B8B8CD] hover:bg-[#F4F4FA]'><IoMdClose/></div>
            </div>
            <div>
                <p className='text-[0.83vw] font-[400] w-fit text-[#667085]'>{text}</p>
            </div>
    
        </div>

        <div>
            <input onChange={(e) => setCode(e.target.value)} type="text" className='h-[5vh] border boder-[#E0E0E9] text-[0.93vw] w-full px-[0.83vw] rounded-[0.63vw] outline-none' />
        </div>

        <div className='grid grid-cols-2 gap-[1.6vh] pt-[1.6vh]'>
            <div onClick={() => setVerifyOpen(false)}  className='cursor-pointer h-[5vh] border border-[#E0E0E9] rounded-[0.78vw] flex items-center justify-center text-[0.83vw] hover:border-[#B8B8CD] hover:bg-[#F4F4FA]'>Back</div>
            <div onClick={handleClick} 
                className='cursor-pointer h-[5vh] border bg-[#50589F] hover-button text-white rounded-[0.78vw] flex items-center justify-center text-[0.83vw]'>
                {
                    loading ?
                    <span className='flex items-center'>
                        <ClipLoader
                        color='white'
                        size={"2.4vh"}
                        />
                        
                    </span> 
                    :
                    "Verify"
                }
            </div>
        </div>
    </div>
  ) 
}

export default VerifyNumber