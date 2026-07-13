# PROJECT_PLAN — Javid HRM React

> سند برنامه‌ریزی پروژه تبدیل قالب HTML/JQuery به React  
> آخرین به‌روزرسانی: ۱۴۰۴/۰۴/۲۲ — ماژول‌های HR کامل + داشبورد و بخش‌ها از API

---

## ۱. هدف پروژه

تبدیل قالب مدیریت منابع انسانی **JavidHrm** (HTML + Vanilla JS) به یک اپلیکیشن **React + TypeScript** ماژولار، قابل توسعه و آماده اتصال به بک‌اند.

### اهداف فاز فعلی

**فاز ۱ — Frontend UI** ✅
- [x] ساختار حرفه‌ای پروژه (کامپوننت / هوک / استایل / داده جدا)
- [x] پیاده‌سازی تمام صفحات قالب HTML
- [x] RTL فارسی + تم روشن/تاریک + تم رنگی
- [x] مسیریابی (React Router)

**فاز ۲ — اتصال API** ✅ (هسته HR کامل)
- [x] `src/services/api/` — client, auth, JWT refresh
- [x] `AuthContext` + `ProtectedRoute` / `GuestRoute`
- [x] Vite proxy + `.env.development`
- [x] صفحات متصل: login, users, roles, permissions, departments, employees
- [x] UserRole در جزئیات کاربر
- [x] **Attendance** — CRUD کامل + check-in/out + آمار + نمودار
- [x] **Leaves** — CRUD کامل + approve/reject + فیلتر + pending/history
- [x] **Payroll** — CRUD کامل + approve/mark-paid + ماشین‌حساب
- [x] **Dashboard** — آمار و نمودار از API (بدون mock)
- [x] **Departments** — لیست + آمار پرسنل (بدون mock)
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
    │   └── navigation.ts    ← منو و quick access (mock/ حذف از features)
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
| داشبورد | `/` | `features/dashboard/DashboardPage.tsx` | ✅ API (aggregate) |
| تقویم | `/calendar` | `features/calendar/CalendarPage.tsx` | 🟡 UI فقط — بدون API |
| کاربران | `/users` | `features/users/UsersPage.tsx` | ✅ API |
| کاربر جدید | `/users/new` | `features/users/AddUserPage.tsx` | ✅ API |
| جزئیات کاربر | `/users/:id` | `features/users/UserDetailPage.tsx` | ✅ API + نقش‌ها |
| نقش‌ها | `/roles` | `features/users/RolesPage.tsx` | ✅ API |
| دسترسی‌ها | `/permissions` | `features/users/PermissionsPage.tsx` | ✅ API |
| کارمندان | `/employees` | `features/employees/EmployeesPage.tsx` | ✅ API |
| استخدام جدید | `/employees/new` | `features/employees/AddEmployeePage.tsx` | ✅ API |
| جزئیات پرسنل | `/employees/:id` | `features/employees/EmployeeDetailPage.tsx` | ✅ API |
| بخش‌ها | `/departments` | `features/departments/DepartmentsPage.tsx` | ✅ API |
| بخش جدید | `/departments/new` | `features/departments/AddDepartmentPage.tsx` | ✅ API |
| جزئیات بخش | `/departments/:id` | `features/departments/DepartmentDetailPage.tsx` | ✅ API |
| حضور و غیاب | `/attendance` | `features/attendance/AttendancePage.tsx` | ✅ API |
| مرخصی‌ها | `/leaves` | `features/leaves/LeavesPage.tsx` | ✅ API |
| حقوق و دستمزد | `/payroll` | `features/payroll/PayrollPage.tsx` | ✅ API |
| تنظیمات | `/settings` | `features/settings/SettingsPage.tsx` | 🟡 UI — بدون API اختصاصی HR |
| تنظیمات حساب | `/account-settings` | `features/settings/AccountSettingsPage.tsx` | 🟡 UI |
| پروفایل | `/profile` | `features/profile/ProfilePage.tsx` | 🟡 UI |
| اعلان‌ها | `/notifications` | `features/notifications/NotificationsPage.tsx` | 🟡 UI — بدون API |
| اطلاعیه‌ها | `/announcements` | `features/announcements/AnnouncementsPage.tsx` | 🟡 UI — بدون API |
| لیست کارها | `/todo` | `features/todo/TodoPage.tsx` | 🟡 UI — بدون API |
| پشتیبان‌گیری | `/backup` | `features/backup/BackupPage.tsx` | 🟡 UI — بدون API |

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

## ۶. ماژول‌های HR — وضعیت فعلی

### داشبورد (`/`) — ✅ API
- کارت‌های آماری: کارکنان، حضور امروز، مرخصی فعال، حقوق ماه
- نمودار روند حضور و حقوق (۶ ماه اخیر)
- توزیع بخش‌ها از پرسنل
- جدول و فید فعالیت‌های اخیر (مرخصی + حضور + حقوق)
- اقدامات سریع با لینک واقعی

### پرسنل (`/employees`) — ✅ API
- لیست با صفحه‌بندی و جستجو
- ایجاد / ویرایش / حذف پرسنل

### بخش‌ها (`/departments`) — ✅ API
- CRUD کامل + جستجو
- آمار پرسنل هر بخش + توزیع نیروی انسانی

### حضور (`/attendance`) — ✅ API
- CRUD + فیلتر وضعیت/تاریخ
- ثبت سریع ورود/خروج (`check-in` / `check-out`)
- خلاصه امروز، آخرین ترددها، نمودار هفتگی، گزارش ماهانه

### مرخصی (`/leaves`) — ✅ API
- CRUD + فیلتر
- تأیید/رد (`approve` / `reject`)
- pending، آینده، تاریخچه، آمار بر اساس نوع

### حقوق (`/payroll`) — ✅ API
- CRUD + فیلتر سال/ماه/وضعیت
- workflow: پیش‌نویس → تأیید → پرداخت
- ماشین‌حساب حقوق، فیش‌های اخیر، تحلیل توزیع

### کاربران / نقش‌ها / دسترسی‌ها — ✅ API
- لیست، ایجاد، ویرایش، حذف کاربر
- مدیریت نقش و permission
- تخصیص نقش در جزئیات کاربر

---

## ۶.۱ صفحات بدون API بک‌اند (فقط UI قالب)

| صفحه | وضعیت | نیاز |
|------|--------|------|
| `/calendar` | UI استاتیک | API رویداد/تقویم |
| `/notifications` | UI استاتیک | API اعلان |
| `/announcements` | UI استاتیک | API اطلاعیه |
| `/todo` | UI استاتیک | API وظایف |
| `/backup` | UI استاتیک | API پشتیبان |
| `/profile` | UI استاتیک | اتصال `account/user-info` |
| `/settings` | UI استاتیک | اتصال `website-setting` |

---

## ۷. فازهای بعدی (برنامه‌ریزی)

### فاز ۲.۵ — تکمیل ابزارها (باقی‌مانده)
- [ ] API + فرانت: notifications, announcements, calendar, todo, backup
- [ ] اتصال profile/settings به API موجود account
- [ ] React Query برای cache و invalidation
- [ ] Toast notifications یکپارچه
- [ ] تست E2E (Playwright)

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
# Auth & Users
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

# HR Core
POST   /api/v1/admin/department/get-all | get | create
PUT    /api/v1/admin/department/update
DELETE /api/v1/admin/department/delete
POST   /api/v1/admin/employee/get-all | get | create
PUT    /api/v1/admin/employee/update
DELETE /api/v1/admin/employee/delete

# Attendance
POST   /api/v1/admin/attendance-record/get-all | get | create
PUT    /api/v1/admin/attendance-record/update
PUT    /api/v1/admin/attendance-record/check-in
PUT    /api/v1/admin/attendance-record/check-out
DELETE /api/v1/admin/attendance-record/delete

# Leave
POST   /api/v1/admin/leave-request/get-all | get | create
PUT    /api/v1/admin/leave-request/update
PUT    /api/v1/admin/leave-request/approve
PUT    /api/v1/admin/leave-request/reject
DELETE /api/v1/admin/leave-request/delete

# Payroll
POST   /api/v1/admin/payroll-entry/get-all | get | create
PUT    /api/v1/admin/payroll-entry/update
PUT    /api/v1/admin/payroll-entry/approve
PUT    /api/v1/admin/payroll-entry/mark-paid
DELETE /api/v1/admin/payroll-entry/delete

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

## ۱۰. گزارش تکمیل

| بخش | وضعیت |
|-----|--------|
| صفحات HTML → React | ✅ ۲۷+ صفحه |
| Layout + UI components | ✅ |
| Auth + Users + RBAC | ✅ API |
| Employee + Department | ✅ API |
| Attendance + Leave + Payroll | ✅ API کامل |
| Dashboard | ✅ API aggregate |
| Mock در features/ | ✅ حذف شده (صفحات HR) |
| Calendar/Todo/Notifications/... | 🟡 UI بدون API |
| React Query / E2E | ❌ فاز بعد |

---

## ۱۱. نکات فنی

1. **Attribute-based styling**: دکمه‌ها و badgeها از attributeهای `variant` و `size` مطابق CSS قالب اصلی استفاده می‌کنند.
2. **Lazy loading**: صفحات با `React.lazy` بارگذاری می‌شوند.
3. **داده HR**: همه صفحات اصلی HR از `src/services/api/` داده می‌گیرند؛ پوشه `src/data/mock/` دیگر در features import نمی‌شود.
4. **داشبورد**: نمودارها و آمار از aggregate چند API (employees, attendance, leaves, payroll, departments).
5. **ID رمزنگاری‌شده**: همه شناسه‌ها در JSON به صورت string ارسال/دریافت می‌شوند.

---

*این سند در طول توسعه پروژه به‌روزرسانی خواهد شد.*
