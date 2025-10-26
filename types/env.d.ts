declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      EXPO_PUBLIC_NEWS_API: string;
  }
}
}

export { };