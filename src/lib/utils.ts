import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export const camelToSnake = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

export const convertKeysToSnake = (obj: any): any => {
  return Array.isArray(obj)
    ? obj.map(convertKeysToSnake)
    : obj !== null && typeof obj === 'object'
      ? Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [camelToSnake(key), convertKeysToSnake(value)])
        )
      : obj;
};

export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const convertKeysToCamel = (obj: any): any => {
  return Array.isArray(obj)
    ? obj.map(convertKeysToCamel)
    : obj !== null && typeof obj === 'object'
      ? Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [snakeToCamel(key), convertKeysToCamel(value)])
        )
      : obj;
};
