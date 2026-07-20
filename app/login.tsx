import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '@/src/components/ui';
import { isSupabaseDataSource } from '@/src/config/dataSource';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { useAuthStore } from '@/src/store/auth';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import { authErrorTranslationKey } from '@/src/utils/authErrorMessages';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{8,}$/;

interface FormErrors {
  identifier?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const signIn = useAuthStore((state) => state.signIn);

  const validate = () => {
    const nextErrors: FormErrors = {};
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      nextErrors.identifier = 'Enter your phone number or email';
    } else if (isSupabaseDataSource) {
      // Supabase Auth in this phase only supports email + password sign-in.
      if (!EMAIL_PATTERN.test(trimmedIdentifier)) {
        nextErrors.identifier = 'Enter your email to sign in';
      }
    } else if (!EMAIL_PATTERN.test(trimmedIdentifier) && !PHONE_PATTERN.test(trimmedIdentifier)) {
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

  const handleContinue = async () => {
    if (isSubmitting || !validate()) return;

    if (!isSupabaseDataSource) {
      router.replace('/(tabs)/home');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    const success = await signIn({ email: identifier.trim(), password });
    setIsSubmitting(false);

    if (success) {
      router.replace('/(tabs)/home');
    } else {
      const errorCode = useAuthStore.getState().error;
      setFormError(t(errorCode ? authErrorTranslationKey(errorCode) : 'somethingWentWrong'));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to schedule your next pickup.</Text>
            {!isSupabaseDataSource ? <Text style={styles.demoBadge}>{t('demoMode')}</Text> : null}
          </View>

          <View style={styles.form}>
            <Input
              label="Phone or Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={identifier}
              onChangeText={setIdentifier}
              error={errors.identifier}
              editable={!isSubmitting}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              editable={!isSubmitting}
            />
          </View>

          {formError ? (
            <Text style={styles.formError} accessibilityLiveRegion="polite">
              {formError}
            </Text>
          ) : null}

          <Button
            title={isSubmitting ? t('signingIn') : 'Continue'}
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleContinue}
            style={styles.continueButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace('/register')}
              hitSlop={8}
              accessibilityRole="link"
              accessibilityLabel="Register"
              accessibilityHint="Opens the account registration screen"
              disabled={isSubmitting}
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
    header: {
      marginBottom: Spacing.xxl,
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
    },
    demoBadge: {
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      color: colors.primary,
      marginTop: Spacing.xxs,
    },
    form: {
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    formError: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.danger,
      marginBottom: Spacing.md,
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
