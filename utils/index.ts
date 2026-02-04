

export type User = {
  name: string;
  _id: string;
  email: string;
  profile_img?: string;
};

export type Recruiter = {
  phoneNumber: string;
  organization: string;
  status: string;
  createdAt: string;
  job: string;
  profile_img: string;
  user: User;
};


export interface Industry {
  value: string;
  label: string;
}


export const industries: Industry[] = [
  { value: "it", label: "Information Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "marketing agency", label: "Marketing Agency" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "automotive", label: "Automotive" },
  { value: "construction", label: "Construction" },
  { value: "hospitality", label: "Hospitality" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "media", label: "Media" },
  { value: "entertainment", label: "Entertainment" },
  { value: "real estate", label: "Real Estate" },
  { value: "energy", label: "Energy" },
  { value: "logistics", label: "Logistics" },
  { value: "pharmaceuticals", label: "Pharmaceuticals" },
  { value: "agriculture", label: "Agriculture" },
  { value: "consulting", label: "Consulting" },
  { value: "insurance", label: "Insurance" },
  { value: "government", label: "Government" },
];
 export function getSocialMediaType(url: string): string {
  // Define regex patterns for each social media platform
  const patterns: { [key: string]: RegExp } = {
      LinkedIn: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i,
      Facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:profile\.php\?id=\d+|[\w.-]+)/i,
      Twitter: /(?:https?:\/\/)?(?:www\.)?twitter\.com\/[\w-]+/i,
      Instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[\w.-]+/i,
      YouTube: /(?:https?:\/\/)?(?:www\.)?(youtube\.com\/(?:channel\/|user\/|c\/|watch\?v=)|youtu\.be\/[\w-]+)/i,
      TikTok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+/i,
      GitHub: /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i,
      Reddit: /(?:https?:\/\/)?(?:www\.)?reddit\.com\/(?:u|user)\/[\w-]+/i,
      Pinterest: /(?:https?:\/\/)?(?:www\.)?pinterest\.com\/[\w-]+/i,
      Snapchat: /(?:https?:\/\/)?(?:www\.)?snapchat\.com\/add\/[\w-]+/i,
      Medium: /(?:https?:\/\/)?(?:www\.)?medium\.com\/@[\w-]+/i,
      Tumblr: /(?:https?:\/\/)?(?:www\.)?[\w-]+\.tumblr\.com\/?/i
  };

  // Iterate through patterns and test URL against each one
  for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(url)) {
          return platform;
      }
  }

  return 'Unknown';
}


 export function formatPhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/\D/g, "");

    if (phoneNumber.length !== 11) {
      return null;
    }

    const countryCode = phoneNumber.slice(0, 1);
    const areaCode = phoneNumber.slice(1, 4);
    const centralOfficeCode = phoneNumber.slice(4, 7);
    const lineNumber = phoneNumber.slice(7);

    return {
      number: `+${countryCode} (${areaCode}) ${centralOfficeCode}-${lineNumber}`,
      areaCode,
    };
  }
export const sanitizeFileName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "");
};

export const removeTypename = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename);
  } else if (obj !== null && typeof obj === 'object') {
    const { __typename, ...rest } = obj;
    return Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, removeTypename(value)]));
  }
  return obj;
};