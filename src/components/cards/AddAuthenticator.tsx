import React from 'react'
import { IoMdClose } from 'react-icons/io'
import Image from 'next/image'
import QRcode from "../../assests/icons/qrcode.svg"
import { verifyAuth } from '@/types/GeneralType'
import { useReactiveVar } from '@apollo/client';
import { secretVar } from './state';
import { useQRCode  } from 'next-qrcode';

const AddAuthenticator: React.FC<verifyAuth> = ({ setOpenAuthenticator, auth, setAuth, addAuth, setAddAuth }) => {
    const secret = useReactiveVar(secretVar);
    const { Canvas } = useQRCode();

    return (
        <div className={`${auth && !addAuth ? "flex" : "hidden"}  flex-col gap-[2.4vh] bg-white h-fit w-[32vw] z-50 py-[1.6vh] px-[0.83vw] text-[#282833] rounded-[1.56vw] shadow-lg`}>
            <div className='flex flex-col gap-[0.8vh]'>
                <div className=' flex justify-between items-center'>
                    <p className='font-[600] text-[1.25vw]'> Setup Authenticator App</p>
                    <div onClick={() => setOpenAuthenticator(false)} className='cursor-pointer border hover:bg-[#F4F4FA] border-[#E0E0E9] w-fit rounded-[0.63vw] py-[0.8vh] px-[0.41vw] hover:border-[#B8B8CD] text-[0.83vw]'><IoMdClose /></div>
                </div>
                <div className='px-[1.25vw]'>
                    <ul className=' list-disc font-[600] text-[#667085] text-[0.83vw]'>
                        <li>In authenticator app tap the<span className='font-bold text-[#282833]'> +</span> </li>
                        <li>Choose <span className=' text-[#282833]'>Scan QR Code</span></li>
                    </ul>
                </div>
            </div>

            <div className='flex items-center justify-center '>
                {/* <Image src={QRcode} alt='qrcode' /> */}
                {secret && (
                    <Canvas
                        text={secret}
                        options={{
                            
                            errorCorrectionLevel: 'H',
                            // margin: 3,
                            // scale: 4,
                            width: 252,
                            // color: {
                            //     dark: '#010599FF',
                            //     light: '#FFBF60FF',
                            // },
                        }}
                        
                    />
                )}
            </div>

            <div className='grid grid-cols-2 gap-[1.6vh]'>
                <div onClick={() => setAuth(false)} className='cursor-pointer h-[5vh] border border-[#E0E0E9] hover:border-[#B8B8CD] rounded-[0.78vw] flex items-center justify-center text-[0.83vw] hover:bg-[#F4F4FA] '>Cancel</div>
                <div onClick={() => setAddAuth(true)} className='cursor-pointer h-[5vh] border bg-[#50589F] hover-button text-white rounded-[0.78vw] flex items-center justify-center text-[0.83vw] '>Next</div>
            </div>
        </div>
    )
}

export default AddAuthenticator