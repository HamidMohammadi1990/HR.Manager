import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import {
  collectDescendantPermissionIds,
  getPermissionLevelIcon,
  permissionIdKey,
  type PermissionTreeNode,
} from '@/lib/permissionTree';

interface PermissionTreeViewProps {
  nodes: PermissionTreeNode[];
  assignedPermissionIds: Set<string>;
  disabled?: boolean;
  savingPermissionIds: Set<string>;
  onToggle: (node: PermissionTreeNode, nextChecked: boolean) => void;
}

function PermissionTreeItem({
  node,
  depth,
  assignedPermissionIds,
  disabled,
  savingPermissionIds,
  onToggle,
  defaultExpanded,
}: {
  node: PermissionTreeNode;
  depth: number;
  assignedPermissionIds: Set<string>;
  disabled?: boolean;
  savingPermissionIds: Set<string>;
  onToggle: (node: PermissionTreeNode, nextChecked: boolean) => void;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const permissionId = permissionIdKey(node.permission.Id)!;
  const hasChildren = node.children.length > 0;
  const isAssigned = assignedPermissionIds.has(permissionId);
  const isSaving = savingPermissionIds.has(permissionId)
    || collectDescendantPermissionIds(node).some((id) => savingPermissionIds.has(id));
  const descendantIds = collectDescendantPermissionIds(node);
  const assignedCount = descendantIds.filter((id) => assignedPermissionIds.has(id)).length;
  const isIndeterminate = hasChildren && assignedCount > 0 && assignedCount < descendantIds.length;

  return (
    <div className="select-none">
      <div
        className={cn(
          'hover:bg-muted/50 flex items-center gap-2 rounded-lg px-2 py-2 transition-colors',
          isAssigned && 'bg-primary/5',
        )}
        style={{ paddingInlineStart: `${depth * 1.25 + 0.5}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-md"
            onClick={() => setExpanded((value) => !value)}
            aria-label={expanded ? 'بستن' : 'باز کردن'}
          >
            <Icon
              name={expanded ? 'material-symbols:expand-more' : 'material-symbols:chevron-left'}
              className="size-5"
            />
          </button>
        ) : (
          <span className="inline-block size-7 shrink-0" />
        )}

        <label className={cn('flex min-w-0 flex-1 cursor-pointer items-center gap-3', disabled && 'cursor-not-allowed opacity-60')}>
          <input
            type="checkbox"
            className="checkbox"
            checked={isAssigned}
            ref={(input) => {
              if (input) input.indeterminate = isIndeterminate;
            }}
            disabled={disabled || isSaving}
            onChange={(event) => onToggle(node, event.target.checked)}
          />
          <Icon
            name={getPermissionLevelIcon(node.permission.LevelTypeId)}
            className={cn(
              'size-5 shrink-0',
              node.permission.LevelTypeId === 2 && 'text-violet-500',
              node.permission.LevelTypeId === 3 && 'text-sky-500',
              node.permission.LevelTypeId === 4 && 'text-amber-500',
            )}
          />
          <span className="min-w-0 flex-1">
            <span className="block font-medium">{node.permission.Title}</span>
            {node.permission.Url && (
              <span className="text-muted-foreground block truncate text-xs" dir="ltr">{node.permission.Url}</span>
            )}
          </span>
          <Badge variant="secondary" className="shrink-0">{node.permission.LevelTypeTitle}</Badge>
          {isSaving && <Icon name="material-symbols:progress-activity" className="text-muted-foreground size-4 shrink-0 animate-spin" />}
        </label>
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <PermissionTreeItem
              key={permissionIdKey(child.permission.Id)!}
              node={child}
              depth={depth + 1}
              assignedPermissionIds={assignedPermissionIds}
              disabled={disabled}
              savingPermissionIds={savingPermissionIds}
              onToggle={onToggle}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PermissionTreeView({
  nodes,
  assignedPermissionIds,
  disabled,
  savingPermissionIds,
  onToggle,
}: PermissionTreeViewProps) {
  const defaultExpanded = useMemo(() => nodes.length <= 8, [nodes.length]);

  if (nodes.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12 text-sm">
        <Icon name="material-symbols:search-off" className="size-10 opacity-50" />
        دسترسی‌ای برای نمایش پیدا نشد
      </div>
    );
  }

  return (
    <div className="divide-border divide-y rounded-xl border">
      {nodes.map((node) => (
        <PermissionTreeItem
          key={permissionIdKey(node.permission.Id)!}
          node={node}
          depth={0}
          assignedPermissionIds={assignedPermissionIds}
          disabled={disabled}
          savingPermissionIds={savingPermissionIds}
          onToggle={onToggle}
          defaultExpanded={defaultExpanded}
        />
      ))}
    </div>
  );
}
