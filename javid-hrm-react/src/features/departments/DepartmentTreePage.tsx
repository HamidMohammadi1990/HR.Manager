import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Avatar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MetricCard,
  PageHeader,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { getPersonName } from '@/lib/hrLabels';
import {
  getAllDepartments,
  getAllEmployees,
  getApiErrorMessage,
  type DepartmentDto,
  type EmployeeDto,
} from '@/services/api';

const DEPTH_COLORS = [
  'from-violet-500 to-indigo-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

interface DepartmentTreeNode {
  department: DepartmentDto;
  children: DepartmentTreeNode[];
}

function buildDepartmentTree(departments: DepartmentDto[]): DepartmentTreeNode[] {
  const byId = new Map<string, DepartmentTreeNode>();
  for (const department of departments) {
    byId.set(department.Id, { department, children: [] });
  }

  const roots: DepartmentTreeNode[] = [];
  for (const department of departments) {
    const node = byId.get(department.Id)!;
    if (department.ParentDepartmentId && byId.has(department.ParentDepartmentId)) {
      byId.get(department.ParentDepartmentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: DepartmentTreeNode[]) => {
    nodes.sort((a, b) => a.department.Name.localeCompare(b.department.Name, 'fa'));
    nodes.forEach((node) => sortNodes(node.children));
  };
  sortNodes(roots);
  return roots;
}

function flattenTree(nodes: DepartmentTreeNode[]): DepartmentTreeNode[] {
  const result: DepartmentTreeNode[] = [];
  const walk = (items: DepartmentTreeNode[]) => {
    for (const item of items) {
      result.push(item);
      walk(item.children);
    }
  };
  walk(nodes);
  return result;
}

function collectDepartmentIds(node: DepartmentTreeNode): string[] {
  return [node.department.Id, ...node.children.flatMap(collectDepartmentIds)];
}

function nodeMatchesSearch(node: DepartmentTreeNode, query: string): boolean {
  const q = query.toLowerCase();
  const { department } = node;
  return (
    department.Name.toLowerCase().includes(q)
    || department.Code.toLowerCase().includes(q)
    || (department.Description ?? '').toLowerCase().includes(q)
    || (department.ParentDepartmentName ?? '').toLowerCase().includes(q)
  );
}

function filterTree(nodes: DepartmentTreeNode[], query: string): DepartmentTreeNode[] {
  if (!query.trim()) return nodes;

  const filterNode = (node: DepartmentTreeNode): DepartmentTreeNode | null => {
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child): child is DepartmentTreeNode => child !== null);

    if (nodeMatchesSearch(node, query) || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
    return null;
  };

  return nodes.map(filterNode).filter((node): node is DepartmentTreeNode => node !== null);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`;
  return name.slice(0, 2) || '—';
}

function formatDateFa(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR');
}

interface TreeNodeRowProps {
  node: DepartmentTreeNode;
  depth: number;
  expanded: Set<string>;
  selectedId: string | null;
  directCount: number;
  totalCount: number;
  onToggle: (id: string) => void;
  onSelect: (node: DepartmentTreeNode) => void;
}

function TreeNodeRow({
  node,
  depth,
  expanded,
  selectedId,
  directCount,
  totalCount,
  onToggle,
  onSelect,
}: TreeNodeRowProps) {
  const { department } = node;
  const hasChildren = node.children.length > 0;
  const isExpanded = expanded.has(department.Id);
  const isSelected = selectedId === department.Id;
  const colorClass = DEPTH_COLORS[depth % DEPTH_COLORS.length];

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node)}
        className={`group flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-start transition-all ${
          isSelected
            ? 'border-primary bg-primary/10 shadow-sm'
            : 'border-transparent hover:border-border hover:bg-muted/40'
        }`}
        style={{ marginInlineStart: `${depth * 1.25}rem` }}
      >
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg"
          onClick={(event) => {
            if (!hasChildren) return;
            event.stopPropagation();
            onToggle(department.Id);
          }}
        >
          {hasChildren ? (
            <Icon
              name={isExpanded ? 'material-symbols:expand-more' : 'material-symbols:chevron-left'}
              className="text-muted-foreground size-5"
            />
          ) : (
            <span className="bg-border size-1.5 rounded-full" />
          )}
        </span>

        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm ${colorClass}`}
        >
          <Icon name="material-symbols:corporate-fare" className="size-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{department.Name}</span>
            <span className="text-muted-foreground font-mono text-xs">{department.Code}</span>
            {!department.IsActive && <Badge variant="secondary">غیرفعال</Badge>}
          </span>
          <span className="text-muted-foreground mt-0.5 flex flex-wrap gap-3 text-xs">
            <span>{directCount.toLocaleString('fa-IR')} پرسنل مستقیم</span>
            {totalCount !== directCount && (
              <span>{totalCount.toLocaleString('fa-IR')} با زیرمجموعه</span>
            )}
            {hasChildren && (
              <span>{node.children.length.toLocaleString('fa-IR')} زیردپارتمان</span>
            )}
          </span>
        </span>

        <Icon
          name="material-symbols:chevron-left"
          className={`text-muted-foreground size-4 shrink-0 transition-opacity ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
          }`}
        />
      </button>

      {hasChildren && isExpanded && (
        <div className="relative mt-1 space-y-1">
          <span
            className="bg-border absolute bottom-2 top-0 w-px"
            style={{ insetInlineStart: `${depth * 1.25 + 0.85}rem` }}
          />
          {node.children.map((child) => (
            <TreeNodeRow
              key={child.department.Id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              selectedId={selectedId}
              directCount={0}
              totalCount={0}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeNodeRowWithCounts(
  props: Omit<TreeNodeRowProps, 'directCount' | 'totalCount'> & {
    countMaps: {
      direct: Map<string, number>;
      total: Map<string, number>;
    };
  },
) {
  const directCount = props.countMaps.direct.get(props.node.department.Id) ?? 0;
  const totalCount = props.countMaps.total.get(props.node.department.Id) ?? 0;
  return <TreeNodeRow {...props} directCount={directCount} totalCount={totalCount} />;
}

export default function DepartmentTreePage() {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<DepartmentTreeNode | null>(null);
  const [includeSubDepartments, setIncludeSubDepartments] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [deptResult, empResult] = await Promise.all([
        getAllDepartments({ Pagination: { PageNumber: 1, PageSize: 500 } }),
        getAllEmployees({ Pagination: { PageNumber: 1, PageSize: 1000 } }),
      ]);
      const deptItems = deptResult.Items ?? [];
      setDepartments(deptItems);
      setEmployees(empResult.Items ?? []);

      const tree = buildDepartmentTree(deptItems);
      const allIds = flattenTree(tree).map((node) => node.department.Id);
      setExpanded(new Set(allIds));
      setSelectedNode((prev) => prev ?? tree[0] ?? null);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const tree = useMemo(() => buildDepartmentTree(departments), [departments]);
  const filteredTree = useMemo(() => filterTree(tree, search), [tree, search]);

  const employeesByDepartment = useMemo(() => {
    const map = new Map<string, EmployeeDto[]>();
    for (const employee of employees) {
      const list = map.get(employee.DepartmentId) ?? [];
      list.push(employee);
      map.set(employee.DepartmentId, list);
    }
    return map;
  }, [employees]);

  const countMaps = useMemo(() => {
    const direct = new Map<string, number>();
    const total = new Map<string, number>();

    const walk = (node: DepartmentTreeNode): number => {
      const directCount = employeesByDepartment.get(node.department.Id)?.length ?? 0;
      direct.set(node.department.Id, directCount);

      let subtreeTotal = directCount;
      for (const child of node.children) {
        subtreeTotal += walk(child);
      }
      total.set(node.department.Id, subtreeTotal);
      return subtreeTotal;
    };

    for (const root of tree) walk(root);
    return { direct, total };
  }, [tree, employeesByDepartment]);

  const stats = useMemo(() => {
    const active = departments.filter((d) => d.IsActive).length;
    const maxDepth = (() => {
      let max = 0;
      const walk = (nodes: DepartmentTreeNode[], depth: number) => {
        for (const node of nodes) {
          max = Math.max(max, depth);
          walk(node.children, depth + 1);
        }
      };
      walk(tree, 1);
      return max;
    })();
    return {
      total: departments.length,
      active,
      employees: employees.length,
      roots: tree.length,
      maxDepth,
    };
  }, [departments, employees, tree]);

  const selectedEmployees = useMemo(() => {
    if (!selectedNode) return [];
    const ids = includeSubDepartments
      ? new Set(collectDepartmentIds(selectedNode))
      : new Set([selectedNode.department.Id]);

    return employees
      .filter((emp) => ids.has(emp.DepartmentId))
      .sort((a, b) => {
        const nameA = getPersonName(a.UserFirstName, a.UserLastName, a.EmployeeCode);
        const nameB = getPersonName(b.UserFirstName, b.UserLastName, b.EmployeeCode);
        return nameA.localeCompare(nameB, 'fa');
      });
  }, [selectedNode, employees, includeSubDepartments]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setExpanded(new Set(flattenTree(tree).map((node) => node.department.Id)));
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  useEffect(() => {
    if (!search.trim()) return;
    const ids = flattenTree(filteredTree).map((node) => node.department.Id);
    setExpanded((prev) => new Set([...prev, ...ids]));
  }, [search, filteredTree]);

  const selectedDept = selectedNode?.department;

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="چارت سازمانی"
        description="نمای درختی دپارتمان‌ها با جزئیات و پرسنل هر واحد"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/departments" className="button" data-variant="outline">
              <Icon name="material-symbols:list" className="size-4" />
              لیست دپارتمان‌ها
            </Link>
            <Link to="/departments/new" className="button" data-variant="default">
              <Icon name="material-symbols:add" className="size-4" />
              دپارتمان جدید
            </Link>
          </div>
        }
      />

      {error && (
        <div className="text-destructive bg-destructive/10 mb-6 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard
          icon={<Icon name="material-symbols:corporate-fare" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="کل دپارتمان‌ها"
          value={loading ? '...' : stats.total.toLocaleString('fa-IR')}
        />
        <MetricCard
          icon={<Icon name="material-symbols:verified" className="size-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          label="فعال"
          value={loading ? '...' : stats.active.toLocaleString('fa-IR')}
        />
        <MetricCard
          icon={<Icon name="material-symbols:account-tree" className="size-5 text-violet-500" />}
          iconClassName="bg-violet-500/10"
          label="سطح ریشه"
          value={loading ? '...' : stats.roots.toLocaleString('fa-IR')}
        />
        <MetricCard
          icon={<Icon name="material-symbols:layers" className="size-5 text-sky-500" />}
          iconClassName="bg-sky-500/10"
          label="عمق سازمان"
          value={loading ? '...' : stats.maxDepth.toLocaleString('fa-IR')}
        />
        <MetricCard
          icon={<Icon name="material-symbols:groups" className="size-5 text-amber-500" />}
          iconClassName="bg-amber-500/10"
          label="کل پرسنل"
          value={loading ? '...' : stats.employees.toLocaleString('fa-IR')}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>ساختار درختی</CardTitle>
                <CardDescription>کلیک روی هر دپارتمان برای مشاهده جزئیات</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={expandAll}>
                  باز کردن همه
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  بستن همه
                </Button>
              </div>
            </div>
            <div className="relative">
              <Icon
                name="material-symbols:search"
                className="text-muted-foreground absolute end-3 top-1/2 size-4 -translate-y-1/2"
              />
              <Input
                className="pe-10"
                placeholder="جستجو در ساختار سازمانی..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground py-12 text-center text-sm">در حال بارگذاری ساختار...</p>
            ) : filteredTree.length === 0 ? (
              <p className="text-muted-foreground py-12 text-center text-sm">دپارتمانی یافت نشد</p>
            ) : (
              <div className="max-h-[calc(100vh-22rem)] space-y-1 overflow-y-auto pe-1">
                {filteredTree.map((node) => (
                  <TreeNodeRowWithCounts
                    key={node.department.Id}
                    node={node}
                    depth={0}
                    expanded={expanded}
                    selectedId={selectedNode?.department.Id ?? null}
                    countMaps={countMaps}
                    onToggle={toggleExpand}
                    onSelect={setSelectedNode}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 xl:col-span-7">
          {selectedDept ? (
            <>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-l from-primary/15 via-violet-500/10 to-transparent px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                        <Icon name="material-symbols:corporate-fare" className="size-7" />
                      </span>
                      <div>
                        <h2 className="text-xl font-bold">{selectedDept.Name}</h2>
                        <p className="text-muted-foreground mt-1 font-mono text-sm">{selectedDept.Code}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant={selectedDept.IsActive ? 'success' : 'secondary'}>
                            {selectedDept.IsActive ? 'فعال' : 'غیرفعال'}
                          </Badge>
                          {selectedDept.ParentDepartmentName && (
                            <Badge variant="info">والد: {selectedDept.ParentDepartmentName}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/departments/${encodeURIComponent(selectedDept.Id)}`}
                        className="button"
                        data-variant="outline"
                        data-size="sm"
                      >
                        <Icon name="material-symbols:edit" className="size-4" />
                        ویرایش
                      </Link>
                      <Link
                        to={`/departments/new?parentId=${encodeURIComponent(selectedDept.Id)}`}
                        className="button"
                        data-variant="outline"
                        data-size="sm"
                      >
                        <Icon name="material-symbols:add" className="size-4" />
                        زیردپارتمان
                      </Link>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  {selectedDept.Description && (
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{selectedDept.Description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-muted-foreground text-xs">پرسنل مستقیم</p>
                      <p className="text-lg font-bold">
                        {(countMaps.direct.get(selectedDept.Id) ?? 0).toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-muted-foreground text-xs">کل با زیرمجموعه</p>
                      <p className="text-lg font-bold">
                        {(countMaps.total.get(selectedDept.Id) ?? 0).toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-muted-foreground text-xs">زیردپارتمان</p>
                      <p className="text-lg font-bold">
                        {(selectedNode?.children.length ?? 0).toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-muted-foreground text-xs">تاریخ ایجاد</p>
                      <p className="text-lg font-bold">{formatDateFa(selectedDept.CreatedOnUtc)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="material-symbols:groups" className="size-5 text-sky-500" />
                        پرسنل دپارتمان
                      </CardTitle>
                      <CardDescription>
                        {selectedEmployees.length.toLocaleString('fa-IR')} نفر
                        {includeSubDepartments ? ' (شامل زیردپارتمان‌ها)' : ' (فقط این واحد)'}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={includeSubDepartments}
                          onChange={(e) => setIncludeSubDepartments(e.target.checked)}
                        />
                        شامل زیردپارتمان‌ها
                      </label>
                      <Link
                        to={`/employees/new?departmentId=${encodeURIComponent(selectedDept.Id)}`}
                        className="button"
                        data-variant="default"
                        data-size="sm"
                      >
                        <Icon name="material-symbols:person-add" className="size-4" />
                        افزودن پرسنل
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="table-wrapper">
                    <table className="table">
                      <thead className="table-header">
                        <tr>
                          <th className="table-head">پرسنل</th>
                          <th className="table-head">کد پرسنلی</th>
                          <th className="table-head">سمت</th>
                          <th className="table-head">دپارتمان</th>
                          <th className="table-head">وضعیت</th>
                          <th className="table-head w-20">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {selectedEmployees.length === 0 ? (
                          <tr className="table-row">
                            <td colSpan={6} className="table-cell text-muted-foreground py-8 text-center text-sm">
                              پرسنلی در این محدوده ثبت نشده
                            </td>
                          </tr>
                        ) : (
                          selectedEmployees.map((employee) => {
                            const personName = getPersonName(
                              employee.UserFirstName,
                              employee.UserLastName,
                              employee.EmployeeCode,
                            );
                            return (
                              <tr key={employee.Id} className="table-row">
                                <td className="table-cell">
                                  <div className="flex items-center gap-2">
                                    <Avatar initials={getInitials(personName)} size="sm" />
                                    <span className="font-medium">{personName}</span>
                                  </div>
                                </td>
                                <td className="table-cell font-mono text-sm">{employee.EmployeeCode}</td>
                                <td className="table-cell text-sm">{employee.JobTitle}</td>
                                <td className="table-cell text-sm">{employee.DepartmentName}</td>
                                <td className="table-cell">
                                  <Badge variant={employee.IsActive ? 'success' : 'secondary'}>
                                    {employee.IsActive ? 'فعال' : 'غیرفعال'}
                                  </Badge>
                                </td>
                                <td className="table-cell">
                                  <Link
                                    to={`/employees/${encodeURIComponent(employee.Id)}`}
                                    className="button"
                                    data-variant="ghost"
                                    data-size="icon-sm"
                                  >
                                    <Icon name="material-symbols:visibility" className="size-4" />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {selectedNode && selectedNode.children.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="material-symbols:account-tree" className="size-5 text-emerald-500" />
                      زیردپارتمان‌های مستقیم
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {selectedNode.children.map((child) => (
                        <button
                          key={child.department.Id}
                          type="button"
                          onClick={() => setSelectedNode(child)}
                          className="hover:bg-muted/40 flex items-center justify-between rounded-xl border p-3 text-start transition-colors"
                        >
                          <div>
                            <p className="font-medium">{child.department.Name}</p>
                            <p className="text-muted-foreground text-xs">{child.department.Code}</p>
                          </div>
                          <div className="text-end text-sm">
                            <p className="font-medium">
                              {(countMaps.direct.get(child.department.Id) ?? 0).toLocaleString('fa-IR')} نفر
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {child.children.length.toLocaleString('fa-IR')} زیرمجموعه
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-16 text-center text-sm">
                یک دپارتمان از درخت سمت راست انتخاب کنید
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
