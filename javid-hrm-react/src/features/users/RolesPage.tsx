import { FormEvent, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  createRole,
  deleteRole,
  getAllRoles,
  getApiErrorMessage,
  type RoleDto,
} from '@/services/api';

export default function RolesPage() {
  const addRoleDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadRoles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getAllRoles({
        Pagination: { PageNumber: 1, PageSize: 50 },
      });
      setRoles(result.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRoles();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;

    setFormError('');
    setIsSaving(true);
    try {
      await createRole(newRoleTitle.trim());
      setNewRoleTitle('');
      addRoleDialog.close();
      await loadRoles();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRole) return;
    try {
      await deleteRole(selectedRole.Id);
      deleteDialog.close();
      setSelectedRole(null);
      await loadRoles();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
      deleteDialog.close();
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">نقش‌ها</h1>
          <p className="text-muted-foreground">مدیریت نقش‌های سیستم HR</p>
        </div>
        <Button onClick={addRoleDialog.open}>
          <Icon name="material-symbols:add" className="size-5" />
          ایجاد نقش جدید
        </Button>
      </div>

      {error && (
        <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{error}</p>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">در حال بارگذاری نقش‌ها...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.Id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="material-symbols:shield-person-outline" className="text-primary size-5" />
                    {role.Title}
                  </CardTitle>
                  <Badge variant={role.IsActive ? 'success' : 'secondary'}>
                    {role.IsActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  تخصیص دسترسی‌ها از صفحه «دسترسی‌ها» و «نقش-دسترسی» انجام می‌شود.
                </p>
              </CardContent>
              <div className="card-footer flex justify-end gap-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setSelectedRole(role);
                    deleteDialog.open();
                  }}
                >
                  <Icon name="material-symbols:delete-outline" className="size-4" />
                  حذف
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addRoleDialog.isOpen} onClose={addRoleDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={addRoleDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <form onSubmit={handleCreate}>
          <div className="dialog-header">
            <h3 className="dialog-title">ایجاد نقش جدید</h3>
            <p className="dialog-description">عنوان نقش HR را وارد کنید</p>
          </div>
          <div className="px-6 py-4">
            {formError && (
              <p className="text-destructive bg-destructive/10 mb-3 rounded-lg px-3 py-2 text-sm">{formError}</p>
            )}
            <label className="mb-1.5 block text-sm font-medium">نام نقش</label>
            <Input
              className="w-full"
              placeholder="مثال: مدیر منابع انسانی"
              value={newRoleTitle}
              onChange={(e) => setNewRoleTitle(e.target.value)}
              required
            />
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={addRoleDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'در حال ایجاد...' : 'ایجاد نقش'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <h3 className="dialog-title">حذف نقش</h3>
          <p className="dialog-description">
            نقش «{selectedRole?.Title}» حذف شود؟
          </p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" onClick={() => void handleDelete()}>حذف</Button>
        </div>
      </Dialog>
    </div>
  );
}
