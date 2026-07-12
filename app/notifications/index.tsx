import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Chip, EmptyState } from '@/src/components/ui';
import { notifications, type AppNotification } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';

type NotificationFilter = 'all' | 'unread' | 'orders' | 'promotions';

const FILTERS: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'orders', label: 'Orders' },
  { id: 'promotions', label: 'Promotions' },
];

const EMPTY_STATE_COPY: Record<NotificationFilter, { title: string; description: string }> = {
  all: { title: 'No notifications', description: "You're all caught up." },
  unread: { title: 'No unread notifications', description: "You've read everything for now." },
  orders: { title: 'No order updates', description: 'Order updates will appear here.' },
  promotions: { title: 'No promotions', description: 'Check back later for new offers.' },
};

interface NotificationCardProps {
  notification: AppNotification;
  colors: ColorScheme;
  styles: ReturnType<typeof createStyles>;
}

function NotificationCard({ notification, colors, styles }: NotificationCardProps) {
  const { isRead } = notification;

  return (
    <Card variant={isRead ? 'outlined' : 'elevated'}>
      <View
        style={styles.row}
        accessible
        accessibilityLabel={`${notification.title}${isRead ? '' : ', unread'}. ${notification.message}. ${notification.time}`}
      >
        <View style={[styles.icon, !isRead && styles.iconUnread]}>
          <Ionicons name={notification.icon} size={20} color={isRead ? colors.textMuted : colors.primary} />
        </View>
        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            {!isRead ? <View style={styles.unreadDot} /> : null}
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.time}>{notification.time}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

  const visibleNotifications = useMemo(() => {
    if (activeFilter === 'unread') return notifications.filter((item) => !item.isRead);
    if (activeFilter === 'orders') return notifications.filter((item) => item.category === 'orders');
    if (activeFilter === 'promotions') return notifications.filter((item) => item.category === 'promotions');
    return notifications;
  }, [activeFilter]);

  const emptyState = EMPTY_STATE_COPY[activeFilter];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Stay updated on your laundry orders.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {FILTERS.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              selected={activeFilter === filter.id}
              onPress={() => setActiveFilter(filter.id)}
              accessibilityHint={`Shows ${filter.label.toLowerCase()} notifications`}
            />
          ))}
        </View>

        <View style={styles.list}>
          {visibleNotifications.length === 0 ? (
            <EmptyState title={emptyState.title} description={emptyState.description} icon="notifications-outline" />
          ) : (
            visibleNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} colors={colors} styles={styles} />
            ))
          )}
        </View>
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
      paddingBottom: Spacing.md,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: Spacing.sm,
      marginLeft: -Spacing.xxs,
    },
    title: {
      fontSize: Typography.headline.fontSize,
      lineHeight: Typography.headline.lineHeight,
      fontWeight: Typography.headline.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xxs,
    },
    subtitle: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
    content: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    list: {
      gap: Spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: Radius.circle,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    iconUnread: {
      backgroundColor: `${colors.primary}1A`,
      borderColor: 'transparent',
    },
    textWrap: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.xxs,
    },
    notificationTitle: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: Radius.circle,
      backgroundColor: colors.primary,
    },
    message: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
      marginBottom: Spacing.xxs,
    },
    time: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
    },
  });
