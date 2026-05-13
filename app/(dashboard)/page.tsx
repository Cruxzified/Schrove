'use client';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, XAxis, BarChart, Bar, Cell
} from 'recharts';
import Topbar from '@/components/Topbar';

const efficiencyData = [
  { time: '00:00', value: 30 },
  { time: '04:00', value: 45 },
  { time: '08:00', value: 85 },
  { time: '12:00', value: 60 },
  { time: '16:00', value: 75 },
  { time: '20:00', value: 90 },
  { time: '23:59', value: 82 },
];

const routePerformance = [
  { name: 'North Corridor', onTime: 82, delayed: 12 },
  { name: 'East Side Exp.', onTime: 65, delayed: 25 },
  { name: 'Downtown Loop', onTime: 95, delayed: 3 },
];

const alerts = [
  { id: 1, title: 'Bus 42 delayed by 15 mins', desc: 'Heavy traffic reported on I-95 corridor. Rerouting suggested.', time: '2 MINS AGO', type: 'error' },
  { id: 2, title: 'Driver swap completed', desc: 'Terminal A: Smith relieved Johnson for Route 12.', time: '14 MINS AGO', type: 'info' },
  { id: 3, title: 'Route 12 completed', desc: 'Arrived at final destination safely. 98% efficiency score.', time: '28 MINS AGO', type: 'success' },
  { id: 4, title: 'Maintenance scheduled', desc: 'Bus 88 scheduled for routine oil change tomorrow 08:00.', time: '1 HR AGO', type: 'maintenance' },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Topbar title="Operational Intelligence" />
      
      <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-md p-md">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="flex h-full flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm transition-all hover:shadow-md">
            <div className="mb-sm flex justify-between items-start">
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Active Buses</span>
              <span className="material-symbols-outlined text-[20px] text-primary">directions_bus</span>
            </div>
            <div>
              <div className="font-metric-md text-on-surface">342</div>
              <div className="mt-xs flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">trending_up</span>
                <span className="font-label-sm text-on-surface-variant">Active right now</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex h-full flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm transition-all hover:shadow-md">
            <div className="mb-sm flex justify-between items-start">
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Delayed Buses</span>
              <span className="material-symbols-outlined text-[20px] text-outline">schedule</span>
            </div>
            <div>
              <div className="font-metric-md text-on-surface">14</div>
              <div className="mt-xs flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px] text-[#b45309]">warning</span>
                <span className="font-label-sm text-[#b45309]">Amber warning active</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex h-full flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm transition-all hover:shadow-md">
            <div className="mb-sm flex justify-between items-start">
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Fleet Efficiency</span>
              <span className="material-symbols-outlined text-[20px] text-primary">bolt</span>
            </div>
            <div>
              <div className="font-metric-md text-on-surface">92.4%</div>
              <div className="mt-xs flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px] text-[#15803d]">arrow_upward</span>
                <span className="font-label-sm text-[#15803d]">+2.1% vs last week</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex h-full flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm transition-all hover:shadow-md">
            <div className="mb-sm flex justify-between items-start">
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Routes Completed</span>
              <span className="material-symbols-outlined text-[20px] text-outline">check_circle</span>
            </div>
            <div>
              <div className="font-metric-md text-on-surface">845</div>
              <div className="mt-xs flex w-full items-center">
                <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="ml-xs font-label-sm text-on-surface-variant">75%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Intelligence Section */}
        <div className="mt-sm">
          <h2 className="font-headline-sm mb-md text-on-surface">Operational Intelligence</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
            {/* Left Column: Charts */}
            <div className="lg:col-span-8 flex flex-col gap-md">
              {/* Fleet Efficiency Chart */}
              <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
                <div className="mb-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-headline-sm text-on-surface">Fleet Efficiency & Performance</h3>
                    <p className="font-body-base text-on-surface-variant">24-hour network aggregate</p>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="flex items-center gap-xs font-label-sm text-on-surface-variant">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      Efficiency Score
                    </span>
                    <button className="flex items-center gap-xs rounded-lg border border-outline-variant px-xs py-[2px] font-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors">
                      Today <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </button>
                  </div>
                </div>
                
                <div className="h-[240px] w-full">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={efficiencyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#464555' }} 
                          dy={10}
                        />
                        <YAxis 
                          hide 
                          domain={[0, 100]} 
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #c7c4d8', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#4f46e5" 
                          strokeWidth={3} 
                          fill="url(#chartGradient)" 
                          activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : <div className="h-full w-full animate-pulse bg-surface-container-low" />}
                </div>
              </div>

              {/* Route Performance Bar Chart */}
              <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
                <h3 className="font-headline-sm mb-md text-on-surface">Route Performance Distribution</h3>
                <div className="flex flex-col gap-sm">
                  {routePerformance.map((route, i) => (
                    <div key={i} className="flex w-full items-center gap-sm">
                      <span className="w-[100px] truncate text-right font-label-sm text-on-surface">{route.name}</span>
                      <div className="flex h-3 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${route.onTime}%` }}></div>
                        <div className="h-full bg-[#f59e0b] transition-all duration-500" style={{ width: `${route.delayed}%` }}></div>
                      </div>
                      <span className="w-[40px] text-right font-label-sm text-on-surface-variant">{route.onTime}%</span>
                    </div>
                  ))}
                  
                  <div className="mt-sm flex items-center justify-end gap-md border-t border-outline-variant pt-sm">
                    <span className="flex items-center gap-xs font-label-sm text-on-surface-variant">
                      <span className="h-2 w-2 rounded-full bg-primary"></span> On-Time
                    </span>
                    <span className="flex items-center gap-xs font-label-sm text-on-surface-variant">
                      <span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span> Delayed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Alerts */}
            <div className="lg:col-span-4 flex flex-col h-full">
              <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm h-full lg:max-h-[600px]">
                <div className="mb-md flex items-center justify-between border-b border-outline-variant pb-xs">
                  <h3 className="font-headline-sm flex items-center gap-xs text-on-surface">
                    Real-time Alerts
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                  </h3>
                  <button className="font-label-sm text-primary hover:underline transition-all">View All</button>
                </div>
                
                <div className="flex flex-1 flex-col gap-sm overflow-y-auto pr-xs custom-scrollbar">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-sm border-b border-outline-variant border-opacity-50 py-xs last:border-0 hover:bg-surface-container-low transition-colors rounded-lg px-1">
                      <div className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                        alert.type === 'error' ? 'bg-error-container' : 
                        alert.type === 'success' ? 'bg-[#dcfce7]' : 
                        alert.type === 'info' ? 'bg-primary-container/20' : 'bg-surface-container-highest'
                      }`}>
                        <span className={`material-symbols-outlined text-[14px] ${
                          alert.type === 'error' ? 'text-on-error-container' : 
                          alert.type === 'success' ? 'text-[#166534]' : 
                          alert.type === 'info' ? 'text-primary' : 'text-on-surface-variant'
                        }`}>
                          {alert.type === 'error' ? 'warning' : 
                           alert.type === 'success' ? 'check_circle' : 
                           alert.type === 'info' ? 'info' : 'build'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm font-semibold text-on-surface">{alert.title}</span>
                        <span className="font-body-base text-[13px] text-on-surface-variant">{alert.desc}</span>
                        <span className="font-label-caps mt-xs text-outline text-[10px]">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-lg"></div>
      </main>
    </div>
  );
}
