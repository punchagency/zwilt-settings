import React, { useEffect, useState } from 'react';
import NotificationCards from './Notification/NotificationCards';
import { useNotificationSettings, SettingsItem } from "@/hooks/nortificationSettings/use-notification-settings";

const NotificationSettingsComponent: React.FC = () => {
    const { notificationSettings, createNotificationSettings, updateNotificationSettings, getNotificationState } = useNotificationSettings({});
    
    const [arrays, setArrays] = useState<{
        rejected: SettingsItem[];
        // newApplication: SettingsItem[];
    }>({
        rejected: [],
        // newApplication: [],
    });

    useEffect(() => {
        setArrays({
            rejected: getNotificationState(notificationSettings?.candidate?.rejected),
            // newApplication: getNotificationState(notificationSettings?.candidate?.newApplication),
        });
    }, [notificationSettings]);

    const handleToggle = (id: string, type: 'rejected' | 'newApplication') => {
        const updatedArray = (arr: SettingsItem[]) =>
            arr.map(item => (item.id === id ? { ...item, toggled: !item.toggled } : item));

        const newSettings = {
            ...notificationSettings,
            candidate: {
                rejected: createNotificationSettings(type === 'rejected' ? updatedArray(arrays.rejected) : arrays.rejected),
                // newApplication: createNotificationSettings(type === 'newApplication' ? updatedArray(arrays.newApplication) : arrays.newApplication),
            },
        };

        updateNotificationSettings(newSettings);
    };

    return (
        <div>
            <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.3vh] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.rejected}
                    setArray={(id) => handleToggle(id, 'rejected')}
                    title='Candidate Rejected'
                    description='Get notified when a candidate is rejected for a job.'
                />
            </div>

            {/* <div className='py-[1.6vh] mt-[0.5vw]'>
                <NotificationCards
                    array={arrays.newApplication}
                    setArray={(id) => handleToggle(id, 'newApplication')}
                    title='New Candidate Application'
                    description='Get notified when a new candidate applies for a job.'
                />
            </div> */}
        </div>
    );
};

export default NotificationSettingsComponent;