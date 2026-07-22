import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePermissions } from '@/contexts/PermissionContext';
import { getRoutePermissions } from '@/lib/routePermissions';

function PermissionLoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <div className="text-muted-foreground text-sm">در حال بررسی دسترسی...</div>
    </div>
  );
}

export function PermissionGuard() {
  const location = useLocation();
  const { hasAnyPermission, isLoading } = usePermissions();
  const requiredPermissions = getRoutePermissions(location.pathname);

  if (!requiredPermissions?.length) {
    return <Outlet />;
  }

  if (isLoading) {
    return <PermissionLoadingState />;
  }

  if (!hasAnyPermission(requiredPermissions)) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
