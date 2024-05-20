export const formatDataToString = (date: string): string => {
  const dateOnly = date.split('T')[0];

  return dateOnly.replaceAll('-', '');
};

export const formatDateTimeToString = (datetime: string) => {
  const date = datetime.split('T')[0];
  const time = datetime.split('T')[1].split('.')[0];

  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');

  return `${year.slice(2, 4)}/${month}/${day} ${hour}:${minute}`;
};
