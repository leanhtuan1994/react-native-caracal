import type { Href } from 'expo-router';

type AuthStatus = 'idle' | 'signOut' | 'signIn';

type RouteGuardInput = { isFirstTime: boolean; status: AuthStatus };

export type RouteGuards = {
  canSeeOnboarding: boolean;
  canSeeAuth: boolean;
  canSeeApp: boolean;
  // Where a guarded route sends the user. Expo Router otherwise falls back to
  // the first unguarded route in file order, which is not a screen here.
  redirectTo: Href;
};

function getEntryRoute({ isFirstTime, status }: RouteGuardInput): Href {
  if (isFirstTime) return '/onboarding';
  return status === 'signIn' ? '/' : '/login';
}

export function getRouteGuards({
  isFirstTime,
  status,
}: RouteGuardInput): RouteGuards {
  const isSignedIn = status === 'signIn';
  return {
    canSeeOnboarding: isFirstTime,
    canSeeAuth: !isSignedIn,
    canSeeApp: isSignedIn,
    redirectTo: getEntryRoute({ isFirstTime, status }),
  };
}
