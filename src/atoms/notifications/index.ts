import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

export interface NotificationSettings {
  basic: {
    comments: string[];
    reactions: string[];
    tags: string[];
    favourites: string[];
  };
  job: {
    archived: string[];
    posted: string[];
  };
  interview: {
    complete: string[];
    incomplete: string[];
  };
  candidate: {
    rejected: string[];
    // newApplication: string[];
  };
  teamActivity: {
    memberAdded: string[];
    memberDeleted: string[];
    roleChanged: string[];
    addedToTracker: string[];
  };
  billingAndPayment: {
    paymentMethodChanged: string[];
    invoiceGenerated: string[];
    paymentSuccessful: string[];
    paymentFailed: string[];
  };
  userAndAccount: {
    loginActivity: string[];
    passwordChanged: string[];
    profileUpdates: string[];
  };
  tracker: {
    infraction: string[];
    weeklyHours: string[];
  };
  sales: {
    uploadedLeads: string[];
    updatedTrigger: string[];
    newTrigger: string[];
    deletedTrigger: string[];
  };
}

export const defaultNotificationSettings: NotificationSettings = {
  basic: {
    comments: [],
    reactions: [],
    tags: [],
    favourites: [],
  },
  job: {
    archived: [],
    posted: [],
  },
  interview: {
    complete: [],
    incomplete: [],
  },
  candidate: {
    rejected: [],
  },
  teamActivity: {
    memberAdded: [],
    memberDeleted: [],
    roleChanged: [],
    addedToTracker: [],
  },
  billingAndPayment: {
    paymentMethodChanged: [],
    invoiceGenerated: [],
    paymentSuccessful: [],
    paymentFailed: [],
  },
  userAndAccount: {
    loginActivity: [],
    passwordChanged: [],
    profileUpdates: [],
  },
  tracker: {
    infraction: [],
    weeklyHours: [],
  },
  sales: {
    uploadedLeads: [],
    updatedTrigger: [],
    newTrigger: [],
    deletedTrigger: [],
  },
};

export const notificationSettingsAtom = atom({
  key: "notification-settings",
  default: defaultNotificationSettings,
  effects_UNSTABLE: [recoilPersist().persistAtom],
});
