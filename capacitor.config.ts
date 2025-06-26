
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f61d6b17b8834e8daac3199c7b4c12b6',
  appName: 'iOS Diagnostics',
  webDir: 'dist',
  server: {
    url: 'https://f61d6b17-b883-4e8d-aac3-199c7b4c12b6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      showSpinner: false
    }
  }
};

export default config;
