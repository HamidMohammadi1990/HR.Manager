# PROJECT_PLAN — Javid HRM React

> سند برنامه‌ریزی پروژه تبدیل قالب HTML/JQuery به React  
> آخرین به‌روزرسانی: ۱۴۰۴/۰۴/۲۱ — اتصال API فاز ۲ + ماژول‌های HR

---

## ۱. هدف پروژه

تبدیل قالب مدیریت منابع انسانی **JavidHrm** (HTML + Vanilla JS) به یک اپلیکیشن **React + TypeScript** ماژولار، قابل توسعه و آماده اتصال به بک‌اند.

### اهداف فاز فعلی

**فاز ۱ — Frontend UI** ✅
- [x] ساختار حرفه‌ای پروژه (کامپوننت / هوک / استایل / داده جدا)
- [x] پیاده‌سازی تمام صفحات قالب HTML
- [x] RTL فارسی + تم روشن/تاریک + تم رنگی
- [x] مسیریابی (React Router)

**فاز ۲ — اتصال API** ✅ (هسته HR)
- [x] `src/services/api/` — client, auth, JWT refresh
- [x] `AuthContext` + `ProtectedRoute` / `GuestRoute`
- [x] Vite proxy + `.env.development`
- [x] صفحات متصل: login, users, roles, permissions, departments, employees
- [x] UserRole در جزئیات کاربر
- [x] جدول API: attendance, leaves, payroll
- [ ] React Query / SWR (اختیاری — فعلاً fetch مستقیم)
- [ ] تست E2E (فاز بعد)

---

## ۲. ساختار پروژه

```
javid-hrm-react/
├── PROJECT_PLAN.md          ← این فایل
├── package.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx              ← Router
    ├── styles/
    │   └── index.css        ← import از JavidHrm/assets/styles
    ├── components/
    │   ├── ui/              ← Button, Card, Badge, Input, Icon, ...
    │   └── layout/          ← Sidebar, Header, Footer, Dialog, AppLayout
    ├── hooks/               ← useTheme, useSidebar, useDialog, useClock, ...
    ├── features/            ← صفحات به تفکیک ماژول
    │   ├── auth/
    │   ├── dashboard/
    │   ├── employees/
    │   ├── departments/
    │   ├── attendance/
    │   ├── leaves/
    │   ├── payroll/
    │   ├── users/
    │   ├── calendar/
    │   ├── settings/
    │   ├── profile/
    │   ├── notifications/
    │   ├── announcements/
    │   ├── todo/
    │   └── backup/
    ├── services/
    │   └── api/             ← client, auth, users, employees, departments, ...
    ├── data/
    │   ├── navigation.ts
    │   └── mock/            ← ویجت‌های تحلیلی (برخی صفحات هنوز mock دارند)
    └── lib/
        ├── utils.ts
        └── hrLabels.ts      ← برچسب enumهای HR
```

---

## ۳. فهرست صفحات و وضعیت پیاده‌سازی

### ۳.۱ احراز هویت (بدون Layout اصلی)

| صفحه | مسیر | فایل React | وضعیت |
|------|------|------------|-------|
| ورود | `/login` | `features/auth/LoginPage.tsx` | ✅ API |
| ثبت‌نام | `/register` | `features/auth/RegisterPage.tsx` | ✅ |
| فراموشی رمز | `/forgot-password` | `features/auth/ForgotPasswordPage.tsx` | ✅ |
| بازنشانی رمز | `/reset-password` | `features/auth/ResetPasswordPage.tsx` | ✅ |
| ورود OTP | `/login-otp` | `features/auth/LoginOtpPage.tsx` | ✅ |
| تأیید دو مرحله‌ای | `/two-factor` | `features/auth/TwoFactorPage.tsx` | ✅ |
| تعمیر و نگهداری | `/maintenance` | `features/auth/MaintenancePage.tsx` | ✅ |

### ۳.۲ پنل مدیریت (با AppLayout)

| صفحه | مسیر | فایل React | وضعیت |
|------|------|------------|-------|
| داشبورد | `/` | `features/dashboard/DashboardPage.tsx` | ✅ (HR-focused) |
| تقویم | `/calendar` | `features/calendar/CalendarPage.tsx` | ✅ |
| کاربران | `/users` | `features/users/UsersPage.tsx` | ✅ API |
| کاربر جدید | `/users/new` | `features/users/AddUserPage.tsx` | ✅ API |
| جزئیات کاربر | `/users/:id` | `features/users/UserDetailPage.tsx` | ✅ API + نقش‌ها |
| نقش‌ها | `/roles` | `features/users/RolesPage.tsx` | ✅ API |
| دسترسی‌ها | `/permissions` | `features/users/PermissionsPage.tsx` | ✅ API |
| کارمندان | `/employees` | `features/employees/EmployeesPage.tsx` | ✅ API |
| استخدام جدید | `/employees/new` | `features/employees/AddEmployeePage.tsx` | ✅ API |
| جزئیات پرسنل | `/employees/:id` | `features/employees/EmployeeDetailPage.tsx` | ✅ API |
| بخش‌ها | `/departments` | `features/departments/DepartmentsPage.tsx` | ✅ API + mock تحلیلی |
| بخش جدید | `/departments/new` | `features/departments/AddDepartmentPage.tsx` | ✅ API |
| جزئیات بخش | `/departments/:id` | `features/departments/DepartmentDetailPage.tsx` | ✅ API |
| حضور و غیاب | `/attendance` | `features/attendance/AttendancePage.tsx` | 🟡 جدول API + mock |
| مرخصی‌ها | `/leaves` | `features/leaves/LeavesPage.tsx` | 🟡 جدول API + mock |
| حقوق و دستمزد | `/payroll` | `features/payroll/PayrollPage.tsx` | 🟡 جدول API + mock |
| تنظیمات | `/settings` | `features/settings/SettingsPage.tsx` | ✅ |
| تنظیمات حساب | `/account-settings` | `features/settings/AccountSettingsPage.tsx` | ✅ |
| پروفایل | `/profile` | `features/profile/ProfilePage.tsx` | ✅ |
| اعلان‌ها | `/notifications` | `features/notifications/NotificationsPage.tsx` | ✅ |
| اطلاعیه‌ها | `/announcements` | `features/announcements/AnnouncementsPage.tsx` | ✅ |
| لیست کارها | `/todo` | `features/todo/TodoPage.tsx` | ✅ |
| پشتیبان‌گیری | `/backup` | `features/backup/BackupPage.tsx` | ✅ |

---

## ۴. کامپوننت‌های مشترک

| کامپوننت | مسیر | توضیح |
|----------|------|-------|
| `AppLayout` | `components/layout/AppLayout.tsx` | قالب اصلی با Sidebar + Header |
| `Sidebar` | `components/layout/Sidebar.tsx` | منوی کناری + آکاردئون |
| `AppHeader` | `components/layout/AppHeader.tsx` | هدر + منوی کاربر + اعلان‌ها |
| `QuickAccessDialog` | `components/layout/Dialog.tsx` | Command Palette (Ctrl+K) |
| `Button`, `Input`, `Card`, `Badge` | `components/ui/` | المان‌های UI |
| `Icon` | `components/ui/Icon.tsx` | Iconify wrapper |
| `AuthLayout` | `features/auth/AuthLayout.tsx` | قالب صفحات ورود |
| `OtpInput` | `features/auth/components/OtpInput.tsx` | ورودی OTP |

---

## ۵. هوک‌ها

| هوک | فایل | کاربرد |
|-----|------|--------|
| `useTheme` | `hooks/useTheme.ts` | تم روشن/تاریک/سیستم + تم رنگی |
| `useSidebar` | `hooks/useTheme.ts` | باز/بسته نوار کناری |
| `useDialog` / `useDrawer` | `hooks/useDisclosure.ts` | مودال و دراور |
| `useDropdown` | `hooks/useDisclosure.ts` | منوهای کشویی |
| `useAccordion` | `hooks/useDisclosure.ts` | آکاردئون سایدبار |
| `useClock` | `hooks/useClock.ts` | ساعت دیجیتال حضور و غیاب |
| `useCountdown` | `hooks/useClock.ts` | تایمر OTP |
| `useKeyboardShortcut` | `hooks/useKeyboardShortcut.ts` | Ctrl+K و ... |
| `useOtpInput` | `features/auth/hooks/useOtpInput.ts` | مدیریت OTP |

---

## ۶. ماژول‌های HR — قابلیت‌های پیاده‌سازی‌شده

### پرسنل (`/employees`) — ✅ API
- لیست با صفحه‌بندی و جستجو
- ایجاد پرسنل (اتصال User → Employee)
- ویرایش/حذف پروفایل پرسنلی

### بخش‌ها (`/departments`) — ✅ API + mock
- CRUD کامل بخش
- ویجت‌های تحلیلی پایین صفحه هنوز mock

### حضور (`/attendance`) — 🟡
- جدول `attendance-record/get-all` در بالای صفحه
- ساعت دیجیتال و ویجت‌های mock در پایین

### مرخصی (`/leaves`) — 🟡
- جدول `leave-request/get-all`
- فرم درخواست هنوز mock

### حقوق (`/payroll`) — 🟡
- جدول `payroll-entry/get-all`
- ماشین‌حساب و ویجت‌ها هنوز mock

---

## ۷. فازهای بعدی (برنامه‌ریزی)

### فاز ۲.۵ — تکمیل HR UI
- [ ] فرم create/edit برای attendance, leaves, payroll
- [ ] حذف یا جایگزینی mock analytics در صفحات HR
- [ ] React Query برای cache و invalidation
- [ ] Toast notifications یکپارچه

### فاز ۳ — ابزارها و توسعه
- [ ] ماژول گزارش‌گیری پیشرفته (Export Excel/PDF)
- [ ] داشبورد تحلیلی real-time
- [ ] اعلان‌های Push
- [ ] چندزبانه (i18n) در صورت نیاز
- [ ] تست واحد (Vitest) + E2E (Playwright)
- [ ] CI/CD pipeline
- [ ] PWA برای موبایل

### فاز ۴ — یکپارچه‌سازی
- [ ] اتصال دستگاه حضور و غیاب (Biometric API)
- [ ] یکپارچه‌سازی با سیستم مالی
- [ ] Workflow تأیید چندمرحله‌ای مرخصی
- [ ] نقشه تقویم شمسی کامل (jalaali-js)

---

## ۸. API Endpoints متصل (JavidHrm بک‌اند)

```
POST   /api/v1/account/sign-in
POST   /api/v1/account/refresh-token
POST   /api/v1/admin/account/get-all | get | create
PUT    /api/v1/admin/account/update
DELETE /api/v1/admin/account/delete
POST   /api/v1/admin/role/get-all | create
DELETE /api/v1/admin/role/delete
POST   /api/v1/admin/permission/get-all
POST   /api/v1/admin/user-role/get-all | create
DELETE /api/v1/admin/user-role/delete
POST   /api/v1/admin/department/get-all | get | create
PUT    /api/v1/admin/department/update
DELETE /api/v1/admin/department/delete
POST   /api/v1/admin/employee/get-all | get | create
PUT    /api/v1/admin/employee/update
DELETE /api/v1/admin/employee/delete
POST   /api/v1/admin/attendance-record/get-all | create | ...
POST   /api/v1/admin/leave-request/get-all | create | ...
POST   /api/v1/admin/payroll-entry/get-all | create | ...
POST   /api/v1/admin/city/search
```

> IDها در JSON رمزنگاری‌شده (string) هستند.

---

## ۹. نحوه اجرا

```bash
cd javid-hrm-react
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

### وابستگی‌های اصلی
- React 19 + TypeScript
- Vite 6
- React Router 7
- Chart.js + react-chartjs-2
- @iconify/react
- clsx

### استایل
استایل‌های اصلی از `../JavidHrm/assets/styles/app.css` و `themes.css` import می‌شوند تا ظاهر ۱۰۰٪ مطابق قالب HTML باشد.

---

## ۱۰. گزارش تکمیل فاز ۱

| بخش | تعداد | وضعیت |
|-----|-------|-------|
| صفحات HTML اصلی | ۲۷ | ✅ تبدیل شده |
| Layout components | ۶ | ✅ |
| UI components | ۸+ | ✅ |
| Custom hooks | ۸+ | ✅ |
| Mock data modules | ۶+ | ✅ |
| Routes | ۲۷+ | ✅ |
| RTL + Theme | — | ✅ |
| Charts | ۳ نوع | ✅ |

---

## ۱۱. نکات فنی

1. **Attribute-based styling**: دکمه‌ها و badgeها از attributeهای `variant` و `size` مطابق CSS قالب اصلی استفاده می‌کنند.
2. **Lazy loading**: صفحات با `React.lazy` بارگذاری می‌شوند.
3. **Mock data**: ویجت‌های تحلیلی در `src/data/mock/` — جداول اصلی HR از API می‌آیند.
4. **داشبورد**: محتوای e-commerce قالب اصلی به زمینه HR تطبیق داده شده است.

---

*این سند در طول توسعه پروژه به‌روزرسانی خواهد شد.*
