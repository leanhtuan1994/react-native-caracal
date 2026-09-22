type AuthStatus = 'idle' | 'signOut' | 'signIn';

type RouteGuardInput = { isFirstTime: boolean; status: AuthStatus };

export type RouteGuards = {
  canSeeOnboarding: boolean;
  canSeeAuth: boolean;
  canSeeApp: boolean;
};

export function getRouteGuards({
  isFirstTime,
  status,
}: RouteGuardInput): RouteGuards {
  const isSignedIn = status === 'signIn';
  return {
    canSeeOnboarding: isFirstTime,
    canSeeAuth: !isSignedIn,
    canSeeApp: isSignedIn,
  };
}
