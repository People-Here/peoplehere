export const EMAIL_VALIDATION =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

export const PASSWORD_VALIDATION = {
  moreThan8: /.{8,}/,
  hasSpecialCharOrNumber: /[!@#$%^&*-_.,:0-9]/,
};
