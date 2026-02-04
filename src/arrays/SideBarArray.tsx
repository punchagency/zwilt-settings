import userImage from "../assests/icons/user.svg";
import companyImage from "../assests/icons/company.svg";
import teamImage from "../assests/icons/team.svg";
import paymentImage from "../assests/icons/payment.svg";
import phoneImage from "../assests/icons/phone.svg";
import emailImage from "../assests/icons/email.svg";
import securityImage from "../assests/icons/security.svg";
import supportImage from "../assests/icons/support.svg";
import InterviewImage from "../assests/icons/Interview.svg";
import NotificationImage from "../assests/icons/Notifications.svg";
import starsImage from "../assests/icons/stars.svg";

import { SideBar } from "@/types/GeneralType";
import ZwiltIcon from "@/assests/icons/ZwiltIcon";
import InterviewSettings from "@/pages/interview";

export const sideBarArray: SideBar[] = [
  {
    name: "User Profile",
    icon: userImage,
    href: "/user",
  },
  {
    name: "Company Profile",
    icon: companyImage,
    href: "/companyprofile",
    icon2: <ZwiltIcon />,
  },
  {
    name: "Manage Team",
    icon: teamImage,
    href: "/manageteam",
  },
  {
    name: " Payment & Billing",
    icon: paymentImage,
    href: "/payment",
  },
  {
    name: "Password & Security",
    icon: securityImage,
    href: "/securitysettings",
  },
  {
    name: " Phone Account",
    icon: phoneImage,
    href: "/phoneaccount",
  },
  {
    name: "Email Account",
    icon: emailImage,
    href: "/emailaccount",
  },

  {
    name: "Interview Settings",
    icon: InterviewImage,
    href: "/interview",
  },
  {
    name: "AI Credits",
    icon: starsImage,
    href: "/ai-credits",
  },
  {
    name: "Notification Settings",
    icon: NotificationImage,
    href: "/notifications",
  },
  {
    name: "Support",
    icon: supportImage,
    href: "/support",
  },
];
