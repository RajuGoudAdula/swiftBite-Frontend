// src/hooks/usePushNotifications.js
import { useEffect } from 'react';
import { urlBase64ToUint8Array } from '../utils/vapidConverter';
import userApi from '../api/userApi';

const PUBLIC_VAPID_KEY = 'BAn4DkLbIMSZ718DTaJvhRFetLG0tRBZ1kh1zmhLhti0GMMlSWrRJgGGyZHqlES0tBdYB-d77cOawDS_mvYlO1o';

const usePushNotifications = (userId) => {
  useEffect(() => {
    const registerPush = async () => {
      if (!userId || !('serviceWorker' in navigator)) return;

      try {
        // 1. Register Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js');

        // 2. Check existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
          // Optional: You could compare keys here if you want, but just unsubscribe for now
          await existingSubscription.unsubscribe();
        }

        // 3. Subscribe to Push Manager with VAPID key
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });

        // 4. Save subscription to backend
        await userApi.userSubscribe(userId, subscription);

      } catch (error) {
        console.error('Push subscription error:', error.message);
      }
    };

    registerPush();
  }, [userId]);
};

export default usePushNotifications;
