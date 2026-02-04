import { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import youtubeImage from "@/assests/images/youtube.webp";
import instagramImage from "@/assests/images/ig.webp";
import facebookImage from "@/assests/images/facebook.webp";
import pinterestImage from "@/assests/images/pininterest.png";
import githubImage from "@/assests/images/github.png";
import linkedinImage from "@/assests/images/linkedin_symbol.png";
import XImage from "@/assests/images/x.png";
import twitterImage from "@/assests/images/twitter.png";
import tiktokImage from "@/assests/images/tiktok.webp";
import tumblrImage from "@/assests/images/tumblr.png";
import mediumImage from "@/assests/images/Medium-Logo.png";
import snapChatImage from "@/assests/images/snapchat.webp";
import redditImage from "@/assests/images/reddit.webp";
import { useRecoilState } from "recoil";
import {
  linksState,
  popoverState,
} from "../../../utils/recoil_store/atoms/toolsAtom";
import { SocialMediaDoc } from "../../../utils/recoil_store/atoms/userAtom";
import { AiOutlineEllipsis } from "react-icons/ai";
import { useLinksState } from "../../../utils/recoil_store/hooks/use-link-state";
import statsocial from "@/assests/icons/statsocial.svg";
import Popover from "@/components/company/pop-over";
import { AnimatePresence } from "framer-motion";
import SocialMediaModal from "./social-media-modal";
import DeleteSocialMediaLink from "./delete-social-media";

const SOCIAL_MEDIA_ICONS: { [key: string]: StaticImageData } = {
  youtube: youtubeImage,
  instagram: instagramImage,
  facebook: facebookImage,
  pinterest: pinterestImage,
  github: githubImage,
  linkedin: linkedinImage,
  x: XImage,
  twitter: twitterImage,
  tiktok: tiktokImage,
  snapchat: snapChatImage,
  tumblr: tumblrImage,
  medium: mediumImage,
  reddit: redditImage,
};

const SocialMediaLinks: React.FC<any> = ({ data }) => {
  const { links } = useLinksState();

  const getIcon = (socialType: string): string | null => {
    const iconUrl = SOCIAL_MEDIA_ICONS[socialType.toLowerCase()];
    //@ts-ignore
    return iconUrl || null;
  };

  return (
    <>
      {links.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {links.map((socialMedia) => (
            <SocialMediaLink
              key={socialMedia.socialLink}
              url={socialMedia.socialLink}
              icon={getIcon(socialMedia.socialType)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SocialMediaLinks;

interface SocialMediaLinkProps {
  url: string;
  icon: string | null;
}

const SocialMediaLink: React.FC<SocialMediaLinkProps> = ({ url, icon }) => {
  const [popover, setPopover] = useRecoilState(popoverState);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkurl, setCheckurl] = useState("");

  const popoverRef = useRef<HTMLDivElement>(null);

  const handleEllipsisClick = () => {
    setPopover((prev) => ({
      visible: !prev.visible,
      url,
    }));
  };

  // Detect click outside to close the popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click was outside the popover
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        popover.visible
      ) {
        setPopover({ visible: false, url: "" }); // Close the popover
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Attach event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, [popover, setPopover]);

  const handleMouseEnter = () => {
    setPopover({ visible: true, url });
    setCheckurl(url);
  };

  const handleMouseLeave = () => {
    setPopover((prev) =>
      prev.url === url ? prev : { visible: false, url: url }
    );
  };

  return url ? (
    <div className="flex items-center justify-between h-[2.55vw] border-[0.05vw] border-[#e0e0e9] rounded-[0.78vw] p-2 mb-2 cursor-pointer hover:border-[#b4b4c8] hover:bg-[#F4F4FA]">
      <div
        className="flex items-center w-full"
        onClick={() => window.open("https://"+url, "_blank", 'noopener,noreferrer')}
      >
        <div className="w-[1.68vw] h-[1.56vw] mr-2 flex items-center">
          <Image
            src={icon ?? statsocial}
            alt={`${url} icon`}
            className="w-[1.56vw] h-[1.56vw]"
            width={30}
            height={30}
            layout="fixed"
          />
        </div>
        <p className="text-[0.83vw] text-[#282833] font-medium truncate">
          {url}
        </p>
      </div>
      <div onClick={handleEllipsisClick} className="relative" data-url={url}>
        <AiOutlineEllipsis />
        {popover.url === url && (
          <div ref={popoverRef} className="absolute right-0 z-50">
            <Popover
              openDelete={() => setIsDeleteOpen(true)}
              openEdit={() => setShowModal(true)}
            />
          </div>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <SocialMediaModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleteOpen && (
          <DeleteSocialMediaLink
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  ) : null;
};
