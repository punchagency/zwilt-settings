import { Dispatch, SetStateAction } from "react";

export interface SideBar {
  name: string;
  icon: string;
  href: string;
  icon2?: JSX.Element;
}

export interface BasicsArrayType {
  browser: string;
  browserName: string;
  flag: string;
  country: string;
  date: any;
}

export interface PageProps {
  currentPassword: string;
}

export interface BasicProps extends PageProps {
  setActive: Dispatch<SetStateAction<string>>;
  isToggled: boolean;
  setIsToggled: Dispatch<SetStateAction<boolean>>;
}

export interface Number {
  setOpenCard: Dispatch<SetStateAction<boolean>>;
}

export interface ExtraNumber extends Number {
  setVerifyOpen: Dispatch<SetStateAction<boolean>>;
  verifyOpen: boolean;
}

export interface addNumberType extends ExtraNumber {
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
}

export interface cardProp extends ExtraNumber {
  head: string;
  text: string;
  setVerified: Dispatch<SetStateAction<boolean>>;
  setItemVerified: Dispatch<SetStateAction<string>>;
  item: string;
}

export interface securityPage extends Number {
  setOpenAuthenticator: Dispatch<SetStateAction<boolean>>;
  verifiedNumber: boolean;
  verifiedAuthenticator: boolean;
  phone: string;
  numberVerified: string;
  authenticatorVerified: string;
}

export interface generalSecurity extends securityPage {
  isToggled: boolean;
  setIsToggled: Dispatch<SetStateAction<boolean>>;
}

export interface AuthenticatorType {
  setOpenAuthenticator: Dispatch<SetStateAction<boolean>>;
}

export interface AuthProps extends AuthenticatorType {
  auth: boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
}

export interface verifyAuth extends AuthProps {
  addAuth: boolean;
  setAddAuth: Dispatch<SetStateAction<boolean>>;
}

export interface switchType {
  isToggled?: boolean;
  setIsToggled?: Dispatch<SetStateAction<boolean>>;
  setActive: Dispatch<SetStateAction<string>>;
}

export interface emailTableType {
  users: {
    email: string;
    img: string;
    connected: boolean;
    checked: boolean;
  }[];
  setUsers: Dispatch<
    SetStateAction<
      {
        email: string;
        img: string;
        connected: boolean;
        checked: boolean;
      }[]
    >
  >;
  setShow: Dispatch<SetStateAction<boolean>>;
  emailForCompare: string;
  setEmailForCompare: Dispatch<SetStateAction<string>>;
  activeEmail: string;
  setActiveEmail: Dispatch<SetStateAction<string>>;
}
export interface addEmailType {
  activeEmail: string;
  setActiveEmail: Dispatch<SetStateAction<string>>;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export interface CreateEmailType {
  activeEmail: string;
  setActiveEmail: Dispatch<SetStateAction<string>>;
  setShow: Dispatch<SetStateAction<boolean>>;
  customEmail: {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    host: string;
    port: number;
  };
  setCustomEmail: Dispatch<
    SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
      userName: string;
      password: string;
      host: string;
      port: number;
    }>
  >;
}

export interface MicrosoftType {
  activeEmail: string;
  setActiveEmail: Dispatch<SetStateAction<string>>;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export interface assignEmailType {
  setShow: Dispatch<SetStateAction<boolean>>;
  users: {
    email: string;
    img: string;
    connected: boolean;
    checked: boolean;
  }[];
  setUsers: Dispatch<
    SetStateAction<
      {
        email: string;
        img: string;
        connected: boolean;
        checked: boolean;
      }[]
    >
  >;
  emailForCompare: string;
  setEmailForCompare: Dispatch<SetStateAction<string>>;
  activeEmail: string;
  setActiveEmail: Dispatch<SetStateAction<string>>;
}

export interface baseCardType extends assignEmailType {
  show: boolean;
  users: {
    email: string;
    img: string;
    connected: boolean;
    checked: boolean;
  }[];
  setUsers: Dispatch<
    SetStateAction<
      {
        email: string;
        img: string;
        connected: boolean;
        checked: boolean;
      }[]
    >
  >;
  emailForCompare: string;
  setEmailForCompare: Dispatch<SetStateAction<string>>;
}

export interface emailPageType {
  setShow: Dispatch<SetStateAction<boolean>>;

  users: {
    email: string;
    img: string;
    connected: boolean;
    checked: boolean;
  }[];
  setUsers: Dispatch<
    SetStateAction<
      {
        email: string;
        img: string;
        connected: boolean;
        checked: boolean;
      }[]
    >
  >;
  emailForCompare: string;
  setEmailForCompare: Dispatch<SetStateAction<string>>;
  activeEmail: string;
  setActiveEmail: Dispatch<SetStateAction<string>>;
}

export interface NumberCard {
  openCard: boolean;
  setOpenCard: Dispatch<SetStateAction<boolean>>;
  verifyOpen: boolean;
  setVerifyOpen: Dispatch<SetStateAction<boolean>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  setVerifiedNumber: Dispatch<SetStateAction<boolean>>;
  setNumberVerified: Dispatch<SetStateAction<string>>;
}

export interface AuthenticatorCardType {
  openAuthenticator: boolean;
  setOpenAuthenticator: Dispatch<SetStateAction<boolean>>;
  auth: boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
  addAuth: boolean;
  setAddAuth: Dispatch<SetStateAction<boolean>>;
  setVerifiedAuthenticator: Dispatch<SetStateAction<boolean>>;
  setAuthenticatorVerified: Dispatch<SetStateAction<string>>;
}

interface assignedUser {
  _id: string | null;
  profile_img: string;
}

export interface userEmail {
  assignedUser: assignedUser | null;
  createdAt: string;
  email: string;
  isAssigned: boolean;
  serviceProvider: string;
  __typename: string;
  _id: string;
}
