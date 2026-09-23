import { useQueryClient } from '@tanstack/react-query';

import { signOut } from './store';

export function useSignOut(): () => void {
  const queryClient = useQueryClient();
  return () => {
    signOut();
    queryClient.clear();
  };
}
