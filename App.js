import 'react-native-gesture-handler';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

import { AuthProvider } from './authProvider';
import { Router } from './components/Router';
import config from './tamagui.config';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <TamaguiProvider config={config}>
        <Theme name={colorScheme}>
          <ThemeProvider
            value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
            <SafeAreaProvider>
              <Router colorScheme={colorScheme} />
            </SafeAreaProvider>
          </ThemeProvider>
        </Theme>
      </TamaguiProvider>
    </AuthProvider>
  );
}
