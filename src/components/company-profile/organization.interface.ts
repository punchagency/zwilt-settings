// Define the type for SocialMediaDoc
interface SocialMediaDoc {
    __typename: string;
    socialLink: string;
    socialType: string;
  }
  
  // Define the type for Organization
  export interface Organization {
    __typename: string;
    _id: string;
    name: string;
    industry: string;
    description: string;
    logo: string;
    companyWebsite: string;
    introVideo: string;
    socialMedia: SocialMediaDoc[];
  }