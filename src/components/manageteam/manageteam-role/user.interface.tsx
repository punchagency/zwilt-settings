export interface User {
  _id: string;
  name: string;
  email: string;
  profile_img: string;
  lastActive: string;

  // Optional properties:
  firstName?: string;
  lastName?: string;
  accountType?: string;
  banner_img?: string;
  createdAt?: string;
  isOnline?: string;
  isChecked?: boolean;
  clientAccountType?: string;
  role?: string;
}

export interface OrganizationMember {
  map(
    arg0: (member: User) => {
      isChecked: boolean;
      _id: string;
      name: string;
      email: string;
      profile_img: string;
      lastActive: string;
      // Optional properties:
      firstName?: string;
      lastName?: string;
      accountType?: string;
      banner_img?: string;
      createdAt?: string;
      isOnline?: string;
      clientAccountType?: string;
      role?: string;
    }
  ): any;

  // Add some method
  some(
    predicate: (member: OrganizationMember) => boolean
  ): boolean;
  
  user: {
    _id: string;
    name: string;
    email: string;
    profile_img: string;
    lastActive: string;
  };
  role: string;
  clientAccountType: string;
  isChecked: boolean;
  _id: string;
  profileStatus: string
}

export interface OrganizationMember extends User { }