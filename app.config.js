import "dotenv/config";

export default {
  expo: {
    name: "Mati",
    slug: "mati-frontend",
    version: "1.7.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "matifrontend",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        backgroundColor: "#000000",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.oscarpocokyle.matifrontend",
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
     
    "expo-web-browser"

    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      EXPO_PUBLIC_NEWS_API: process.env.EXPO_PUBLIC_NEWS_API,

      router: {},
      eas: {
        projectId: "3f0e474a-5986-4bdb-a074-81bf29d0b52e",
      },
    },
  },
};
