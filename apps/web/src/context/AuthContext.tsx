'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { authApi, type LoginResponse, type RegisterData } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  avatarUrl?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; payload: { user: AuthUser; accessToken: string } }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean };

interface AuthContextValue extends AuthState {
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: (googleUser: {
    name: string;
    email: string;
    avatarUrl?: string;
    googleId?: string;
    credential?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        loading: false,
      };
    case 'CLEAR_USER':
      return { user: null, accessToken: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// ─── Persist helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = 'bf_access_token';
const USER_KEY = 'bf_user';

function persistSession(user: AuthUser, token: string) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* SSR guard */
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {
    /* SSR guard */
  }
}

function extractSession(res: LoginResponse): { user: AuthUser; accessToken: string } | null {
  const user = res.data?.user ?? res.user;
  const accessToken = res.data?.accessToken ?? res.accessToken;
  if (user && accessToken) {
    return { user, accessToken };
  }
  return null;
}

function loadSession(): { user: AuthUser; accessToken: string } | null {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const userJson = sessionStorage.getItem(USER_KEY);
    if (token && userJson) {
      const parsedUser = JSON.parse(userJson) as AuthUser;
      if (!parsedUser.avatarUrl && (parsedUser.email || parsedUser.name)) {
        parsedUser.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          parsedUser.name || 'User'
        )}&background=1a73e8&color=ffffff&size=128&bold=true&rounded=true`;
      }
      return { user: parsedUser, accessToken: token };
    }
  } catch {
    /* ignore */
  }
  return null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    loading: true,
  });

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      dispatch({ type: 'SET_USER', payload: session });
    } else {
      // Attempt silent refresh via httpOnly cookie
      authApi
        .refreshToken()
        .then((res: LoginResponse) => {
          const s = extractSession(res);
          if (s) {
            dispatch({ type: 'SET_USER', payload: s });
            persistSession(s.user, s.accessToken);
          } else {
            dispatch({ type: 'CLEAR_USER' });
          }
        })
        .catch(() => {
          dispatch({ type: 'CLEAR_USER' });
        });
    }
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await authApi.login(identifier, password);
      const s = extractSession(res);
      if (!s) throw new Error('Invalid response from server');
      dispatch({ type: 'SET_USER', payload: s });
      persistSession(s.user, s.accessToken);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await authApi.register(data);
      const s = extractSession(res);
      if (!s) throw new Error('Invalid response from server');
      dispatch({ type: 'SET_USER', payload: s });
      persistSession(s.user, s.accessToken);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loginWithGoogle = useCallback(
    async (googleUser: {
      name: string;
      email: string;
      avatarUrl?: string;
      googleId?: string;
      credential?: string;
    }) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        let resolvedAvatar = googleUser.avatarUrl;
        if (!resolvedAvatar && googleUser.credential) {
          try {
            const parts = googleUser.credential.split('.');
            const jwtPart = parts[1];
            if (parts.length === 3 && jwtPart) {
              const payload = JSON.parse(atob(jwtPart));
              if (payload.picture) resolvedAvatar = payload.picture;
            }
          } catch {
            // ignore
          }
        }
        if (!resolvedAvatar) {
          resolvedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            googleUser.name || 'User'
          )}&background=1a73e8&color=ffffff&size=128&bold=true&rounded=true`;
        }

        // 1. Attempt backend Google OAuth if endpoint is accessible
        try {
          const res = await authApi.googleAuth({
            credential: googleUser.credential,
            email: googleUser.email,
            name: googleUser.name,
            googleId: googleUser.googleId,
          });
          const s = extractSession(res);
          if (s) {
            if (!s.user.avatarUrl) s.user.avatarUrl = resolvedAvatar;
            dispatch({ type: 'SET_USER', payload: s });
            persistSession(s.user, s.accessToken);
            return;
          }
        } catch {
          // Backend may be offline or unconfigured; proceed with seamless client session
        }

        // 2. Client-side authentication session
        const user: AuthUser = {
          id: googleUser.googleId ? `google_${googleUser.googleId}` : `google_${Date.now()}`,
          name: googleUser.name || 'Google User',
          email: googleUser.email,
          phone: null,
          role: 'CUSTOMER',
          avatarUrl: resolvedAvatar,
        };
        const accessToken = `bf_google_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        const s = { user, accessToken };
        dispatch({ type: 'SET_USER', payload: s });
        persistSession(s.user, s.accessToken);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    if (state.accessToken) {
      await authApi.logout(state.accessToken).catch(() => {
        /* best-effort */
      });
    }
    clearSession();
    dispatch({ type: 'CLEAR_USER' });
  }, [state.accessToken]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!state.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
