import { getMyPermissions } from '@/services/api/myPermissions';
import { hasStoredSession } from '@/services/api/tokenStorage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionContextValue {
  permissions: ReadonlySet<number>;
  isLoading: boolean;
  hasPermission: (permissionId: number) => boolean;
  hasAnyPermission: (permissionIds: number[]) => boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<ReadonlySet<number>>(new Set());
  const [isLoading, setIsLoading] = useState(hasStoredSession());

  const refreshPermissions = useCallback(async () => {
    if (!hasStoredSession()) {
      setPermissions(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const ids = await getMyPermissions();
      setPermissions(new Set(ids));
    } catch {
      setPermissions(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setPermissions(new Set());
      setIsLoading(false);
      return;
    }

    void refreshPermissions();
  }, [isAuthenticated, refreshPermissions]);

  const hasPermission = useCallback(
    (permissionId: number) => permissions.has(permissionId),
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (permissionIds: number[]) => permissionIds.some((id) => permissions.has(id)),
    [permissions],
  );

  const value = useMemo(
    () => ({
      permissions,
      isLoading,
      hasPermission,
      hasAnyPermission,
      refreshPermissions,
    }),
    [permissions, isLoading, hasPermission, hasAnyPermission, refreshPermissions],
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions(): PermissionContextValue {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider');
  }
  return context;
}
