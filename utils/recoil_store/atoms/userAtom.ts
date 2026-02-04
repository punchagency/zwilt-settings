import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
interface IUserState {
  currentUser?: any;
}
const { persistAtom } = recoilPersist();
export const defaultUserState: IUserState = {
  currentUser: null,
};
export const userAtom = atom<IUserState>({
  key: "client-atom",
  default: defaultUserState,
  effects_UNSTABLE: [persistAtom],
});

export const SocialMediaDoc = atom<any>({
  key: 'SocialMediaDoc',
  default: null
})



export const userReloadAtom = atom<(() => Promise<any>) | null>({
  key: "userReloadAtom", // Unique ID for the atom
  default: null, // Initially, there's no refetch function available
});
