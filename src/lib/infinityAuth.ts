import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { PersistedState } from '../game/types';

WebBrowser.maybeCompleteAuthSession();

const API_BASE = 'https://api.chefu.co.za';
const CLIENT_ID = 'infinity-mobile';
const SESSION_KEY = 'infinity-oauth-session';
const REDIRECT_URI = AuthSession.makeRedirectUri({ path: 'auth', scheme: 'infinity' });
const DISCOVERY = {
  authorizationEndpoint: `${API_BASE}/oauth/authorize`,
  revocationEndpoint: `${API_BASE}/oauth/revoke`,
  tokenEndpoint: `${API_BASE}/oauth/token`,
  userInfoEndpoint: `${API_BASE}/oauth/userinfo`,
};

export type InfinityUser = { uid: string; email: string; displayName?: string };
export type InfinitySession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  user: InfinityUser;
};

export async function loadInfinitySession(): Promise<InfinitySession | null> {
  const value = await SecureStore.getItemAsync(SESSION_KEY);
  if (!value) return null;
  try {
    const session = JSON.parse(value) as InfinitySession;
    return session.accessToken && session.expiresAt > Math.floor(Date.now() / 1000)
      ? session
      : null;
  } catch {
    return null;
  }
}

export async function saveInfinitySession(session: InfinitySession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearInfinitySession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function signInToInfinity(): Promise<InfinitySession | null> {
  const state = randomParam(32);
  const nonce = randomParam(32);
  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    extraParams: { nonce },
    prompt: AuthSession.Prompt.Login,
    redirectUri: REDIRECT_URI,
    responseType: AuthSession.ResponseType.Code,
    scopes: ['openid', 'profile', 'email'],
    state,
    usePKCE: true,
  });
  const result = await request.promptAsync(DISCOVERY);
  if (result.type !== 'success') return null;
  if (result.params.state !== state || !result.params.code || !request.codeVerifier) {
    throw new Error('Sign in response failed security validation.');
  }

  const token = await AuthSession.exchangeCodeAsync(
    {
      clientId: CLIENT_ID,
      code: result.params.code,
      extraParams: { code_verifier: request.codeVerifier },
      redirectUri: REDIRECT_URI,
    },
    DISCOVERY,
  );
  if (!token.accessToken || !token.expiresIn) throw new Error('Sign in did not return a valid session.');

  const userInfo = await AuthSession.fetchUserInfoAsync({ accessToken: token.accessToken }, DISCOVERY) as {
    sub?: string; email?: string; name?: string;
  };
  if (!userInfo.sub || !userInfo.email) throw new Error('Sign in did not return a valid user.');

  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.issuedAt + token.expiresIn,
    user: { uid: userInfo.sub, email: userInfo.email, displayName: userInfo.name },
  };
}

export async function fetchInfinityState(accessToken: string): Promise<PersistedState | null> {
  const response = await fetch(`${API_BASE}/infinity/history`, { headers: authHeaders(accessToken) });
  if (!response.ok) throw new Error('Could not load your saved history.');
  const payload = await response.json() as { state?: PersistedState | null };
  return payload.state ?? null;
}

export async function saveInfinityState(accessToken: string, state: PersistedState) {
  const response = await fetch(`${API_BASE}/infinity/history`, {
    method: 'PUT',
    headers: { ...authHeaders(accessToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });
  if (!response.ok) throw new Error('Could not save your game history.');
}

function authHeaders(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}`, 'x-chefu-app': 'infinity' };
}

function randomParam(length: number) {
  const bytes = Crypto.getRandomBytes(length);
  return Array.from(bytes, byte => String.fromCharCode(65 + (byte % 26))).join('');
}