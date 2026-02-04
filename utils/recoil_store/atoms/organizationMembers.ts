import { atom } from 'recoil';

export interface OrganizationMember {
  clientAccountType: string;
  role: string | null;
  user: {
    _id?: string;
    lastActive: string;
    name: string;
    email: string;
    profile_img: string | null;
  };
}

export const organizationMembersState = atom<OrganizationMember[]>({
  key: 'organizationMembersState',
  default: []
});