import { getRouteGuards } from './route-guards';

describe('getRouteGuards', () => {
  it('shows onboarding on first launch', () => {
    expect(getRouteGuards({ isFirstTime: true, status: 'signOut' })).toEqual({
      canSeeOnboarding: true,
      canSeeAuth: true,
      canSeeApp: false,
    });
  });
  it('shows auth when signed out after onboarding', () => {
    expect(getRouteGuards({ isFirstTime: false, status: 'signOut' })).toEqual({
      canSeeOnboarding: false,
      canSeeAuth: true,
      canSeeApp: false,
    });
  });
  it('shows the app when signed in', () => {
    expect(getRouteGuards({ isFirstTime: false, status: 'signIn' })).toEqual({
      canSeeOnboarding: false,
      canSeeAuth: false,
      canSeeApp: true,
    });
  });
  it('treats idle as signed out', () => {
    expect(
      getRouteGuards({ isFirstTime: false, status: 'idle' }).canSeeAuth
    ).toBe(true);
  });
});
