import React, { useEffect, useState } from "react";
import NotificationCards from "./Notification/NotificationCards";
import {
  useNotificationSettings,
  SettingsItem,
} from "@/hooks/nortificationSettings/use-notification-settings";

const NotificationSettingsComponent: React.FC = () => {
  const {
    notificationSettings,
    createNotificationSettings,
    updateNotificationSettings,
    getNotificationState,
  } = useNotificationSettings({});

  const [arrays, setArrays] = useState<{
    infraction: SettingsItem[];
    weeklyHours: SettingsItem[];
  }>({
    infraction: [],
    weeklyHours: []
  });

  useEffect(() => {
    setArrays({
      infraction: getNotificationState(
        notificationSettings?.tracker?.infraction ?? []
      ),
      weeklyHours: getNotificationState(
        notificationSettings?.tracker?.weeklyHours ?? []
      ),
    });
  }, [notificationSettings]);

  const handleToggle = (id: string, type: "infraction" | 'weeklyHours') => {
    const updatedArray = (arr: SettingsItem[]) =>
      arr.map((item) =>
        item.id === id ? { ...item, toggled: !item.toggled } : item
      );

    const newSettings = {
      ...notificationSettings,
      tracker: {
        infraction: createNotificationSettings(
          type === "infraction"
            ? updatedArray(arrays.infraction)
            : arrays.infraction
        ),
        weeklyHours: createNotificationSettings(
          type === "weeklyHours"
            ? updatedArray(arrays.weeklyHours)
            : arrays.weeklyHours
        )
      },
    };

    updateNotificationSettings(newSettings);
  };

  return (
    <div>
      <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.4vh]'>
        <NotificationCards
          array={arrays.infraction}
          setArray={(id) => handleToggle(id, "infraction")}
          title='Infraction'
          description="Get notified as an admin when an infraction is detected in the Tracker app."
        />
      </div>

      <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.4vh]'>
        <NotificationCards
          array={arrays.weeklyHours}
          setArray={(id) => handleToggle(id, "weeklyHours")}
          title='Weekly Hours'
          description="Get notified as an admin when a team member's weekly hours fall below the expected threshold in the Tracker app."
        />
      </div>
    </div>
  );
};

export default NotificationSettingsComponent;
