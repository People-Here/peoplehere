import JSONbig from 'json-bigint';

export const parseBigint = (input: string) => {
  const obj: Record<string, string> = {};

  const dataArray = input.replace(/\{|\}|"/g, '').split(',');

  dataArray.forEach((data) => {
    const [key, value] = data.split(':');
    obj[key] = value;
  });

  return obj;
};

export const parseJSONBigint = (input: string) => {
  if (!input) {
    return input;
  }

  return JSONbig.parse(input) as JSON;
};
