import React, { useEffect, useState } from 'react';
import NotificationCards from './Notification/NotificationCards';
import { useNotificationSettings, SettingsItem } from "@/hooks/nortificationSettings/use-notification-settings";

const NotificationSettingsComponent: React.FC = () => {
    const {
        notificationSettings,
        createNotificationSettings,
        updateNotificationSettings,
        getNotificationState
    } = useNotificationSettings({});
    
    const [arrays, setArrays] = useState<{
        loginActivity: SettingsItem[];
        passwordChanged: SettingsItem[];
        profileUpdates: SettingsItem[];
    }>({
        loginActivity: [],
        passwordChanged: [],
        profileUpdates: [],
    });

    useEffect(() => {
        setArrays({
            loginActivity: getNotificationState(notificationSettings.userAndAccount.loginActivity),
            passwordChanged: getNotificationState(notificationSettings.userAndAccount.passwordChanged),
            profileUpdates: getNotificationState(notificationSettings.userAndAccount.profileUpdates),
        });
    }, [notificationSettings]);

    const handleToggle = (id: string, type: 'loginActivity' | 'passwordChanged' | 'profileUpdates') => {
        const updatedArray = (arr: SettingsItem[]) =>
            arr.map(item => (item.id === id ? { ...item, toggled: !item.toggled } : item));

        const newSettings = {
            ...notificationSettings,
            userAndAccount: {
                loginActivity: createNotificationSettings(type === 'loginActivity' ? updatedArray(arrays.loginActivity) : arrays.loginActivity),
                passwordChanged: createNotificationSettings(type === 'passwordChanged' ? updatedArray(arrays.passwordChanged) : arrays.passwordChanged),
                profileUpdates: createNotificationSettings(type === 'profileUpdates' ? updatedArray(arrays.profileUpdates) : arrays.profileUpdates),
            },
        };

        updateNotificationSettings(newSettings);
    };

    return (
        <div>
            <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.4vh]'>
                <NotificationCards 
                    array={arrays.loginActivity}
                    setArray={(id) => handleToggle(id, 'loginActivity')}
                    title='Login Activity'
                    description='Get notified when you log in from a new device.'
                />
            </div>

            <div className='py-[1.6vh] mt-[0.5vw] border-b-[0.3vh] border-[#E0E0E9]'>
                <NotificationCards 
                    array={arrays.passwordChanged}
                    setArray={(id) => handleToggle(id, 'passwordChanged')}
                    title='Password Change'
                    description='Get notified when your password is changed.'
                />
            </div>

            <div className='py-[1.6vh] mt-[0.5vw]'>
                <NotificationCards 
                    array={arrays.profileUpdates}
                    setArray={(id) => handleToggle(id, 'profileUpdates')}
                    title='Profile Updates'
                    description='Get notified when your profile is updated.'
                />
            </div>
        </div>
    );
};

export default NotificationSettingsComponent;