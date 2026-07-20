import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, EmptyState, Input } from '@/src/components/ui';
import { faqs, type Faq } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import { matchesSearch } from '@/src/utils/search';

interface FaqRowProps {
  faq: Faq;
  expanded: boolean;
  onToggle: () => void;
  colors: ColorScheme;
  styles: ReturnType<typeof createStyles>;
}

function FaqRow({ faq, expanded, onToggle, colors, styles }: FaqRowProps) {
  return (
    <Card
      variant="outlined"
      onPress={onToggle}
      accessibilityLabel={faq.question}
      accessibilityHint={expanded ? 'Collapses this answer' : 'Expands this answer'}
      accessibilityState={{ expanded }}
    >
      <View style={styles.questionRow}>
        <Text style={styles.question} numberOfLines={2}>
          {faq.question}
        </Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </View>
      {expanded ? <Text style={styles.answer}>{faq.answer}</Text> : null}
    </Card>
  );
}

export default function HelpCenterScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleFaqs = useMemo(
    () => faqs.filter((faq) => matchesSearch(searchQuery, [faq.question, faq.answer])),
    [searchQuery]
  );

  const handleCallSupport = () => {
    Alert.alert('Call Support', 'Call +855 12 345 678 (mock support line).', [{ text: t('cancel'), style: 'cancel' }]);
  };

  const handleMessageSupport = () => {
    Alert.alert('Message Support', 'Email support@washgo.example (mock support inbox).', [
      { text: t('cancel'), style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{t('helpCenter')}</Text>
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

        <Text style={styles.sectionTitle}>{t('frequentlyAskedQuestions')}</Text>
        <View style={styles.faqList}>
          {visibleFaqs.length === 0 ? (
            <EmptyState title="No results found" description="Try a different search term." />
          ) : (
            visibleFaqs.map((faq) => (
              <FaqRow
                key={faq.id}
                faq={faq}
                expanded={expandedId === faq.id}
                onToggle={() => setExpandedId((current) => (current === faq.id ? null : faq.id))}
                colors={colors}
                styles={styles}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('contactSupport')}</Text>
          <Card variant="outlined">
            <Text style={styles.contactDescription}>
              Our team is available every day from 8 AM to 8 PM.
            </Text>
            <View style={styles.contactActions}>
              <Button
                title="Call Support"
                variant="outline"
                icon={<Ionicons name="call-outline" size={16} color={colors.primary} />}
                onPress={handleCallSupport}
                accessibilityHint="Shows the WashGo support phone number"
                style={styles.contactButton}
              />
              <Button
                title="Message Support"
                variant="outline"
                icon={<Ionicons name="chatbubble-outline" size={16} color={colors.primary} />}
                onPress={handleMessageSupport}
                accessibilityHint="Shows the WashGo support email address"
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
      marginBottom: Spacing.xl,
    },
    questionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    question: {
      flex: 1,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
    },
    answer: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
      marginTop: Spacing.sm,
    },
    section: {
      marginTop: Spacing.md,
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
