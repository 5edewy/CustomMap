import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

export const zustandStorage = {
  setItem: (name: string, value: string | number | boolean | ArrayBuffer) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};
