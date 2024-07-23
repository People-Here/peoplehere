import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Preferences } from '@capacitor/preferences';

export const addFCMListeners = async () => {
  await FirebaseMessaging.addListener('tokenReceived', async (event) => {
    await Preferences.set({ key: 'fcmToken', value: event.token });
    console.log('Push registration success, token: ' + event.token);
  });

  await FirebaseMessaging.addListener('notificationReceived', (event) => {
    console.log('Push notification received: ', event.notification);
  });

  await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
    console.log('Push notification action performed', event.actionId, event.inputValue);
  });
};

export const registerNotifications = async () => {
  let permission = await FirebaseMessaging.checkPermissions();

  if (permission.receive === 'prompt') {
    permission = await FirebaseMessaging.requestPermissions();
  }

  if (permission.receive !== 'granted') {
    throw new Error('User denied permissions');
  }
};

export const getDeliveredNotifications = async () => {
  const notificationList = await FirebaseMessaging.getDeliveredNotifications();
  console.log('Delivered notifications: ', notificationList);
};
