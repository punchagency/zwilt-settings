import { atom, useRecoilState } from 'recoil';
import useUser from './use-user-state';

// Create admin status atom
export const adminStatusState = atom<boolean>({
  key: 'adminStatusState',
  default: false
});

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useRecoilState(adminStatusState);
  const { userState } = useUser();
  const currentUser = userState?.currentUser?.user;

  const checkAdminStatus = (orgMembers: any[]) => {
    const adminStatus = orgMembers.some(
      (member) => 
        member.user._id === currentUser?._id && 
        member.clientAccountType === "ADMIN"
    );
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  return {
    isAdmin,
    checkAdminStatus,
    setIsAdmin
  };
};