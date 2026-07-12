import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useSettingsStore } from '@/src/store/settingsStore';

export default function RootLayout() {
  const themeMode = useSettingsStore((state) => state.themeMode);

  return (
    <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          // Never show a text label next to the native back button (e.g. "(tabs)") —
          // only the chevron icon. Applies to every screen that opts into a native header.
          headerBackTitle: '',
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="laundry/[id]" />
        <Stack.Screen name="services/index" />
        <Stack.Screen name="shops/index" />
        <Stack.Screen name="pickup/index" />
        <Stack.Screen name="summary/index" />
        <Stack.Screen name="payment/index" />
        <Stack.Screen name="success/index" />
        <Stack.Screen name="tracking/index" />
        <Stack.Screen name="order-details/index" />
        <Stack.Screen name="addresses/index" />
        <Stack.Screen name="addresses/add" />
        <Stack.Screen name="addresses/edit" />
        <Stack.Screen name="payment-methods/index" />
        <Stack.Screen name="payment-methods/add" />
        <Stack.Screen name="notifications/index" />
        <Stack.Screen name="favorites/index" />
        <Stack.Screen name="help-center/index" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="about/index" />
        <Stack.Screen name="design-system" options={{ headerShown: true, title: 'Design System' }} />
      </Stack>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
