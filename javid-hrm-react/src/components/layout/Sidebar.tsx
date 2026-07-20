import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  accountNavItems,
  hrNavItems,
  mainNavItems,
  toolsNavItems,
  usersNavItems,
  type NavItem,
} from '@/data/navigation';
import { cn } from '@/lib/utils';
import styles from './Sidebar.module.css';

function isNavActive(pathname: string, path: string) {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isRouteInGroup(pathname: string, items: NavItem[]) {
  return items.some((item) => item.path && isNavActive(pathname, item.path));
}

interface SidebarNavLinkProps {
  item: NavItem;
  className?: string;
  subItem?: boolean;
}

function SidebarNavLink({ item, className, subItem = false }: SidebarNavLinkProps) {
  const location = useLocation();
  if (!item.path) return null;

  const active = isNavActive(location.pathname, item.path);

  if (subItem) {
    return (
      <Link
        to={item.path}
        className={cn(styles.subNavLink, active && styles.subNavLinkActive, className)}
      >
        {item.icon && (
          <span className={styles.subNavIcon}>
            <Icon name={item.icon} className="size-4" />
          </span>
        )}
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <Link
      to={item.path}
      className={cn(
        'sidebar-item',
        styles.navLink,
        active && 'sidebar-item-active',
        active && styles.navLinkActive,
        className,
      )}
    >
      {item.icon && (
        <span className={styles.navIconWrap}>
          <Icon name={item.icon} className="size-[1.125rem]" />
        </span>
      )}
      <span className="sidebar-label">{item.label}</span>
    </Link>
  );
}

interface AccordionGroupProps {
  icon: string;
  label: string;
  items: NavItem[];
}

function AccordionGroup({ icon, label, items }: AccordionGroupProps) {
  const location = useLocation();
  const isChildActive = isRouteInGroup(location.pathname, items);
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  return (
    <div data-accordion data-accordion-open={isOpen ? '' : undefined}>
      <button
        type="button"
        className={cn(
          'sidebar-item accordion-trigger w-full',
          isChildActive && styles.accordionTriggerActive,
        )}
        data-accordion-trigger
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className={styles.navIconWrap}>
            <Icon name={icon} className="size-[1.125rem]" />
          </span>
          <span className="sidebar-label truncate">{label}</span>
        </div>
        <Icon
          name="material-symbols:keyboard-arrow-down"
          className={cn(
            'sidebar-label size-5 shrink-0 opacity-70 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          data-accordion-icon
        />
      </button>
      <div
        data-accordion-content
        className={styles.accordionContent}
        style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden' }}
      >
        <div className={styles.subNavList}>
          {items.map((item) => (
            <SidebarNavLink key={item.path} item={item} subItem />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  id?: string;
  className?: string;
}

export function Sidebar({ id = 'mobile-sidebar', className }: SidebarProps) {
  return (
    <aside id={id} className={cn('sidebar', className)}>
      <nav className="sidebar-content scrollbar-thin flex flex-col">
        <div className="flex-1 space-y-1">
          <div className="sidebar-group">
            <div className={styles.groupTitle}>منوی اصلی</div>
            <div className="sidebar-menu">
              {mainNavItems.map((item) => (
                <SidebarNavLink key={item.path} item={item} />
              ))}
            </div>
          </div>

          <div className="sidebar-group">
            <div className={styles.groupTitle}>کاربران و منابع انسانی</div>
            <div className="sidebar-menu">
              <AccordionGroup
                icon="material-symbols:manage-accounts"
                label="کاربران"
                items={usersNavItems}
              />
              <AccordionGroup
                icon="material-symbols:groups"
                label="پرسنل"
                items={hrNavItems}
              />
            </div>
          </div>

          <div className="sidebar-group">
            <div className={styles.groupTitle}>ابزارها</div>
            <div className="sidebar-menu">
              {toolsNavItems.map((item) => (
                <SidebarNavLink key={item.path} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.footerTitle}>حساب کاربری</div>
          <div className="sidebar-menu">
            {accountNavItems.map((item) => (
              <SidebarNavLink key={item.path} item={item} />
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
