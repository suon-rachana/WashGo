import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionHeader } from '@/src/components/common';
import { Card } from '@/src/components/ui';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

export default function LegalScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
        <Text style={styles.title}>{t('termsAndPrivacy')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="outlined" style={styles.noticeCard}>
          <View style={styles.noticeRow}>
            <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
            <Text style={styles.noticeText}>
              WashGo is an academic thesis project. This page is placeholder content for
              presentation purposes and is not a real legal agreement.
            </Text>
          </View>
        </Card>

        <View style={styles.section}>
          <SectionHeader title="Terms of Service" />
          <Card variant="outlined">
            <Text style={styles.paragraph}>
              By using the WashGo prototype, you agree that all orders, payments, and account data
              shown in the app are simulated for demonstration purposes only. No real laundry
              service is scheduled or delivered, and no real payment is processed.
            </Text>
          </Card>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <SectionHeader title="Privacy Policy" />
          <Card variant="outlined">
            <Text style={styles.paragraph}>
              The prototype does not send your information to a server or store it outside your
              device session. Profile details, addresses, and payment preferences you enter reset
              the next time the app restarts.
            </Text>
          </Card>
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
    },
    content: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
    noticeCard: {
      marginBottom: Spacing.xl,
    },
    noticeRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.sm,
    },
    noticeText: {
      flex: 1,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      color: colors.textMuted,
    },
    section: {
      marginBottom: Spacing.xxl,
    },
    lastSection: {
      marginBottom: Spacing.xl,
    },
    paragraph: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
  });
