/* eslint-disable @typescript-eslint/no-floating-promises */

import { Storage } from '@ionic/storage';
import { useLayoutEffect, useRef } from 'react';

const useStorage = () => {
  const storage = useRef<Storage>();

  useLayoutEffect(() => {
    (async () => {
      const storageInstance = new Storage();
      storage.current = storageInstance;

      await storage.current.create();
    })();
  }, [storage]);

  const getItem = async (key: string) => {
    try {
      const value = (await storage.current?.get(key)) as string;
      return value;
    } catch (error) {
      throw new Error('Key is not exist in storage');
    }
  };

  const setItem = async (key: string, value: string) => {
    await storage.current?.set(key, value);
  };

  const removeItem = async (key: string) => {
    await storage.current?.remove(key);
  };

  const clearStorage = async () => {
    await storage.current?.clear();
  };

  return { getItem, setItem, removeItem, clearStorage };
};

export default useStorage;
