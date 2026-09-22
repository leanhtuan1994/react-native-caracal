import { useState } from 'react';

type Value = string | number | boolean;

function createMockMMKV() {
  const values = new Map<string, Value>();
  return {
    set: (key: string, value: Value) => {
      values.set(key, value);
    },
    getString: (key: string) => {
      const value = values.get(key);
      return typeof value === 'string' ? value : undefined;
    },
    getBoolean: (key: string) => {
      const value = values.get(key);
      return typeof value === 'boolean' ? value : undefined;
    },
    getNumber: (key: string) => {
      const value = values.get(key);
      return typeof value === 'number' ? value : undefined;
    },
    contains: (key: string) => values.has(key),
    remove: (key: string) => values.delete(key),
    clearAll: () => values.clear(),
    getAllKeys: () => [...values.keys()],
  };
}

type MockMMKV = ReturnType<typeof createMockMMKV>;

const defaultStorage = createMockMMKV();

export const createMMKV = () => createMockMMKV();

function useMockValue<T extends Value>(
  key: string,
  read: (storage: MockMMKV) => T | undefined,
  storage: MockMMKV = defaultStorage
) {
  const [value, setValue] = useState<T | undefined>(() => read(storage));
  const update = (next: T | undefined) => {
    if (next === undefined) storage.remove(key);
    else storage.set(key, next);
    setValue(next);
  };
  return [value, update] as const;
}

export const useMMKVString = (key: string, storage?: MockMMKV) =>
  useMockValue<string>(key, (s) => s.getString(key), storage);

export const useMMKVBoolean = (key: string, storage?: MockMMKV) =>
  useMockValue<boolean>(key, (s) => s.getBoolean(key), storage);

export const useMMKVNumber = (key: string, storage?: MockMMKV) =>
  useMockValue<number>(key, (s) => s.getNumber(key), storage);
