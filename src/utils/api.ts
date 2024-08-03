import { isAxiosError } from 'axios';

import { getNewToken } from '../api/login';

import type { AxiosResponse, AxiosError } from 'axios';

export const onAxiosErrorResponse = async (error: Error | AxiosError) => {
  if (isAxiosError(error)) {
    const { message } = error;
    const { status, statusText } = error.response as AxiosResponse;
    console.error('api error axios', message, status, statusText);

    if (status === 403) {
      await getNewToken();
    }
  } else {
    console.error('Unknown api error', error);
  }
};

const errorHandler = (errorStatus: number) => {
  switch (errorStatus) {
    case 403:
  }
};
