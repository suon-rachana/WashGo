import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ComponentProps, useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuRow } from '@/src/components/common';
import { Card } from '@/src/components/ui';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

interface AddOption {
  id: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

const ADD_OPTIONS: AddOption[] = [
  { id: 'add-card', label: 'Add Card', icon: 'card-outline' },
  { id: 'link-aba', label: 'Link ABA Pay', icon: 'phone-portrait-outline' },
  { id: 'link-wing', label: 'Link Wing', icon: 'wallet-outline' },
  { id: 'use-khqr', label: 'Use KHQR', icon: 'qr-code-outline' },
];

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSelect = (option: AddOption) => {
    // Mock only — no backend to link a real payment method to.
    Alert.alert(option.label, `${option.label} has been linked to your account (mock).`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Add Payment Method</Text>
        <Text style={styles.subtitle}>Choose a payment method to link.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="outlined" padding="none">
          {ADD_OPTIONS.map((option, index) => (
            <MenuRow
              key={option.id}
              icon={option.icon}
              label={option.label}
              showDivider={index < ADD_OPTIONS.length - 1}
              onPress={() => handleSelect(option)}
            />
          ))}
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
  });
