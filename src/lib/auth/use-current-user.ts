import { getAccountById } from './accounts';
import { useAuth } from './store';

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  initials: string;
};

export function useCurrentUser(): UserProfile | null {
  const userId = useAuth((state) => state.userId);
  const account = userId ? getAccountById(userId) : undefined;
  if (!account) return null;
  const initials = account.fullName
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    username: account.email.split('@')[0],
    initials,
  };
}
