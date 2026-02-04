import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  defaultInterviewSettings,
  interviewSettingsAtom,
  InterviewSettings,
} from "@/atoms/interview-settings";
import {
  GET_INTERVIEW_SETTINGS,
  UPDATE_INTERVIEW_SETTINGS,
} from "@/graphql/queries/interviewSettings";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";

interface InterviewSettingsProps {
  fetchOnMount?: boolean;
}

export const useInterviewSettings = ({
  fetchOnMount = true,
}: InterviewSettingsProps) => {
  const [recoilState, setRecoilState] = useRecoilState(interviewSettingsAtom);
  const [interviewSettings, setInterviewSettings] = useState<InterviewSettings>(
    defaultInterviewSettings
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fetchSettings, { loading: fetching }] = useLazyQuery(
    GET_INTERVIEW_SETTINGS,
    {
      onCompleted: (data) => {
        if (data?.getInterviewSettings?.success) {
          const fetchedSettings = data.getInterviewSettings.data;
          setRecoilState(fetchedSettings);
        } else {
          setError(data?.getInterviewSettings?.message || "Fetch failed");
        }
      },
      onError: (err) => {
        console.error(err);
        setError("Error fetching settings");
      },
    }
  );

  const [updateInterviewSettingsMutation, { loading: updating }] = useMutation(
    UPDATE_INTERVIEW_SETTINGS,
    {
      onCompleted: (data) => {
        console.log({ data });
        if (data?.updateInterviewSettings?.success) {
          const updatedSettings = data.updateInterviewSettings.data;
          setRecoilState(updatedSettings);

          notifySuccessFxn("Interview Settings updated");
        } else {
          setError(data?.updateInterviewSettings?.message || "Update failed");
          notifyErrorFxn(
            data?.updateInterviewSettings?.message || "Update failed"
          );
        }
      },
      onError: (err) => {
        console.error(err);
        setError("Error updating settings");
        notifyErrorFxn("Error updating settings");
      },
    }
  );

  const updateInterviewSettings = useCallback(
    (newSettings: InterviewSettings) => {
      updateInterviewSettingsMutation({ variables: { input: newSettings } });
    },
    [updateInterviewSettingsMutation]
  );

  useEffect(() => {
    setInterviewSettings(recoilState);
  }, [recoilState]);

  useEffect(() => {
    setLoading(fetching || updating);
  }, [fetching, updating]);

  useEffect(() => {
    fetchOnMount && fetchSettings();
  }, [fetchOnMount, fetchSettings]);

  return {
    interviewSettings,
    error,
    updateInterviewSettings,
    fetchSettings,
    loading,
  };
};
