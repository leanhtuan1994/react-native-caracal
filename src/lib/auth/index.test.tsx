import { act, renderHook } from '@testing-library/react-native';

import {
  loginWithEmail,
  signIn,
  signUpWithEmail,
  useAuth,
  useCurrentUser,
} from './index';

const mockAccount = {
  id: 'user-1',
  fullName: 'Emily Johnson',
  email: 'emily@example.com',
};

jest.mock('@/lib/storage', () => ({
  getItem: jest.fn(() => null),
  removeItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('./accounts', () => ({
  AUTH_ERRORS: {
    emailTaken: 'email_taken',
    invalidCredentials: 'invalid_credentials',
  },
  createAccount: jest.fn(async () => mockAccount),
  verifyCredentials: jest.fn(async () => mockAccount),
  getAccountById: jest.fn(() => mockAccount),
}));

describe('useAuth', () => {
  beforeEach(() => {
    useAuth.setState({ status: 'idle', userId: null });
  });

  it('uses Zustand selectors without a custom use namespace', () => {
    const { result } = renderHook(() => ({
      status: useAuth((state) => state.status),
      userId: useAuth((state) => state.userId),
    }));

    expect('use' in useAuth).toBe(false);
    expect(result.current).toEqual({ status: 'idle', userId: null });

    act(() => {
      signIn('user-1');
    });

    expect(result.current).toEqual({ status: 'signIn', userId: 'user-1' });
  });

  it('signs in after a successful login', async () => {
    await loginWithEmail({ email: 'emily@example.com', password: 'secret1' });
    expect(useAuth.getState()).toMatchObject({
      status: 'signIn',
      userId: 'user-1',
    });
  });

  it('signs in after creating an account', async () => {
    await signUpWithEmail({
      fullName: 'Emily Johnson',
      email: 'emily@example.com',
      password: 'secret1',
    });
    expect(useAuth.getState()).toMatchObject({
      status: 'signIn',
      userId: 'user-1',
    });
  });

  it('returns the signed-in user profile', () => {
    act(() => {
      signIn('user-1');
    });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current).toEqual({
      id: 'user-1',
      fullName: 'Emily Johnson',
      email: 'emily@example.com',
      username: 'emily',
      initials: 'EJ',
    });
  });
});
