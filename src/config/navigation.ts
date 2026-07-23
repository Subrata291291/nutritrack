export interface NavItem {
  to: string;
  icon: string;
  label: string;
}

export const defaultNavItems: NavItem[] = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/log', icon: 'restaurant', label: 'Nutrition Log' },
  { to: '/planner', icon: 'event_note', label: 'Meal Plans' },
  { to: '/recipes', icon: 'menu_book', label: 'Recipe Library' },
  { to: '/food', icon: 'nutrition', label: 'Food Library' },
  { to: '/insights', icon: 'insights', label: 'Insights' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];
