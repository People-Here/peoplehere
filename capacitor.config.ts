import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.peoplehereteam.peoplehere',
  appName: 'peoplehere',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
