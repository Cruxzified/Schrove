'use client';
import { useState, useEffect } from 'react';
import { Search, Bell, Sun, Clock, Plus } from 'lucide-react';
import Image from 'next/image';

interface TopbarProps {
  title?: string;
  action?: { label: string; onClick?: () => void };
  searchPlaceholder?: string;
}

export default function Topbar({ title, action, searchPlaceholder = "Search routes, buses or students..." }: TopbarProps) {
  const [time, setTime] = useState('');
  const [unread] = useState(3);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar">
      {/* Left Area (Optional Title or Actions) */}
      <div className="flex items-center gap-6">
        {title && <h1 className="text-xl font-bold text-violet-900">{title}</h1>}
        
        {/* Search */}
        <div className="search-bar">
          <Search size={16} style={{ color: '#94A3B8', flexShrink: 0 }} />
          <input placeholder={searchPlaceholder} />
        </div>
      </div>

      <div className="topbar-right">
        {/* Primary action button */}
        {action && (
          <button className="btn-dark" onClick={action.onClick}>
            <Plus size={16} />
            {action.label}
          </button>
        )}

        {/* Icons */}
        <div className="flex items-center gap-2">
          <button className="topbar-icon-btn">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
            )}
          </button>
          <button className="topbar-icon-btn"><Sun size={18} /></button>
          <button className="topbar-icon-btn"><Clock size={18} /></button>
        </div>

        <div className="topbar-divider" />

        {/* User */}
        <div className="profile-block">
          <div className="profile-text">
            <div className="profile-name">Admin Administrator</div>
            <div className="profile-role">Chief Controller</div>
          </div>
          <div className="avatar">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
          </div>
          <button 
            onClick={() => {
              import('@/lib/actions/auth').then((m) => m.logOut());
            }}
            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
