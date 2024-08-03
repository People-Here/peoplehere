import { isAxiosError } from 'axios';

import type { AxiosResponse, AxiosError } from 'axios';

export const onAxiosErrorResponse = (error: Error | AxiosError) => {
  if (isAxiosError(error)) {
    const { message } = error;
    const { status, statusText } = error.response as AxiosResponse;
    console.error('api error axios', message, status, statusText);
  } else {
    console.error('api error', error);
  }
};

const errorHandler = (errorStatus: number) => {
  switch (errorStatus) {
    case 401:
  }
};
