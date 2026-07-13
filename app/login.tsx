import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '@/src/components/ui';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{8,}$/;

interface FormErrors {
  identifier?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!identifier.trim()) {
      nextErrors.identifier = 'Enter your phone number or email';
    } else if (!EMAIL_PATTERN.test(identifier.trim()) && !PHONE_PATTERN.test(identifier.trim())) {
      nextErrors.identifier = 'Enter a valid phone number or email';
    }

    if (!password) {
      nextErrors.password = 'Enter your password';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to schedule your next pickup.</Text>

          <View style={styles.form}>
            <Input
              label="Phone or Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={identifier}
              onChangeText={setIdentifier}
              error={errors.identifier}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />
          </View>

          <Button title="Continue" fullWidth onPress={handleContinue} style={styles.continueButton} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace('/register')}
              hitSlop={8}
              accessibilityRole="link"
              accessibilityLabel="Register"
              accessibilityHint="Opens the account registration screen"
            >
              <Text style={styles.footerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
    },
    title: {
      fontSize: Typography.headline.fontSize,
      lineHeight: Typography.headline.lineHeight,
      fontWeight: Typography.headline.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      fontWeight: Typography.body.fontWeight,
      color: colors.textMuted,
      marginBottom: Spacing.xxl,
    },
    form: {
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    continueButton: {
      marginBottom: Spacing.xl,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      fontSize: Typography.bodyMedium.fontSize,
      color: colors.textMuted,
    },
    footerLink: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.primary,
    },
  });
