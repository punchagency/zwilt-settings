import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { PhoneInput } from 'react-international-phone';
import "react-international-phone/style.css";
import RadioButton from '../RadioButton';
import { addNumberType } from '@/types/GeneralType';
import { ADD_PHONE } from '@/graphql/mutations/settings';
import { useMutation } from '@apollo/client';
import { phoneVerificationRequestIdVar } from './state/index';
import { ClipLoader } from 'react-spinners';
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";



const AddNumber: React.FC<addNumberType> = ({ setOpenCard, verifyOpen, setVerifyOpen, phone, setPhone }) => {

  const [sendVerification, { loading, data, error }] = useMutation(ADD_PHONE);
  const [type, setType] = useState('SMS');

  async function handleSendVerification() {
    try {
      const { data } = await sendVerification({
        variables: {
          phone: phone.replace(/\s/g, ''),
          verificationType: type
        }
      });

      if (error) notifyErrorFxn(error.message);

      const { addPersonalPhoneNumber } = data;
      if (type == 'SMS') {
        if (addPersonalPhoneNumber?.requestId) {
          phoneVerificationRequestIdVar(addPersonalPhoneNumber?.requestId)
          setVerifyOpen(true)
        }
      } else {
        if (addPersonalPhoneNumber.called && addPersonalPhoneNumber.called == 'success') {
          setVerifyOpen(true)
        }
      }

    } catch (error) {
      console.error(error);
    }
  }



  
  return (
    <div className={`${verifyOpen ? "hidden" : "flex"} flex-col z-50  gap-[2.4vh] bg-white h-fit w-[32.29vw] py-[1.6vh] px-[1.09vw] text-[#282833] rounded-[1.56vw] shadow-lg`}>
      <div className=' flex justify-between items-center'>
        <p className='font-[600] text-[1.25vw]'> Add a Phone Number</p>
        <div onClick={() => setOpenCard(false)} className='cursor-pointer border border-[#E0E0E9] w-fit rounded-[0.623vw] py-[0.8vh] px-[0.42vw] text-[0.83vw] hover:border-[#B8B8CD] hover:bg-[#F4F4FA]'><IoMdClose  /></div>
      </div>
      <div>
        <p className='text-[0.83vw] font-[400] w-[23.7vw] text-[#667085]'>A phone number can be used as a second step, to help you sign back in if you lose access,
          and to receive alerts if there’s unusual activity </p>
      </div>
      <div className="flex items-center ">
        <PhoneInput
          defaultCountry="ua"
          value={phone}
          onChange={(value) => setPhone(value)}
          inputClassName="phone w-[26vw] h-[2.60417vw] !h-[2.60417vw] px-4  border-[#E0E0E9] border rounded-md focus:outline-none "
          // buttonClass="bg-green-500 hover:bg-green-600 focus:outline-none rounded-r-lg h-[5vh]"
        />
      </div>
      {/* <div className='flex flex-col gap-[1.2vh]'>
        <p className='font-[600] text-[0.93vw]'>How do you want to get the code? </p>
        <RadioButton onChange={setType} defaultValue={type}  />
      </div> */}

      <div className='flex flex-col gap-[1.2vh]'>
          <p className='font-[600] text-[0.93vw]'>How do you want to get the code? </p>
          <div className=' flex  gap-[2.083vw]'>
            <span className='flex items-center gap-[0.52vw]'>
              <input type="radio" name="code" id="" className=' accent-[#282833] cursor-pointer h-[2.4vh] w-[1.25vw]'/>
              <label className='text-[0.83vw] font-[400]'>Text Message</label>
            </span>

            <span className='flex items-center gap-[0.52vw]'>
              <input type="radio" name="code" id="" className=' accent-[#282833] cursor-pointer h-[2.4vh] w-[1.25vw]' />
              <label className='text-[0.83vw] font-[400]'>Phone Call</label>
            </span>
          </div>
      </div>

      <div className='grid grid-cols-2 gap-[1.6vh]'>
        <div onClick={() => setOpenCard(false)} className='cursor-pointer h-[5vh] border text-[0.93vw] opacity-[70%] hover:opacity-[100%] border-[#E0E0E9] hover:border-[#B8B8CD] rounded-[0.781vw] flex items-center justify-center hover:bg-[#F4F4FA]'>Cancel</div>
        <div onClick={handleSendVerification} className='cursor-pointer h-[5vh] border text-[0.93vw] bg-[#50589F] hover-button  text-white rounded-[0.781vw] flex items-center justify-center '>
        {
            loading ?
            <span className='flex items-center'>
                <ClipLoader
                  color='white'
                  size={"2.4vh"}
                />
                
            </span> 
            :
            "Send"
            
            }
          </div>
      </div>


    </div>
  )
}

export default AddNumber