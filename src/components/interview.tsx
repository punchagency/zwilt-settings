import React, { useEffect, useState } from 'react';
import NotificationCards from './Notification/NotificationCards';
import { useNotificationSettings, SettingsItem } from "@/hooks/nortificationSettings/use-notification-settings";

const NotificationSettingsComponent: React.FC = () => {
    const { notificationSettings, createNotificationSettings, updateNotificationSettings, getNotificationState } = useNotificationSettings({});

    const [arrays, setArrays] = useState<{
        complete: SettingsItem[];
        incomplete: SettingsItem[];
    }>({
        complete: [],
        incomplete: [],
    });

    useEffect(() => {
        setArrays({
            complete: getNotificationState(notificationSettings?.interview?.complete),
            incomplete: getNotificationState(notificationSettings?.interview?.incomplete),
        });
    }, [notificationSettings]);

    const handleToggle = (id: string, type: 'complete' | 'incomplete') => {
        const updatedArray = (arr: SettingsItem[]) =>
            arr.map(item => (item.id === id ? { ...item, toggled: !item.toggled } : item));

        const newSettings = {
            ...notificationSettings,
            interview: {
                complete: createNotificationSettings(type === 'complete' ? updatedArray(arrays.complete) : arrays.complete),
                incomplete: createNotificationSettings(type === 'incomplete' ? updatedArray(arrays.incomplete) : arrays.incomplete),
            },
        };

        updateNotificationSettings(newSettings);
    };

    return (
        <div>
            <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.3vh] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.complete}
                    setArray={(id) => handleToggle(id, 'complete')}
                    title='Complete Interview'
                    description='Get notified when an interview for a job is completed.'
                />
            </div>

            <div className='py-[1.6vh] mt-[0.5vw]'>
                <NotificationCards
                    array={arrays.incomplete}
                    setArray={(id) => handleToggle(id, 'incomplete')}
                    title='Incomplete Interview'
                    description='Get notified when an interview for a job is incomplete.'
                />
            </div>
        </div>
    );
};

export default NotificationSettingsComponent;