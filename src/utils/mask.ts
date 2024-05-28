export const maskPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '**-****-$3');
};

export const roundAge = (age: string) => {
  return age ? `${age[2]}0년대생` : '';
};
