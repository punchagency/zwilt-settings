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
        paymentMethodChanged: SettingsItem[];
        invoiceGenerated: SettingsItem[];
        paymentSuccessful: SettingsItem[];
        paymentFailed: SettingsItem[];
    }>({
        paymentMethodChanged: [],
        invoiceGenerated: [],
        paymentSuccessful: [],
        paymentFailed: [],
    });

    useEffect(() => {
        setArrays({
            paymentMethodChanged: getNotificationState(notificationSettings.billingAndPayment.paymentMethodChanged),
            invoiceGenerated: getNotificationState(notificationSettings.billingAndPayment.invoiceGenerated),
            paymentSuccessful: getNotificationState(notificationSettings.billingAndPayment.paymentSuccessful),
            paymentFailed: getNotificationState(notificationSettings.billingAndPayment.paymentFailed),
        });
    }, [notificationSettings]);

    const handleToggle = (id: string, type: 'paymentMethodChanged' | 'invoiceGenerated' | 'paymentSuccessful' | 'paymentFailed') => {
        const updatedArray = (arr: SettingsItem[]) =>
            arr.map(item => (item.id === id ? { ...item, toggled: !item.toggled } : item));

        const newSettings = {
            ...notificationSettings,
            billingAndPayment: {
                paymentMethodChanged: createNotificationSettings(type === 'paymentMethodChanged' ? updatedArray(arrays.paymentMethodChanged) : arrays.paymentMethodChanged),
                invoiceGenerated: createNotificationSettings(type === 'invoiceGenerated' ? updatedArray(arrays.invoiceGenerated) : arrays.invoiceGenerated),
                paymentSuccessful: createNotificationSettings(type === 'paymentSuccessful' ? updatedArray(arrays.paymentSuccessful) : arrays.paymentSuccessful),
                paymentFailed: createNotificationSettings(type === 'paymentFailed' ? updatedArray(arrays.paymentFailed) : arrays.paymentFailed),
            },
        };

        updateNotificationSettings(newSettings);
    };

    return (
        <div>
            <div className='pb-[1.6vh] border-b-[0.3vh] mt-[0.5vw] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.paymentMethodChanged}
                    setArray={(id) => handleToggle(id, 'paymentMethodChanged')}
                    title='Payment Method Changed'
                    description='Get notified when your payment method is changed.'
                />
            </div>

            <div className='py-[1.6vh] border-b-[0.3vh] mt-[0.5vw] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.invoiceGenerated}
                    setArray={(id) => handleToggle(id, 'invoiceGenerated')}
                    title='Invoice Generated'
                    description='Get notified when an invoice is generated for your account.'
                />
            </div>

            <div className='py-[1.6vh] border-b-[0.3vh] mt-[0.5vw] border-[#E0E0E9]'>
                <NotificationCards
                    array={arrays.paymentSuccessful}
                    setArray={(id) => handleToggle(id, 'paymentSuccessful')}
                    title='Payment Successful'
                    description='Get notified when your payment is successfully processed.'
                />
            </div>

            <div className='pt-[1.6vh] mt-[0.5vw]'>
                <NotificationCards
                    array={arrays.paymentFailed}
                    setArray={(id) => handleToggle(id, 'paymentFailed')}
                    title='Payment Failed'
                    description='Get notified when a payment fails to process.'
                />
            </div>
        </div>
    );
};

export default NotificationSettingsComponent;