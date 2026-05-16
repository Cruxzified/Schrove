'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accentColor?: string;
}

export default function SlidePanel({ open, onClose, title, subtitle, children, accentColor = 'var(--accent)' }: SlidePanelProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="slide-panel-overlay" onClick={onClose} />
      <div className="slide-panel">

        {/* Header */}
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ 
              width: 6, height: 48, borderRadius: 99, flexShrink: 0,
              background: `linear-gradient(180deg, ${accentColor}, transparent)` 
            }} />
            <div>
              <h2 className="panel-title">{title}</h2>
              {subtitle && <p className="panel-sub">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose}
            className="topbar-icon-btn"
            style={{ marginLeft: 16, flexShrink: 0, border: '1px solid var(--border)', background: 'var(--surface-solid)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="panel-body">
          {children}
        </div>
      </div>
    </>
  );
}
