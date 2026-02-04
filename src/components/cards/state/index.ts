import { ReactiveVar, makeVar } from '@apollo/client';

export const phoneVerificationRequestIdVar: ReactiveVar<string | null> = makeVar<string | null>(null);
export const secretVar: ReactiveVar<string | null> = makeVar<string | null>(null);