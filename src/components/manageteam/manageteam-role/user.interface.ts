export interface User {
  _id: string;
  name: string;
  email: string;
  profile_img?: string;
  lastActive?: string;
  isDeleted?: boolean;
  // ... other existing fields ...
}

export interface OrganizationMember {
  _id: string;
  user: User;
  role: string;
  clientAccountType: string;
  profileStatus: string;
  // ... other existing fields ...
} 