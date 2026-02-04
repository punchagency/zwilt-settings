import React, { useEffect, useState } from 'react';
import NotificationCards from './Notification/NotificationCards';
import { useNotificationSettings, SettingsItem } from "@/hooks/nortificationSettings/use-notification-settings";

const NotificationSettingsComponent: React.FC = () => {
    const { notificationSettings, createNotificationSettings, getNotificationState, updateNotificationSettings } = useNotificationSettings({});
    
    const [arrays, setArrays] = useState<{
        teamAdded: SettingsItem[];
        teamDeleted: SettingsItem[];
        roleChanged: SettingsItem[];
        addedToTracker: SettingsItem[];
    }>({
        teamAdded: [],
        teamDeleted: [],
        roleChanged: [],
        addedToTracker: [],
    });

    useEffect(() => {
        setArrays({
            teamAdded: getNotificationState(notificationSettings?.teamActivity?.memberAdded),
            teamDeleted: getNotificationState(notificationSettings?.teamActivity?.memberDeleted),
            roleChanged: getNotificationState(notificationSettings?.teamActivity?.roleChanged),
            addedToTracker: getNotificationState(notificationSettings?.teamActivity?.addedToTracker),
        });
    }, [notificationSettings]);

    const handleToggle = (id: string, type: 'teamAdded' | 'teamDeleted' | 'roleChanged' | 'addedToTracker') => {
        const updatedArray = (arr: SettingsItem[]) =>
            arr.map(item => (item.id === id ? { ...item, toggled: !item.toggled } : item));

        const newSettings = {
            ...notificationSettings,
            teamActivity: {
                memberAdded: createNotificationSettings(type === 'teamAdded' ? updatedArray(arrays.teamAdded) : arrays.teamAdded),
                memberDeleted: createNotificationSettings(type === 'teamDeleted' ? updatedArray(arrays.teamDeleted) : arrays.teamDeleted),
                roleChanged: createNotificationSettings(type === 'roleChanged' ? updatedArray(arrays.roleChanged) : arrays.roleChanged),
                addedToTracker: createNotificationSettings(type === 'addedToTracker' ? updatedArray(arrays.addedToTracker) : arrays.addedToTracker),
            },
        };

        updateNotificationSettings(newSettings);
    };

    return (
        <div>
            <div className='pb-[1.6vh] border-b-[0.3vh] mt-[0.5vw] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.teamAdded}
                    setArray={(id) => handleToggle(id, 'teamAdded')}
                    title='New Team Member Added'
                    description='Get notified when a new member joins your team.'
                />
            </div>

            <div className='py-[1.6vh] border-b-[0.3vh] mt-[0.5vw] border-[#E0E0E9]'>
                <NotificationCards 
                    array={arrays.teamDeleted}
                    setArray={(id) => handleToggle(id, 'teamDeleted')}
                    title='Team Member Deleted'
                    description='Get notified when a team member is removed from your team.'
                    />
            </div>

            <div className='py-[1.6vh] border-b-[0.3vh] mt-[0.5vw] border-[#E0E0E9]'>
                <NotificationCards 
                    array={arrays.roleChanged}
                    setArray={(id) => handleToggle(id, 'roleChanged')}
                    title='Team Member Role Changed'
                    description="Get notified when a team member's role is changed."
                    />
            </div>

            <div className='pt-[1.6vh] mt-[0.5vw]'>
                <NotificationCards 
                    array={arrays.addedToTracker}
                    setArray={(id) => handleToggle(id, 'addedToTracker')}
                    title='Team Member Added to Tracker'
                    description='Get notified when a team member is added to tracker.'
                />
            </div>
        </div>
    );
};

export default NotificationSettingsComponent;