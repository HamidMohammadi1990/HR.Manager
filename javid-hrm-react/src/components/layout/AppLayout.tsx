import { Outlet } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { Drawer, QuickAccessDialog } from './Dialog';
import { useKeyboardShortcut, useSidebar } from '@/hooks';

export function AppLayout() {
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isHidden, expandSidebar } = useSidebar();

  const openQuickAccess = useCallback(() => setQuickAccessOpen(true), []);

  useKeyboardShortcut('k', openQuickAccess, { ctrl: true });

  return (
    <div className="app-layout">
      <Sidebar />

      <Drawer open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} id="mobile-sidebar-drawer">
        <Sidebar id="mobile-sidebar-drawer-content" />
        <button
          type="button"
          className="absolute start-4 top-4"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="بستن"
        />
      </Drawer>

      <AppHeader
        onOpenQuickAccess={openQuickAccess}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        showSidebarExpand={isHidden}
        onExpandSidebar={expandSidebar}
      />

      <QuickAccessDialog open={quickAccessOpen} onClose={() => setQuickAccessOpen(false)} />

      <div className="app-body">
        <main className="app-main flex flex-col">
          <Outlet />
        </main>
      </div>

      <AppFooter />
    </div>
  );
}
