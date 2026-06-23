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
    name: "Dashboard",
    icon: teamImage,
    href: "/dashboard",
  },
  {
    name: "Company Profile",
    icon: companyImage,
    href: "/companyprofile",
    icon2: <ZwiltIcon />,
    adminOnly: true,
  },
  {
    name: "Manage Team",
    icon: teamImage,
    href: "/manageteam",
    adminOnly: true,
  },
  {
    name: " Payment & Billing",
    icon: paymentImage,
    href: "/payment",
    adminOnly: true,
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
    adminOnly: true,
  },
  {
    name: "Email Account",
    icon: emailImage,
    href: "/emailaccount",
    adminOnly: true,
  },

  {
    name: "Interview Settings",
    icon: InterviewImage,
    href: "/interview",
    adminOnly: true,
  },
  {
    name: "AI Credits",
    icon: starsImage,
    href: "/ai-credits",
    adminOnly: true,
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
