
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.20e66b2e186547d896ed4da7aad7ea59',
  appName: 'task-optimizer-delight-12-55',
  webDir: 'dist',
  server: {
    url: 'https://20e66b2e-1865-47d8-96ed-4da7aad7ea59.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    }
  }
};

export default config;
