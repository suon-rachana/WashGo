import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { Spacing, Typography } from '@/src/theme';

export default function TabLayout() {
  const colors = useThemeColors();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        // Off by default — Home keeps its own custom in-page header.
        // Orders/Laundries/Profile below turn this on for a compact native
        // header matching the rest of the app; these style options apply
        // whenever a screen does.
        headerShown: false,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: {
          fontSize: Typography.subtitle.fontSize,
          fontWeight: Typography.subtitle.fontWeight,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarItemStyle: {
          paddingTop: Spacing.xxs,
        },
        tabBarLabelStyle: {
          fontSize: Typography.label.fontSize,
          fontWeight: Typography.label.fontWeight,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: t('home'),
          tabBarAccessibilityLabel: t('home'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('orders'),
          headerShown: true,
          tabBarAccessibilityLabel: t('orders'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="laundries"
        options={{
          // Tab bar keeps the short "Laundries" label; the native header
          // shows the longer, existing "Choose a Laundry" title.
          title: t('laundries'),
          headerShown: true,
          headerTitle: t('chooseALaundry'),
          tabBarAccessibilityLabel: t('laundries'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'shirt' : 'shirt-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          headerShown: true,
          tabBarAccessibilityLabel: t('profile'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
