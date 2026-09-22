import { getItem, removeItem, setItem } from '@/lib/storage';

const SESSION = 'session';

export type Session = { userId: string };

export const getSession = () => getItem<Session>(SESSION);
export const removeSession = () => removeItem(SESSION);
export const setSession = (value: Session) => setItem<Session>(SESSION, value);
