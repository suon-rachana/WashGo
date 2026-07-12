import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, EmptyState, Input } from '@/src/components/ui';
import { faqs } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import { matchesSearch } from '@/src/utils/search';

export default function HelpCenterScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleFaqs = useMemo(
    () => faqs.filter((faq) => matchesSearch(searchQuery, [faq.question, faq.answer])),
    [searchQuery]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Help Center</Text>
        <Text style={styles.subtitle}>Find answers or reach our support team.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          placeholder="Search help..."
          icon={<Ionicons name="search" size={18} color={colors.textMuted} />}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityRole="search"
          accessibilityLabel="Search help"
          containerStyle={styles.search}
        />

        <View style={styles.faqList}>
          {visibleFaqs.length === 0 ? (
            <EmptyState title="No results found" description="Try a different search term." />
          ) : (
            visibleFaqs.map((faq) => (
              <Card key={faq.id} variant="outlined">
                <Text style={styles.question}>{faq.question}</Text>
                <Text style={styles.answer}>{faq.answer}</Text>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <Card variant="outlined">
            <Text style={styles.contactDescription}>
              Our team is available every day from 8 AM to 8 PM.
            </Text>
            <View style={styles.contactActions}>
              <Button
                title="Call Support"
                variant="outline"
                icon={<Ionicons name="call-outline" size={16} color={colors.primary} />}
                onPress={() => console.log('Call support pressed')}
                accessibilityHint="Calls the WashGo support team"
                style={styles.contactButton}
              />
              <Button
                title="Message Support"
                variant="outline"
                icon={<Ionicons name="chatbubble-outline" size={16} color={colors.primary} />}
                onPress={() => console.log('Message support pressed')}
                accessibilityHint="Opens a message to the WashGo support team"
                style={styles.contactButton}
              />
            </View>
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
    search: {
      marginBottom: Spacing.xl,
    },
    faqList: {
      gap: Spacing.md,
    },
    question: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    answer: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
    section: {
      marginTop: Spacing.xxl,
    },
    sectionTitle: {
      fontSize: Typography.subtitle.fontSize,
      lineHeight: Typography.subtitle.lineHeight,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    contactDescription: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
      marginBottom: Spacing.md,
    },
    contactActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    contactButton: {
      flex: 1,
    },
  });
