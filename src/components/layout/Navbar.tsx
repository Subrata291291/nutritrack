import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@contexts/ThemeContext';
import { cn } from '@utils/cn';
import { notificationsService } from '@services/notifications.service';
import type { AppNotification } from '@services/notifications.service';

interface NavbarProps {
  onMenuToggle?: () => void;
  searchPlaceholder?: string;
}

export function Navbar({ onMenuToggle, searchPlaceholder = 'Search meals or recipes...' }: NavbarProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { notifications: items, unread } = await notificationsService.getNotifications();
      setNotifications(items);
      setUnreadCount(unread);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      setUnreadCount(0);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setShowHelp(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-20 h-16 bg-surface-container-lowest/90 backdrop-blur-lg border-b border-outline-variant flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 flex-1">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}

        <div className="hidden sm:flex items-center w-full max-w-96 relative">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-on-surface-variant"
            placeholder={searchPlaceholder}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery('');
              }
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="material-symbols-outlined">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotifications(v => !v); setShowHelp(false); }}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-[10px] font-bold text-white rounded-full px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-2xl mb-2 block">notifications_off</span>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container transition-colors cursor-pointer">
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />}
                      <span className={`material-symbols-outlined text-base mt-0.5 ${n.color}`}>{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm', n.unread ? 'text-on-surface font-medium' : 'text-on-surface-variant')}>{n.text}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div ref={helpRef} className="relative">
          <button
            onClick={() => { setShowHelp(v => !v); setShowNotifications(false); }}
            className="hidden sm:flex p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>

          {showHelp && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xl overflow-hidden z-50">
              <div className="p-4 border-b border-outline-variant">
                <h3 className="text-sm font-semibold mb-1">Help & Support</h3>
                <p className="text-xs text-on-surface-variant">How can we help you today?</p>
              </div>
              <div>
                {[
                  { icon: 'help', text: 'FAQ', desc: 'Browse common questions', onClick: () => navigate('/faq') },
                  { icon: 'description', text: 'Guides', desc: 'Step-by-step tutorials', onClick: () => setShowGuides(true) },
                  { icon: 'forum', text: 'Contact Support', desc: 'Get help from our team', onClick: () => navigate('/support') },
                  { icon: 'feedback', text: 'Send Feedback', desc: 'Help us improve', onClick: () => navigate('/feedback') },
                ].map(item => (
                  <button
                    key={item.text}
                    onClick={() => { setShowHelp(false); item.onClick(); }}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-surface-container transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-base text-primary">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{item.text}</p>
                      <p className="text-xs text-on-surface-variant">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-outline-variant mx-1 lg:mx-2" />

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold leading-none">{user?.displayName || 'User'}</p>
            <p className="text-xs text-on-surface-variant capitalize">{user?.membership || 'Free'} Member</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden bg-surface-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
        </div>
      </div>
      </header>
      {/* Guides modal */}
      {showGuides && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowGuides(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/30 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                </div>
                <div>
                  <h2 className="text-headline-md font-bold text-on-surface">App Guide</h2>
                  <p className="text-sm text-on-surface-variant/70">Learn how to use NutriTrack</p>
                </div>
              </div>
              <button onClick={() => setShowGuides(false)} className="w-8 h-8 rounded-xl hover:bg-surface-container-low flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant/50">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {[
                {
                  icon: 'dashboard',
                  title: 'Dashboard',
                  desc: 'Your daily health snapshot at a glance.',
                  steps: ['View your calorie progress ring', 'Check macros breakdown', 'See your next scheduled meal', 'Track quick stats and insights'],
                },
                {
                  icon: 'menu_book',
                  title: 'Nutrition Log',
                  desc: 'Log everything you eat throughout the day.',
                  steps: ['Click "Add Meal" to log a food item', 'Search foods or browse recent items', 'Adjust portion sizes as needed', 'View your complete daily log'],
                },
                {
                  icon: 'calendar_month',
                  title: 'Meal Planner',
                  desc: 'Plan your meals for the entire week.',
                  steps: ['Use the weekly calendar to pick a day', 'Add meals from the recipe library', 'Drag to reorder your meals', 'Generate a shopping list automatically'],
                },
                {
                  icon: 'auto_awesome',
                  title: 'Recipes',
                  desc: 'Discover healthy recipes tailored for you.',
                  steps: ['Browse recipe categories', 'Use the search bar to find specific meals', 'Click a recipe to view full details', 'Add recipes to your daily log or planner'],
                },
                {
                  icon: 'insights',
                  title: 'Insights',
                  desc: 'Track your progress and trends over time.',
                  steps: ['View weight tracking charts', 'Check your nutritional balance score', 'Celebrate milestones as you progress', 'Get AI-powered smart insights'],
                },
                {
                  icon: 'settings',
                  title: 'Settings',
                  desc: 'Personalize your experience.',
                  steps: ['Update your profile and goals', 'Adjust daily calorie targets', 'Switch between light and dark themes', 'Manage subscription and account'],
                },
              ].map((section) => (
                <div key={section.title} className="bg-surface-container-low/30 rounded-xl p-4 border border-outline-variant/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-[18px]">{section.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-on-surface">{section.title}</h3>
                      <p className="text-xs text-on-surface-variant/70">{section.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 ml-1">
                    {section.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-outline-variant/30 flex-shrink-0 flex justify-end gap-3">
              <button
                onClick={() => setShowGuides(false)}
                className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowGuides(false)}
                className="px-4 py-2 text-sm font-semibold text-on-primary bg-primary hover:bg-primary/90 rounded-xl transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
