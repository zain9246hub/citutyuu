
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class PushNotificationService {
  private static isInitialized = false;
  private static listeners: any[] = [];

  static async initialize() {
    if (!Capacitor.isNativePlatform() || this.isInitialized) {
      console.log('Push notifications only work on native platforms or already initialized');
      return;
    }

    try {
      // Request permission
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();
        
        // Listen for registration token
        const registrationListener = PushNotifications.addListener('registration', (token) => {
          console.log('Push registration success, token: ' + token.value);
          localStorage.setItem('pushToken', token.value);
        });

        // Listen for registration errors
        const errorListener = PushNotifications.addListener('registrationError', (err) => {
          console.error('Registration error: ', err.error);
        });

        // Listen for incoming push notifications
        const receivedListener = PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received: ', notification);
        });

        // Listen for push notification actions
        const actionListener = PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed', notification.actionId, notification.inputValue);
        });

        // Store listeners for cleanup
        this.listeners = [registrationListener, errorListener, receivedListener, actionListener];
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  static async cleanup() {
    if (this.listeners.length > 0) {
      this.listeners.forEach(listener => {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      });
      this.listeners = [];
    }
    this.isInitialized = false;
  }

  static async sendLocalNotification(title: string, body: string) {
    if (Capacitor.isNativePlatform()) {
      try {
        // Request permissions for local notifications
        const permission = await LocalNotifications.requestPermissions();
        
        if (permission.display === 'granted') {
          await LocalNotifications.schedule({
            notifications: [
              {
                title,
                body,
                id: Date.now(),
                schedule: { at: new Date(Date.now() + 1000) }, // 1 second delay
                sound: 'default',
                attachments: [],
                actionTypeId: '',
                extra: null
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error sending local notification:', error);
      }
    } else {
      // Fallback for web - just log
      console.log('Local notification (web):', { title, body });
    }
  }

  static getRegistrationToken(): string | null {
    return localStorage.getItem('pushToken');
  }

  static isReady(): boolean {
    return this.isInitialized;
  }
}
