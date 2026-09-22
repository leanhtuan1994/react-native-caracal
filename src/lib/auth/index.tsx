import { createAccount, verifyCredentials } from './accounts';
import { signIn } from './store';

export async function loginWithEmail(values: {
  email: string;
  password: string;
}): Promise<void> {
  const account = await verifyCredentials(values);
  signIn(account.id);
}

export async function signUpWithEmail(values: {
  fullName: string;
  email: string;
  password: string;
}): Promise<void> {
  const account = await createAccount(values);
  signIn(account.id);
}

export { AUTH_ERRORS } from './accounts';
export * from './store';
export * from './use-current-user';
