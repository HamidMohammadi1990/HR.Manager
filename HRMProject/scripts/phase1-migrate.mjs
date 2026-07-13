/**
 * JavidHrm Phase 1 migration
 * - Rename Edition -> JavidHrm (solution, projects, namespaces)
 * - Remove e-commerce / print commerce code
 * - Company -> Department
 *
 * Run from repo root:
 *   node EditionProject/scripts/phase1-migrate.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TEXT_EXTENSIONS = new Set([
  '.cs', '.csproj', '.sln', '.json', '.resx', '.md', '.http', '.props', '.targets', '.xml',
]);

const COMMERCE_ENTITIES = [
  'Category', 'SubCategory', 'Product', 'ProductComment', 'ProductDescription', 'ProductFeature',
  'ProductFeatureType', 'ProductFile', 'ProductOrderItemAttachmentType', 'ProductPrice',
  'ProductPriceDeliveryOption', 'ProductProperty', 'ProductPropertyPrice', 'ProductPropertyRule',
  'Property', 'PropertyCategory', 'PropertyItem', 'PropertyItemPrice', 'PropertyItemDependency',
  'Order', 'OrderItem', 'OrderItemAttachment', 'OrderItemAttachmentType',
  'OrderItemAttachmentTypeRestriction', 'OrderItemProperty', 'OrderNote', 'OrderCommission', 'OrderVat',
  'Discount', 'DeliveryType', 'DeliveryOption', 'PostType', 'Wallet', 'WalletTransaction',
  'CompanyProduct', 'CompanyComment', 'CompanyPosDevice', 'Tag', 'CommentTopic',
  'Page', 'PageSection', 'Section', 'SectionItem', 'SectionType',
  'BlogPost', 'BlogPostCategory', 'BlogPostTag', 'BlogPostLike', 'BlogPostComment',
  'PosTransaction', 'BankTransaction', 'ChequeTransaction', 'Expense', 'ExpenseType',
  'FinancialDocument', 'FinancialDocumentDetail', 'BankAccount',
];

const KEEP_FEATURES = new Set([
  'Users', 'UserSessions', 'RefreshTokens', 'Roles', 'Permissions', 'RolePermissions', 'UserRoles',
  'Departments', 'Provinces', 'Cities', 'UserAddresses', 'WebSiteSettings',
  'ContentPolicies', 'ContentPolicyRules', 'ContentPolicyRecordAccesses', 'ContentPolicyMetadata',
  'Banks', 'FinancialYears', 'ChartOfAccounts', 'Currencies',
]);

const KEEP_CONTROLLERS = new Set([
  'AccountController', 'UserAddressController', 'ProvinceController', 'CityController',
  'BankController', 'WebSiteSettingController', 'DepartmentController',
  'RoleController', 'PermissionController', 'RolePermissionController', 'UserRoleController',
  'ContentPolicyController', 'ContentPolicyRuleController', 'ContentPolicyRecordAccessController',
  'ContentPolicyMetadataController', 'FinancialYearController', 'ChartOfAccountController',
]);

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'bin' || entry.name === 'obj') continue;
      callback(full, true);
      walk(full, callback);
    } else {
      callback(full, false);
    }
  }
}

function rmrf(target) {
  if (!fs.existsSync(target)) return;
  if (fs.lstatSync(target).isDirectory()) {
    fs.rmSync(target, { recursive: true, force: true });
  } else {
    fs.unlinkSync(target);
  }
}

function replaceText(content) {
  return content
    .replaceAll('EditionDbContext', 'JavidHrmDbContext')
    .replaceAll('EditionWebSite', 'JavidHrm')
    .replaceAll('namespace Edition.', 'namespace JavidHrm.')
    .replaceAll('using Edition.', 'using JavidHrm.')
    .replaceAll('Edition.', 'JavidHrm.');
}

function transformCompanyToDepartment(content) {
  return content
    .replaceAll('ManageCompanyGroup', 'ManageDepartmentGroup')
    .replaceAll('ManageCompany', 'ManageDepartment')
    .replaceAll('ListCompany', 'ListDepartment')
    .replaceAll('GetCompanyById', 'GetDepartmentById')
    .replaceAll('CreateCompany', 'CreateDepartment')
    .replaceAll('UpdateCompany', 'UpdateDepartment')
    .replaceAll('DeleteCompany', 'DeleteDepartment')
    .replaceAll('SearchCompany', 'SearchDepartment')
    .replaceAll('GetAllCompany', 'GetAllDepartment')
    .replaceAll('GetCompany', 'GetDepartment')
    .replaceAll('CompanyController', 'DepartmentController')
    .replaceAll('ICompanyRepository', 'IDepartmentRepository')
    .replaceAll('CompanyRepository', 'DepartmentRepository')
    .replaceAll('CompanyConfig', 'DepartmentConfig')
    .replaceAll('CompanyProduct', 'DepartmentProduct_REMOVED')
    .replaceAll('Companies', 'Departments')
    .replaceAll('Company', 'Department')
    .replaceAll('company', 'department')
    .replaceAll('ApiControllerCategory.Department', 'ApiControllerCategory.Department')
    .replaceAll('DepartmentProduct_REMOVED', '');
}

console.log('=== Phase 1: Delete commerce artifacts ===');

// Seed product data
rmrf(path.join(ROOT, 'src', 'Infrastructure', 'Edition.Infrastructure.Persistence', 'SeedData', 'Data', 'Extract Code Files'));
rmrf(path.join(ROOT, 'src', 'Infrastructure', 'JavidHrm.Infrastructure.Persistence', 'SeedData', 'Data', 'Extract Code Files'));

for (const file of ['Categories.json', 'AllProducts.json']) {
  for (const base of ['Edition', 'JavidHrm']) {
    const p = path.join(ROOT, 'src', 'Infrastructure', `${base}.Infrastructure.Persistence`, 'SeedData', 'Data', file);
    rmrf(p);
  }
}

// Delete commerce entities
for (const entity of COMMERCE_ENTITIES) {
  for (const base of ['Edition', 'JavidHrm']) {
    const entityPath = path.join(ROOT, 'src', 'Core', `${base}.Domain`, 'Entities', `${entity}.cs`);
    rmrf(entityPath);
    const repoInterface = path.join(ROOT, 'src', 'Core', `${base}.Domain`, 'Repositories', `I${entity}Repository.cs`);
    rmrf(repoInterface);
    const repo = path.join(ROOT, 'src', 'Infrastructure', `${base}.Infrastructure.Persistence`, 'Repositories', `${entity}Repository.cs`);
    rmrf(repo);
    const config = path.join(ROOT, 'src', 'Infrastructure', `${base}.Infrastructure.Persistence`, 'Configuration', `${entity}Config.cs`);
    rmrf(config);
  }
}

// Delete Company entity (replaced by Department.cs written separately)
for (const base of ['Edition', 'JavidHrm']) {
  rmrf(path.join(ROOT, 'src', 'Core', `${base}.Domain`, 'Entities', 'Company.cs'));
  rmrf(path.join(ROOT, 'src', 'Infrastructure', `${base}.Infrastructure.Persistence`, 'Configuration', 'CompanyConfig.cs'));
}

// Delete commerce feature folders
for (const base of ['Edition', 'JavidHrm']) {
  const featuresRoot = path.join(ROOT, 'src', 'Core', `${base}.Application`, 'Features');
  if (!fs.existsSync(featuresRoot)) continue;
  for (const name of fs.readdirSync(featuresRoot)) {
    if (!KEEP_FEATURES.has(name)) {
      rmrf(path.join(featuresRoot, name));
      console.log(`Removed feature: ${name}`);
    }
  }
}

// Delete commerce controllers
for (const base of ['Edition', 'JavidHrm']) {
  for (const sub of ['Controllers/v1', 'Controllers/v1/Admin']) {
    const ctrlRoot = path.join(ROOT, 'src', 'Presentation', `${base}.Api`, sub);
    if (!fs.existsSync(ctrlRoot)) continue;
    for (const file of fs.readdirSync(ctrlRoot)) {
      if (!file.endsWith('Controller.cs')) continue;
      const name = file.replace('.cs', '');
      if (!KEEP_CONTROLLERS.has(name) && !name.includes('Department')) {
        rmrf(path.join(ctrlRoot, file));
        console.log(`Removed controller: ${sub}/${file}`);
      }
    }
  }
}

// Delete commerce tests
const commerceTestPatterns = ['Order', 'Wallet', 'Discount', 'Product', 'Blog', 'Category'];
for (const base of ['Edition', 'JavidHrm']) {
  const testsRoot = path.join(ROOT, 'tests');
  if (!fs.existsSync(testsRoot)) continue;
  walk(testsRoot, (full, isDir) => {
    if (isDir) return;
    const rel = path.relative(testsRoot, full);
    if (commerceTestPatterns.some((p) => rel.includes(p))) {
      rmrf(full);
    }
  });
}

// Delete old migrations (fresh HR schema)
for (const base of ['Edition', 'JavidHrm']) {
  const mig = path.join(ROOT, 'src', 'Infrastructure', `${base}.Infrastructure.Persistence`, 'Migrations');
  rmrf(mig);
  fs.mkdirSync(mig, { recursive: true });
}

console.log('=== Phase 1: Rename Edition -> JavidHrm ===');

// Rename directories deepest-first
const dirs = [];
walk(ROOT, (full, isDir) => {
  if (isDir && path.basename(full).startsWith('Edition')) dirs.push(full);
});
dirs.sort((a, b) => b.length - a.length);
for (const dir of dirs) {
  const parent = path.dirname(dir);
  const newName = path.basename(dir).replace(/^Edition/, 'JavidHrm');
  const target = path.join(parent, newName);
  if (dir !== target && !fs.existsSync(target)) {
    fs.renameSync(dir, target);
    console.log(`Renamed: ${path.basename(dir)} -> ${newName}`);
  }
}

// Rename csproj files
walk(ROOT, (full, isDir) => {
  if (isDir) return;
  if (path.basename(full).startsWith('Edition') && full.endsWith('.csproj')) {
    const target = path.join(path.dirname(full), path.basename(full).replace(/^Edition/, 'JavidHrm'));
    if (!fs.existsSync(target)) fs.renameSync(full, target);
  }
});

if (fs.existsSync(path.join(ROOT, 'Edition.sln'))) {
  fs.renameSync(path.join(ROOT, 'Edition.sln'), path.join(ROOT, 'JavidHrm.sln'));
}

console.log('=== Phase 1: Text replacement ===');

walk(ROOT, (full, isDir) => {
  if (isDir) return;
  const ext = path.extname(full);
  if (!TEXT_EXTENSIONS.has(ext)) return;
  if (full.includes(`${path.sep}scripts${path.sep}`)) return;
  let content = fs.readFileSync(full, 'utf8');
  const updated = replaceText(content);
  if (updated !== content) fs.writeFileSync(full, updated, 'utf8');
});

console.log('=== Phase 1: Company -> Department transforms ===');

walk(ROOT, (full, isDir) => {
  if (isDir) return;
  if (!full.endsWith('.cs')) return;
  let content = fs.readFileSync(full, 'utf8');
  if (!content.includes('Company') && !content.includes('company') && !content.includes('Companies')) return;
  const updated = transformCompanyToDepartment(content);
  if (updated !== content) fs.writeFileSync(full, updated, 'utf8');
});

// Rename Companies feature folder -> Departments
for (const featuresRoot of [
  path.join(ROOT, 'src', 'Core', 'JavidHrm.Application', 'Features', 'Companies'),
  path.join(ROOT, 'src', 'Core', 'Edition.Application', 'Features', 'Companies'),
]) {
  const target = featuresRoot.replace('Companies', 'Departments');
  if (fs.existsSync(featuresRoot) && !fs.existsSync(target)) {
    fs.renameSync(featuresRoot, target);
  }
}

// Rename Company controllers
for (const ctrl of [
  path.join(ROOT, 'src', 'Presentation', 'JavidHrm.Api', 'Controllers', 'v1', 'Admin', 'CompanyController.cs'),
  path.join(ROOT, 'src', 'Presentation', 'JavidHrm.Api', 'Controllers', 'v1', 'CompanyController.cs'),
]) {
  if (fs.existsSync(ctrl)) {
    fs.renameSync(ctrl, ctrl.replace('CompanyController', 'DepartmentController'));
  }
}

// Rename repository files
for (const pair of [
  ['ICompanyRepository.cs', 'IDepartmentRepository.cs'],
  ['CompanyRepository.cs', 'DepartmentRepository.cs'],
]) {
  for (const base of ['JavidHrm']) {
    const repoDir = path.join(ROOT, 'src');
    walk(repoDir, (full, isDir) => {
      if (isDir) return;
      if (path.basename(full) === pair[0]) {
        fs.renameSync(full, path.join(path.dirname(full), pair[1]));
      }
    });
  }
}

// Rename Dtos/Companies -> Dtos/Departments
for (const dto of [
  path.join(ROOT, 'src', 'Core', 'JavidHrm.Domain', 'Dtos', 'Companies'),
]) {
  const target = dto.replace('Companies', 'Departments');
  if (fs.existsSync(dto) && !fs.existsSync(target)) fs.renameSync(dto, target);
}

console.log('=== Phase 1 complete ===');
console.log('Next: dotnet ef migrations add InitialHrSchema -p src/Infrastructure/JavidHrm.Infrastructure.Persistence');
console.log('Then: dotnet build JavidHrm.sln');
