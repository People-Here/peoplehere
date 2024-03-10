import { StyleSheet } from 'react-native';
import colorStyles from './colors';

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colorStyles.gray7,
    color: colorStyles.white,
  },
  sub: {
    backgroundColor: colorStyles.orange1,
    color: colorStyles.orange5,
  },
  line: {
    backgroundColor: colorStyles.white,
    color: colorStyles.gray6,
    borderWidth: 1,
    borderColor: colorStyles.gray3,
  },
  gray: {
    backgroundColor: colorStyles.gray2,
    color: colorStyles.gray6,
  },
  danger: {
    backgroundColor: colorStyles.red1,
    color: colorStyles.red3,
  },
});

const buttonSizeStyles = StyleSheet.create({
  large: {
    height: 52,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  medium: {
    height: 44,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  small: {
    height: 28,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});

export { buttonStyles, buttonSizeStyles };
