import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { useLazyQuery, useMutation } from "@apollo/client";
import { defaultNotificationSettings, notificationSettingsAtom } from "@/atoms/notifications";
import { GET_NOTIFICATION_SETTINGS, UPDATE_NOTIFICATION_SETTINGS } from "@/graphql/queries/notifications";
import { NotificationSettings } from "@/atoms/notifications";
import { removeTypename } from '../../../utils/index';

interface NotificationSettingsProps {
  fetchOnMount?: boolean;
}

export interface SettingsItem {
  name: string;
  label: string;
  id: string;
  toggled: boolean;
}

export const useNotificationSettings = ({ fetchOnMount = true }: NotificationSettingsProps) => {
  const [recoilState, setRecoilState] = useRecoilState<NotificationSettings>(notificationSettingsAtom);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const allOptions = ["PUSH", "EMAIL", "SMS"];

  const [fetchSettings, { loading: fetching, refetch }] = useLazyQuery<{ getNotificationSettings: { data: NotificationSettings } }>(GET_NOTIFICATION_SETTINGS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const fetchedSettings = removeTypename(data.getNotificationSettings?.data) || defaultNotificationSettings;
      if (JSON.stringify(fetchedSettings) !== JSON.stringify(recoilState)) {
        setRecoilState(fetchedSettings);
      }
    },
    onError: (err) => {
      console.error(err);
      setError("Error fetching settings");
    },
  });

  const [updateNotificationSettingsMutation] = useMutation<{ updateNotificationSettings: { data: NotificationSettings } }>(UPDATE_NOTIFICATION_SETTINGS, {
    onCompleted: () => {
      refetch()
    },
    onError: (err) => {
      console.error(err);
      setError("Error updating settings");
    },
  });

  const updateNotificationSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const sanitizedSettings = { ...newSettings };

    const previousState = recoilState;

    setRecoilState(prev => ({ ...prev, ...sanitizedSettings }));

    updateNotificationSettingsMutation({
      variables: { input: removeTypename(sanitizedSettings) },
      onError: () => {
        setRecoilState(previousState);
      },
    });
  }, [updateNotificationSettingsMutation, recoilState, setRecoilState]);

  const createNotificationSettings = (settingsArray: SettingsItem[]) =>
    settingsArray.filter(item => item.toggled).map(item => item.name.toUpperCase());

  const toTitleCase = (str: string) =>
    str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const getNotificationState = (settings: string[] = [], idPrefix?: string) =>
    allOptions.map(option => ({
      name: option,
      label: option === 'SMS' ? option : toTitleCase(option),
      id: `${idPrefix || ''}${option.toLowerCase()}Id`,
      toggled: settings.includes(option),
    }));

  useEffect(() => {
    if (fetchOnMount) {
      if (!recoilState || JSON.stringify(recoilState) === JSON.stringify(defaultNotificationSettings)) {
        fetchSettings();
      }
    }
  }, [fetchOnMount, fetchSettings, recoilState]);

  useEffect(() => {
    setLoading(fetching);
  }, [fetching]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return {
    notificationSettings: recoilState,
    error,
    loading,
    updateNotificationSettings,
    fetchSettings,
    createNotificationSettings,
    getNotificationState,
  };
};
