import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, Chip, EmptyState, Input } from '@/src/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';
import type { ColorToken } from '@/src/theme';

const SWATCHES: ColorToken[] = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'danger',
  'text',
  'textSecondary',
  'textMuted',
  'border',
  'surface',
  'card',
  'elevatedSurface',
  'inputBackground',
  'background',
];

const TYPE_SCALE: { variant: keyof typeof Typography; label: string }[] = [
  { variant: 'display', label: 'Display' },
  { variant: 'headline', label: 'Headline' },
  { variant: 'title', label: 'Title' },
  { variant: 'subtitle', label: 'Subtitle' },
  { variant: 'body', label: 'Body' },
  { variant: 'bodyMedium', label: 'Body Medium' },
  { variant: 'caption', label: 'Caption' },
  { variant: 'label', label: 'Label' },
];

const SPACING_SCALE: (keyof typeof Spacing)[] = [
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'xxxl',
  'xxxxl',
  'huge',
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function DesignSystemScreen() {
  const [chipSelected, setChipSelected] = useState('express');
  const [inputValue, setInputValue] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Colors">
          <View style={styles.swatchRow}>
            {SWATCHES.map((token) => (
              <View key={token} style={styles.swatchItem}>
                <View style={[styles.swatch, { backgroundColor: Colors[token] }]} />
                <Text style={styles.swatchLabel}>{token}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Typography">
          {TYPE_SCALE.map(({ variant, label }) => (
            <Text
              key={variant}
              style={{
                fontSize: Typography[variant].fontSize,
                lineHeight: Typography[variant].lineHeight,
                fontWeight: Typography[variant].fontWeight,
                letterSpacing: Typography[variant].letterSpacing,
                color: Colors.text,
                marginBottom: Spacing.xs,
              }}>
              {label} — Aa
            </Text>
          ))}
        </Section>

        <Section title="Spacing">
          {SPACING_SCALE.map((token) => (
            <View key={token} style={styles.spacingRow}>
              <Text style={styles.spacingLabel}>{token}</Text>
              <View style={[styles.spacingBar, { width: Spacing[token] }]} />
              <Text style={styles.spacingValue}>{Spacing[token]}</Text>
            </View>
          ))}
        </Section>

        <Section title="Buttons">
          <View style={styles.stackGap}>
            <Button title="Primary" onPress={() => {}} />
            <Button title="Secondary" variant="secondary" onPress={() => {}} />
            <Button title="Book Now" variant="accent" onPress={() => {}} />
            <Button title="Outline" variant="outline" onPress={() => {}} />
            <Button title="Ghost" variant="ghost" onPress={() => {}} />
            <Button title="Danger" variant="danger" onPress={() => {}} />
            <Button title="Loading" loading onPress={() => {}} />
            <Button title="Disabled" disabled onPress={() => {}} />
          </View>
        </Section>

        <Section title="Inputs">
          <View style={styles.stackGap}>
            <Input
              label="Outline"
              placeholder="Type something"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <Input label="Filled" variant="filled" placeholder="Filled variant" />
            <Input label="Error" placeholder="Invalid value" error="This field is required" />
            <Input label="Disabled" placeholder="Disabled" disabled />
          </View>
        </Section>

        <Section title="Cards">
          <View style={styles.stackGap}>
            <Card variant="elevated">
              <Text style={styles.cardText}>Elevated card</Text>
            </Card>
            <Card variant="outlined">
              <Text style={styles.cardText}>Outlined card</Text>
            </Card>
            <Card variant="flat">
              <Text style={styles.cardText}>Flat card</Text>
            </Card>
          </View>
        </Section>

        <Section title="Badges">
          <View style={styles.wrapRow}>
            <Badge label="Neutral" variant="neutral" />
            <Badge label="Primary" variant="primary" />
            <Badge label="Secondary" variant="secondary" />
            <Badge label="Accent" variant="accent" />
            <Badge label="Success" variant="success" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Danger" variant="danger" />
          </View>
        </Section>

        <Section title="Chips">
          <View style={styles.wrapRow}>
            {['wash-fold', 'dry-clean', 'express', 'ironing'].map((id) => (
              <Chip
                key={id}
                label={id}
                selected={chipSelected === id}
                onPress={() => setChipSelected(id)}
              />
            ))}
          </View>
        </Section>

        <Section title="Empty State">
          <EmptyState title="No laundries found" description="Try adjusting your search." />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.subtitle.fontSize,
    lineHeight: Typography.subtitle.lineHeight,
    fontWeight: Typography.subtitle.fontWeight,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  swatchItem: {
    alignItems: 'center',
    width: 64,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxs,
  },
  swatchLabel: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  spacingLabel: {
    width: 56,
    fontSize: Typography.caption.fontSize,
    color: Colors.textMuted,
  },
  spacingBar: {
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
    marginRight: Spacing.sm,
  },
  spacingValue: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textMuted,
  },
  stackGap: {
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  cardText: {
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },
});
