'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map, Route, Users, Bus,
  Bell, Settings, Zap
} from 'lucide-react';

const navItems = [
  { href: '/',          label: 'Overview',    icon: LayoutDashboard },
  { href: '/fleet',     label: 'Live Fleet',  icon: Map             },
  { href: '/routes',    label: 'Routes',      icon: Route           },
  { href: '/students',  label: 'Students',    icon: Users           },
  { href: '/drivers',   label: 'Drivers',     icon: Users           },
  { href: '/alerts',    label: 'Alerts',      icon: Bell, badge: 3  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <div className="sidebar-brand-icon">
            <Bus size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="sidebar-brand-name">EduPulse</div>
            <div className="sidebar-brand-sub">Fleet Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={17} strokeWidth={active ? 2.5 : 2} className="nav-icon" />
              <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link
          href="/settings"
          className={`nav-item ${pathname.startsWith('/settings') ? 'active' : ''}`}
          style={{ marginBottom: 0 }}
        >
          <Settings size={17} strokeWidth={2} className="nav-icon" />
          <span>Settings</span>
        </Link>

        {/* System status pill */}
        <div style={{
          marginTop: 14,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.18)',
          borderRadius: 8,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div className="live-dot" />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#34D399' }}>All Systems Live</span>
          <Zap size={12} style={{ color: '#34D399', marginLeft: 'auto' }} />
        </div>
      </div>
    </aside>
  );
}
