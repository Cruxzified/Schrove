'use client';
import { useState } from 'react';
import { TrafficCone, BellOff, CheckCircle2, ArrowRightCircle, ListFilter, X, Bell } from 'lucide-react';
import Topbar from '@/components/Topbar';

const allAlerts = [
  {
    id: 1, type: 'TRAFFIC DELAY', category: 'Traffic',
    color: 'var(--amber)', bg: 'var(--amber-bg)', border: 'rgba(245,158,11,0.2)',
    icon: TrafficCone,
    title: 'Route A-12 experiencing a 12-min delay on 5th Ave.',
    desc: 'Heavy congestion reported near central intersection. Automatic re-routing protocol initiated for downstream stops.',
    time: '10:42 AM', read: false,
    actions: [{ label: 'View Map', fn: () => alert('Opening map…') }, { label: 'Notify Parents', fn: () => alert('Parents notified!') }],
  },
  {
    id: 2, type: 'ATTENDANCE CHANGE', category: 'Attendance',
    color: 'var(--blue)', bg: 'rgba(10,132,255,0.1)', border: 'rgba(10,132,255,0.2)',
    icon: BellOff,
    title: 'Sarah Smith marked absent for the afternoon run.',
    desc: 'Parent portal update received. Route B-08 manifesting stop list adjusted to bypass 42 Oak St.',
    time: '10:35 AM', read: false,
    actions: [{ label: 'Confirm Stop Skip', fn: () => alert('Stop skipped!') }],
  },
  {
    id: 3, type: 'ROUTE COMPLETE', category: 'System',
    color: 'var(--green)', bg: 'var(--green-bg)', border: 'rgba(48,209,88,0.2)',
    icon: CheckCircle2,
    title: 'Route B-08 finished ahead of schedule.',
    desc: "Final drop-off verified at 09:48 AM. Driver status set to 'Returning to Depot'. Efficiency rating: +8%.",
    time: '09:50 AM', read: true,
    actions: [{ label: 'View Log', fn: () => alert('Viewing log…') }],
  },
  {
    id: 4, type: 'DRIVER UPDATE', category: 'System',
    color: 'var(--accent)', bg: 'var(--accent-light)', border: 'rgba(94,92,230,0.2)',
    icon: ArrowRightCircle,
    title: 'Marcus Thompson signed in to Bus 12.',
    desc: 'Pre-trip inspection checklist submitted and approved. GPS sync active.',
    time: '08:15 AM', read: true,
    actions: [{ label: 'View Inspection', fn: () => alert('Opening inspection…') }],
  },
  {
    id: 5, type: 'SAFETY ALERT', category: 'Safety',
    color: 'var(--red)', bg: 'var(--red-bg)', border: 'rgba(255,69,58,0.2)',
    icon: Bell,
    title: 'Bus 004 exceeded speed limit on Highway 6.',
    desc: 'Speed recorded at 67 km/h in a 50 km/h zone. Driver has been automatically warned via in-cab alert system.',
    time: '07:58 AM', read: false,
    actions: [{ label: 'View Report', fn: () => alert('Opening safety report…') }, { label: 'Contact Driver', fn: () => alert('Calling driver…') }],
  },
];

const categories = ['All Alerts', 'System', 'Traffic', 'Attendance', 'Safety'];

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('All Alerts');
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visible = allAlerts.filter(a => {
    if (dismissed.includes(a.id)) return false;
    if (activeTab === 'All Alerts') return true;
    return a.category === activeTab;
  });

  const unread = allAlerts.filter(a => !a.read && !dismissed.includes(a.id)).length;

  return (
    <>
      <Topbar title="Alerts" subtitle="Operational updates & notifications" />
      <div className="page-content">

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="filter-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-tab ${activeTab === cat ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                  {cat === 'All Alerts' && unread > 0 && (
                    <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, background: 'var(--red)', color: 'white', padding: '1px 6px', borderRadius: 99, verticalAlign: 'middle' }}>
                      {unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ fontSize: 12.5, gap: 6 }}>
              <ListFilter size={14} /> Sort by Recent
            </button>
            <button
              className="btn-secondary"
              onClick={() => setDismissed(allAlerts.map(a => a.id))}
              style={{ fontSize: 12.5 }}
            >
              Dismiss All
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Alerts',    val: allAlerts.length,                                    color: 'var(--text-1)', bg: 'var(--surface)' },
            { label: 'Unread',          val: unread,                                               color: 'var(--red)',       bg: 'var(--red-bg)'        },
            { label: 'Traffic',         val: allAlerts.filter(a => a.category === 'Traffic').length,   color: 'var(--amber)', bg: 'var(--amber-bg)'        },
            { label: 'Safety',          val: allAlerts.filter(a => a.category === 'Safety').length,    color: 'var(--accent)', bg: 'var(--accent-light)'        },
          ].map(({ label, val, color, bg }) => (
            <div key={label} style={{ background: bg, border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-4)', fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 22, fontWeight: 800, color }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Alert cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 860 }}>
          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-4)', fontSize: 14 }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <div style={{ fontWeight: 600 }}>All clear! No alerts in this category.</div>
            </div>
          )}

          {visible.map(alert => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className="alert-card hover-lift" style={{
                border: `1px solid ${alert.read ? 'var(--border)' : alert.border}`,
                opacity: alert.read ? 0.8 : 1,
              }}>
                <div className="alert-icon-wrap" style={{ background: alert.bg, color: alert.color, flexShrink: 0 }}>
                  <Icon size={18} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                    <div className="alert-title" style={{ color: alert.color }}>
                      {alert.type}
                      {!alert.read && <span style={{ marginLeft: 8, display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: alert.color, verticalAlign: 'middle' }} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11.5, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'var(--text-4)' }}>{alert.time}</span>
                      <button
                        onClick={() => setDismissed(prev => [...prev, alert.id])}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-5)', padding: 2, display: 'flex', borderRadius: 4, transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-3)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-5)')}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="alert-desc">{alert.title}</div>
                  <div className="alert-sub" style={{ marginBottom: 12 }}>{alert.desc}</div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {alert.actions.map(act => (
                      <button
                        key={act.label}
                        onClick={act.fn}
                        className="btn-secondary"
                        style={{ height: 32, fontSize: 12, padding: '0 12px' }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
