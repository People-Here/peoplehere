import { IonToast } from '@ionic/react';

import ExclamationMarkIcon from '../assets/svgs/exclamation-mark.svg';
import ExclamationMarkGrayIcon from '../assets/svgs/exclamation-mark-gray.svg';
import DoubleHeartIcon from '../assets/svgs/double-heart.svg';
import colors from '../theme/colors';

import './toast.css';

type ToastType = 'error-large' | 'error-small' | 'success' | 'info';

type Props = {
  type: ToastType;
  trigger: string;
  message: string;
  duration?: number;
};

const Toast = ({ type, trigger, message, duration = 1500 }: Props) => {
  return (
    <IonToast
      trigger={trigger}
      message={message}
      duration={duration}
      icon={toastIcons[type]}
      position="bottom"
      style={{ ...commonToastStyles, ...toastStyles[type] }}
    />
  );
};

const toastIcons: Record<ToastType, string> = {
  'error-large': ExclamationMarkIcon,
  'error-small': ExclamationMarkIcon,
  success: DoubleHeartIcon,
  info: ExclamationMarkGrayIcon,
};

const toastStyles: Record<ToastType, object> = {
  'error-large': {
    '--background': colors.red2,
    '--color': colors.red3,
    '--border-width': '1px',
    '--border-style': 'solid',
    '--border-color': colors.red3,
    '--border-radius': '10px',
  },
  info: {
    '--background': colors.white,
    '--color': colors.gray7,
    '--border-width': '1px',
    '--border-style': 'solid',
    '--border-color': colors.gray5,
    '--border-radius': '10px',
  },
  'error-small': {
    '--background': colors.red2,
    '--color': colors.red3,
    '--border-radius': '8px',
  },
  success: {
    '--background': colors.orange2,
    '--color': colors.orange5,
    '--border-radius': '8px',
  },
};

const commonToastStyles = {
  '--box-shadow': 'none',
};

export default Toast;
