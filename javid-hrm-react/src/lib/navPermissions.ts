import type { NavItem } from '@/data/navigation';

export function canAccessNavItem(
  item: NavItem,
  hasAnyPermission: (permissionIds: number[]) => boolean,
  isPermissionsLoading = false,
): boolean {
  if (!item.permissions?.length) return true;
  if (isPermissionsLoading) return false;
  return hasAnyPermission(item.permissions);
}

export function filterNavItems(
  items: NavItem[],
  hasAnyPermission: (permissionIds: number[]) => boolean,
  isPermissionsLoading = false,
): NavItem[] {
  return items.filter((item) => canAccessNavItem(item, hasAnyPermission, isPermissionsLoading));
}
