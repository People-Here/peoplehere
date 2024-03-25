import colors from './colors';

const buttonStyles = {
  '.button-primary': {
    backgroundColor: colors.gray7,
    color: colors.white,

    ['&:active']: {
      backgroundColor: colors.gray6,
    },
    ['&:disabled']: {
      backgroundColor: colors.gray4,
    },
  },
  '.button-sub': {
    backgroundColor: colors.orange1,
    color: colors.orange5,

    ['&:active']: {
      backgroundColor: colors.orange3,
    },
    ['&:disabled']: {
      backgroundColor: colors.gray3,
      color: colors.white,
    },
  },
  '.button-line': {
    backgroundColor: colors.white,
    borderWidth: '1px',
    borderColor: colors.gray3,
    color: colors.gray6,

    ['&:active']: {
      backgroundColor: colors.gray1,
    },
    ['&:disabled']: {
      backgroundColor: colors.gray1,
      borderColor: colors.gray2,
      color: colors.gray4,
    },
  },
  '.button-gray': {
    backgroundColor: colors.gray2,
    color: colors.gray6,

    ['&:active']: {
      backgroundColor: colors.gray3,
    },
    ['&:disabled']: {
      backgroundColor: colors['gray1.5'],
      color: colors.gray4,
    },
  },
  '.button-danger': {
    backgroundColor: colors.red1,
    color: colors.red3,

    ['&:active']: {
      backgroundColor: colors.red2,
    },
    ['&:disabled']: {
      backgroundColor: colors.gray3,
      color: colors.white,
    },
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
