import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './styles/auth.module.css';

type AuthLayoutVariant = 'grid' | 'gradient' | 'plain' | 'custom';

interface AuthLayoutProps {
  children: ReactNode;
  variant?: AuthLayoutVariant;
  className?: string;
}

const GRID_RECTS = [
  { x: 97, y: 97 },
  { x: 385, y: 193 },
  { x: 193, y: 289 },
  { x: 673, y: 289 },
  { x: 481, y: 385 },
  { x: 1249, y: 97 },
  { x: 1, y: 481 },
  { x: 577, y: 481 },
  { x: 1441, y: 385 },
  { x: 1057, y: 289 },
  { x: 961, y: 481 },
  { x: 1249, y: 577 },
];

function AuthGridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 print:hidden" aria-hidden>
      <div className={styles.gridPattern}>
        <svg className="absolute top-0 left-0 size-full stroke-black/20 stroke-2 sm:mask-[linear-gradient(transparent_10%,white,transparent_85%)] dark:stroke-white/10">
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#auth-grid-pattern)" />
          <svg>
            {GRID_RECTS.map((rect) => (
              <rect
                key={`${rect.x}-${rect.y}`}
                strokeWidth="0"
                width="95"
                height="95"
                x={rect.x}
                y={rect.y}
                className="fill-muted hover:fill-muted/80 pointer-events-auto transition duration-500 dark:fill-white/5 dark:hover:fill-white/10"
              />
            ))}
          </svg>
          <defs>
            <pattern
              id="auth-grid-pattern"
              viewBox="0 0 64 64"
              width="96"
              height="96"
              patternUnits="userSpaceOnUse"
            >
              <path d="M64 0H0V64" fill="none" />
            </pattern>
          </defs>
        </svg>
      </div>
    </div>
  );
}

const variantClasses: Record<AuthLayoutVariant, string> = {
  grid: 'bg-background relative flex w-full items-center justify-center overflow-x-hidden sm:min-h-screen',
  gradient:
    'from-primary/5 via-background flex min-h-screen items-center justify-center bg-gradient-to-br to-sky-500/5 p-4',
  plain: 'bg-background flex min-h-screen items-center justify-center p-4',
  custom: 'relative',
};

export function AuthLayout({ children, variant = 'plain', className }: AuthLayoutProps) {
  return (
    <div className={cn(variantClasses[variant], 'relative', className)}>
      {variant === 'grid' && <AuthGridBackground />}
      {children}
    </div>
  );
}

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <main className="sm:container">
      <div
        className={cn(
          'bg-card text-card-foreground relative mx-auto rounded-xl border max-sm:flex max-sm:min-h-screen max-sm:min-w-screen max-sm:items-center max-sm:justify-center max-sm:overflow-y-auto sm:h-auto sm:max-w-96',
          className,
        )}
      >
        {children}
      </div>
    </main>
  );
}

interface AuthSeparatorProps {
  text?: string;
}

export function AuthSeparator({ text = 'یا' }: AuthSeparatorProps) {
  return (
    <div className={styles.separator}>
      <span className={styles.separatorText}>{text}</span>
    </div>
  );
}
