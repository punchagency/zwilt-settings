import * as yup from "yup";

type TGetUserCommon = any;

export const validationSchema = yup.object({
  title: yup.string().required("Required"),
  firstName: yup.string().required("Required"),
  middleName: yup.string(),
  lastName: yup.string().required("Required"),
  bloodGroup: yup.string(),
  dateOfBirth: yup.string(),
  phoneNumber: yup.string(),
  identityNumber: yup.string(),
  streetAddress: yup.string(),
  city: yup.string(),
  country: yup.string(),
  zipCode: yup.string(),
  personalEmail: yup.string(),
  medicalHistory: yup.string(),
  employeeId: yup.string(),
  department: yup.string(),
  statusOfEmployment: yup.string(),
  designation: yup.string(),
  dateOfJoining: yup.string(),
  salary: yup.string(),
  officialPersonalEmail: yup.string(),
  officialEmail: yup.string(),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Please enter a valid email address",
    ),
  profileImage: yup.string(),
  assignedRole: yup.string().required("Required"),
  location: yup.string().required("Team is required"),
  religionStatus: yup.string(),
  accountHoldersName: yup.string(),
  accountName: yup.string(),
  ibanNumber: yup.string(),
  swiftCode: yup.string(),
  secondaryContactName: yup.string(),
  secondaryContactRelation: yup.string(),
  secondaryContactPhoneNumber: yup.string(),
  secondaryContactName2: yup.string(),
  secondaryContactRelation2: yup.string(),
  secondaryContactPhoneNumber2: yup.string(),
  attachedOrganizationId: yup.string(),
  annualLeaveBalance: yup
    .number()
    .min(0, "Must be a positive number")
    .default(14),
  probationPeriod: yup
    .number()
    .min(1, "Must be at least 1 month")
    .max(12, "Cannot exceed 12 months")
    .default(3),
  appAccess: yup.array().of(yup.string().required()).default(["tracker"]),
});

export type IInitialValues = yup.InferType<typeof validationSchema>;

export const initialValues: IInitialValues = {
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  bloodGroup: "",
  dateOfBirth: "",
  phoneNumber: "",
  identityNumber: "",
  streetAddress: "",
  city: "",
  country: "",
  zipCode: "",
  personalEmail: "",
  medicalHistory: "",
  employeeId: "",
  department: "",
  statusOfEmployment: "",
  designation: "",
  dateOfJoining: "",
  salary: "",
  officialPersonalEmail: "",
  officialEmail: "",
  email: "",
  assignedRole: "",
  location: "",
  religionStatus: "",
  accountHoldersName: "",
  accountName: "",
  ibanNumber: "",
  swiftCode: "",
  secondaryContactName: "",
  secondaryContactRelation: "",
  secondaryContactPhoneNumber: "",
  secondaryContactName2: "",
  secondaryContactRelation2: "",
  secondaryContactPhoneNumber2: "",
  attachedOrganizationId: "",
  annualLeaveBalance: 14,
  probationPeriod: 3,
  appAccess: ["tracker"],
};

export const generateInviteUserPayLoad = (data: IInitialValues) => {
  return {
    title: data?.title,
    role: data?.assignedRole,
    lastName: data?.lastName,
    firstName: data?.firstName,
    email: data?.email,
    profileImg: data?.profileImage,
    organization: data?.attachedOrganizationId,
    location: data?.location,
    appAccess: data?.appAccess || [],
  };
};

export const generateEditUserPayLoad = (data: IInitialValues) => {
  return {
    title: data?.title,
    role: data?.assignedRole,
    lastName: data?.lastName,
    firstName: data?.firstName,
    email: data?.email,
    profileImg: data?.profileImage,
    attachedOrganization: data?.attachedOrganizationId,
    location: data?.location,
    annualLeaveBalance: data?.annualLeaveBalance ?? 14,
    probationPeriod: data?.probationPeriod ?? 3,
    appAccess: data?.appAccess || [],
  };
};

export const transformUserDataToFormikFormat = (data: TGetUserCommon) => {
  return {
    title: (data as any)?.title || "",
    firstName: (data as any)?.firstName || "",
    lastName: (data as any)?.lastName || "",
    profileImage: (data as any)?.profileImg || "",
    email: (data as any)?.email || "",
    assignedRole: (data as any)?.role || "",
    location: (data as any)?.location || "",
    attachedOrganizationId: (data as any)?.attachedOrganization?._id || "",
    teamId: (data as any)?.teamId || "",
    annualLeaveBalance: (data as any)?.annualLeaveBalance ?? 14,
    probationPeriod: (data as any)?.probationPeriod ?? 3,
    appAccess: (data as any)?.appAccess ||
      (data as any)?.zwiltAppAccess || ["tracker"],
  };
};

export const UserTitle = [
  { label: "Mr.", value: "mr" },
  { label: "Ms.", value: "ms" },
  { label: "Mrs.", value: "mrs" },
  { label: "Miss.", value: "miss" },
  { label: "Others", value: "others" },
];
export const BloodGroup = [
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];
export const Country = [
  { label: "Nigeria", value: "ng" },
  { label: "Pakistan", value: "pk" },
  { label: "United State", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
  { label: "Spain", value: "es" },
  { label: "Italy", value: "it" },
];
export const Designation = [
  { label: "Managing Director", value: "managing-director" },
  { label: "Support Assistant", value: "support-assistant" },
  { label: "Office Support", value: "office-support" },
  { label: "Senior Webflow Developer", value: "senior-webflow-developer" },
  { label: "Senior UI UX Designer", value: "senior-ui-ux-designer" },
  { label: "Senior Product Manager", value: "senior-product-manager" },
  { label: "Admin", value: "admin" },
  { label: "Senior Software Engineer", value: "senior-software-engineer" },
  { label: "Backend Engineer", value: "backend-engineer" },
  {
    label: "Assistant Software Engineer",
    value: "assistant-software-engineer",
  },
  { label: "Graphic Designer", value: "graphic-designer" },
  {
    label: "Content, Marketing and Communications Manager",
    value: "content/marketing-and-communications-manager",
  },
  { label: "HR Executive", value: "hr-executive" },
  { label: "Operations Enablement", value: "operations-enablement" },
  { label: "AI/ML Engineer", value: "ai/ml-engineer" },
  { label: "Graphic Designer", value: "graphic-designer" },
  { label: "Technical Project Manager", value: "technical-project-manager" },
  { label: "Devops Engineer", value: "devops-engineer" },
  { label: "UI/UX Designer", value: "ui/ux-designer" },
  { label: "Lead Marketing", value: "lead-marketing" },
  {
    label: "Associate Webflow Developer",
    value: "associate-webflow-developer",
  },
  { label: "Graphic Designer", value: "graphic-designer" },
  {
    label: "Business Development Executive",
    value: "business-development-executive",
  },
];
export const Department = [
  { label: "Engineering", value: "engineering" },
  { label: "Administration", value: "administration" },
  { label: "Project Management", value: "project-management " },
  { label: "E-Commerce", value: "e-commerce" },
  { label: "Sales", value: "sales" },
  { label: "Design", value: "design" },
  { label: "HR and Recruitment", value: "hr-and-recruitment" },
  { label: "Operations", value: "operations" },
  { label: "Marketing", value: "marketing" },
];

export const EmploymentStatus = [
  { label: "Full Time Employee", value: "full-time-employee" },
  { label: "Part Time Employee", value: "part-time-employee" },
  { label: "Intern", value: "intern" },
  { label: "Contract Employee", value: "contract-employee" },
  { label: "Resigned", value: "resigned" },
  { label: "Terminated", value: "terminated" },
];

export const Role = [
  { label: "USER", value: "USER" },
  { label: "VIEW", value: "VIEW" },
  { label: "PROJECT_MANAGER/CLIENT", value: "PROJECT_MANAGER" },
  { label: "ORGANIZATION_MANAGER", value: "ORGANIZATION_MANAGER" },
  { label: "ORGANIZATION_OWNER", value: "ORGANIZATION_OWNER" },
];
