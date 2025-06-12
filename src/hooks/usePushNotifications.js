import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { urlBase64ToUint8Array } from '../utils/vapidConverter';
import userApi from '../api/userApi';
import { addToast } from '../store/slices/toastSlice';


const PUBLIC_VAPID_KEY = 'BAn4DkLbIMSZ718DTaJvhRFetLG0tRBZ1kh1zmhLhti0GMMlSWrRJgGGyZHqlES0tBdYB-d77cOawDS_mvYlO1o';

const usePushNotifications = (userId) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userId || !('serviceWorker' in navigator)) return;
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (err) {
        console.error('Checking push subscription failed:', err);
      }
    };
    checkSubscription();
  }, [userId]);

  const subscribe = useCallback(async () => {
    if (!userId || !('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const existing = await registration.pushManager.getSubscription();

      if (existing) {
        await existing.unsubscribe();
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      await userApi.userSubscribe(userId, subscription);
      setIsSubscribed(true);

      dispatch(
        addToast({
          id: Date.now(),
          type: 'success',
          message: 'Browser notifications have been enabled',
          duration: 3000,
        })
      );
    } catch (err) {
      console.error('Push subscribe failed:', err);
      dispatch(
        addToast({
          id: Date.now(),
          type: 'error',
          message: 'Failed to enable browser notifications',
          duration: 3000,
        })
      );
    }
  }, [userId, dispatch]);

  const unsubscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await userApi.userUnsubscribe(userId);
      }

      setIsSubscribed(false);

      dispatch(
        addToast({
          id: Date.now(),
          type: 'info',
          message: 'Browser notifications have been disabled',
          duration: 3000,
        })
      );
    } catch (err) {
      console.error('Push unsubscribe failed:', err);
      dispatch(
        addToast({
          id: Date.now(),
          type: 'error',
          message: 'Failed to disable browser notifications',
          duration: 3000,
        })
      );
    }
  }, [userId, dispatch]);

  const toggleSubscription = useCallback(() => {
    isSubscribed ? unsubscribe() : subscribe();
  }, [isSubscribed, subscribe, unsubscribe]);

  return { isSubscribed, subscribe, unsubscribe, toggleSubscription };
};

export default usePushNotifications;
