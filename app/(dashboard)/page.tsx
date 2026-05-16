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
  { id: '104', delay: '+12m', name: 'Canyon Ridge Run',  driver: 'Michael Chen',   initials: 'MC', color: 'var(--red)' },
  { id: '218', delay: '+08m', name: 'Westside Loop',     driver: 'Sarah Jenkins',  initials: 'SJ', color: 'var(--amber)' },
  { id: '088', delay: '+05m', name: 'North Station Exp', driver: 'David Miller',   initials: 'DM', color: 'var(--amber)' },
];

const attendanceRoutes = [
  { id: 'R-12', perc: 100, name: 'Lakeside Heights', students: '24/24', color: 'var(--green)' },
  { id: 'R-45', perc: 82,  name: 'Oakwood Academy',  students: '18/22', color: 'var(--accent)' },
  { id: 'R-09', perc: 96,  name: 'Hillcrest Valley', students: '31/32', color: 'var(--green)' },
  { id: 'R-03', perc: 64,  name: 'Pine Street',      students: '9/14',  color: 'var(--amber)' },
];

const kpis = [
  {
    label: 'Active Buses',
    value: '42',
    delta: '+3',
    pos: true,
    sub: 'Fleet in operation',
    icon: Bus,
    iconBg: 'var(--accent-light)',
    iconColor: 'var(--accent)',
    dot: 'var(--green)',
  },
  {
    label: 'Delayed Buses',
    value: '3',
    delta: '-1',
    pos: false,
    sub: 'Action required',
    icon: AlertTriangle,
    iconBg: 'var(--red-bg)',
    iconColor: 'var(--red)',
    dot: null,
  },
  {
    label: 'Fleet Efficiency',
    value: '98.4%',
    delta: '+1.2%',
    pos: true,
    sub: 'vs last week',
    icon: TrendingUp,
    iconBg: 'var(--green-bg)',
    iconColor: 'var(--green)',
    dot: null,
  },
  {
    label: 'Routes Completed',
    value: '12/45',
    delta: '27%',
    pos: true,
    sub: 'Morning run progress',
    icon: CheckCircle,
    iconBg: 'var(--amber-bg)',
    iconColor: 'var(--amber)',
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {kpis.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} className="stat-card group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: k.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s' }} className="group-hover:scale-110">
                    <Icon size={20} style={{ color: k.iconColor }} />
                  </div>
                  {k.dot && <div style={{ width: 10, height: 10, borderRadius: '50%', background: k.dot, boxShadow: `0 0 0 4px ${k.dot}33` }} />}
                  {!k.dot && (
                    <span className={`stat-delta ${k.pos ? 'pos' : 'neg'}`}>{k.delta}</span>
                  )}
                </div>
                <div className="stat-label">{k.label}</div>
                <div className="stat-value">{k.value}</div>
                <div className="stat-sub">{k.sub}</div>
              </div>
            );
          })}
        </div>

        {/* MIDDLE: Chart + Delayed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="card col-span-2 flex flex-col" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div>
                <div className="card-title">Live Efficiency</div>
                <div className="card-subtitle">Fleet performance during the morning run</div>
              </div>
              <div className="filter-tabs">
                {(['realtime', 'historical'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab === 'realtime' ? 'Real-time' : 'Historical'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, padding: '16px 24px 24px', minHeight: 280, height: 280 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={efficiencyData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: 'var(--text-4)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-solid)', boxShadow: 'var(--shadow-lg)', padding: '12px 16px', fontSize: 14 }}
                      itemStyle={{ color: 'var(--accent)', fontWeight: 700 }}
                      labelStyle={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 4 }}
                    />
                    <Area
                      type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3}
                      fillOpacity={1} fill="url(#effGrad)"
                      activeDot={{ r: 6, fill: 'var(--surface-solid)', stroke: 'var(--accent)', strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--sidebar-active-bg)', borderRadius: 12, animation: 'pulse 2s infinite' }} />
              )}
            </div>
          </div>

          {/* Delayed Routes */}
          <div className="card flex flex-col" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--red)' }} />
                </div>
                <div className="card-title">Delayed Routes</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, background: 'var(--red-bg)', color: 'var(--red)', padding: '4px 10px', borderRadius: 8 }}>
                {delayedRoutes.length} Active
              </span>
            </div>

            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
              {delayedRoutes.map((r, i) => (
                <div key={i} className="hover-lift" style={{
                  border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px',
                  cursor: 'pointer', background: 'var(--surface-solid)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--accent-muted)', color: 'var(--accent)', padding: '3px 8px', borderRadius: 6, letterSpacing: '0.05em' }}>
                        BUS #{r.id}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.delay}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>{r.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--sidebar-active-bg)', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
                        {r.initials}
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{r.driver}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--text-5)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ATTENDANCE OVERVIEW */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)' }}>Attendance Overview</div>
              <div style={{ fontSize: 14, color: 'var(--text-4)', marginTop: 4 }}>Real-time student boarding across active routes</div>
            </div>
            <button className="btn-secondary" style={{ gap: 8 }}>
              View All Reports <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {attendanceRoutes.map((rt, i) => (
              <div key={i} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                    ROUTE {rt.id}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: rt.color }}>{rt.perc}%</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>{rt.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-4)', fontWeight: 500, marginBottom: 20 }}>{rt.students} Boarded</div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${rt.perc}%`, background: rt.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Dispatch */}
          <div className="dark-card" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#F5F5F7', marginBottom: 4 }}>Need to dispatch an emergency vehicle?</div>
              <div style={{ fontSize: 14, color: '#AEAEB2' }}>Instantly notify drivers and parents with one click.</div>
            </div>
            <button
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--blue))', flexShrink: 0, border: 'none', boxShadow: '0 4px 16px rgba(10, 132, 255, 0.3)' }}
            >
              <Plus size={16} /> Dispatch Emergency Bus
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
