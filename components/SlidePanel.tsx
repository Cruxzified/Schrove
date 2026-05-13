'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accentColor?: string;
}

export default function SlidePanel({ open, onClose, title, subtitle, children, accentColor = '#3B82F6' }: SlidePanelProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="slide-panel-overlay" onClick={onClose} />
      <div className="slide-panel glass-overlay" style={{ width: 480 }}>

        {/* Header */}
        <div className="sticky top-0 z-10 px-7 py-5" style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226,232,240,0.7)',
        }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-12 rounded-full flex-shrink-0" style={{ background: `linear-gradient(180deg,${accentColor},${accentColor}44)` }} />
              <div>
                <h2 className="font-black text-violet-900" style={{ fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h2>
                {subtitle && <p className="text-sm text-violet-400 mt-0.5">{subtitle}</p>}
              </div>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all ml-4 flex-shrink-0"
              style={{ border: '1.5px solid rgba(226,232,240,0.9)', background: 'rgba(248,250,252,0.8)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,250,252,0.8)'; }}>
              <X size={15} className="text-violet-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-7 py-6 space-y-5">
          {children}
        </div>
      </div>
    </>
  );
}
