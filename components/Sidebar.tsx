'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map, Route, Users, Bus,
  BarChart2, Bell, Settings
} from 'lucide-react';

const navItems = [
  { href: '/',         label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/fleet',    label: 'Live Fleet',     icon: Map             },
  { href: '/routes',   label: 'Routes',         icon: Route           },
  { href: '/students', label: 'Students',       icon: Users           },
  { href: '/drivers',  label: 'Drivers',        icon: Bus             },
  { href: '/analytics',label: 'Analytics',      icon: BarChart2       },
  { href: '/alerts',   label: 'Alerts',         icon: Bell, badge: 3  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-name">EduPulse</div>
        <div className="sidebar-brand-sub">Operational Intelligence</div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={active ? 2.5 : 2} className="nav-icon" />
              <span>{label}</span>
              {badge && <span className="nav-badge-dot ml-auto">{badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link href="/settings" className={`settings-btn ${pathname.startsWith('/settings') ? 'text-slate-900 font-semibold' : ''}`}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
