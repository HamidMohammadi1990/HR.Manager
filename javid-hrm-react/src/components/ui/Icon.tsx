import { Icon as IconifyIcon } from '@iconify/react';

interface IconProps {
  name: string;
  className?: string;
}

/** Material Symbols / Lucide icon helper — maps template icon names to Iconify */
export function Icon({ name, className }: IconProps) {
  const icon = name.includes(':') ? name : name.replace('--', ':');
  return <IconifyIcon icon={icon} className={className} aria-hidden />;
}
