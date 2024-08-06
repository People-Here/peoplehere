export const maskPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '**-****-$3');
};

export const roundAge = (age: string, lang?: string) => {
  return lang === 'ko' ? `${age[2]}0년대생` : `${age[2]}0s`;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
