import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileDrawer } from './MobileDrawer';
import { useIsMobile } from '@hooks/useMediaQuery';

export function MainLayout() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="min-h-screen bg-background">
      {isMobile && (
        <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
          <Sidebar onNavClick={closeDrawer} />
        </MobileDrawer>
      )}

      <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant z-50">
        <Sidebar />
      </aside>

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Navbar onMenuToggle={isMobile ? openDrawer : undefined} />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
