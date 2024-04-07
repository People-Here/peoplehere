export const formatDataToString = (date: string): string => {
  const dateOnly = date.split('T')[0];

  return dateOnly.replaceAll('-', '');
};
