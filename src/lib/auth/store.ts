import { create } from 'zustand';

import { getAccountById } from './accounts';
import { getSession, removeSession, setSession } from './utils';

type AuthState = {
  userId: string | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (userId: string) => void;
  signOut: () => void;
  hydrate: () => void;
};

export const useAuth = create<AuthState>()((set, get) => ({
  status: 'idle',
  userId: null,
  signIn: (userId) => {
    setSession({ userId });
    set({ status: 'signIn', userId });
  },
  signOut: () => {
    removeSession();
    set({ status: 'signOut', userId: null });
  },
  hydrate: () => {
    try {
      const session = getSession();
      if (session && getAccountById(session.userId)) {
        get().signIn(session.userId);
      } else {
        get().signOut();
      }
    } catch (e) {
      // only to remove eslint error, handle the error properly
      console.error(e);
      // catch error here
      // Maybe sign_out user!
    }
  },
}));

export const signOut = () => useAuth.getState().signOut();
export const signIn = (userId: string) => useAuth.getState().signIn(userId);
export const hydrateAuth = () => useAuth.getState().hydrate();
