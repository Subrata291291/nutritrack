import { NavLink } from 'react-router-dom';
import { cn } from '@utils/cn';
import { defaultNavItems, type NavItem } from '@config/navigation';

interface SidebarProps {
  items?: NavItem[];
  onNavClick?: () => void;
  bottom?: React.ReactNode;
}

export function Sidebar({ items = defaultNavItems, onNavClick, bottom }: SidebarProps) {
  return (
    <aside className="h-full w-64 flex flex-col py-6">
      <div className="px-6 mb-8">
        <h1 className="text-[24px] font-semibold text-primary">NutriTrack</h1>
        <p className="text-sm text-on-surface-variant opacity-70">Health Dashboard</p>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={onNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-6 py-2 text-base transition-colors',
                    isActive
                      ? 'text-primary font-bold border-r-4 border-primary bg-primary/5'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  )
                }
              >
                <span className="material-symbols-outlined mr-4">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {bottom || (
        <div className="px-6 mt-auto">
          <button className="w-full py-4 bg-primary-container text-on-primary text-sm font-semibold tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1">
            <span className="material-symbols-outlined">add</span>
            Log Meal
          </button>
        </div>
      )}
    </aside>
  );
}
