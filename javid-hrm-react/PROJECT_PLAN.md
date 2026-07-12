# PROJECT_PLAN — Javid HRM React

> سند برنامه‌ریزی پروژه تبدیل قالب HTML/JQuery به React  
> آخرین به‌روزرسانی: ۱۴۰۴/۰۴/۲۰

---

## ۱. هدف پروژه

تبدیل قالب مدیریت منابع انسانی **JavidHrm** (HTML + Vanilla JS) به یک اپلیکیشن **React + TypeScript** ماژولار، قابل توسعه و آماده اتصال به بک‌اند.

### اهداف فاز فعلی (فاز ۱ — Frontend)
- [x] ساختار حرفه‌ای پروژه (کامپوننت / هوک / استایل / داده جدا)
- [x] پیاده‌سازی تمام صفحات قالب HTML
- [x] RTL فارسی + تم روشن/تاریک + تم رنگی
- [x] داده Mock برای نمایش UI
- [x] مسیریابی (React Router)
- [ ] تست E2E (فاز بعد)
- [ ] اتصال API (فاز ۲)

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
    ├── data/
    │   ├── navigation.ts
    │   └── mock/            ← داده‌های نمونه (جایگزین API)
    └── lib/
        └── utils.ts
```

---

## ۳. فهرست صفحات و وضعیت پیاده‌سازی

### ۳.۱ احراز هویت (بدون Layout اصلی)

| صفحه | مسیر | فایل React | وضعیت |
|------|------|------------|-------|
| ورود | `/login` | `features/auth/LoginPage.tsx` | ✅ |
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
| کاربران | `/users` | `features/users/UsersPage.tsx` | ✅ |
| کاربر جدید | `/users/new` | `features/users/AddUserPage.tsx` | ✅ |
| جزئیات کاربر | `/users/:id` | `features/users/UserDetailPage.tsx` | ✅ |
| نقش‌ها | `/roles` | `features/users/RolesPage.tsx` | ✅ |
| دسترسی‌ها | `/permissions` | `features/users/PermissionsPage.tsx` | ✅ |
| کارمندان | `/employees` | `features/employees/EmployeesPage.tsx` | ✅ |
| بخش‌ها | `/departments` | `features/departments/DepartmentsPage.tsx` | ✅ |
| حضور و غیاب | `/attendance` | `features/attendance/AttendancePage.tsx` | ✅ |
| مرخصی‌ها | `/leaves` | `features/leaves/LeavesPage.tsx` | ✅ |
| حقوق و دستمزد | `/payroll` | `features/payroll/PayrollPage.tsx` | ✅ |
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

### حضور و غیاب (`/attendance`)
- آمار روزانه (حاضرین، غایبین، دیرکرد، اضافه‌کاری)
- ساعت دیجیتال + دکمه ورود/خروج
- تردد زنده (Live Feed)
- نمودار هفتگی
- درخواست‌های مرخصی جانبی
- خلاصه اضافه‌کاری ماه
- سیاست‌های حضور
- گزارش ماهانه

### مرخصی (`/leaves`)
- فرم درخواست مرخصی (انواع: استحقاقی، ساعتی، بیماری، ...)
- موجودی مرخصی با Progress Bar
- تأیید/رد درخواست‌های معلق
- تقویم مرخصی
- تاریخچه با جدول
- آمار استفاده از مرخصی

### حقوق و دستمزد (`/payroll`)
- ماشین‌حساب حقوق (پایه، اضافه‌کاری، پاداش، بیمه)
- ساختار حقوقی (رتبه الف/ب/ج)
- فیش حقوقی
- تحلیل هزینه‌ها
- مالیات و بیمه
- مزایا
- انطباق قانونی

### پرسنل (`/employees`)
- دایرکتوری کارکنان
- واحدهای سازمانی
- عملکرد و آموزش
- خط لوله استخدام
- چرخه زندگی کارکنان

### بخش‌ها (`/departments`)
- نمودار سازمانی
- تخصیص منابع و بودجه
- اهداف بخشی
- پروژه‌های بین‌بخشی

---

## ۷. فازهای بعدی (برنامه‌ریزی)

### فاز ۲ — اتصال بک‌اند
- [ ] تعریف `src/services/api/` با Axios/Fetch
- [ ] تعریف TypeScript types از API contract
- [ ] جایگزینی `data/mock/` با React Query / SWR
- [ ] احراز هویت JWT + Refresh Token
- [ ] Route guards (ProtectedRoute)
- [ ] مدیریت خطا و Toast notifications
- [ ] آپلود فایل (مدارک پرسنلی، فیش حقوقی PDF)

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

## ۸. API Endpoints پیش‌بینی‌شده (برای بک‌اند)

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/otp/verify
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/employees
GET    /api/departments
GET    /api/attendance
POST   /api/attendance/check-in
POST   /api/attendance/check-out
GET    /api/leaves
POST   /api/leaves
PUT    /api/leaves/:id/approve
PUT    /api/leaves/:id/reject
GET    /api/payroll
POST   /api/payroll/calculate
GET    /api/payroll/payslips/:id
GET    /api/notifications
GET    /api/roles
GET    /api/permissions
```

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
3. **Mock data**: تمام داده‌ها در `src/data/mock/` قرار دارند و در فاز ۲ با API جایگزین می‌شوند.
4. **داشبورد**: محتوای e-commerce قالب اصلی به زمینه HR تطبیق داده شده است.

---

*این سند در طول توسعه پروژه به‌روزرسانی خواهد شد.*
