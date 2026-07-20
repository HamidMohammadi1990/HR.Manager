import { Icon } from '@/components/ui/Icon';
import { useSidebar } from '@/hooks';
import { cn } from '@/lib/utils';
import styles from './SidebarToggle.module.css';

export function SidebarToggle() {
  const { isHidden, toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      className={cn(styles.toggle, isHidden ? styles.collapsed : styles.expanded)}
      onClick={toggleSidebar}
      aria-label={isHidden ? 'باز کردن منو' : 'بستن منو'}
      aria-expanded={!isHidden}
    >
      <Icon
        name="material-symbols:chevron-left"
        className={cn(styles.icon, !isHidden && styles.iconOpen)}
      />
    </button>
  );
}
