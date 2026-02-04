import { AuthenticatorCardType } from '@/types/GeneralType'
import React from 'react'
import Authenticator from './Authenticator'
import AddAuthenticator from './AddAuthenticator'
import CompleteAuthentication from './CompleteAuthentication'

const BaseAuthCard: React.FC<AuthenticatorCardType> = ({ 
    openAuthenticator,
    setOpenAuthenticator,
    auth,
    setAuth,
    addAuth,
    setAddAuth,
    setAuthenticatorVerified,
    setVerifiedAuthenticator     
       
}) => {

  return (
    <div className={`${openAuthenticator ? "fixed " : "hidden"} top-0 left-0 h-screen  w-[100vw] bg-[#282833] bg-opacity-[30%] flex  items-center justify-center z-[100]`}>
            <Authenticator 
              setOpenAuthenticator={setOpenAuthenticator} 
              auth={auth}                       
              setAuth={setAuth}
            /> 

              <AddAuthenticator 
                setOpenAuthenticator={setOpenAuthenticator} 
                auth={auth} 
                setAuth={setAuth} 
                addAuth={addAuth} 
                setAddAuth={setAddAuth}
              /> 

              <div className={`${addAuth ? "block" : "hidden"}`}>
                <CompleteAuthentication 
                setOpenCard={setOpenAuthenticator} 
                verifyOpen={addAuth} 
                setVerifyOpen={setAddAuth}  
                head="Setup Authenticator App"
                text="Enter the 6 digit code you see in the app."
                setVerified={setVerifiedAuthenticator}
                setItemVerified={setAuthenticatorVerified}
                item ="Google Authenticator"
                 />
              </div>
         </div>
  )
}

export default BaseAuthCard