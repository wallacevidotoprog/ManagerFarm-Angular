export type LocalSKey = keyof typeof localStorageData;

export function getLocal<T>(key: LocalSKey): T {
  const storageKey = localStorageData[key];
 
  const data = localStorage.getItem(storageKey);  
  if (!data) {
    throw new Error(`LocalStorage item '${storageKey}' not found`);
  }
  return JSON.parse(data) as T;
}

export const localStorageData = {
  PROPERTY: 'property',
  DATA_USER: 'data-user',
} as const;
