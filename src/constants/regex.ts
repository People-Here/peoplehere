export const EMAIL_VALIDATION = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const PASSWORD_VALIDATION = {
  moreThan8: /.{8,}/,
  hasSpecialCharOrNumber: /[!@#$%^&*-_.,:0-9]/,
};
