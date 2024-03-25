import colors from './colors';

const buttonStyles = {
  '.button-primary': {
    backgroundColor: colors.gray7,
  },
  '.button-sub': {
    backgroundColor: colors.orange1,
  },
  '.button-line': {
    backgroundColor: colors.white,
    borderWidth: '1px',
    borderColor: colors.gray3,
  },
  '.button-gray': {
    backgroundColor: colors.gray2,
  },
  '.button-danger': {
    backgroundColor: colors.red1,
  },
};

const buttonSizes = {
  '.button-lg': {
    height: '52px',
    paddingVertical: '14px',
    paddingHorizontal: '12px',
    borderRadius: '10px',
  },
  '.button-md': {
    height: '44px',
    paddingVertical: '7px',
    paddingHorizontal: '12px',
    borderRadius: '8px',
  },
  '.button-sm': {
    height: '28px',
    paddingVertical: '3px',
    paddingHorizontal: '12px',
    borderRadius: '6px',
  },
};

const buttons = {
  ...buttonStyles,
  ...buttonSizes,
};

export default buttons;
