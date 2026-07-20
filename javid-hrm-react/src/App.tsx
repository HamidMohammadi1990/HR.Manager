import { lazy, ReactNode, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, GuestRoute } from '@/components/auth/ProtectedRoute';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const EmployeesPage = lazy(() => import('@/features/employees/EmployeesPage'));
const AddEmployeePage = lazy(() => import('@/features/employees/AddEmployeePage'));
const EmployeeDetailPage = lazy(() => import('@/features/employees/EmployeeDetailPage'));
const DepartmentsPage = lazy(() => import('@/features/departments/DepartmentsPage'));
const AddDepartmentPage = lazy(() => import('@/features/departments/AddDepartmentPage'));
const DepartmentDetailPage = lazy(() => import('@/features/departments/DepartmentDetailPage'));
const AttendancePage = lazy(() => import('@/features/attendance/AttendancePage'));
const LeavesPage = lazy(() => import('@/features/leaves/LeavesPage'));
const PayrollPage = lazy(() => import('@/features/payroll/PayrollPage'));
const UsersPage = lazy(() => import('@/features/users/UsersPage'));
const AddUserPage = lazy(() => import('@/features/users/AddUserPage'));
const UserDetailPage = lazy(() => import('@/features/users/UserDetailPage'));
const RolesPage = lazy(() => import('@/features/users/RolesPage'));
const PermissionsPage = lazy(() => import('@/features/users/PermissionsPage'));
const CalendarPage = lazy(() => import('@/features/calendar/CalendarPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));
const AccountSettingsPage = lazy(() => import('@/features/settings/AccountSettingsPage'));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage'));
const NotificationsPage = lazy(() => import('@/features/notifications/NotificationsPage'));
const AnnouncementsPage = lazy(() => import('@/features/announcements/AnnouncementsPage'));
const TodoPage = lazy(() => import('@/features/todo/TodoPage'));
const BackupPage = lazy(() => import('@/features/backup/BackupPage'));
const WorkShiftsPage = lazy(() => import('@/features/work-shifts/WorkShiftsPage'));
const LeaveBalancesPage = lazy(() => import('@/features/leave-balances/LeaveBalancesPage'));
const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/ResetPasswordPage'));
const LoginOtpPage = lazy(() => import('@/features/auth/LoginOtpPage'));
const TwoFactorPage = lazy(() => import('@/features/auth/TwoFactorPage'));
const HelpSupportPage = lazy(() => import('@/features/help/HelpSupportPage'));
const MaintenancePage = lazy(() => import('@/features/auth/MaintenancePage'));

function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <div className="text-muted-foreground text-sm">در حال بارگذاری...</div>
    </div>
  );
}

function SuspensePage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SuspensePage><DashboardPage /></SuspensePage> },
      { path: 'calendar', element: <SuspensePage><CalendarPage /></SuspensePage> },
      { path: 'users', element: <SuspensePage><UsersPage /></SuspensePage> },
      { path: 'users/new', element: <SuspensePage><AddUserPage /></SuspensePage> },
      { path: 'users/:id', element: <SuspensePage><UserDetailPage /></SuspensePage> },
      { path: 'roles', element: <SuspensePage><RolesPage /></SuspensePage> },
      { path: 'permissions', element: <SuspensePage><PermissionsPage /></SuspensePage> },
      { path: 'employees', element: <SuspensePage><EmployeesPage /></SuspensePage> },
      { path: 'employees/new', element: <SuspensePage><AddEmployeePage /></SuspensePage> },
      { path: 'employees/:id', element: <SuspensePage><EmployeeDetailPage /></SuspensePage> },
      { path: 'departments', element: <SuspensePage><DepartmentsPage /></SuspensePage> },
      { path: 'departments/new', element: <SuspensePage><AddDepartmentPage /></SuspensePage> },
      { path: 'departments/:id', element: <SuspensePage><DepartmentDetailPage /></SuspensePage> },
      { path: 'attendance', element: <SuspensePage><AttendancePage /></SuspensePage> },
      { path: 'leaves', element: <SuspensePage><LeavesPage /></SuspensePage> },
      { path: 'payroll', element: <SuspensePage><PayrollPage /></SuspensePage> },
      { path: 'work-shifts', element: <SuspensePage><WorkShiftsPage /></SuspensePage> },
      { path: 'leave-balances', element: <SuspensePage><LeaveBalancesPage /></SuspensePage> },
      { path: 'settings', element: <SuspensePage><SettingsPage /></SuspensePage> },
      { path: 'account-settings', element: <SuspensePage><AccountSettingsPage /></SuspensePage> },
      { path: 'profile', element: <SuspensePage><ProfilePage /></SuspensePage> },
      { path: 'notifications', element: <SuspensePage><NotificationsPage /></SuspensePage> },
      { path: 'announcements', element: <SuspensePage><AnnouncementsPage /></SuspensePage> },
      { path: 'todo', element: <SuspensePage><TodoPage /></SuspensePage> },
      { path: 'backup', element: <SuspensePage><BackupPage /></SuspensePage> },
      { path: 'help', element: <SuspensePage><HelpSupportPage /></SuspensePage> },
    ],
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <SuspensePage><LoginPage /></SuspensePage>
      </GuestRoute>
    ),
  },
  { path: '/register', element: <SuspensePage><RegisterPage /></SuspensePage> },
  { path: '/forgot-password', element: <SuspensePage><ForgotPasswordPage /></SuspensePage> },
  { path: '/reset-password', element: <SuspensePage><ResetPasswordPage /></SuspensePage> },
  { path: '/login-otp', element: <SuspensePage><LoginOtpPage /></SuspensePage> },
  { path: '/two-factor', element: <SuspensePage><TwoFactorPage /></SuspensePage> },
  { path: '/maintenance', element: <SuspensePage><MaintenancePage /></SuspensePage> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
