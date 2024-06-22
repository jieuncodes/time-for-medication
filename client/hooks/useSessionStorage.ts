import { useState } from 'react';

const useSessionStorage = ({
  key,
  initialValue = '',
}: {
  key: string;
  initialValue?: string;
}) => {
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? item : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<string>(readValue);

  const setValue = (value: string) => {
    if (typeof window == 'undefined') {
      console.warn(
        `Tried setting sessionStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      setStoredValue(value);
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Error setting sessionStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue] as const;
};

export default useSessionStorage;
