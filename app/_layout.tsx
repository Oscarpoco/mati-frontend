import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '@/redux/store/store';
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, fontLoadError] = useFonts({
    poppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
    poppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
    poppinsExtraLight: require('../assets/fonts/Poppins-ExtraLight.ttf'),
    poppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    poppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded || fontLoadError) {
      SplashScreen.hideAsync();
    }
  }, [loaded, fontLoadError]);

  if (!loaded && !fontLoadError) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </Provider>
  );
}