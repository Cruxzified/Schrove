'use client';
import { useState, useEffect } from 'react';
import { Search, Bell, Plus, ChevronDown, Clock } from 'lucide-react';

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

  useEffect(() => {
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
          <div style={{ marginRight: 8 }}>
            <div className="page-heading">{title}</div>
            {subtitle && <div className="page-breadcrumb">{subtitle}</div>}
          </div>
        )}

        <div className="search-bar">
          <Search size={14} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
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
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '5px 10px',
          fontSize: 12.5, fontWeight: 600, color: 'var(--text-3)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <Clock size={12} />
          {time}
        </div>

        {/* Action button */}
        {action && (
          <button className="btn-primary" onClick={action.onClick}>
            {action.icon ? <action.icon size={15} /> : <Plus size={15} />}
            {action.label}
          </button>
        )}

        {/* Bell */}
        <button className="topbar-icon-btn" style={{ position: 'relative' }}>
          <Bell size={17} />
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--red)',
              border: '1.5px solid white',
            }} />
          )}
        </button>

        <div className="topbar-divider" />

        {/* Profile */}
        <div className="profile-chip">
          <div className="profile-avatar">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
          </div>
          <div>
            <div className="profile-name">Admin</div>
            <div className="profile-role">Chief Controller</div>
          </div>
          <ChevronDown size={13} style={{ color: 'var(--text-4)' }} />
        </div>

        {/* Logout */}
        <button
          className="btn-danger"
          onClick={() => import('@/lib/actions/auth').then(m => m.logOut())}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
