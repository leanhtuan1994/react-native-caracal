import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';

import { SignUpForm } from './sign-up-form';

const mockSignUp = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/lib/auth', () => ({
  signUpWithEmail: (values: unknown) => mockSignUp(values),
  AUTH_ERRORS: {
    invalidCredentials: 'invalid_credentials',
    emailTaken: 'email_taken',
  },
}));

afterEach(cleanup);

beforeEach(() => {
  mockSignUp.mockReset();
  mockSignUp.mockResolvedValue(undefined);
});

type Values = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

const valid: Values = {
  name: 'Emily Johnson',
  email: 'e@x.com',
  password: 'secret1',
  confirm: 'secret1',
};

async function fillForm(
  user: ReturnType<typeof setup>['user'],
  values: Values
) {
  await user.type(screen.getByTestId('sign-up-name-input'), values.name);
  await user.type(screen.getByTestId('sign-up-email-input'), values.email);
  await user.type(
    screen.getByTestId('sign-up-password-input'),
    values.password
  );
  await user.type(screen.getByTestId('sign-up-confirm-input'), values.confirm);
}

describe('SignUpForm', () => {
  it('shows a mismatch error when passwords differ', async () => {
    const { user } = setup(<SignUpForm />);
    await fillForm(user, { ...valid, confirm: 'other12' });
    await user.press(screen.getByTestId('sign-up-terms'));
    await user.press(screen.getByTestId('sign-up-submit'));
    expect(
      await screen.findByText('auth.validation.password_mismatch')
    ).toBeOnTheScreen();
  });

  it('requires the terms to be accepted', async () => {
    const { user } = setup(<SignUpForm />);
    await fillForm(user, valid);
    await user.press(screen.getByTestId('sign-up-submit'));
    expect(
      await screen.findByText('auth.validation.terms_required')
    ).toBeOnTheScreen();
  });

  it('creates the account with the entered values', async () => {
    const { user } = setup(<SignUpForm />);
    await fillForm(user, valid);
    await user.press(screen.getByTestId('sign-up-terms'));
    await user.press(screen.getByTestId('sign-up-submit'));
    await waitFor(() =>
      expect(mockSignUp).toHaveBeenCalledWith({
        fullName: 'Emily Johnson',
        email: 'e@x.com',
        password: 'secret1',
      })
    );
  });

  it('shows the email-taken error on the email field', async () => {
    mockSignUp.mockRejectedValue(new Error('email_taken'));
    const { user } = setup(<SignUpForm />);
    await fillForm(user, valid);
    await user.press(screen.getByTestId('sign-up-terms'));
    await user.press(screen.getByTestId('sign-up-submit'));
    expect(
      await screen.findByText('auth.sign_up.email_taken')
    ).toBeOnTheScreen();
  });
});
