import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { defaultNavItems, type NavItem } from '@config/navigation';
import { authService } from '@services/auth.service';

interface SidebarProps {
  items?: NavItem[];
  onNavClick?: () => void;
  bottom?: React.ReactNode;
}

export function Sidebar({ items = defaultNavItems, onNavClick, bottom }: SidebarProps) {
  const navigate = useNavigate();
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  return (
    <aside className="h-full w-64 flex flex-col py-4">
      <div className="px-6 mb-6">
        <h1 className="text-[22px] font-bold text-primary tracking-tight">NutriTrack</h1>
        <p className="text-xs text-on-surface-variant/60 mt-0.5">Health Dashboard</p>
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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-all group">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm font-medium tracking-wide">Sign Out</span>
            <span className="ml-auto">
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}
