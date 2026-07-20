import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getCurrentUser,
  hasStoredSession,
  signIn as apiSignIn,
  signOut as apiSignOut,
  type SignInRequest,
  type UserDto,
} from '@/services/api';
import { clearTokens } from '@/services/api/tokenStorage';
import { getUserDisplayName } from '@/lib/userDisplay';

interface AuthContextValue {
  isAuthenticated: boolean;
  currentUser: UserDto | null;
  userName?: string;
  displayName: string;
  isLoading: boolean;
  isUserLoading: boolean;
  signIn: (request: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
  clearSession: () => void;
  refreshCurrentUser: () => Promise<UserDto | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredSession);
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(hasStoredSession);

  const refreshCurrentUser = useCallback(async (): Promise<UserDto | null> => {
    if (!hasStoredSession()) {
      setCurrentUser(null);
      return null;
    }

    setIsUserLoading(true);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } catch {
      setCurrentUser(null);
      return null;
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasStoredSession()) {
      void refreshCurrentUser();
    }
  }, [refreshCurrentUser]);

  const signIn = useCallback(async (request: SignInRequest) => {
    setIsLoading(true);
    try {
      await apiSignIn(request);
      setIsAuthenticated(true);
      await refreshCurrentUser();
    } finally {
      setIsLoading(false);
    }
  }, [refreshCurrentUser]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiSignOut();
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    clearTokens();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsLoading(false);
    setIsUserLoading(false);
  }, []);

  const displayName = currentUser ? getUserDisplayName(currentUser) : 'کاربر';
  const userName = currentUser?.UserName;

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentUser,
      userName,
      displayName,
      isLoading,
      isUserLoading,
      signIn,
      signOut,
      clearSession,
      refreshCurrentUser,
    }),
    [
      isAuthenticated,
      currentUser,
      userName,
      displayName,
      isLoading,
      isUserLoading,
      signIn,
      signOut,
      clearSession,
      refreshCurrentUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
