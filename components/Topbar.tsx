'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Search, Bell, Plus, ChevronDown, Clock, Sun, Moon } from 'lucide-react';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  action?: { label: string; onClick?: () => void; icon?: React.ElementType };
  searchPlaceholder?: string;
}

export default function Topbar({
  title,
  subtitle,
  action,
  searchPlaceholder = 'Search routes, buses, students…',
}: TopbarProps) {
  const [time, setTime] = useState('');
  const [unread] = useState(3);
  const [searchVal, setSearchVal] = useState('');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar">
      {/* Left */}
      <div className="topbar-left">
        {title && (
          <div style={{ marginRight: 12 }}>
            <div className="page-heading">{title}</div>
            {subtitle && <div className="page-breadcrumb">{subtitle}</div>}
          </div>
        )}

        <div className="search-bar">
          <Search size={16} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
      </div>

      {/* Right */}
      <div className="topbar-right">
        {/* Time chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--sidebar-active-bg)', border: '1px solid transparent',
          borderRadius: 10, padding: '6px 12px',
          fontSize: 13, fontWeight: 600, color: 'var(--text-3)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <Clock size={14} />
          {time}
        </div>

        {/* Action button */}
        {action && (
          <button className="btn-primary" onClick={action.onClick}>
            {action.icon ? <action.icon size={16} /> : <Plus size={16} />}
            {action.label}
          </button>
        )}

        {/* Theme Toggle */}
        {mounted && (
          <button 
            className="topbar-icon-btn" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {/* Bell */}
        <button className="topbar-icon-btn" style={{ position: 'relative' }}>
          <Bell size={18} />
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 8, right: 8,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--red)',
              border: '2px solid var(--surface)',
            }} />
          )}
        </button>

        <div className="topbar-divider" />

        {/* Profile */}
        <div className="profile-chip">
          <div className="profile-avatar">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
          </div>
          <div style={{ paddingRight: 4 }}>
            <div className="profile-name">Admin</div>
            <div className="profile-role">Chief Controller</div>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-4)' }} />
        </div>

        {/* Logout */}
        <button
          className="btn-danger"
          onClick={() => import('@/lib/actions/auth').then(m => m.logOut())}
          style={{ height: 36, padding: '0 14px', fontSize: 13 }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
