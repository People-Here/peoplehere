import colorStyles from '@styles/colors';
import textStyles from '@styles/typos';
import { useCallback, useState } from 'react';
import type { InputModeOptions } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  type: 'text' | 'password' | 'email' | 'number' | 'tel';
  value: string;
  onChange?: (input: string) => void;
  label?: string;
  readonly?: boolean;
  placeholder?: string;
}

const Input = ({ type, value, onChange, label, readonly = false, placeholder }: Props) => {
  const [focused, setFocused] = useState(false);

  const getInputMode = useCallback((type: Props['type']) => {
    if (['email', 'numeric', 'tel'].includes(type)) {
      return type as InputModeOptions;
    }

    return 'text';
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={
          focused || value
            ? [styles.focusedLabel, textStyles.caption2]
            : [styles.label, textStyles.body1]
        }>
        {label}
      </Text>

      <TextInput
        readOnly={readonly}
        value={value}
        placeholder={placeholder}
        inputMode={getInputMode(type)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={(text) => onChange && onChange(text)}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 54,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',

    backgroundColor: colorStyles['gray1.5'],

    borderRadius: 12,

    padding: 16,
  },
  label: {
    position: 'absolute',
    left: 16,
    color: colorStyles.gray5,
    transform: 'translateY(0)',
  },
  focusedLabel: {
    position: 'absolute',
    left: 16,
    color: colorStyles.gray5,
    transform: 'translateY(-12px)',
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingTop: 4,
    color: colorStyles.gray8,
  },
  focusedInput: {
    width: '100%',
    backgroundColor: 'transparent',
    color: colorStyles.gray8,
  },
});
