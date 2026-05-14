'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';
import { AlertTriangle, ChevronRight, Plus, TrendingUp, Bus, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';
import Topbar from '@/components/Topbar';

const efficiencyData = [
  { time: '6AM',  value: 30 },
  { time: '6:30', value: 35 },
  { time: '7AM',  value: 32 },
  { time: '7:30', value: 28 },
  { time: '8AM',  value: 55 },
  { time: '8:30', value: 78 },
  { time: '8:45', value: 88 },
  { time: '9AM',  value: 84 },
];

const delayedRoutes = [
  { id: '104', delay: '+12m', name: 'Canyon Ridge Run',  driver: 'Michael Chen',   initials: 'MC', color: '#EF4444' },
  { id: '218', delay: '+08m', name: 'Westside Loop',     driver: 'Sarah Jenkins',  initials: 'SJ', color: '#F59E0B' },
  { id: '088', delay: '+05m', name: 'North Station Exp', driver: 'David Miller',   initials: 'DM', color: '#F59E0B' },
];

const attendanceRoutes = [
  { id: 'R-12', perc: 100, name: 'Lakeside Heights', students: '24/24', color: '#10B981' },
  { id: 'R-45', perc: 82,  name: 'Oakwood Academy',  students: '18/22', color: '#6366F1' },
  { id: 'R-09', perc: 96,  name: 'Hillcrest Valley', students: '31/32', color: '#10B981' },
  { id: 'R-03', perc: 64,  name: 'Pine Street',      students: '9/14',  color: '#F59E0B' },
];

const kpis = [
  {
    label: 'Active Buses',
    value: '42',
    delta: '+3',
    pos: true,
    sub: 'Fleet in operation',
    icon: Bus,
    iconBg: '#EEF2FF',
    iconColor: '#6366F1',
    dot: '#10B981',
  },
  {
    label: 'Delayed Buses',
    value: '3',
    delta: '-1',
    pos: false,
    sub: 'Action required',
    icon: AlertTriangle,
    iconBg: '#FEF2F2',
    iconColor: '#EF4444',
    dot: null,
  },
  {
    label: 'Fleet Efficiency',
    value: '98.4%',
    delta: '+1.2%',
    pos: true,
    sub: 'vs last week',
    icon: TrendingUp,
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
    dot: null,
  },
  {
    label: 'Routes Completed',
    value: '12/45',
    delta: '27%',
    pos: true,
    sub: 'Morning run progress',
    icon: CheckCircle,
    iconBg: '#FFFBEB',
    iconColor: '#F59E0B',
    dot: null,
  },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'realtime' | 'historical'>('realtime');

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <Topbar title="Overview" subtitle="Good morning — here's what's happening today" />

      <div className="page-content">

        {/* KPI STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          {kpis.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: k.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: k.iconColor }} />
                  </div>
                  {k.dot && <div style={{ width: 8, height: 8, borderRadius: '50%', background: k.dot, boxShadow: `0 0 0 3px ${k.dot}33` }} />}
                  {!k.dot && (
                    <span className={`stat-delta ${k.pos ? 'pos' : 'neg'}`}>{k.delta}</span>
                  )}
                </div>
                <div className="stat-label">{k.label}</div>
                <div className="stat-value" style={{ fontSize: 30 }}>{k.value}</div>
                <div className="stat-sub">{k.sub}</div>
              </div>
            );
          })}
        </div>

        {/* MIDDLE: Chart + Delayed */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {/* Chart */}
          <div className="card-white col-span-2 flex flex-col" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div>
                <div className="card-title">Live Efficiency</div>
                <div className="card-subtitle">Fleet performance during the morning run</div>
              </div>
              <div style={{ display: 'flex', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 3, gap: 2 }}>
                {(['realtime', 'historical'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 600, transition: 'all 0.15s',
                      background: activeTab === tab ? 'white' : 'transparent',
                      color: activeTab === tab ? 'var(--text-1)' : 'var(--text-4)',
                      boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    {tab === 'realtime' ? 'Real-time' : 'Historical'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, padding: '8px 20px 16px', minHeight: 240, height: 240 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={efficiencyData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: '10px 14px', fontSize: 13 }}
                      itemStyle={{ color: '#6366F1', fontWeight: 700 }}
                      labelStyle={{ color: 'var(--text-3)', fontSize: 11 }}
                    />
                    <Area
                      type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2.5}
                      fillOpacity={1} fill="url(#effGrad)"
                      activeDot={{ r: 5, fill: '#6366F1', stroke: '#fff', strokeWidth: 2.5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--bg)', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />
              )}
            </div>
          </div>

          {/* Delayed Routes */}
          <div className="card-white flex flex-col" style={{ overflow: 'hidden' }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={15} style={{ color: 'var(--red)' }} />
                </div>
                <div className="card-title">Delayed Routes</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--red-bg)', color: 'var(--red)', padding: '2px 8px', borderRadius: 6 }}>
                {delayedRoutes.length} Active
              </span>
            </div>

            <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
              {delayedRoutes.map((r, i) => (
                <div key={i} className="hover-lift" style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px',
                  cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, background: 'var(--accent-muted)', color: 'var(--accent)', padding: '2px 7px', borderRadius: 5, letterSpacing: '0.04em' }}>
                        BUS #{r.id}
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: r.color }}>{r.delay}</span>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-1)', marginBottom: 5 }}>{r.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--text-1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>
                        {r.initials}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>{r.driver}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-5)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ATTENDANCE OVERVIEW */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>Attendance Overview</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-4)', marginTop: 2 }}>Real-time student boarding across active routes</div>
            </div>
            <button className="btn-secondary" style={{ gap: 6 }}>
              View All Reports <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {attendanceRoutes.map((rt, i) => (
              <div key={i} className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                    ROUTE {rt.id}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: rt.color }}>{rt.perc}%</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3 }}>{rt.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 500, marginBottom: 14 }}>{rt.students} Boarded</div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${rt.perc}%`, background: rt.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Dispatch */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: '20px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 3 }}>Need to dispatch an emergency vehicle?</div>
              <div style={{ fontSize: 12.5, color: '#64748B' }}>Instantly notify drivers and parents with one click.</div>
            </div>
            <button
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', flexShrink: 0 }}
            >
              <Plus size={15} /> Dispatch Emergency Bus
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
