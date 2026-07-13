import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '@/src/components/ui';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

const PHONE_PATTERN = /^\+?[0-9\s-]{8,}$/;

interface FormErrors {
  fullName?: string;
  phone?: string;
  password?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = 'Enter your full name';
    } else if (fullName.trim().length < 2) {
      nextErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!phone.trim()) {
      nextErrors.phone = 'Enter your phone number';
    } else if (!PHONE_PATTERN.test(phone.trim())) {
      nextErrors.phone = 'Enter a valid phone number';
    }

    if (!password) {
      nextErrors.password = 'Create a password';
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Sign up to get your laundry picked up in minutes.</Text>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Jane Doe"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
            />
            <Input
              label="Phone Number"
              placeholder="012 345 678"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />
          </View>

          <Button title="Continue" fullWidth onPress={handleContinue} style={styles.continueButton} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace('/login')}
              hitSlop={8}
              accessibilityRole="link"
              accessibilityLabel="Login"
              accessibilityHint="Opens the login screen"
            >
              <Text style={styles.footerLink}>Login</Text>
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
