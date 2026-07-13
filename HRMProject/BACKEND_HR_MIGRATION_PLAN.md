# BACKEND_HR_MIGRATION_PLAN — EditionProject → سیستم HR

> سند برنامه‌ریزی تبدیل بک‌اند Edition (چاپ/فروشگاه) به پلتفرم منابع انسانی  
> مرتبط با فرانت‌اند: `../javid-hrm-react/PROJECT_PLAN.md`  
> تاریخ بررسی اولیه: ۱۴۰۴/۰۴/۲۰  
> **آخرین به‌روزرسانی:** ۱۴۰۴/۰۴/۲۲ — ماژول‌های HR کامل (Employee, Department, Attendance, Leave, Payroll) + اعتبارسنجی و workflow

---

## ۱. خلاصه اجرایی

**EditionProject** یک بک‌اند .NET با معماری **Clean Architecture** است که برای پلتفرم چاپ و فروشگاه آنلاین (Edition) ساخته شده. حدود **۵۵٪** کد مربوط به e-commerce/چاپ است و باید حذف شود. حدود **۳۰٪** زیرساخت احراز هویت، نقش، دسترسی و persistence **بدون تغییر اساسی** قابل استفاده است. **۱۵٪** قابل **تطبیق** با دامنه HR (شرکت→بخش، آدرس→آدرس کارمند، ...).

### تکنولوژی‌های موجود (نگه‌داری کل معماری)

| لایه | پروژه | تکنولوژی |
|------|--------|----------|
| Domain | `Edition.Domain` | Entities, Enums, Content Policy |
| Application | `Edition.Application` | MediatR (CQRS), FluentValidation |
| Infrastructure | `Edition.Infrastructure` | JWT, SMS, Email, Redis, Serilog |
| Persistence | `Edition.Infrastructure.Persistence` | EF Core, SQL Server, Migrations |
| API | `Edition.Api` | ASP.NET Core, API v1 |
| WebFramework | `Edition.WebFramework` | BaseController, ApiResult, Swagger |
| Common | `Edition.Common` | PasswordHasher, Localization fa-IR |

### جریان درخواست

```
Controller → MediatR (ISender) → Handler → Repository → EditionDbContext → SQL Server
```

### مسیر API

- عمومی: `api/v1/{controller}`
- ادمین (نیاز به `[Authorize]`): `api/v1/admin/{controller}`

---

## ۲. ارزیابی وضعیت فعلی

### آمار کلی

| مورد | تعداد تقریبی |
|------|-------------|
| Entity | ۷۵+ |
| Controller | ۸۶ (public + admin) |
| Feature folder (Application) | ۵۶ |
| Repository | ۶۱ |
| PermissionType enum | ~۱۰۰۰ خط / ۴۰۰+ مقدار |
| Seed JSON (محصولات چاپ) | ۸۰۰+ فایل |

### نقاط قوت برای HR

- احراز هویت کامل: JWT + Refresh Token + Session + OTP موبایل/ایمیل
- RBAC سلسله‌مراتبی با کشف خودکار Permission از Controller
- Content Policy (دسترسی سطح ردیف — مثلاً مدیر فقط تیم خودش)
- الگوی Repository + UnitOfWork + Migration
- تست معماری (ArchTests) + تست یکپارچگی با Testcontainers
- بومی‌سازی فارسی (fa-IR)
- Redis برای blocklist توکن و cache

### شکاف‌های اصلی

| ماژول | وضعیت |
|--------|--------|
| Employee / پرسنل | ✅ CRUD کامل — `api/v1/admin/employee/*` |
| Department | ✅ CRUD کامل — `Company` → `Department` |
| Attendance | ✅ CRUD + `check-in` / `check-out` + فیلتر بازه تاریخ + اعتبارسنجی |
| Leave | ✅ CRUD + `approve` / `reject` + اعتبارسنجی تداخل تاریخ |
| Payroll | ✅ CRUD + `approve` / `mark-paid` + اعتبارسنجی مبالغ + محافظت فیش پرداخت‌شده |
| UserRole | ✅ تخصیص نقش در API + فرانت |
| Dashboard آمار | ✅ (فرانت از APIهای موجود aggregate می‌کند) |
| Notification inbox | ❌ (فقط SMS/Email برای OTP) |
| Announcement / Todo / Calendar API | ❌ |
| Workflow تأیید چندمرحله‌ای | ❌ (تأیید تک‌مرحله‌ای در Leave/Payroll موجود است) |
| WorkShift / LeaveBalance / Payslip PDF | ❌ فاز بعد |
| EF Migration روی DB محلی | ⚠️ باید توسط توسعه‌دهنده اجرا شود |

---

## ۳. ✅ نگه‌داری — زیرساخت و هویت (بدون حذف)

### ۳.۱ Entities

| Entity | فایل | کاربرد در HR |
|--------|------|-------------|
| `User` | `Entities/User.cs` | حساب کاربری — **پاکسازی navigation به Order/Wallet/Blog** |
| `Role` | `Entities/Role.cs` | نقش (مدیر HR، کارمند، ...) |
| `Permission` | `Entities/Permission.cs` | درخت دسترسی منو/API |
| `RolePermission` | `Entities/RolePermission.cs` | نقش ↔ دسترسی |
| `UserRole` | `Entities/UserRole.cs` | کاربر ↔ نقش |
| `RefreshToken` | `Entities/RefreshToken.cs` | توکن تازه‌سازی |
| `UserSession` | `Entities/UserSession.cs` | نشست‌های فعال / محدودیت دستگاه |

### ۳.۲ سرویس‌های Auth

| سرویس | مسیر تقریبی |
|--------|------------|
| `AccountingService` | JWT صدور/اعتبارسنجی، OTP |
| `UserAuthCache` | کش SecurityStamp |
| `UserSessionService` | مدیریت session |
| `AuthContextValidator` | اعتبارسنجی هر درخواست |
| `HttpCurrentUserContext` | Claims کاربر جاری |
| `PasswordHasher` | `Edition.Common` |

### ۳.۳ Middleware & Pipeline

| مورد | فایل |
|------|------|
| `BlockTokenControlMiddleware` | `Edition.Api/Middlewares/` |
| `CustomExceptionHandler` | Global error handling |
| JWT Bearer + `OnTokenValidated` | Extensions |

### ۳.۴ API — Account (احراز هویت) ✅

**`api/v1/account`** — همه برای فرانت React لازم است:

| متد | Route | استفاده در فرانت |
|-----|-------|------------------|
| POST | `sign-in` | `/login` |
| POST | `sign-in-by-phone-number` | `/login-otp` |
| POST | `get-phone-number-token` | ارسال OTP |
| POST | `get-email-token` | OTP ایمیل |
| POST | `refresh-token` | تازه‌سازی JWT |
| GET | `sign-out` | خروج |
| GET | `active-sessions` | امنیت حساب |
| DELETE | `session` / `other-sessions` | مدیریت نشست |
| POST | `register` | `/register` |
| POST | `user-info` | پروفایل جاری |
| POST | `forget-password` / `change-password*` | بازیابی رمز |
| POST | `change-email` / `change-phone-number` | تنظیمات حساب |

**`api/v1/admin/account`**

| متد | Route | استفاده در فرانت |
|-----|-------|------------------|
| POST | `get-all` | `/users` |
| POST | `get` | `/users/:id` |
| POST | `create` | `/users/new` |
| PUT | `update` | `/users/:id` |
| DELETE | `delete` | `/users/:id` |

### ۳.۵ API — RBAC ✅

| Controller Admin | Feature Application |
|------------------|---------------------|
| `RoleController` | `Features/Roles` |
| `PermissionController` | `Features/Permissions` |
| `RolePermissionController` | `Features/RolePermissions` |
| `UserRoleController` | `Features/UserRoles` |

### ۳.۶ Application Features — نگه‌داری

```
Features/Users/
Features/UserSessions/
Features/RefreshTokens/
Features/Roles/
Features/Permissions/
Features/RolePermissions/
Features/UserRoles/
```

### ۳.۷ Cross-Cutting — نگه‌داری کامل

- `Edition.Common` — PasswordHasher, OperationResult, ErrorModel, Extensions
- `Edition.WebFramework` — ApiResult, Swagger, BaseApiController
- `Edition.Arch.Tests` — قوانین وابستگی لایه‌ها
- الگوی FluentValidation + Pagination validators
- `IDistributedCache` + Redis
- Localization fa-IR / en-US

---

## ۴. 🔄 تطبیق — بازاستفاده با تغییر دامنه

### ۴.۱ Entity Mapping

| Entity فعلی | نقش فعلی | هدف HR | اقدام |
|-------------|----------|--------|-------|
| `Company` | واحد تجاری کاربر | **Department / Branch** | حذف وابستگی Wallet/Order؛ افزودن ParentId، ManagerId |
| `Province` / `City` | موقعیت جغرافیایی | آدرس کارمند | نگه‌داری |
| `UserAddress` | آدرس ارسال | آدرس تماس کارمند | نگه‌داری |
| `FinancialYear` | سال مالی شرکت | **دوره حقوقی** | نگه‌داری |
| `WebSiteSetting` | تنظیمات سایت چاپ | **تنظیمات سیستم HR** | تطبیق فیلدها |
| `Bank` | بانک | بانک برای واریز حقوق | نگه‌داری |
| `ChartOfAccount` | حساب کل | حسابداری حقوق (اختیاری) | فاز بعد |
| `FinancialDocument` | سند حسابداری | سند حقوق (اختیاری) | فاز بعد |
| `Currency` | ارز | ارز حقوق | نگه‌داری |
| `ContentPolicy` + Rules + RecordAccess | دسترسی سطح ردیف | **مدیر فقط تیم خودش** | نگه‌داری کامل |
| `Expense` / `ExpenseType` | هزینه | هزینه‌های HR (اختیاری) | فاز بعد |

### ۴.۲ API — تطبیق

| Controller | وضعیت |
|------------|--------|
| `WebSiteSettingController` | → Settings فرانت |
| `ProvinceController` / `CityController` | dropdown مکان |
| `UserAddressController` | آدرس کارمند |
| `CompanyController` | → **Departments** (تغییر نام و منطق) |
| `FinancialYearController` | دوره حقوق |
| `BankController` | master بانک |
| `ContentPolicy*` (۴ controller) | امنیت داده HR |

### ۴.۳ Seed Data — تطبیق

| Seed | اقدام |
|------|--------|
| `provinces.json` / `cities.json` | ✅ نگه‌داری |
| Permission از `PermissionModule` | 🔄 بازنویسی enum برای HR |
| JSON محصولات چاپ (۸۰۰+ فایل) | ❌ حذف |
| نقش‌های blogger/content-policy | 🔄 نقش‌های HR |

### ۴.۴ User Entity — پاکسازی لازم

فیلدها/Navigationهای **حذف از User**:

```csharp
// حذف یا جدا کردن:
RefundMethod          // مخصوص e-commerce
ICollection<Order>
ICollection<Wallet>
ICollection<BlogPost>
ICollection<OrderNote>
ICollection<Discount>
ICollection<BlogPostLike>
ICollection<ProductComment>
ICollection<CompanyComment>
ICollection<BlogPostComment>
ICollection<BankTransaction>   // اگر به payroll وصل نشود
ICollection<ChequeTransaction>
ICollection<WalletTransaction>
```

فیلدهای **نگه‌داری**:

```csharp
UserName, FirstName, LastName, Email, PhoneNumber
PasswordHash, SecurityStamp, Gender, CityId
IsActive, LoginPermission, LastLoginDateOnUtc
UserRoles, RefreshTokens, UserSessions
```

---

## ۵. ❌ حذف — دامنه چاپ و فروشگاه

### ۵.۱ Entities (۴۲+ مورد)

```
Category, SubCategory
Product, ProductPrice, ProductProperty, ProductPropertyPrice, ProductPropertyRule
ProductFile, ProductDescription, ProductComment, ProductFeatureType
ProductPriceDeliveryOption, ProductOrderItemAttachmentType
Property, PropertyCategory, PropertyItem, PropertyItemPrice, PropertyItemDependency
Order, OrderItem, OrderItemProperty, OrderItemAttachment, OrderItemAttachmentType
OrderItemAttachmentTypeRestriction, OrderNote, OrderCommission, OrderVat
Discount, DeliveryType, DeliveryOption, PostType
Wallet, WalletTransaction
CompanyProduct, CompanyPosDevice, CompanyComment
Tag, CommentTopic
Page, PageSection, Section, SectionItem, SectionType
BlogPost, BlogPostCategory, BlogPostTag, BlogPostLike, BlogPostComment
PosTransaction  (اگر فقط commerce)
```

### ۵.۲ Application Features — حذف (۴۱ پوشه)

```
Wallets, Orders
Products, ProductPrices, ProductProperties, ProductPropertyPrices, ProductPropertyRules
ProductFiles, ProductDescriptions, ProductComments, ProductFeatureTypes
ProductOrderItemAttachmentTypes, ProductPriceDeliveryOptions
Properties, PropertyCategories, PropertyItems, PropertyItemPrices
Categories, SubCategories
Discounts, DeliveryTypes, DeliveryOptions, PostTypes
Pages, PageSections, Sections, SectionItems, SectionTypes
BlogPosts, BlogPostCategories, BlogPostTags, BlogPostLikes, BlogPostComments
Tags, CommentTopics
CompanyComments, CompanyPosDevices
```

### ۵.۳ Controllers — حذف

**Public:** `WalletController`, `OrderController`, `CategoryController`, `SubCategoryController`, تمام `Product*`, `Page*`, `Section*`, `BlogPost*`, `Delivery*`, `CompanyCommentController`

**Admin:** متناظر با Features حذف‌شده + `WalletController`, `OrderController`, `DiscountController`, ...

### ۵.۴ PermissionType Enum

فایل `PermissionType.cs` (~۱۰۰۰ خط) عمدتاً e-commerce است.

**اقدام:** بازنویسی کامل با گروه‌های HR:

```csharp
// پیشنهاد گروه‌های جدید
ManageUsersGroup, ManageUsers, CreateUser, ...
ManageEmployeesGroup, ManageEmployees, ...
ManageAttendanceGroup, ...
ManageLeavesGroup, ...
ManagePayrollGroup, ...
ManageDepartmentsGroup, ...
ManageSettingsGroup, ...
```

### ۵.۵ Seed / Static Data

```
Infrastructure.Persistence/SeedData/Data/Extract Code Files/  → حذف کامل
Infrastructure.Persistence/SeedData/Data/*.json (محصولات)     → حذف
```

### ۵.۶ Tests — حذف/بازنویسی

| تست | اقدام |
|-----|--------|
| Order*, Wallet*, Discount* | ❌ حذف |
| ContentPolicy* | ✅ نگه‌داری |
| AuthContextValidator | ✅ نگه‌داری |
| ArchTests | ✅ نگه‌داری |
| BankRepository | 🔄 نگه‌داری |

---

## ۶. ➕ ماژول‌های HR

### ۶.۰ پیاده‌سازی‌شده (۱۴۰۴/۰۴/۲۲)

| Entity | API Admin | وضعیت |
|--------|-----------|--------|
| `Employee` | `employee/*` | ✅ Create, Update, Delete, Get, GetAll |
| `Department` | `department/*` | ✅ CRUD کامل |
| `AttendanceRecord` | `attendance-record/*` | ✅ CRUD + `PUT check-in` / `PUT check-out` + `WorkDateFrom`/`WorkDateTo` + یک رکورد/روز + خروج بعد از ورود |
| `LeaveRequest` | `leave-request/*` | ✅ CRUD + `PUT approve` / `PUT reject` + تداخل بازه + فقط Pending قابل تأیید/رد |
| `PayrollEntry` | `payroll-entry/*` | ✅ CRUD + `PUT approve` / `PUT mark-paid` + Net=Gross-Deductions + فیش Paid غیرقابل ویرایش/حذف |

**پیام‌های خطای فارسی اضافه‌شده:** `OverlappingLeavePeriod`, `LeaveRequestNotPending`, `CheckOutMustBeAfterCheckIn`, `AttendanceAlreadyCheckedIn`, `InvalidPayrollNetAmount`, `PayrollEntryNotDraft`, ...

**Namespace:** `JavidHrm.*` (پوشه‌ها هنوز `Edition.*`) — `JavidHrmDbContext`

**Migration:** کاربر باید locally اجرا کند:
```bat
dotnet ef migrations add HrModulesSchema -p src\Infrastructure\Edition.Infrastructure.Persistence -s src\Presentation\Edition.Api
dotnet ef database update -p src\Infrastructure\Edition.Infrastructure.Persistence -s src\Presentation\Edition.Api
```

### ۶.۱ ماژول‌های پیشنهادی (فاز بعد — Greenfield)

### ۶.۱ Domain Entities پیشنهادی

```
Employee              — پروفایل HR (UserId, EmployeeCode, DepartmentId, JobTitle, HireDate, ManagerId, ...)
Department            — (تطبیق از Company یا entity جدید)
AttendanceRecord      — ورود/خروج، تاخیر، اضافه‌کار
WorkShift             — شیفت کاری
AttendancePolicy      — سیاست حضور
LeaveType             — استحقاقی، استعلاجی، ...
LeaveBalance          — موجودی مرخصی
LeaveRequest          — درخواست + وضعیت تأیید
LeaveApproval         — گردش تأیید
PayrollPeriod         — (ارتباط با FinancialYear)
SalaryStructure       — حقوق پایه، گرید
PayrollRun            — اجرای محاسبه ماهانه
Payslip               — فیش حقوق
PayslipItem           — اقلام فیش (مزایا، کسورات)
Notification          — اعلان درون‌سیستمی
Announcement          — اطلاعیه سازمانی
TodoItem              — وظایف (اختیاری)
```

### ۶.۲ API پیشنهادی (هم‌تراز با فرانت React)

| ماژول فرانت | Route پیشنهادی API |
|-------------|-------------------|
| `/employees` | `api/v1/admin/employee/*` |
| `/departments` | `api/v1/admin/department/*` |
| `/attendance` | `api/v1/attendance/*` + admin |
| `/leaves` | `api/v1/leave/*` + admin |
| `/payroll` | `api/v1/admin/payroll/*` |
| `/notifications` | `api/v1/notification/*` |
| `/announcements` | `api/v1/admin/announcement/*` |
| `/calendar` | `api/v1/calendar/events` |
| `/todo` | `api/v1/todo/*` |

### ۶.۳ Mapping فرانت → بک‌اند موجود

| صفحه React | API موجود Edition | وضعیت |
|------------|-------------------|--------|
| `/login` | `POST account/sign-in` | ✅ آماده |
| `/login-otp` | `sign-in-by-phone-number` | ✅ آماده |
| `/register` | `account/register` | ✅ آماده |
| `/forgot-password` | `forget-password` | ✅ آماده |
| `/users` | `admin/account/get-all` | ✅ آماده |
| `/users/new` | `admin/account/create` | ✅ آماده |
| `/roles` | `admin/role/*` | ✅ آماده |
| `/permissions` | `admin/permission/*` | ✅ آماده (enum باید HR شود) |
| `/settings` | `website-setting/*` | 🔄 تطبیق |
| `/employees` | `admin/employee/*` | ✅ API + فرانت CRUD |
| `/departments` | `admin/department/*` | ✅ API + فرانت CRUD + آمار از API |
| `/users/:id` (نقش) | `admin/user-role/*` | ✅ تخصیص/حذف نقش در UI |
| `/attendance` | `admin/attendance-record/*` | ✅ فرانت کامل + check-in/out |
| `/leaves` | `admin/leave-request/*` | ✅ فرانت کامل + approve/reject |
| `/payroll` | `admin/payroll-entry/*` | ✅ فرانت کامل + approve/mark-paid |
| `/` (داشبورد) | aggregate از APIهای HR | ✅ نمودار و آمار واقعی |
| `/notifications` | — | ❌ باید ساخته شود |
| `/announcements` | — | ❌ باید ساخته شود |
| `/calendar` | — | ❌ باید ساخته شود |
| `/todo` | — | ❌ باید ساخته شود |
| `/backup` | — | ❌ باید ساخته شود |

---

## ۷. فازبندی اجرایی (پیشنهاد دقیق)

### فاز ۰ — آماده‌سازی (۱–۲ روز)

- [ ] Branch جدید: `feature/hr-migration` (اختیاری)
- [ ] پشتیبان DB و repo
- [x] فعال‌سازی seed در Development (`ApplyDevelopmentBootstrapAsync`)
- [ ] اجرای `dotnet test` و ثبت baseline
- [x] مستندسازی connection string و Redis در `appsettings.Development.json`

### فاز ۱ — پاکسازی دامنه چاپ (۳–۵ روز) — ~۹۵٪ انجام شده

**ترتیب حذف (وابستگی به وابستگی):**

1. Handlers/Controllers مربوط به `Order`, `Wallet`
2. Product* و Property*
3. CMS/Blog (Page, Section, BlogPost*)
4. Delivery, Discount, Tag, CommentTopic
5. Entities از Domain + EF Configuration
6. DbSet از `EditionDbContext`
7. Repositoryهای مربوطه
8. Migration جدید: `RemoveCommerceDomain`
9. حذف Seed JSON محصولات
10. پاکسازی `PermissionType` (فقط گروه Users/Roles/Settings بماند)
11. پاکسازی navigationهای `User` و `Company`
12. به‌روزرسانی ArchTests و حذف تست‌های commerce

**خروجی فاز ۱:** پروژه build شود، auth کار کند، commerce حذف شده باشد. ✅ build تأیید شده

### فاز ۲ — تطبیق برای HR (۳–۴ روز) — انجام شده

- [x] `Company` → `Department` (entity + API)
- [ ] تطبیق `WebSiteSetting` برای HR
- [x] نگه‌داری Province/City/UserAddress
- [x] `PermissionType` — مقادیر HR (Employee, Attendance, Leave, Payroll) اضافه شد
- [x] Seed: admin (`09120000000` / `Admin@123`)، استان/شهر، نقش‌ها
- [x] admin user CRUD (update/delete)

### فاز ۳ — اتصال فرانت React (۲–۳ روز) — انجام شده

- [x] `src/services/api/` (client, auth, users, departments, roles, permissions, cities)
- [x] Auth interceptor (JWT + refresh) + `AuthContext`
- [x] Protected/Guest routes
- [x] صفحات: login, users, roles, permissions, departments (لیست)
- [x] CORS + Vite proxy → `localhost:5000`

### فاز ۴ — Employee + Department + UserRole — انجام شده

- [x] Entity `Employee` + CRUD + `EmployeeController`
- [x] فرانت: `/employees`, `/employees/new`, `/employees/:id`
- [x] فرانت: `/departments/new`, `/departments/:id`
- [x] UI تخصیص نقش در `UserDetailPage`

### فاز ۵ — Attendance — ✅ انجام شده

- [x] `AttendanceRecord` + CRUD admin
- [x] `PUT check-in` / `PUT check-out` (تشخیص تأخیر بعد از ۹:۰۰ ایران)
- [x] اعتبارسنجی: یک رکورد/روز، خروج بعد از ورود
- [x] فیلتر `WorkDateFrom` / `WorkDateTo` در get-all
- [x] فرانت کامل: CRUD، ثبت سریع، آمار، نمودار هفتگی
- [ ] `WorkShift`, `AttendancePolicy` (فاز بعد)

### فاز ۶ — Leave — ✅ انجام شده

- [x] `LeaveRequest` + enum نوع/وضعیت + CRUD
- [x] `PUT approve` / `PUT reject`
- [x] اعتبارسنجی تداخل بازه مرخصی
- [x] فرانت کامل: CRUD، فیلتر، pending/upcoming/history
- [ ] `LeaveBalance`, `LeaveApproval` چندمرحله‌ای (فاز بعد)

### فاز ۷ — Payroll — ✅ انجام شده

- [x] `PayrollEntry` + CRUD
- [x] `PUT approve` / `PUT mark-paid`
- [x] اعتبارسنجی Net = Gross − Deductions؛ محافظت فیش Paid
- [x] فرانت کامل: CRUD، ماشین‌حساب، workflow تأیید/پرداخت
- [ ] محاسبه خودکار از حضور، فیش PDF، `ChartOfAccount` (فاز بعد)

### فاز ۸ — Dashboard + تکمیل فرانت — ✅ انجام شده

- [x] داشبورد از APIهای employees, attendance, leaves, payroll, departments
- [x] حذف mock از صفحات HR اصلی (dashboard, departments, attendance, leaves, payroll)
- [ ] Notification, Announcement, Calendar, Todo, Backup API + فرانت

### فاز ۹ — تکمیلی (باقی‌مانده)

- [ ] Notification, Announcement, Calendar, Todo, Backup (بک‌اند + فرانت)
- [ ] گزارش‌گیری و Export Excel/PDF
- [ ] React Query در فرانت (اختیاری)
- [ ] تست E2E

---

## ۸. وابستگی‌های زیرساخت

### الزامی برای اجرا

| سرویس | تنظیم در appsettings |
|--------|---------------------|
| SQL Server | ConnectionStrings |
| Redis | Cache + token blocklist |
| JWT | SiteSettings.JwtSettings |
| SMS (OTP) | PhoneNumberTokenProvider |
| Email (OTP) | EmailTokenProvider |

### اختیاری

- Serilog / Seq
- ForwardedHeaders (پشت reverse proxy)

---

## ۹. ریسک‌ها و تصمیم‌های باز

| # | موضوع | گزینه‌ها | پیشنهاد |
|---|--------|----------|---------|
| 1 | Rename Solution | Edition → JavidHrm | فاز ۲ بعد از پاکسازی |
| 2 | Company vs Department جدید | Rename vs Entity جدید | Entity جدید + migration داده |
| 3 | User = Employee? | یکی vs جدا | **جدا** — User برای login، Employee برای HR |
| 4 | Migration دیتابیس | حذف تدریجی vs DB خالی | DB خالی برای dev؛ migration تدریجی برای prod |
| 5 | Permission enum | پاکسازی vs فایل جدید | فایل جدید `HrPermissionType` |
| 6 | Content Policy | نگه‌داری کامل؟ | ✅ برای محدودیت دسترسی مدیران |
| 7 | Financial/Accounting | در payroll؟ | فاز ۷ اختیاری |

---

## ۱۰. چک‌لیست حذف فایل (فاز ۱)

### Domain/Entities — حذف

```
Category.cs, SubCategory.cs, Product*.cs, Property*.cs
Order*.cs, Discount.cs, Delivery*.cs, PostType.cs
Wallet*.cs, CompanyProduct.cs, CompanyPosDevice.cs, CompanyComment.cs
Page*.cs, Section*.cs, BlogPost*.cs, Tag.cs, CommentTopic.cs
```

### Application/Features — حذف پوشه

```
Features/Wallets, Features/Orders, Features/Products, ...
(لیست کامل بخش ۵.۲)
```

### Api/Controllers — حذف

```
Controllers/v1/OrderController.cs, WalletController.cs, ...
Controllers/v1/Admin/OrderController.cs, ...
```

### Persistence

```
Configurations/* مربوط به entities حذف‌شده
Repositories/* مربوطه
SeedData/Data/Extract Code Files/  (کل پوشه)
```

---

## ۱۱. خلاصه درصدها

```
┌─────────────────────────────────────────────────────────┐
│  ✅ نگه‌داری (Auth, RBAC, Infra, Patterns)     ~30%   │
│  🔄 تطبیق (Company, Location, Settings, Bank)  ~15%   │
│  ❌ حذف (Commerce, Print, CMS, Blog)           ~55%   │
│  ➕ ساخت جدید (HR Core Modules)                100%   │
│     نسبت به ماژول‌های HR مورد نیاز فرانت              │
└─────────────────────────────────────────────────────────┘
```

---

## ۱۲. قدم بعدی فوری

1. ⚠️ اجرای **EF migration** روی دیتابیس محلی (اگر هنوز انجام نشده)
2. تست end-to-end کامل:
   - login (`09120000000` / `Admin@123`)
   - employee → department → user role
   - attendance check-in/out → leave create/approve → payroll create/approve/mark-paid
   - dashboard آمار
3. ساخت API برای: Notification, Announcement, Calendar, Todo, Backup
4. بازنویسی کامل `PermissionType` برای منوی HR (فعلاً مقادیر کافی برای build)
5. حذف نهایی دامنه commerce (فاز ۱) در صورت نیاز production

---

## ۱۳. خلاصه وضعیت فعلی (۱۴۰۴/۰۴/۲۲)

| حوزه | انجام شده | باقی‌مانده |
|------|-----------|------------|
| Auth + RBAC | ✅ | بازنویسی enum منو |
| Employee | ✅ | — |
| Department | ✅ | — |
| Attendance | ✅ CRUD + check-in/out | WorkShift, Policy |
| Leave | ✅ CRUD + approve/reject | LeaveBalance, workflow چندمرحله |
| Payroll | ✅ CRUD + approve/paid | PDF, محاسبه خودکار |
| Dashboard (فرانت) | ✅ aggregate API | — |
| Commerce حذف | ~۹۵٪ | تست نهایی + migration |
| Notification/Todo/... | ❌ | کل ماژول |

---

*این سند با پیشرفت پروژه به‌روزرسانی می‌شود. پس از هر فاز، وضعیت چک‌لیست‌ها علامت‌گذاری شود.*
