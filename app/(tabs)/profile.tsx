import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { ComponentProps, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuRow } from '@/src/components/common';
import { Badge, Card } from '@/src/components/ui';
import { mockUser } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation, type TranslationKey } from '@/src/i18n';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';

interface MenuItem {
  id: string;
  labelKey: TranslationKey;
  icon: ComponentProps<typeof Ionicons>['name'];
  accessibilityHint: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'orders', labelKey: 'myOrders', icon: 'receipt-outline', accessibilityHint: 'Opens your order history' },
  {
    id: 'addresses',
    labelKey: 'savedAddresses',
    icon: 'location-outline',
    accessibilityHint: 'Opens saved addresses',
  },
  {
    id: 'payment',
    labelKey: 'paymentMethods',
    icon: 'card-outline',
    accessibilityHint: 'Opens saved payment methods',
  },
  {
    id: 'favorites',
    labelKey: 'favoriteLaundries',
    icon: 'heart-outline',
    accessibilityHint: 'Opens your favorite laundries',
  },
  {
    id: 'notifications',
    labelKey: 'notifications',
    icon: 'notifications-outline',
    accessibilityHint: 'Opens the notifications screen',
  },
  { id: 'help', labelKey: 'helpCenter', icon: 'help-circle-outline', accessibilityHint: 'Opens the help center' },
  { id: 'settings', labelKey: 'settings', icon: 'settings-outline', accessibilityHint: 'Opens app settings' },
  {
    id: 'about',
    labelKey: 'aboutWashGo',
    icon: 'information-circle-outline',
    accessibilityHint: 'Opens information about WashGo',
  },
];

// `/(tabs)/orders`, `/addresses`, `/payment-methods`, `/favorites`,
// `/notifications`, `/help-center`, `/settings`, and `/about` are index
// routes (or, for `/(tabs)/orders`, a route inside a group); the local
// typed-routes generator doesn't collapse these to a plain path, so the
// literal string fails the type check even though it's the correct runtime
// href. Cast once here for each.
const ORDERS_HREF = '/(tabs)/orders' as Href;
const ADDRESSES_HREF = '/addresses' as Href;
const FAVORITES_HREF = '/favorites' as Href;
const PAYMENT_METHODS_HREF = '/payment-methods' as Href;
const NOTIFICATIONS_HREF = '/notifications' as Href;
const HELP_CENTER_HREF = '/help-center' as Href;
const SETTINGS_HREF = '/settings' as Href;
const ABOUT_HREF = '/about' as Href;

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  const handleMenuItemPress = (itemId: string) => {
    if (itemId === 'orders') {
      router.push(ORDERS_HREF);
      return;
    }
    if (itemId === 'addresses') {
      router.push(ADDRESSES_HREF);
      return;
    }
    if (itemId === 'payment') {
      router.push(PAYMENT_METHODS_HREF);
      return;
    }
    if (itemId === 'favorites') {
      router.push(FAVORITES_HREF);
      return;
    }
    if (itemId === 'notifications') {
      router.push(NOTIFICATIONS_HREF);
      return;
    }
    if (itemId === 'help') {
      router.push(HELP_CENTER_HREF);
      return;
    }
    if (itemId === 'settings') {
      router.push(SETTINGS_HREF);
      return;
    }
    if (itemId === 'about') {
      router.push(ABOUT_HREF);
      return;
    }
  };

  const handleLogout = () => {
    Alert.alert(t('logOutConfirmTitle'), t('logOutConfirmMessage'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: () => router.replace('/login'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
          <Text style={styles.name}>{mockUser.firstName}</Text>
          <Text style={styles.phone}>{mockUser.phone}</Text>
          <Badge label={t('regularMember')} variant="secondary" style={styles.memberBadge} />
        </Card>

        <Card variant="outlined" padding="none" style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <MenuRow
              key={item.id}
              icon={item.icon}
              label={t(item.labelKey)}
              showDivider={index < MENU_ITEMS.length - 1}
              onPress={() => handleMenuItemPress(item.id)}
              accessibilityHint={item.accessibilityHint}
            />
          ))}
        </Card>

        <Card variant="outlined" padding="none" style={styles.menuCard}>
          <MenuRow
            icon="log-out-outline"
            label={t('logout')}
            danger
            onPress={handleLogout}
            accessibilityHint="Logs you out of your account"
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
    },
    title: {
      fontSize: Typography.headline.fontSize,
      lineHeight: Typography.headline.lineHeight,
      fontWeight: Typography.headline.fontWeight,
      color: colors.text,
    },
    content: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
    profileCard: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: Radius.circle,
      backgroundColor: `${colors.primary}1A`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.md,
    },
    name: {
      fontSize: Typography.title.fontSize,
      lineHeight: Typography.title.lineHeight,
      fontWeight: Typography.title.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xxs,
    },
    phone: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
      marginBottom: Spacing.md,
    },
    memberBadge: {
      alignSelf: 'center',
    },
    menuCard: {
      marginBottom: Spacing.xl,
    },
  });
