import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { hrNavItems, mainNavItems, toolsNavItems, usersNavItems } from '@/data/navigation';
import { cn } from '@/lib/utils';
import styles from './Sidebar.module.css';

interface AccordionGroupProps {
  icon: string;
  label: string;
  items: { label: string; path: string }[];
}

function isRouteInGroup(pathname: string, items: { path: string }[]) {
  return items.some(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  );
}

function AccordionGroup({ icon, label, items }: AccordionGroupProps) {
  const location = useLocation();
  const isChildActive = isRouteInGroup(location.pathname, items);
  const [isOpen, setIsOpen] = useState(isChildActive);

  // با ورود به یکی از صفحات زیرگروه، منو باز شود
  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [location.pathname, isChildActive]);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div data-accordion data-accordion-open={isOpen ? '' : undefined}>
      <button
        type="button"
        className="sidebar-item accordion-trigger w-full"
        data-accordion-trigger
        onClick={toggle}
      >
        <div className="flex items-center gap-3">
          <Icon name={icon} className="sidebar-item-icon" />
          <span className="sidebar-label">{label}</span>
        </div>
        <Icon
          name="material-symbols:keyboard-arrow-down"
          className={cn('sidebar-label size-5 transition-transform', isOpen && 'rotate-180')}
          data-accordion-icon
        />
      </button>
      <div
        data-accordion-content
        className={styles.accordionContent}
        style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden' }}
      >
        <div className="space-y-1 py-1 ps-8">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-item text-sm',
                location.pathname === item.path && 'bg-accent',
              )}
            >
              {item.label}
            </Link>
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
  const location = useLocation();

  return (
    <aside id={id} className={cn('sidebar', className)}>
      <nav className="sidebar-content scrollbar-thin">
        <div className="sidebar-group">
          <div className="sidebar-group-title">منوی اصلی</div>
          <div className="sidebar-menu">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path!}
                className={cn('sidebar-item', location.pathname === item.path && 'bg-accent')}
              >
                <Icon name={item.icon!} className="sidebar-item-icon" />
                <span className="sidebar-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="sidebar-group">
          <div className="sidebar-group-title">کاربران و منابع انسانی</div>
          <div className="sidebar-menu">
            <AccordionGroup
              icon="material-symbols:group"
              label="کاربران"
              items={usersNavItems.map((i) => ({ label: i.label, path: i.path! }))}
            />
            <AccordionGroup
              icon="material-symbols:badge"
              label="پرسنل"
              items={hrNavItems.map((i) => ({ label: i.label, path: i.path! }))}
            />
          </div>
        </div>

        <div className="sidebar-group">
          <div className="sidebar-group-title">ابزارها</div>
          <div className="sidebar-menu">
            {toolsNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path!}
                className={cn('sidebar-item', location.pathname === item.path && 'bg-accent')}
              >
                <span className="sidebar-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
