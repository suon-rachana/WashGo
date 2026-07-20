import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { LoadingState } from '@/src/components/ui';
import { isSupabaseDataSource } from '@/src/config/dataSource';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useAuthStore } from '@/src/store/auth';
import { useSettingsStore } from '@/src/store/settingsStore';
import { Typography } from '@/src/theme';

// Supabase-mode only: keeps unauthenticated users out of the customer tabs
// and bounces an already-authenticated user away from login/register. Mock
// mode is untouched — the prototype's own router.replace() calls in each
// screen keep controlling navigation exactly as before.
function useAuthNavigationGuard() {
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isSupabaseDataSource) return;
    // Wait until the root navigator has mounted, and until the initial
    // session check has resolved, so we never redirect on stale state.
    if (!rootNavigationState?.key) return;
    if (isInitializing) return;

    const topSegment = segments[0] as string | undefined;
    const inAuthGroup = topSegment === 'login' || topSegment === 'register';
    const inProtectedGroup = topSegment === '(tabs)';

    if (!isAuthenticated && inProtectedGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isInitializing, rootNavigationState?.key, router, segments]);
}

export default function RootLayout() {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const colors = useThemeColors();
  const initialize = useAuthStore((state) => state.initialize);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useAuthNavigationGuard();

  if (isSupabaseDataSource && isInitializing) {
    return (
      <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
          <View>
            <LoadingState />
          </View>
        </SafeAreaView>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          // Off by default so screens that haven't adopted AppScreen/the
          // native header yet keep rendering their own in-page header
          // unchanged. AppScreen turns this on per-screen via a nested
          // <Stack.Screen options={{ headerShown: true }} /> override.
          headerShown: false,
          // Never show a text label next to the native back button (e.g. "(tabs)") —
          // only the chevron icon. Applies to every screen that opts into a native header.
          headerBackTitle: '',
          headerBackButtonDisplayMode: 'minimal',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: {
            fontSize: Typography.subtitle.fontSize,
            fontWeight: Typography.subtitle.fontWeight,
          },
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
        <Stack.Screen name="map/index" />
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
        <Stack.Screen name="personal-information/index" />
        <Stack.Screen name="language/index" />
        <Stack.Screen name="legal/index" />
        <Stack.Screen name="design-system" options={{ headerShown: true, title: 'Design System' }} />
      </Stack>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
