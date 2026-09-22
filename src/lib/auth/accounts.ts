import * as Crypto from 'expo-crypto';

import { getItem, setItem } from '@/lib/storage';

const ACCOUNTS = 'accounts';

export const AUTH_ERRORS = {
  emailTaken: 'email_taken',
  invalidCredentials: 'invalid_credentials',
} as const;

export type Account = {
  id: string;
  fullName: string;
  email: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
};

type Credentials = { email: string; password: string };
type NewAccount = Credentials & { fullName: string };

const normaliseEmail = (email: string) => email.trim().toLowerCase();

const getAccounts = (): Account[] => getItem<Account[]>(ACCOUNTS) ?? [];

function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}${password}`
  );
}

export function getAccountById(id: string): Account | undefined {
  return getAccounts().find((account) => account.id === id);
}

export async function createAccount({
  fullName,
  email,
  password,
}: NewAccount): Promise<Account> {
  const accounts = getAccounts();
  const normalised = normaliseEmail(email);
  if (accounts.some((account) => account.email === normalised)) {
    throw new Error(AUTH_ERRORS.emailTaken);
  }
  const salt = Crypto.randomUUID();
  const account: Account = {
    id: Crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalised,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  setItem<Account[]>(ACCOUNTS, [...accounts, account]);
  return account;
}

export async function verifyCredentials({
  email,
  password,
}: Credentials): Promise<Account> {
  const account = getAccounts().find(
    (item) => item.email === normaliseEmail(email)
  );
  if (
    !account ||
    (await hashPassword(password, account.salt)) !== account.passwordHash
  ) {
    throw new Error(AUTH_ERRORS.invalidCredentials);
  }
  return account;
}
