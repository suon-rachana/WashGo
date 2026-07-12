import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card } from '@/src/components/ui';
import { addresses as mockAddresses, type Address } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  colors: ColorScheme;
  styles: ReturnType<typeof createStyles>;
}

function AddressCard({ address, onEdit, onDelete, colors, styles }: AddressCardProps) {
  return (
    <Card variant="elevated">
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Ionicons name={address.icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.cardTextWrap}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardLabel}>{address.label}</Text>
            {address.isDefault ? <Badge label="Default" variant="primary" /> : null}
          </View>
          <Text style={styles.cardDetail}>{address.detail}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <Button
          title="Edit"
          variant="outline"
          onPress={onEdit}
          accessibilityLabel={`Edit ${address.label} address`}
          style={styles.actionButton}
        />
        <Button
          title="Delete"
          variant="outline"
          onPress={onDelete}
          accessibilityLabel={`Delete ${address.label} address`}
          accessibilityHint="Asks for confirmation before removing this address"
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
}

export default function SavedAddressesScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [addresses, setAddresses] = useState(mockAddresses);

  const handleEdit = (address: Address) => {
    router.push({ pathname: '/addresses/edit', params: { id: address.id } });
  };

  const handleDelete = (address: Address) => {
    Alert.alert('Delete Address', `Remove "${address.label}" from your saved addresses?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setAddresses((prev) => prev.filter((item) => item.id !== address.id)),
      },
    ]);
  };

  const handleAdd = () => {
    router.push('/addresses/add');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Saved Addresses</Text>
        <Text style={styles.subtitle}>Manage your pickup and delivery locations.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address)}
              colors={colors}
              styles={styles}
            />
          ))}
        </View>

        <Button
          title="Add Address"
          fullWidth
          icon={<Ionicons name="add" size={16} color={colors.onPrimary} />}
          onPress={handleAdd}
          accessibilityLabel="Add address"
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
      marginBottom: Spacing.md,
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
    cardDetail: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
    cardActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    actionButton: {
      flex: 1,
    },
    addButton: {
      marginTop: Spacing.xl,
    },
  });
