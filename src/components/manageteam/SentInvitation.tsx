import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_INVITED_USERS } from "@/graphql/queries/manageTeam";
import { OrganizationMember } from "./manageteam-role/user.interface";
import Loader from "./Loader";
import Error from "./Error";
import CancelIcon from "./CancelIcon";
import { CANCEL_INVITATION } from "@/graphql/mutations/manageTeam";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";

interface User {
  __typename: string;
  _id: string;
  user: {
    __typename: string;
    email: string;
    name?: string;
    profile_img: string;
    createdAt: null;

  };
  role: string;
  clientAccountType: string;
  profileStatus: string;
}

interface SentInvitationProps {
  filteredInvitedUsers: User[];
  setFilteredInvitedUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const SentInvitation: React.FC<SentInvitationProps> = ({
  filteredInvitedUsers,
  setFilteredInvitedUsers,
}) => {
  const { loading, error } = useQuery(GET_INVITED_USERS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const capitalizeEveryWord = (str: string) => {
    return str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };


  const [cancelInvitation] = useMutation(CANCEL_INVITATION, {
    onCompleted: () => {
      notifySuccessFxn("Invitation cancelled successfully");
    },
    onError: (error) => {
      setFilteredInvitedUsers(prevUsers => [...prevUsers]);
      notifyErrorFxn(error.message || "Failed to cancel invitation");
    }
  });

  const handleRemoveInvite = async (id: string) => {
    try {
      setFilteredInvitedUsers(prevUsers => 
        prevUsers.filter((user) => user._id !== id)
      );

      await cancelInvitation({
        variables: { invitationId: id },
        refetchQueries: [{ query: GET_INVITED_USERS }]
      });
    } catch (error) {
      console.error('Cancellation error:', error);
    }
  };
  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <form className='flex flex-col items-start max-w-full w-full z-0'>
      <table className='w-full'>
        <thead className='sticky top-0 bg-white z-10 border-b'>
          <tr className='border-b border-[#e0e0e9]'>
            <th
              className='py-[1.56vw] pl-[1.56vw] text-[0.94vw] text-left'
              style={{ width: "30%" }}
            >
              Email
            </th>
            <th
              className='py-[1.36vw] text-[0.94vw] text-center'
              style={{ width: "16%" }}
            >
              User
            </th>
            <th
              className='py-[1.36vw] text-[0.94vw] text-center'
              style={{ width: "21%" }}
            >
              Team Role
            </th>
            <th
              className='py-[1.36vw] text-[0.94vw] text-center'
              style={{ width: "18%" }}
            >
              Date Invited
            </th>
            <th
              className='py-[1.36vw] text-[0.94vw] text-center pe-6 md:pe-10 lg:pe-16'
              style={{ width: "19%" }}
            >
              Status
            </th>
          </tr>
        </thead>
      </table>
      <div className='max-h-[45vh] overflow-y-auto w-full scrollbar-thin'>
        <table className='w-full'>
          <tbody>
            {filteredInvitedUsers.map((invite: User) => (
              <tr className='w-full' key={invite._id}>
                <td
                  className='py-[1.41vw] pl-[1.56vw] text-left'
                  style={{ width: "29%" }}
                >
                  <div className='flex items-center'>
                    <span className='w-[2.6vw] h-[2.6vw] bg-[#d9d9d9] rounded-full font-semibold text-[1.25vw] text-[#282833] flex items-center justify-center'>
                      {invite?.user?.email?.charAt(0).toUpperCase()}
                    </span>
                    <div className='flex items-center justify-start pl-[0.52vw] py-[0.42vw] w-full'>
                      <p className='text-[0.83vw] text-left font-medium leading-[1vw] text-[#282833]'>
                        {invite.user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  className='py-[1.41vw] text-[0.83vw] font-medium leading-[1vw] text-center text-[#282833]'
                  style={{ width: "19%" }}
                >
                  {capitalizeEveryWord(invite.clientAccountType)}
                </td>
                <td
                  className='py-[1.41vw] text-[0.83vw] font-medium leading-[1vw] text-center text-[#282833]'
                  style={{ width: "19%" }}
                >
                  {capitalizeEveryWord(invite.role)}
                </td>
                <td
                  className='py-[1.41vw] text-[0.83vw] font-medium leading-[1vw] text-center text-[#282833]'
                  style={{ width: "19%" }}
                >
                  Jul 10, 2023
                </td>
                <td
                  className='py-[1.41vw] text-[0.83vw] font-medium leading-[1vw] text-center text-[#282833]'
                  style={{ width: "10%" }}
                >
                  <div className='flex items-center justify-center'>
                    {invite.profileStatus === "accepted" ? (
                      <span className='flex items-center justify-center text-[#17b26a] font-medium text-[0.83vw] py-[0.52vw] px-[0.78vw] w-[4.69vw] h-[1.56vw] bg-[#dcfae6] border border-[#abefc6] rounded-[2.60vw] cursor-pointer'>
                        Accepted
                      </span>
                    ) : (
                      <span className='flex items-center justify-center text-[#F04438] font-medium text-[0.83vw] py-[0.52vw] px-[0.78vw] w-[4.69vw] h-[1.56vw] bg-[#FEE4E2] border border-[#FDA29B] rounded-[2.60vw] cursor-pointer'>
                        {capitalizeEveryWord(invite.profileStatus)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-[1.41vw]"  style={{ width: "10%" }}>
                  <button className="flex items-center justify-center" onClick={() => handleRemoveInvite(invite._id)} onMouseEnter={() => setHoveredId(invite._id)} onMouseLeave={() => setHoveredId(null)}>
                  <CancelIcon isHovered={hoveredId === invite._id} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default SentInvitation;
