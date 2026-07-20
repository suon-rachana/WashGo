import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationItem } from '@/src/components/notification';
import { Chip, EmptyState } from '@/src/components/ui';
import { getOrderById } from '@/src/data/mock';
import { getUnreadNotificationCount, type WashGoNotification } from '@/src/data/mock/notifications';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { useNotificationsStore } from '@/src/store/notifications';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

type NotificationFilter = 'all' | 'unread';

// `/shops` and `/settings` are index routes; the local typed-routes generator
// doesn't collapse index files to their parent path, so the literal string
// fails the type check even though it's the correct runtime href. Cast once here.
const SHOPS_HREF = '/shops' as Href;
const SETTINGS_HREF = '/settings' as Href;

export default function NotificationsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const notifications = useNotificationsStore((state) => state.notifications);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);

  const unreadCount = useMemo(() => getUnreadNotificationCount(notifications), [notifications]);
  const visibleNotifications = filter === 'unread' ? notifications.filter((item) => !item.isRead) : notifications;

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // No backend yet — mock the refresh gesture so the screen still feels live.
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleNotificationPress = useCallback(
    (notification: WashGoNotification) => {
      markAsRead(notification.id);

      if (notification.type === 'promotion') {
        router.push(SHOPS_HREF);
        return;
      }

      if (notification.type === 'system') {
        router.push(SETTINGS_HREF);
        return;
      }

      // Every other type is tied to an order — validate it still exists
      // before navigating so malformed/missing notification data can't crash
      // the screen.
      const order = getOrderById(notification.orderId);
      if (!order) {
        Alert.alert(t('orderDetails'), t('orderNotFound'));
        return;
      }

      if (order.status === 'active') {
        router.push({ pathname: '/tracking', params: { orderId: order.id } } as unknown as Href);
      } else {
        router.push({ pathname: '/order-details', params: { orderId: order.id } } as unknown as Href);
      }
    },
    [markAsRead, router, t]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.titleRow}>
          <Text style={styles.title}>{t('notifications')}</Text>
          {unreadCount > 0 ? (
            <Pressable
              onPress={markAllAsRead}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t('markAllAsRead')}
            >
              <Text style={styles.markAllText}>{t('markAllAsRead')}</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.filterRow}>
          <Chip
            label={t('all')}
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            accessibilityHint="Shows all notifications"
          />
          <Chip
            label={t('unread')}
            selected={filter === 'unread'}
            onPress={() => setFilter('unread')}
            accessibilityHint="Shows only unread notifications"
          />
        </View>
      </View>

      <FlatList
        data={visibleNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <NotificationItem notification={item} onPress={() => handleNotificationPress(item)} />
        )}
        ListEmptyComponent={
          filter === 'unread' ? (
            <EmptyState
              icon="checkmark-done-outline"
              title={t('youAreAllCaughtUp')}
              description={t('noUnreadNotificationsDescription')}
            />
          ) : (
            <EmptyState
              icon="notifications-outline"
              title={t('noNotifications')}
              description={t('notificationsEmptyDescription')}
            />
          )
        }
      />
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
      paddingBottom: Spacing.md,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: Spacing.sm,
      marginLeft: -Spacing.xxs,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.lg,
    },
    title: {
      fontSize: Typography.headline.fontSize,
      lineHeight: Typography.headline.lineHeight,
      fontWeight: Typography.headline.fontWeight,
      color: colors.text,
    },
    markAllText: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.primary,
    },
    filterRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    listContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
    separator: {
      height: Spacing.md,
    },
  });
