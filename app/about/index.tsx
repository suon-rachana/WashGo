import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/src/components/ui';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';

const LOGO_SIZE = 96;

export default function AboutScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>About WashGo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="shirt-outline" size={44} color={colors.primary} />
          </View>
          <Text style={styles.wordmark}>WashGo</Text>
          <Text style={styles.tagline}>Your laundry, delivered.</Text>
        </View>

        <Card variant="outlined" style={styles.card}>
          <Text style={styles.description}>
            WashGo connects busy people in Siem Reap with trusted local laundry partners for
            convenient pickup and delivery — schedule a pickup, track your order in real time, and
            get fresh, folded laundry brought back to your door.
          </Text>
        </Card>

        <Card variant="outlined" padding="none" style={styles.card}>
          <View style={[styles.infoRow, styles.infoRowDivider]}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Built for</Text>
            <Text style={styles.infoValue}>Siem Reap, Cambodia</Text>
          </View>
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Text style={styles.noteTitle}>Team &amp; Acknowledgments</Text>
          <Text style={styles.noteText}>
            WashGo was designed and built as an academic thesis project. Team credits and
            acknowledgments will be added here.
          </Text>
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
    logoSection: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    logoCircle: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      borderRadius: Radius.circle,
      backgroundColor: `${colors.primary}1A`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.md,
    },
    wordmark: {
      fontSize: Typography.title.fontSize,
      lineHeight: Typography.title.lineHeight,
      fontWeight: Typography.title.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xxs,
    },
    tagline: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
    },
    card: {
      marginBottom: Spacing.xl,
    },
    description: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    infoRowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    infoLabel: {
      fontSize: Typography.body.fontSize,
      color: colors.text,
    },
    infoValue: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.textMuted,
    },
    noteTitle: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    noteText: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
  });
