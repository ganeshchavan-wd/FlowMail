import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.flowmail.app",
  appName: "FlowMail AI",

  // Not used when server.url is set
  webDir: "out",

  server: {
    url: "https://flow-mail-phi.vercel.app/",
    cleartext: false,
    androidScheme: "https",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a0a",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#6366f1",
    },
  },
};

export default config;