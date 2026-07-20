import type { PermissionDto } from '@/services/api';

export function permissionIdKey(id: number | string | null | undefined): string | null {
  if (id === null || id === undefined || id === '') return null;
  return String(id);
}

export interface PermissionTreeNode {
  permission: PermissionDto;
  children: PermissionTreeNode[];
}

export function buildPermissionTree(permissions: PermissionDto[]): PermissionTreeNode[] {
  const byId = new Map<string, PermissionTreeNode>();

  for (const permission of permissions) {
    const id = permissionIdKey(permission.Id);
    if (!id) continue;
    byId.set(id, { permission, children: [] });
  }

  const roots: PermissionTreeNode[] = [];

  for (const node of byId.values()) {
    const parentId = permissionIdKey(node.permission.ParentId);
    const parent = parentId ? byId.get(parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: PermissionTreeNode[]) => {
    nodes.sort((a, b) => a.permission.Priority - b.permission.Priority || a.permission.Title.localeCompare(b.permission.Title, 'fa'));
    nodes.forEach((node) => sortNodes(node.children));
  };

  sortNodes(roots);
  return roots;
}

export function flattenPermissionTree(nodes: PermissionTreeNode[]): PermissionTreeNode[] {
  const result: PermissionTreeNode[] = [];
  const walk = (items: PermissionTreeNode[]) => {
    for (const item of items) {
      result.push(item);
      walk(item.children);
    }
  };
  walk(nodes);
  return result;
}

export function collectDescendantPermissionIds(node: PermissionTreeNode): string[] {
  const ids: string[] = [];
  const walk = (current: PermissionTreeNode) => {
    const id = permissionIdKey(current.permission.Id);
    if (id) ids.push(id);
    current.children.forEach(walk);
  };
  walk(node);
  return ids;
}

export function filterPermissionTree(nodes: PermissionTreeNode[], query: string): PermissionTreeNode[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return nodes;

  const filterNode = (node: PermissionTreeNode): PermissionTreeNode | null => {
    const titleMatch = node.permission.Title.toLowerCase().includes(normalized)
      || (node.permission.Url ?? '').toLowerCase().includes(normalized);
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child): child is PermissionTreeNode => child !== null);

    if (titleMatch || filteredChildren.length > 0) {
      return { permission: node.permission, children: filteredChildren };
    }

    return null;
  };

  return nodes
    .map(filterNode)
    .filter((node): node is PermissionTreeNode => node !== null);
}

export function getPermissionLevelIcon(levelTypeId: number): string {
  if (levelTypeId === 2) return 'material-symbols:folder';
  if (levelTypeId === 3) return 'material-symbols:web';
  if (levelTypeId === 4) return 'material-symbols:touch-app';
  return 'material-symbols:lock';
}
