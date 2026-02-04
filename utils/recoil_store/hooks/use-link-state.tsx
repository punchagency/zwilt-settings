import { atom, useRecoilState } from "recoil";
import { SocialMediaDoc } from "../atoms/userAtom";
import { linksState } from "../atoms/toolsAtom";

export const useLinksState = () => {
  const [links, setLinks] = useRecoilState(linksState);

  const deleteLink = (socialLinkToDelete: string) => {
    setLinks((prevLinks) =>
      prevLinks.filter((link) => link.socialLink !== socialLinkToDelete)
    );
  };

  return {
    links,
    deleteLink,
    setLinks,
  };
};
