import { userEmail } from "@/types/GeneralType";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();


export interface IEmailAccountType {
  emailAccountList: userEmail[];
}

export const defaultEmailAccountPageState = {
  emailAccountList: []
};

const emailAccountPageAtom = atom<IEmailAccountType>({
  key: "email-accounts-page-atom",
  default: defaultEmailAccountPageState,
  effects_UNSTABLE: [persistAtom],
});
export default emailAccountPageAtom;


export const phraseToSearch = atom({
  key: 'phraseToSearch',
  default: ""
})

//const { emailAccountList, updateEmailAccount } = useEmailAccount();