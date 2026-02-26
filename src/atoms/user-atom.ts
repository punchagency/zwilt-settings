import { AtomEffect, atom } from "recoil";
import { storageEffect } from "./utils/storage-effects";

interface IUserState {
  isAuth: boolean;
  userData: any;
  loading: boolean;
}

export const defaultUserState: IUserState = {
  isAuth: false,
  userData: null,
  loading: false
};

const userAtom = atom<IUserState>({
  key: "user-atom",
  default: defaultUserState,
  effects: [
    storageEffect({ key: "ps_us" }) as unknown as AtomEffect<IUserState>,
  ],
});

export default userAtom;
