'use client';
import { useState } from 'react';
import { MapPin, AlertCircle, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import Topbar from '@/components/Topbar';
import SlidePanel from '@/components/SlidePanel';
import { routes } from '@/lib/data';

type AppRoute = typeof routes[number];

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  'on-time': { bg: '#ECFDF5', color: '#059669', label: 'On Time' },
  'delayed':  { bg: '#FFFBEB', color: '#B45309', label: 'Delayed' },
  'idle':     { bg: '#F1F5F9', color: '#475569', label: 'Idle'    },
};

export default function RoutesPage() {
  const [selected, setSelected] = useState<AppRoute | null>(null);
  const [applied, setApplied] = useState(false);

  return (
    <>
      <Topbar title="Routes" subtitle="Route intelligence & optimization" action={{ label: 'New Route' }} />
      <div className="page-content">

        {/* Header chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span className="chip chip-blue">Active Routes: {routes.length}</span>
          <span className="chip chip-amber">Optimization Available</span>
          <span className="chip chip-green">AI Ready</span>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {/* AI Savings */}
          <div className="dark-card flex flex-col justify-between">
            <div>
              <div className="dark-card-icon">
                <Zap size={18} style={{ color: '#818CF8' }} />
              </div>
              <div className="dark-card-value">$18,240</div>
              <div className="dark-card-label">Potential Monthly Savings</div>
            </div>
            <div className="dark-card-delta">
              <button
                onClick={() => setApplied(true)}
                style={{
                  width: '100%', padding: '10px 0', borderRadius: 9,
                  background: applied ? '#10B981' : '#6366F1',
                  color: 'white', border: 'none', fontWeight: 700, fontSize: 13.5,
                  cursor: 'pointer', transition: 'background 0.25s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}
              >
                <TrendingUp size={15} />
                {applied ? '✓ Optimization Applied' : 'Apply AI Optimization'}
              </button>
            </div>
          </div>

          {/* Ghost Stop Warning */}
          <div className="section-card col-span-2">
            <div className="section-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={14} style={{ color: '#F59E0B' }} />
                </div>
                <span className="section-card-title">Ghost Stop Warnings</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, background: '#FFFBEB', color: '#B45309', padding: '2px 8px', borderRadius: 6 }}>7 Stops · 0% Attendance</span>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 13, color: '#92400E', fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>
                  Removing these stops could save an estimated <strong>$2,340</strong> in fuel this month.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['R-04 Stop 3', 'R-07 Stop 1', 'R-12 Stop 5', 'R-09 Stop 2', 'R-02 Stop 4'].map(stop => (
                    <span key={stop} style={{
                      background: 'white', border: '1px solid rgba(245,158,11,0.25)',
                      color: '#B45309', fontSize: 11.5, fontWeight: 700,
                      padding: '3px 10px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace',
                    }}>{stop}</span>
                  ))}
                </div>
                <button
                  style={{ marginTop: 12, fontSize: 12.5, fontWeight: 600, color: '#B45309', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                  onClick={() => alert('Ghost stops flagged for review')}
                >
                  Review & Remove Stops <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Route table */}
        <div className="section-card">
          <div className="section-card-header">
            <span className="section-card-title">Route Directory</span>
            <span style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 500 }}>{routes.length} routes configured</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Name</th>
                <th>Distance</th>
                <th>Efficiency</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {routes.map(r => {
                const ss = statusStyle[r.status] ?? statusStyle['idle'];
                return (
                  <tr key={r.id} onClick={() => setSelected(r)}>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, fontWeight: 700, color: 'var(--accent)' }}>
                        {r.id}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{r.name}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, color: 'var(--text-3)' }}>{r.distance} km</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 80, height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, width: `${r.efficiency}%`, background: r.efficiency > 80 ? '#10B981' : r.efficiency > 60 ? '#F59E0B' : '#EF4444' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', width: 32 }}>{r.efficiency}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: ss.bg, color: ss.color }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.color, display: 'inline-block' }} />
                        {ss.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <ChevronRight size={15} style={{ color: 'var(--text-5)', display: 'inline-block' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Slide Panel */}
        <SlidePanel
          open={!!selected}
          onClose={() => setSelected(null)}
          title={selected?.name || ''}
          subtitle={`Route ID: ${selected?.id}`}
          accentColor="#6366F1"
        >
          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Quick metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  { label: 'Distance',   val: `${selected.distance} km` },
                  { label: 'Efficiency', val: `${selected.efficiency}%` },
                  { label: 'Stops',      val: `${selected.stops}` },
                ].map(m => (
                  <div key={m.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>{m.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 500, marginTop: 3 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-3)', fontWeight: 500 }}>Current Status</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99,
                    fontSize: 12, fontWeight: 600,
                    background: statusStyle[selected.status]?.bg ?? '#F1F5F9',
                    color: statusStyle[selected.status]?.color ?? '#475569',
                  }}>
                    {statusStyle[selected.status]?.label ?? selected.status}
                  </span>
                </div>
              </div>

              {/* Efficiency bar */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-3)', fontWeight: 500 }}>Route Efficiency</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{selected.efficiency}%</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${selected.efficiency}%` }} />
                </div>
              </div>

              {/* Stops */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Scheduled Stops</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Depot', 'Green Park', 'Sunrise Colony', 'Central School'].map((stop, i) => (
                    <div key={stop} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
                      <MapPin size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)', flex: 1 }}>{stop}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {['07:00', '07:18', '07:34', '08:10'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('Editing route…')}>Edit Route</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('Optimizing route…')}>
                  <Zap size={14} /> Optimize
                </button>
              </div>
            </div>
          )}
        </SlidePanel>
      </div>
    </>
  );
}
