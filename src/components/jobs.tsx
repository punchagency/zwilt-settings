import React, { useEffect, useState } from 'react';
import NotificationCards from './Notification/NotificationCards';
import { useNotificationSettings, SettingsItem } from "@/hooks/nortificationSettings/use-notification-settings";

const NotificationSettingsComponent: React.FC = () => {
    const { notificationSettings, createNotificationSettings, updateNotificationSettings, getNotificationState } = useNotificationSettings({});

    const [arrays, setArrays] = useState<{
        posted: SettingsItem[];
        archived: SettingsItem[];
    }>({
        posted: [],
        archived: [],
    });

    useEffect(() => {
        setArrays({
            posted: getNotificationState(notificationSettings?.job?.posted),
            archived: getNotificationState(notificationSettings?.job?.archived),
        });
    }, [notificationSettings]);

    const handleToggle = (id: string, type: 'posted' | 'archived') => {
        const updatedArray = (arr: SettingsItem[]) =>
            arr.map(item => (item.id === id ? { ...item, toggled: !item.toggled } : item));

        const newSettings = {
            ...notificationSettings,
            job: {
                posted: createNotificationSettings(type === 'posted' ? updatedArray(arrays.posted) : arrays.posted),
                archived: createNotificationSettings(type === 'archived' ? updatedArray(arrays.archived) : arrays.archived),
            },
        };

        updateNotificationSettings(newSettings);
    };

    return (
        <div>
            <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.3vh] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.posted}
                    setArray={(id) => handleToggle(id, 'posted')}
                    title='Job Posted'
                    description='Get notified when a new job is posted or created.'
                />
            </div>

            <div className='py-[1.6vh] mt-[0.5vw]'>
                <NotificationCards
                    array={arrays.archived}
                    setArray={(id) => handleToggle(id, 'archived')}
                    title='Job Archived'
                    description="Receive notifications when a job is archived."
                />
            </div>
        </div>
    );
};

export default NotificationSettingsComponent;