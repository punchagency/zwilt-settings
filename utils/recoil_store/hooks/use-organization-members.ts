import { useRecoilState } from 'recoil';
import { OrganizationMember, organizationMembersState } from '../atoms/organizationMembers';



export const useOrganizationMembers = () => {
  const [members, setMembers] = useRecoilState(organizationMembersState);

  const addMember = (newMember: OrganizationMember) => {
    setMembers(current => [...current, newMember]);
  };

  return {
    members,
    setMembers,
    addMember
  };
};