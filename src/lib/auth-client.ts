import { createAuthClient } from 'better-auth/react';

// When running in the browser, use window.location.origin so cookies are first-party.
// When running server-side or locally, fall back to NEXT_PUBLIC_API_URL or localhost:5000.
const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, signOut, useSession } = authClient;