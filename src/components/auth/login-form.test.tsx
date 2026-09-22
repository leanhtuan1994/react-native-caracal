import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';

import { LoginForm } from './login-form';

const mockLogin = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/lib/auth', () => ({
  loginWithEmail: (values: unknown) => mockLogin(values),
  AUTH_ERRORS: {
    invalidCredentials: 'invalid_credentials',
    emailTaken: 'email_taken',
  },
}));

afterEach(cleanup);

beforeEach(() => {
  mockLogin.mockReset();
  mockLogin.mockResolvedValue(undefined);
});

describe('LoginForm', () => {
  it('shows required errors when submitting empty fields', async () => {
    const { user } = setup(<LoginForm />);
    await user.press(screen.getByTestId('login-submit'));
    expect(
      await screen.findByText('auth.validation.email_required')
    ).toBeOnTheScreen();
    expect(
      screen.getByText('auth.validation.password_required')
    ).toBeOnTheScreen();
  });

  it('shows format errors for an invalid email and short password', async () => {
    const { user } = setup(<LoginForm />);
    await user.type(screen.getByTestId('login-email-input'), 'emily@');
    await user.type(screen.getByTestId('login-password-input'), '123');
    await user.press(screen.getByTestId('login-submit'));
    expect(
      await screen.findByText('auth.validation.email_invalid')
    ).toBeOnTheScreen();
    expect(screen.getByText('auth.validation.password_min')).toBeOnTheScreen();
  });

  it('signs in with valid credentials', async () => {
    const { user } = setup(<LoginForm />);
    await user.type(
      screen.getByTestId('login-email-input'),
      'emily@example.com'
    );
    await user.type(screen.getByTestId('login-password-input'), 'secret1');
    await user.press(screen.getByTestId('login-submit'));
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'emily@example.com',
        password: 'secret1',
      })
    );
  });

  it('shows the login error when credentials are rejected', async () => {
    mockLogin.mockRejectedValue(new Error('invalid_credentials'));
    const { user } = setup(<LoginForm />);
    await user.type(
      screen.getByTestId('login-email-input'),
      'emily@example.com'
    );
    await user.type(screen.getByTestId('login-password-input'), 'secret1');
    await user.press(screen.getByTestId('login-submit'));
    expect(await screen.findByText('auth.login.error')).toBeOnTheScreen();
  });
});
