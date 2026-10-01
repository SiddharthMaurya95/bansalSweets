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
      return { user: JSON.parse(userJson) as AuthUser, accessToken: token };
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
      value={{ ...state, login, register, logout, isAuthenticated: !!state.user }}
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
