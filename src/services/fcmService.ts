import { PushNotifications } from '@capacitor/push-notifications';

export const addFCMLogListeners = async () => {
  await PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success, token: ' + token.value);
  });

  await PushNotifications.addListener('registrationError', (err) => {
    console.error('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push notification received: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log(
      'Push notification action performed',
      notification.actionId,
      notification.inputValue,
    );
  });
};

export const registerNotifications = async () => {
  let permission = await PushNotifications.checkPermissions();

  if (permission.receive === 'prompt') {
    permission = await PushNotifications.requestPermissions();
  }

  if (permission.receive === 'granted') {
    throw new Error('User denied permissions');
  }

  await PushNotifications.register();
};

export const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('Delivered notifications: ', notificationList);
};
