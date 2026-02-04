
import { atom } from "recoil";
import { SocialMediaDoc } from "./userAtom";



export const linksState = atom<any[]>({
  key: "linksState",
  default: [],
});


export const popoverState = atom({
  key: "popoverState",
  default: {
    visible: false,
    url: "",
  },
});