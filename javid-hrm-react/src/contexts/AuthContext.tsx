import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getAccessToken,
  getUserNameFromToken,
  hasStoredSession,
  signIn as apiSignIn,
  signOut as apiSignOut,
  type SignInRequest,
} from '@/services/api';

interface AuthContextValue {
  isAuthenticated: boolean;
  userName?: string;
  isLoading: boolean;
  signIn: (request: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUserName(): string | undefined {
  const token = getAccessToken();
  return token ? getUserNameFromToken(token) : undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredSession);
  const [userName, setUserName] = useState<string | undefined>(readUserName);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async (request: SignInRequest) => {
    setIsLoading(true);
    try {
      const response = await apiSignIn(request);
      setIsAuthenticated(true);
      setUserName(getUserNameFromToken(response.AccessToken));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiSignOut();
    } finally {
      setIsAuthenticated(false);
      setUserName(undefined);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, userName, isLoading, signIn, signOut }),
    [isAuthenticated, userName, isLoading, signIn, signOut],
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
