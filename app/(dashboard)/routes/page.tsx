'use client';
import { useState } from 'react';
import { MapPin, AlertCircle, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import Topbar from '@/components/Topbar';
import SlidePanel from '@/components/SlidePanel';
import { routes } from '@/lib/data';

type AppRoute = typeof routes[number];

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  'on-time': { bg: 'var(--green-bg)', color: 'var(--green)', label: 'On Time' },
  'delayed':  { bg: 'var(--amber-bg)', color: 'var(--amber)', label: 'Delayed' },
  'idle':     { bg: 'var(--sidebar-active-bg)', color: 'var(--text-3)', label: 'Idle' },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* AI Savings */}
          <div className="dark-card flex flex-col justify-between">
            <div>
              <div className="dark-card-icon">
                <Zap size={20} style={{ color: '#818CF8' }} />
              </div>
              <div className="dark-card-value">$18,240</div>
              <div className="dark-card-label">Potential Monthly Savings</div>
            </div>
            <div className="dark-card-delta" style={{ marginTop: 24 }}>
              <button
                onClick={() => setApplied(true)}
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 10,
                  background: applied ? 'var(--green)' : 'linear-gradient(135deg, var(--accent), var(--blue))',
                  color: 'white', border: 'none', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', transition: 'background 0.25s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <TrendingUp size={16} />
                {applied ? '✓ Optimization Applied' : 'Apply AI Optimization'}
              </button>
            </div>
          </div>

          {/* Ghost Stop Warning */}
          <div className="section-card col-span-2">
            <div className="section-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--amber-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={16} style={{ color: 'var(--amber)' }} />
                </div>
                <span className="section-card-title">Ghost Stop Warnings</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, background: 'var(--amber-bg)', color: 'var(--amber)', padding: '4px 10px', borderRadius: 8 }}>7 Stops · 0% Attendance</span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ background: 'var(--amber-bg)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '16px 20px' }}>
                <p style={{ fontSize: 14, color: 'var(--amber)', fontWeight: 600, marginBottom: 12, lineHeight: 1.5 }}>
                  Removing these stops could save an estimated <strong>$2,340</strong> in fuel this month.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['R-04 Stop 3', 'R-07 Stop 1', 'R-12 Stop 5', 'R-09 Stop 2', 'R-02 Stop 4'].map(stop => (
                    <span key={stop} style={{
                      background: 'var(--surface-solid)', border: '1px solid rgba(245,158,11,0.25)',
                      color: 'var(--amber)', fontSize: 12, fontWeight: 700,
                      padding: '4px 12px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace",
                    }}>{stop}</span>
                  ))}
                </div>
                <button
                  style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: 'var(--amber)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                  onClick={() => alert('Ghost stops flagged for review')}
                >
                  Review & Remove Stops <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Route table */}
        <div className="section-card">
          <div className="section-card-header">
            <span className="section-card-title">Route Directory</span>
            <span style={{ fontSize: 13, color: 'var(--text-4)', fontWeight: 500 }}>{routes.length} routes configured</span>
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
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                        {r.id}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{r.name}</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-3)' }}>{r.distance} km</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 100, height: 6, borderRadius: 99, background: 'var(--sidebar-active-bg)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, width: `${r.efficiency}%`, background: r.efficiency > 80 ? 'var(--green)' : r.efficiency > 60 ? 'var(--amber)' : 'var(--red)' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', width: 36 }}>{r.efficiency}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: ss.bg, color: ss.color }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.color, display: 'inline-block' }} />
                        {ss.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <ChevronRight size={18} style={{ color: 'var(--text-5)', display: 'inline-block' }} />
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
        >
          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Quick metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[
                  { label: 'Distance',   val: `${selected.distance} km` },
                  { label: 'Efficiency', val: `${selected.efficiency}%` },
                  { label: 'Stops',      val: `${selected.stops}` },
                ].map(m => (
                  <div key={m.label} style={{ background: 'var(--sidebar-active-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>{m.val}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 500, marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600 }}>Current Status</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99,
                    fontSize: 13, fontWeight: 600,
                    background: statusStyle[selected.status]?.bg ?? 'var(--sidebar-active-bg)',
                    color: statusStyle[selected.status]?.color ?? 'var(--text-3)',
                  }}>
                    {statusStyle[selected.status]?.label ?? selected.status}
                  </span>
                </div>
              </div>

              {/* Efficiency bar */}
              <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600 }}>Route Efficiency</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{selected.efficiency}%</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${selected.efficiency}%` }} />
                </div>
              </div>

              {/* Stops */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Scheduled Stops</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Depot', 'Green Park', 'Sunrise Colony', 'Central School'].map((stop, i) => (
                    <div key={stop} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
                      <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', flex: 1 }}>{stop}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {['07:00', '07:18', '07:34', '08:10'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('Editing route…')}>Edit Route</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('Optimizing route…')}>
                  <Zap size={16} /> Optimize
                </button>
              </div>
            </div>
          )}
        </SlidePanel>
      </div>
    </>
  );
}
