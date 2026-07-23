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
    // Without this, any navigation to a domain outside flow-mail-phi.vercel.app
    // (e.g. the Google login screen) gets kicked out to the system browser by
    // Android, and everything after that (including the dashboard) ends up
    // stuck in Chrome instead of the app. Whitelisting these keeps the whole
    // login -> dashboard flow inside the app's WebView.
    allowNavigation: [
      "flow-mail-phi.vercel.app",
      "accounts.google.com",
      "*.google.com",
      "*.googleusercontent.com",
      "*.googleapis.com",
      "*.gstatic.com",
    ],
  },

  plugins: {
    StatusBar: {
      // Without this, the app draws edge-to-edge behind the status bar
      // (Android 15+ default), so the dashboard header ends up jammed
      // against the clock/notification icons. This reserves real space
      // for the status bar and pushes the WebView content down below it.
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#0a0a0a",
    },
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