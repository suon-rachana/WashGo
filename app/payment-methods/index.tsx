import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card } from '@/src/components/ui';
import { DEFAULT_PAYMENT_METHOD_ID, paymentMethods, type PaymentMethod } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';

// Neither the local typed-routes generator nor a running dev server is
// available right now to pick up this brand-new route, so the literal string
// fails the type check even though it's the correct runtime href. Cast once here.
const ADD_PAYMENT_METHOD_HREF = '/payment-methods/add' as Href;

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isDefault: boolean;
  onSetDefault: () => void;
  colors: ColorScheme;
  styles: ReturnType<typeof createStyles>;
}

function PaymentMethodCard({ method, isDefault, onSetDefault, colors, styles }: PaymentMethodCardProps) {
  return (
    <Card variant="elevated">
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Ionicons name={method.icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.cardTextWrap}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardLabel}>{method.label}</Text>
            {isDefault ? <Badge label="Default" variant="primary" /> : null}
          </View>
          <Text style={styles.cardDescription}>{method.description}</Text>
        </View>
      </View>

      {!isDefault ? (
        <Pressable
          onPress={onSetDefault}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Set ${method.label} as default payment method`}
          style={styles.setDefaultRow}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [defaultMethodId, setDefaultMethodId] = useState(DEFAULT_PAYMENT_METHOD_ID);

  const handleAdd = () => {
    router.push(ADD_PAYMENT_METHOD_HREF);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Payment Methods</Text>
        <Text style={styles.subtitle}>Manage how you pay for pickups.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isDefault={defaultMethodId === method.id}
              onSetDefault={() => setDefaultMethodId(method.id)}
              colors={colors}
              styles={styles}
            />
          ))}
        </View>

        <Button
          title="Add Payment Method"
          fullWidth
          icon={<Ionicons name="add" size={16} color={colors.onPrimary} />}
          onPress={handleAdd}
          accessibilityLabel="Add payment method"
          style={styles.addButton}
        />
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
      paddingBottom: Spacing.huge,
    },
    list: {
      gap: Spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: Radius.circle,
      backgroundColor: `${colors.primary}1A`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    cardTextWrap: {
      flex: 1,
    },
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.xxs,
    },
    cardLabel: {
      fontSize: Typography.subtitle.fontSize,
      lineHeight: Typography.subtitle.lineHeight,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.text,
    },
    cardDescription: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
    setDefaultRow: {
      alignSelf: 'flex-start',
      marginTop: Spacing.md,
    },
    setDefaultText: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.primary,
    },
    addButton: {
      marginTop: Spacing.xl,
    },
  });
