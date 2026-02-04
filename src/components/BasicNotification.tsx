import React, { useCallback, useEffect, useState } from 'react';
import NotificationCards from './Notification/NotificationCards';
import { useNotificationSettings, SettingsItem } from "@/hooks/nortificationSettings/use-notification-settings";

const BasicNotification: React.FC = () => {
    const { notificationSettings, updateNotificationSettings, createNotificationSettings, getNotificationState } = useNotificationSettings({});

    const [arrays, setArrays] = useState<{
        comments: SettingsItem[];
        reactions: SettingsItem[];
        tags: SettingsItem[];
        favourites: SettingsItem[];
    }>({
        comments: [],
        reactions: [],
        tags: [],
        favourites: [],
    });

    const updateArrays = useCallback(() => {
        setArrays({
            comments: getNotificationState(notificationSettings?.basic?.comments),
            reactions: getNotificationState(notificationSettings?.basic?.reactions),
            tags: getNotificationState(notificationSettings?.basic?.tags),
            favourites: getNotificationState(notificationSettings?.basic?.favourites),
        });
    }, [notificationSettings]);


    useEffect(() => {
        updateArrays()
    }, [updateArrays])

    const handleToggle = (id: string, type: 'comments' | 'reactions' | 'tags' | 'favourites') => {
        const updatedArray = (arr: SettingsItem[]) =>
            arr.map(item => (item.id === id ? { ...item, toggled: !item.toggled, name: item.name?.toUpperCase() } : item));

        const newSettings = {
            ...notificationSettings,
            basic: {
                comments: createNotificationSettings(type === 'comments' ? updatedArray(arrays.comments) : arrays.comments),
                reactions: createNotificationSettings(type === 'reactions' ? updatedArray(arrays.reactions) : arrays.reactions),
                tags: createNotificationSettings(type === 'tags' ? updatedArray(arrays.tags) : arrays.tags),
                favourites: createNotificationSettings(type === 'favourites' ? updatedArray(arrays.favourites) : arrays.favourites),
            },
        };

        updateNotificationSettings(newSettings);
    };

    return (
        <div>
            <div className='pb-[1.6vh] mt-[0.5vw] border-b-[0.3vh] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.comments}
                    setArray={(id) => handleToggle(id, 'comments')}
                    title='Comments'
                    description='Get notified when your team members add new comments to an interview profile.'
                />
            </div>

            <div className='py-[1.6vh] mt-[0.5vw] border-b-[0.3vh] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.reactions}
                    setArray={(id) => handleToggle(id, 'reactions')}
                    description='Get notified about new reactions added by your team to an interview profile.'
                    title='Reactions'
                />
            </div>

            <div className='py-[1.6vh] mt-[0.5vw] border-b-[0.3vh] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.tags}
                    setArray={(id) => handleToggle(id, 'tags')}
                    title='Tags'
                    description='Get notified when you are tagged by your team on an interview profile.'
                />
            </div>

            <div className='pt-[1.6vh] mt-[0.5vw]'>
                <NotificationCards
                    array={arrays.favourites}
                    setArray={(id) => handleToggle(id, 'favourites')}
                    title='Favorited'
                    description='Get notified when your team members favorite an interview profile.'
                />
            </div>
        </div>
    );
};

export default BasicNotification;