import { useEffect, useState } from 'react';

type SessionValue<T> = T & {
  channelId: 'general' | `match_${string}` | string;
};
/**
 ** This will start work once Chat Interface is mounted, and will be used to store the current `channelId` in session storage, so that when the user refreshes the page, we can redirect them to the last channel they were in. The `channelId` will be stored in the format of `general` for the default channel, or `match_{matchId}` for match channels. This hook will also provide a function to update the stored value, and will automatically clean up the session storage when the component unmounts.
 **  Custom hook to manage session storage for chat-related data, including the current channel ID.
 **  This hook ensures that the channel ID is always included in the stored value and provides a default value if none exists.
 * @param key The key under which the value will be stored in session storage.
 * @param defaultValue The default value to use if no value is found in session storage. The channelId will be set to 'general' by default.
 * @returns A tuple containing the stored `value` and a `function` to update it. The stored value will always include a `channelId`.
 * @default "general"
 * @update the session storage value whenever the `channelId` changes `general` or `match_{matchId}`
 * @cleanup remove the session storage value when the component unmounts
 */
export function useChatSessionStorage<T>(
  key: string,
  defaultValue: T,
): [SessionValue<T>, (value: SessionValue<T>) => void] {
  const STORAGE_EVENT = 'chat-session-change';
  // const DEFAULT_CHANNEL_ID = 'general';

  const [storedValue, setStoredValue] = useState<SessionValue<T>>(() => {
    if (typeof window === 'undefined') {
      return { ...defaultValue, channelId: 'general' };
    }
    try {
      const item = window.sessionStorage.getItem(key);
      if (!item) {
        return { ...defaultValue, channelId: 'general' };
      }

      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading session storage', error);
      return { ...defaultValue, channelId: 'general' };
    }
  });

  const setValue = (value: SessionValue<T>) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(
          new CustomEvent(STORAGE_EVENT, { detail: { key, value } }),
        );
      }
    } catch (error) {
      console.error('Error setting session storage', error);
      // Even if session storage fails, we still want to update the state with default value
      setStoredValue({ ...defaultValue, channelId: 'general' });
    }
  };

  useEffect(() => {
    const handleChange = (event: Event) => {
      // read updated value and call setStoredValue(...)
      const customEvent = event as CustomEvent<{
        key: string;
        value: SessionValue<T>;
      }>;
      if (customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };
    window.addEventListener(STORAGE_EVENT, handleChange as EventListener);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleChange as EventListener);
      try {
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(key);
        }
      } catch (error) {
        console.error('Error removing session storage', error);
      }
    };
  }, [key]);

  return [storedValue, setValue];
}
