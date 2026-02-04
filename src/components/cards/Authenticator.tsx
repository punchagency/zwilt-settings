import { AuthProps } from '@/types/GeneralType'
import React from 'react'
import { IoMdClose } from 'react-icons/io'
import { useMutation } from '@apollo/client';
import { GENERATE_SECRET } from '@/graphql/mutations/settings';
import { secretVar } from './state';
import { ClipLoader } from 'react-spinners';
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";


const Authenticator: React.FC<AuthProps> = ({setOpenAuthenticator, auth, setAuth}) => {
  const [generateSecret, { loading, data, error }] = useMutation(GENERATE_SECRET);

  async function genAuth() {
    try { 
      const { data } = await generateSecret({ });

      if (error) notifyErrorFxn(error.message);

      const { generateTwoFactorSecret } = data;
      if (generateTwoFactorSecret) {
        secretVar(generateTwoFactorSecret)
        setAuth(true)
      }

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={` ${auth? "hidden" : "flex"} flex-col gap-[2.4vh] bg-white h-fit w-[32.29vw] z-50 py-[1.6vh] px-[0.83vw] text-[#282833] rounded-[1.56vw] shadow-lg`}>
        <div className=' flex justify-between items-center'>
            <p className='font-[600] text-[1.25vw]'> Authenticator App</p>
            <div onClick={() =>setOpenAuthenticator(false)} className='cursor-pointer border border-[#E0E0E9] w-fit rounded-[0.623vw] py-[0.8vh] px-[0.42vw] text-[0.83vw] hover:border-[#B8B8CD] hover:bg-[#F4F4FA]'><IoMdClose /></div>
        </div>
  
        <div>
            <p className='text-[0.83vw] font-[400] w-[23.7vw] text-[#667085]'>Instead of waiting for text messages, get verification codes from an authenticator app. It works even if your phone is offline. </p>
        </div>
          
        <div>
            <p className='text-[0.83vw] font-[400] w-[27vw] text-[#667085]'>First, download Google Authenticator from the  
            <a href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&p' target='_blank' className=' underline text-[#50589F] font-[600]'>Google Play Store</a> or the 
            <a href='https://apps.apple.com/us/app/google-authenticator/id388497605' target='_blank' className=' underline text-[#50589F] font-[600]'>iOS App Store</a></p>
        </div>
        <div onClick={() => genAuth()} className='cursor-pointer h-[5vh] w-[14.56vw] text-[0.93vw] border bg-[#50589F] hover-button text-white rounded-[15px] flex items-center justify-center'>
          {
            loading ?
            <span className='flex items-center'>
                <ClipLoader
                  color='white'
                  size={"2.4vh"}
                />
                
            </span> 
            :
            "Set up Authenticator"
            
            }
        </div>

    </div>   
  )
}
              
export default Authenticator