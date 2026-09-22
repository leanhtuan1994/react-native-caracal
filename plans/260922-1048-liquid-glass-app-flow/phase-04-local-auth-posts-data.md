---
phase: 4
title: 'Local auth and mock posts data'
status: done
priority: P1
effort: '4h'
dependencies: [1]
---

# Phase 4: Local auth and mock posts data

## Goal

Accounts and the session live only on the device in MMKV: Create account stores a new
account (password salted and hashed), Sign in checks email + password against stored
accounts, and the session survives restarts. The Home posts feed and its tag list come
from bundled mock data with local search and tag filtering. This phase makes no network
calls at all.

## Files to Create / Modify

- Modify: `src/lib/auth/utils.tsx` (session storage replaces token storage)
- Create: `src/lib/auth/accounts.ts`, `src/lib/auth/accounts.test.ts`
- Modify: `src/lib/auth/index.tsx` (store holds `userId`; add `loginWithEmail`, `signUpWithEmail`, `useCurrentUser`)
- Modify: `src/lib/auth/index.test.tsx`
- Create: `src/lib/posts/types.ts`, `src/lib/posts/mock-posts.ts`, `src/lib/posts/filter-posts.ts`, `src/lib/posts/filter-posts.test.ts`, `src/lib/posts/index.ts`
- Modify: `src/lib/index.tsx`

## Key facts

- `src/lib/storage.tsx` exposes synchronous `getItem<T>(key)`, `setItem<T>(key, value)`, `removeItem(key)` over MMKV (JSON-serialised). `setItem`/`removeItem` are declared `async` but write synchronously.
- `useAuth.hydrate()` must stay synchronous (Phase 2 calls `hydrateAuth()` at module scope).
- `expo-crypto` (already installed) provides `Crypto.randomUUID()` and `Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text)`.
- Never store the plain password. Store `salt` + `passwordHash` = SHA-256 of `salt + password`.
- Emails compare case-insensitively: normalise with `email.trim().toLowerCase()`.
- `TokenType` is only used inside `src/lib/auth/`; confirm with `grep -rn "TokenType" src` before removing it.
- Posts are local mock data (user decision): no `axios`, no react-query, no loading or error states for the feed. Leave `src/api/` untouched.

## Tasks

### Task 4.1 — Session storage

- Goal: the session stores only the signed-in account id.
- Target files: `src/lib/auth/utils.tsx`.
- Steps:
  1. Run `grep -rn "TokenType\|getToken\|setToken\|removeToken" src` and note every usage (expected: only `src/lib/auth/`).
  2. Replace the file content with:

     ```ts
     import { getItem, removeItem, setItem } from '@/lib/storage';

     const SESSION = 'session';

     export type Session = { userId: string };

     export const getSession = () => getItem<Session>(SESSION);
     export const removeSession = () => removeItem(SESSION);
     export const setSession = (value: Session) =>
       setItem<Session>(SESSION, value);
     ```

- Verify: `grep -rn "TokenType\|getToken\|setToken\|removeToken" src --include=*.ts --include=*.tsx | grep -v "src/lib/auth/index" | wc -l` prints `0` (index.tsx is updated in Task 4.3).

### Task 4.2 — Local accounts registry (test first)

- Goal: create accounts and verify credentials against MMKV.
- Target files: `src/lib/auth/accounts.ts` (exports `Account`, `createAccount`, `verifyCredentials`, `getAccountById`, `AUTH_ERRORS`), `src/lib/auth/accounts.test.ts`.
- Steps:
  1. Test first:

     ```ts
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
           verifyCredentials({
             email: 'emily@example.com',
             password: 'secret1',
           })
         ).resolves.toEqual(account);
       });

       it('rejects a wrong password or unknown email', async () => {
         await createAccount(input);
         await expect(
           verifyCredentials({ email: 'emily@example.com', password: 'wrong1' })
         ).rejects.toThrow(AUTH_ERRORS.invalidCredentials);
         await expect(
           verifyCredentials({
             email: 'nobody@example.com',
             password: 'secret1',
           })
         ).rejects.toThrow(AUTH_ERRORS.invalidCredentials);
       });
     });
     ```

  2. Run `pnpm test accounts` → must fail (module missing).
  3. Implement:

     ```ts
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
     ```

- Success criteria: four tests pass; no plain password in storage.
- Verify: step 2 exits non-zero (expected red). After step 3, `pnpm test accounts` exits 0 and prints `4 passed`.

### Task 4.3 — Auth store on local accounts (test first)

- Goal: `useAuth` holds `userId`; `loginWithEmail` / `signUpWithEmail` sign in on success; `useCurrentUser` returns the profile.
- Target files: `src/lib/auth/index.tsx`, `src/lib/auth/index.test.tsx`.
- Steps:
  1. Update the existing test file: mock `@/lib/storage` as today, and mock `./accounts` with `createAccount` / `verifyCredentials` returning `{ id: 'user-1', fullName: 'Emily Johnson', email: 'emily@example.com' }` and `getAccountById` returning the same object. Keep the existing "uses Zustand selectors" test but assert `{ status: 'idle', userId: null }` and call `signIn('user-1')`. Add:
     - `await loginWithEmail({ email: 'emily@example.com', password: 'secret1' })` → `useAuth.getState()` has `status: 'signIn'` and `userId: 'user-1'`;
     - `await signUpWithEmail({ fullName: 'Emily Johnson', email: 'emily@example.com', password: 'secret1' })` → same state;
     - `renderHook(() => useCurrentUser())` after `signIn('user-1')` returns `{ id: 'user-1', fullName: 'Emily Johnson', email: 'emily@example.com', username: 'emily', initials: 'EJ' }`.
  2. Run `pnpm test src/lib/auth/index` → must fail.
  3. Implement in `index.tsx`:
     - State: `userId: string | null`, `status: 'idle' | 'signOut' | 'signIn'`, `signIn(userId: string)`, `signOut()`, `hydrate()`. `signIn` calls `setSession({ userId })`; `signOut` calls `removeSession()`; `hydrate` reads `getSession()` and signs in only if `getAccountById(session.userId)` exists, otherwise signs out. Keep the existing `try/catch` in `hydrate`.
     - Keep exports `signOut`, `signIn`, `hydrateAuth`.
     - Add:

       ```ts
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

       export type UserProfile = {
         id: string;
         fullName: string;
         email: string;
         username: string;
         initials: string;
       };

       export function useCurrentUser(): UserProfile | null {
         const userId = useAuth((state) => state.userId);
         const account = userId ? getAccountById(userId) : undefined;
         if (!account) return null;
         const initials = account.fullName
           .split(/\s+/)
           .map((part) => part[0]?.toUpperCase() ?? '')
           .join('')
           .slice(0, 2);
         return {
           id: account.id,
           fullName: account.fullName,
           email: account.email,
           username: account.email.split('@')[0],
           initials,
         };
       }
       ```

     - Re-export `AUTH_ERRORS` from `./accounts`.

  4. If the file passes 80 lines, move `useCurrentUser` and `UserProfile` into `src/lib/auth/use-current-user.ts` and re-export it from `index.tsx`.

- Verify: step 2 exits non-zero (expected red). After step 3, `pnpm test src/lib/auth` exits 0 with every test passing; `pnpm type-check` exits 0.

### Task 4.4 — Mock posts, search and tag filter (test first)

- Goal: `filterPosts(posts, { query, tag })` and `getPostTags(posts)` work on a bundled `MOCK_POSTS` list.
- Target files: `src/lib/posts/types.ts`, `src/lib/posts/mock-posts.ts` (export `MOCK_POSTS`), `src/lib/posts/filter-posts.ts` (exports `filterPosts`, `getPostTags`), `src/lib/posts/filter-posts.test.ts`, `src/lib/posts/index.ts`, `src/lib/index.tsx`.
- Steps:
  1. `types.ts`:

     ```ts
     export type Post = {
       id: number;
       title: string;
       body: string;
       tags: string[];
       likes: number;
       views: number;
     };

     export type PostsFilter = { query?: string; tag?: string };
     ```

  2. `mock-posts.ts`: `export const MOCK_POSTS: Post[] = [...]` with exactly these 12 posts (ids 1–12, in this order; `body` text as given):
     | id | title | tags | likes | views | body |
     |----|-------|------|-------|-------|------|
     | 1 | His mother had always taught him | history, american, crime | 192 | 305 | His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. |
     | 2 | He was an expert but not in a discipline | french, fiction, english | 859 | 4884 | He was an expert but not in a discipline that anyone could fully appreciate. He knew how to hold the cone just right. |
     | 3 | Dave watched as the forest burned up on the hill. | magical, history, french | 1448 | 4784 | Dave watched as the forest burned up on the hill, only a few miles from his house. The car had been hastily packed. |
     | 4 | The morning train was late again | fiction, city | 312 | 1204 | The platform filled with people who had all decided, at the same moment, that today they would complain about it. |
     | 5 | A garden that grows at night | nature, magical | 640 | 2210 | Nobody in the village could explain why the flowers only opened after midnight, so they stopped trying. |
     | 6 | Letters from the old lighthouse | history, love | 505 | 1873 | Every winter a new letter arrived, sealed with wax and signed with a single initial nobody recognised. |
     | 7 | The detective who hated coffee | crime, fiction | 977 | 3650 | She solved every case before lunch, mostly because she refused to waste mornings standing in queues. |
     | 8 | Maps of places that do not exist | adventure, fiction | 421 | 1398 | The atlas had forty pages, and only thirty-nine of them matched anything on the real coastline. |
     | 9 | A quiet street in Paris | french, city, love | 733 | 2951 | The bakery on the corner opened at six, and by seven the whole street smelled of warm butter. |
     | 10 | The last summer before the storm | nature, memory | 288 | 990 | They spent the whole summer on the lake, pretending the clouds on the horizon were someone else's problem. |
     | 11 | Notes on building a small boat | adventure, english | 356 | 1127 | The first boat sank in ten minutes. The second one lasted an hour, which everyone agreed was progress. |
     | 12 | The museum after closing time | history, mystery | 1102 | 4015 | The night guard swore the portraits changed expressions, but only when nobody else was looking. |
  3. Test first (`filter-posts.test.ts`), using `MOCK_POSTS`:
     - `filterPosts(MOCK_POSTS, {})` returns all 12;
     - `filterPosts(MOCK_POSTS, { query: 'MOTHER' })` returns ids `[1]` (case-insensitive, matches title or body);
     - `filterPosts(MOCK_POSTS, { query: '   ' })` returns all 12 (blank query ignored);
     - `filterPosts(MOCK_POSTS, { tag: 'history' })` returns ids `[1, 3, 6, 12]`;
     - `filterPosts(MOCK_POSTS, { query: 'street', tag: 'french' })` returns ids `[9]` (both filters apply);
     - `filterPosts(MOCK_POSTS, { query: 'zzzqqq' })` returns `[]`;
     - `getPostTags(MOCK_POSTS).slice(0, 6)` equals `['history', 'american', 'crime', 'french', 'fiction', 'english']` (unique, first-seen order).
  4. Run `pnpm test filter-posts` → must fail (module missing).
  5. Implement `filter-posts.ts`:

     ```ts
     import type { Post, PostsFilter } from './types';

     export function filterPosts(
       posts: Post[],
       { query, tag }: PostsFilter
     ): Post[] {
       const needle = query?.trim().toLowerCase() ?? '';
       return posts.filter((post) => {
         const matchesTag = !tag || post.tags.includes(tag);
         const matchesQuery =
           !needle ||
           post.title.toLowerCase().includes(needle) ||
           post.body.toLowerCase().includes(needle);
         return matchesTag && matchesQuery;
       });
     }

     export function getPostTags(posts: Post[]): string[] {
       return [...new Set(posts.flatMap((post) => post.tags))];
     }
     ```

  6. `src/lib/posts/index.ts` re-exports `types`, `mock-posts` and `filter-posts`; add `export * from './posts';` to `src/lib/index.tsx`.

- Verify: step 4 exits non-zero (expected red). After step 5, `pnpm test filter-posts` exits 0 and prints `7 passed`; `pnpm type-check` exits 0; `grep -c "id: " src/lib/posts/mock-posts.ts` prints `12`.

### Task 4.5 — Phase gate and commit

- Steps:
  1. Run `pnpm lint`, `pnpm type-check`, `pnpm test`.
  2. Commit: `git add -A && git commit -m "feat(auth): store accounts locally in mmkv; add mock posts"`.
- Verify: all three commands exit 0; `git log -1 --pretty=%s` prints `feat(auth): store accounts locally in mmkv; add mock posts`.

## Failure Protocol

If any Verify step does not meet its stated pass condition, STOP this phase.
Do not improvise a fix, retry blindly, or reason around the failure.
Spawn the `kongming` subagent for next-step counsel and pass:

- the phase and task id,
- what you attempted (the steps you ran),
- the exact command and its full output,
- the pass condition it failed to meet.
  Apply kongming's guidance, then re-run the Verify step.
  If `kongming` cannot be spawned in this environment, STOP and report the same
  failure evidence to the user. Never continue by self-reasoning.
