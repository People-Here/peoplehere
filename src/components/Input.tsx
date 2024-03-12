import colorStyles from '@styles/colors';
import textStyles from '@styles/typos';
import { useRef, useCallback, useState } from 'react';
import type { InputModeOptions } from 'react-native';
import { Animated, Easing, StyleSheet, TextInput } from 'react-native';

interface Props {
  type: 'text' | 'password' | 'email' | 'number' | 'tel';
  value: string;
  onChange?: (input: string) => void;
  label?: string;
  readonly?: boolean;
  placeholder?: string;
}

const Input = ({ type, value, onChange, label, readonly = false, placeholder }: Props) => {
  const animatedValue = useRef(new Animated.Value(0));

  const [focused, setFocused] = useState(false);

  const getInputMode = useCallback((type: Props['type']) => {
    if (['email', 'number', 'tel'].includes(type)) {
      return type as InputModeOptions;
    }

    return 'text';
  }, []);

  const returnAnimatedTitleStyles = {
    transform: [
      {
        translateY: animatedValue?.current?.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 10],
          extrapolate: 'clamp',
        }),
      },
    ],
    fontSize: animatedValue?.current?.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
      extrapolate: 'clamp',
    }),
    color: animatedValue?.current?.interpolate({
      inputRange: [0, 1],
      outputRange: [colorStyles.gray5, colorStyles.gray6],
    }),
  };

  const onFocus = () => {
    setFocused(true);
    Animated.timing(animatedValue?.current, {
      toValue: 1,
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };

  const onBlur = () => {
    setFocused(false);
    if (!value) {
      Animated.timing(animatedValue?.current, {
        toValue: 0,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <Animated.View style={[styles.container, focused && styles.focusedContainer]}>
      <Animated.Text style={[{ paddingLeft: 4 }, textStyles.body1, returnAnimatedTitleStyles]}>
        {label}
      </Animated.Text>

      <TextInput
        inputMode={getInputMode(type)}
        onChangeText={onChange}
        value={value}
        style={textStyles.body1}
        onBlur={onBlur}
        onFocus={onFocus}
        autoCorrect={false}
        placeholder={placeholder}
        readOnly={readonly}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 54,
    backgroundColor: colorStyles['gray1.5'],
    borderRadius: 12,
    paddingHorizontal: 16,
    display: 'flex',
    justifyContent: 'center',
  },
  focusedContainer: {
    borderColor: colorStyles.gray3,
    borderWidth: 1,
  },
});

export default Input;
