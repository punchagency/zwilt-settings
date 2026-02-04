import { selector } from "recoil";
import { userAtom } from "../atoms/userAtom";

export const organizationSelector = selector({
  key: "organizationSelector",
  get: ({ get }) => {
    const userState = get(userAtom);
    return userState;
  },
});
