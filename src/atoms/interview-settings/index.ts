import { recoilPersist } from 'recoil-persist';
import { atom } from 'recoil';
const { persistAtom } = recoilPersist();

export interface InterviewSettings {
  questionsPerCategory: number;
  questionDelay: number,
  followOnQuestions: boolean;
  showStatistics: boolean;
}

export const defaultInterviewSettings: InterviewSettings = {
  questionsPerCategory: 4,
  questionDelay: 0,
  followOnQuestions: false,
  showStatistics: false
}

export const interviewSettingsAtom = atom({
  key: "interview-settings",
  default: defaultInterviewSettings,
  effects_UNSTABLE: [persistAtom],
});