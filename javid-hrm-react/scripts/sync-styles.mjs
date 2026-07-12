import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const sourceDir = join(projectRoot, '..', 'JavidHrm', 'assets', 'styles');
const targetDir = join(projectRoot, 'src', 'assets', 'styles');

const files = ['app.css', 'themes.css'];

if (!existsSync(sourceDir)) {
  console.error(`[sync-styles] Source not found: ${sourceDir}`);
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });

for (const file of files) {
  const from = join(sourceDir, file);
  const to = join(targetDir, file);

  if (!existsSync(from)) {
    console.error(`[sync-styles] Missing source file: ${from}`);
    process.exit(1);
  }

  copyFileSync(from, to);
  const { size } = statSync(to);
  console.log(`[sync-styles] Copied ${file} (${size} bytes)`);
}

console.log('[sync-styles] Done.');
