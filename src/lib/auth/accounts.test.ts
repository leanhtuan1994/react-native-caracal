import {
  AUTH_ERRORS,
  createAccount,
  getAccountById,
  verifyCredentials,
} from './accounts';

const mockStore = new Map<string, unknown>();
jest.mock('@/lib/storage', () => ({
  getItem: (key: string) => mockStore.get(key) ?? null,
  setItem: (key: string, value: unknown) => {
    mockStore.set(key, value);
  },
  removeItem: (key: string) => {
    mockStore.delete(key);
  },
}));

let mockId = 0;
jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  randomUUID: () => `id-${++mockId}`,
  digestStringAsync: async (_algorithm: string, text: string) =>
    `hash(${text})`,
}));

const input = {
  fullName: 'Emily Johnson',
  email: 'Emily@Example.com',
  password: 'secret1',
};

describe('accounts', () => {
  beforeEach(() => {
    mockStore.clear();
    mockId = 0;
  });

  it('creates an account without storing the plain password', async () => {
    const account = await createAccount(input);
    expect(account.email).toBe('emily@example.com');
    expect(account.passwordHash).not.toBe('secret1');
    expect(JSON.stringify(mockStore.get('accounts'))).not.toContain(
      '"secret1"'
    );
    expect(getAccountById(account.id)?.fullName).toBe('Emily Johnson');
  });

  it('rejects a duplicate email regardless of case', async () => {
    await createAccount(input);
    await expect(
      createAccount({ ...input, email: 'EMILY@example.com ' })
    ).rejects.toThrow(AUTH_ERRORS.emailTaken);
  });

  it('verifies correct credentials', async () => {
    const account = await createAccount(input);
    await expect(
      verifyCredentials({ email: 'emily@example.com', password: 'secret1' })
    ).resolves.toEqual(account);
  });

  it('rejects a wrong password or unknown email', async () => {
    await createAccount(input);
    await expect(
      verifyCredentials({ email: 'emily@example.com', password: 'wrong1' })
    ).rejects.toThrow(AUTH_ERRORS.invalidCredentials);
    await expect(
      verifyCredentials({ email: 'nobody@example.com', password: 'secret1' })
    ).rejects.toThrow(AUTH_ERRORS.invalidCredentials);
  });
});
