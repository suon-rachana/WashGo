import { StyleProp, Text, TextStyle } from 'react-native';

import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Typography } from '@/src/theme';

export interface CharacterCounterProps {
  current: number;
  max: number;
  style?: StyleProp<TextStyle>;
}

export function CharacterCounter({ current, max, style }: CharacterCounterProps) {
  const colors = useThemeColors();
  const isNearLimit = current >= max * 0.9;

  return (
    <Text
      style={[
        { fontSize: Typography.caption.fontSize, color: isNearLimit ? colors.warning : colors.textMuted },
        style,
      ]}
    >
      {current} / {max}
    </Text>
  );
}
