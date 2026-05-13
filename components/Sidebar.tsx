'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',         label: 'Dashboard',     icon: 'dashboard' },
  { href: '/fleet',    label: 'Live Fleet',    icon: 'airport_shuttle' },
  { href: '/routes',   label: 'Routes',        icon: 'directions_bus' },
  { href: '/students', label: 'Students',      icon: 'school' },
  { href: '/drivers',  label: 'Drivers',       icon: 'group' },
  { href: '/analytics',label: 'Analytics',     icon: 'monitoring' },
  { href: '/alerts',   label: 'Alerts',        icon: 'notifications_active' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col gap-xs border-r border-outline-variant bg-surface-container-lowest p-sm dark:border-outline dark:bg-inverse-surface">
      <div className="mb-md flex items-center gap-sm px-xs py-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-on-primary">
          <span className="material-symbols-outlined text-[20px]">route</span>
        </div>
        <div>
          <h1 className="font-headline-sm text-on-surface tracking-tight dark:text-inverse-on-surface">Wizor</h1>
          <p className="font-label-sm text-on-surface-variant">Intelligence Platform</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-base">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-sm rounded-xl px-sm py-xs transition-all duration-200 ${
                active
                  ? 'bg-secondary-container font-semibold text-on-secondary-container translate-x-1 dark:bg-secondary dark:text-on-secondary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface dark:text-surface-variant dark:hover:bg-surface-container'
              }`}
            >
              <span 
                className={`material-symbols-outlined ${active ? 'fill' : ''}`}
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className="font-label-sm">{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto border-t border-outline-variant pt-md">
        <Link
          href="/settings"
          className={`flex items-center gap-sm rounded-xl px-sm py-xs transition-all ${
            pathname.startsWith('/settings')
              ? 'bg-secondary-container font-semibold text-on-secondary-container dark:bg-secondary dark:text-on-secondary shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface dark:text-surface-variant dark:hover:bg-surface-container'
          }`}
        >
          <span 
            className="material-symbols-outlined"
            style={{ fontVariationSettings: pathname.startsWith('/settings') ? "'FILL' 1" : "'FILL' 0" }}
          >
            settings
          </span>
          <span className="font-label-sm">Settings</span>
        </Link>
      </div>
    </nav>
  );
}
