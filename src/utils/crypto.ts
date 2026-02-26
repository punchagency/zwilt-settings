import CryptoJS from "crypto-js";
import type { IObjectWithAnyKeys } from "@/types/global";

// const secretPass = process.env.NEXT_PUBLIC_SECRET_PASS as string;
const secretPass = "process.env.NEXT_PUBLIC_SECRET_PASS" as string;

export const encryptData = (obj: IObjectWithAnyKeys): string => {
  const data = CryptoJS?.AES?.encrypt(
    JSON?.stringify(obj),
    secretPass
  ).toString();
  return data;
};

export const decryptData = (text: string) => {
  const bytes = CryptoJS?.AES?.decrypt(text, secretPass);
  const data = JSON?.parse(bytes?.toString(CryptoJS.enc.Utf8));
  return data;
};
