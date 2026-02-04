import React, { useEffect, useState } from 'react'
import deleteIcon from "@/assests/icons/delete.svg"
import disconnectIcon from '@/assests/icons/diconnect.svg'
import reload from '@/assests/icons/reload.svg'
import Image from 'next/image'
import { emailTableType } from '@/types/GeneralType'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GetEmailAccounts } from '@/graphql/queries/emailAccount'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userEmailToAssign, confirmDeleteIcon, userEmailToDelete } from '../../../utils/recoil_store/atoms/emailToAssign'
import { DeleteEmailAccount, UnAssignEmailAccount, ConnectAndDisconnectEmail} from '@/graphql/mutations/emailAccount'
import face from "@/assests/images/avatar-PH.jpeg"
import useEmailAccountService from '@/hooks/use-email-account'
import "react-toastify/dist/ReactToastify.css";
import { notifyErrorFxn, notifySuccessFxn, notifyInfoFxn} from "../../../utils/toast-fxn";
import { phraseToSearch } from '../../../utils/recoil_store/atoms/email-account-atom'
import 'react-tooltip/dist/react-tooltip.css'
import { ClipLoader } from 'react-spinners'
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { BootstrapTooltip } from '@/assests/Tooltip'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import EmailCheckbox from './Checkbox'
import useUser from 'utils/recoil_store/hooks/use-user-state'

interface assignedUser{
    _id: string | null,
    profile_img: string 
    
}

interface userEmail {
    assignedUser: assignedUser | null,
    createdAt: string,
    email: string,
    isAssigned: boolean,
    isConnected:boolean,
    serviceProvider: string,
    __typename: string,
    _id: string
}
interface checkprop{
    _id: boolean;
}

const EmailTable: React.FC<emailTableType> = ({users, setUsers, setShow, emailForCompare, setEmailForCompare, activeEmail, setActiveEmail}) => {
    const { emailAcccountData,  emailAccountRefetch, emailAccountLoading} = useEmailAccountService();
    const [deleteEmailIcon, setDeleteEmailIcon] = useRecoilState<boolean>(confirmDeleteIcon)
    const [userEmailDelete, setUserEmailDelete] = useRecoilState(userEmailToDelete)
    const [isConnected, setIsConnected] = useState(false)
    const [checkedItems, setCheckedItems] = useState <any>({});
    const [usersEmail, setUsersEmail] = useState<userEmail[] | null>(null)
    const [checked, setChecked] = useState<boolean>(false)
    const [emailAssign, setEmailAssign] = useRecoilState(userEmailToAssign)
    const searchTerm = useRecoilValue(phraseToSearch)
    const [connect, setConnect] = useState("")
    const [isAllChecked, setIsAllChecked] = useState<any>(false);
 
    const searchItems = usersEmail?.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const itemToShow = searchTerm ===""?  usersEmail : searchItems  

// querying email
 useEffect(() =>{
     setUsersEmail(emailAcccountData?.getEmailAccounts?.data)
    
     const initialState: any = {}
        usersEmail?.forEach((item) => {
            initialState[item._id] = false
        })
        setCheckedItems(initialState)
 }, [emailAcccountData, usersEmail])




//mutation query
const [unAssignEmailAccount] = useMutation(UnAssignEmailAccount, {
    onCompleted: (data) => {
        notifySuccessFxn("unassign successfull!")
        emailAccountRefetch()
    },
    onError: (error) =>{
        notifyErrorFxn('error unassigning user!')
        console.log(`error unassigning user: ${error}`)
    }
})


const [deleteEmailAccount] = useMutation(DeleteEmailAccount, {
    onCompleted: (data) => {
        notifySuccessFxn("Email deleted successfully")
        emailAccountRefetch()
    },
    onError: (error) =>{
        notifyErrorFxn(`error deleting user ${error}`)
    }
})

const [connectAndDisconnectEmail] = useMutation(ConnectAndDisconnectEmail, {
    onCompleted: (data) => {
        notifySuccessFxn(data.connectAndDisconnectEmail.data.isConnected?'connected successfully': "disconnected successfully")
        emailAccountRefetch()
    },
    onError: (error) => {
        notifyErrorFxn(error.message)
    }
})



//toggle between connect and disconnect
    const handleConnection = (email: string, connect: boolean) => {
        usersEmail?.map((item) => {
                if(item.email === email ) {
                    connectAndDisconnectEmail({
                        variables: {
                                email: email,
                                connect: !connect,
                        },
                    })
                }
        })
    }
// individual checkbox handler
const handleChecked = (id: string) => {
    setCheckedItems((prevCheckedItems: any) => {
      const newCheckedItems = {
        ...prevCheckedItems,
        [id]: !prevCheckedItems[id],
      };
      // Update isAllChecked if all items are checked
      const allChecked = usersEmail?.every((item) => newCheckedItems[item?._id]);
      setIsAllChecked(allChecked);

      return newCheckedItems;
    });
  };
//parent check
const handleCheckAll = () => {
    const newCheckedStatus = !isAllChecked;
    const newCheckedItems: any = {};
    usersEmail?.forEach((item) => {
      newCheckedItems[item?._id] = newCheckedStatus;
    });
    setCheckedItems(newCheckedItems);
    setIsAllChecked(newCheckedStatus);
  };
// deleting an email function 
    const handleDeleteEmail = (emailToDelete: any) => {
        setShow(true);
        setDeleteEmailIcon(true)
        setUserEmailDelete(emailToDelete)

    }
    const handleAssign = (email: string) =>{
    setEmailAssign(email)
    setShow(true)
    setActiveEmail("assign")
    setEmailForCompare(email)

    }

    
     
  return (
    <div className='px-[1.25vw] '>
        {
            emailAccountLoading ? 
            ( <div className='w-[100%] h-[70vh] flex items-center justify-center'> 
                <ClipLoader
                color='#282833'
                size={"5vh"}
                />
            </div>)
                :
        (<div>
            <table className='min-w-full  '>
              <thead className='border-b '>
                <tr className='text-center'>
                    <th className='py-[1.6vh] text-right  w-[1.65vw]'><EmailCheckbox  id="" checked={isAllChecked} onChange={handleCheckAll}/></th>
                    <th className='text-left  py-[1.6vh] text-[0.94vw] font-[600]'>Email</th>
                    <th className='text-center py-[1.6vh] text-[0.94vw] font-[600]'>Status</th>
                    <th className='px-[0.83vw] whitespace-nowrap py-[1.6vh] text-[0.94vw] font-[600]'>Assign to</th>
                </tr>
              </thead>
            
              <tbody>
              
               {
                    itemToShow?.map((item, index) => (
                        <tr key={index}  >
                            <td className='text-center'><EmailCheckbox id={item?._id} checked={checkedItems?checkedItems[item?._id]: true} onChange={() => handleChecked(item._id)} /> </td>
                            <td className='py-[2.4vh] text-[0.83vw]'>{item.email}</td>
                            <td className='text-center'><span className={` cursor-default px-[0.78vw] py-[1vh] text-[0.83vw]  border-[1px] ${item.isConnected ?"bg-[#DCFAE6] border-[#ABEFC6] text-[#17B26A]": "border-[#FECDCA] text-[#F04438] bg-[#FEE4E2]"}  rounded-[2.604vw]`}>{item.isConnected ? "Connected": "Disconnected"}</span></td>
                            <td className='text-center'>
                            {
                                item?.isAssigned ?
                                <span className=' flex items-center justify-center'>
                                    <Image src={item.assignedUser?.profile_img ?? face } alt="card" height={30} width={30} className=' h-[4vh] w-[2.1vw] rounded-[100vw]'/>
                                </span> :
                                <span 
                                onClick={() => handleAssign(item.email)}
                                className='cursor-pointer px-[1.04vw] py-[1vh] text-[0.83vw] border-[1px] hover:border-[#B8B8CD] hover:bg-[#F4F4FA] border-[#E0E0E9] text-[#282833] text-opacity-[75%] rounded-[0.781vw]'>
                                    Assign
                                </span> 
                            }
                            </td>
                            <td className='text-right w-fit'>
                                <BootstrapTooltip title="Delete" placement="top" color = 'rgba(0, 0, 0, 0.87)' arrow  >
                                    <Image  onClick={() => handleDeleteEmail(item.email)} src={deleteIcon} alt="delete"  className='cursor-pointer w-[1.25vw] h-[2.4vh] opacity-50 hover:opacity-100'/> 
                                </BootstrapTooltip>   
                            </td>
                            <td className='text-center'>
                            <BootstrapTooltip title={item.isConnected? "Disconnect" : "Reconnect"} placement='top'  > 
                                <Image onClick={() =>{handleConnection(item.email, item.isConnected)}} src={item.isConnected? disconnectIcon: reload} alt="disconnect" className='cursor-pointer w-[1.25vw] h-[2.4vh] opacity-50 hover:opacity-100 '/> 
                            </BootstrapTooltip>
                            </td>
                        </tr>
    ))
      }
                </tbody>
            </table>
        </div>
        )
        }
       
    </div>
  )
}

export default EmailTable


