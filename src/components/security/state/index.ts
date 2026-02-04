import { ReactiveVar, makeVar } from '@apollo/client';

export interface SignedInDevice {
  browser: string;
  device: string;
  location: string;
  sessionToken: string;
  signInDate: string;
}

export const signedInDevicesVar: ReactiveVar<SignedInDevice[]> = makeVar<SignedInDevice[]>([]);
export const userIdVar: ReactiveVar<string | null> = makeVar<string | null>(null);
export const is2FAEnabledVar: ReactiveVar<boolean> = makeVar<boolean>(false);