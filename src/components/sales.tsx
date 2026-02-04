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
    uploadedLeads: SettingsItem[];
    newTrigger: SettingsItem[];
    updatedTrigger: SettingsItem[];
    deletedTrigger: SettingsItem[];
  }>({
    uploadedLeads: [],
    newTrigger: [],
    updatedTrigger: [],
    deletedTrigger: [],
  });

  useEffect(() => {
    setArrays({
      uploadedLeads: getNotificationState(
        notificationSettings?.sales?.uploadedLeads ?? []
      ),
      newTrigger: getNotificationState(
        notificationSettings?.sales?.newTrigger ?? []
      ),
      updatedTrigger: getNotificationState(
        notificationSettings?.sales?.updatedTrigger ?? []
      ),
      deletedTrigger: getNotificationState(
        notificationSettings?.sales?.deletedTrigger ?? []
      ),
    });
  }, [notificationSettings]);

  const handleToggle = (
    id: string,
    type: "uploadedLeads" | "newTrigger" | "updatedTrigger" | "deletedTrigger"
  ) => {
    const updatedArray = (arr: SettingsItem[]) =>
      arr.map((item) =>
        item.id === id ? { ...item, toggled: !item.toggled } : item
      );

    const newSettings = {
      ...notificationSettings,
      sales: {
        uploadedLeads: createNotificationSettings(
          type === "uploadedLeads"
            ? updatedArray(arrays.uploadedLeads)
            : arrays.uploadedLeads
        ),
        updatedTrigger: createNotificationSettings(
          type === "updatedTrigger"
            ? updatedArray(arrays.updatedTrigger)
            : arrays.updatedTrigger
        ),
        newTrigger: createNotificationSettings(
          type === "newTrigger"
            ? updatedArray(arrays.newTrigger)
            : arrays.newTrigger
        ),
        deletedTrigger: createNotificationSettings(
          type === "deletedTrigger"
            ? updatedArray(arrays.deletedTrigger)
            : arrays.deletedTrigger
        ),
      },
    };

    updateNotificationSettings(newSettings);
  };

  return (
    <div>
      <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.4vh]'>
        <NotificationCards
          array={arrays.uploadedLeads}
          setArray={(id) => handleToggle(id, "uploadedLeads")}
          title='Uploaded Leads'
          description="Get notified as an admin when your team uploads new leads to the Sales app."
        />
      </div>
      <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.4vh]'>
        <NotificationCards
          array={arrays.newTrigger}
          setArray={(id) => handleToggle(id, "newTrigger")}
          title='New Trigger'
          description="Get notified as an admin when a new trigger is created in the Sales app by your team."
        />
      </div>
      <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.4vh]'>
        <NotificationCards
          array={arrays.updatedTrigger}
          setArray={(id) => handleToggle(id, "updatedTrigger")}
          title='Updated Trigger'
          description="Get notified as an admin when an existing trigger is updated by your team in the Sales app."
        />
      </div>
      <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.4vh]'>
        <NotificationCards
          array={arrays.deletedTrigger}
          setArray={(id) => handleToggle(id, "deletedTrigger")}
          title='Deleted Trigger'
          description="Get notified as an admin when a trigger is deleted from the Sales app by your team."
        />
      </div>
    </div>
  );
};

export default NotificationSettingsComponent;
