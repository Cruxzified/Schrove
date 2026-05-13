'use client';
import { useState } from 'react';
import { Route as RouteIcon, MapPin, Ghost, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import Topbar from '@/components/Topbar';
import SlidePanel from '@/components/SlidePanel';
import { routes } from '@/lib/data';

type AppRoute = typeof routes[number];

export default function RoutesPage() {
  const [selected, setSelected] = useState<AppRoute | null>(null);

  return (
    <>
      <Topbar title="Routes" actionLabel="New Route" />
      <div className="page-content">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="chip chip-blue">Active Routes: {routes.length}</span>
              <span className="chip chip-amber">Optimization Suggested</span>
            </div>
            <h1 className="page-title mb-0">Route Intelligence</h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* AI Optimization Card */}
          <div className="col-span-1 dark-card h-full flex flex-col justify-between">
            <div>
              <div className="dark-card-icon">
                <RouteIcon size={20} color="#60A5FA" />
              </div>
              <div className="dark-card-value text-[32px]">$18,240</div>
              <div className="dark-card-label">Potential Monthly Savings</div>
            </div>
            <div className="dark-card-delta border-none pt-0">
              <button className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                Apply AI Optimization
              </button>
            </div>
          </div>

          <div className="col-span-2 section-card">
            <div className="section-card-header">
              <div className="section-card-title">Ghost Stop Warnings</div>
            </div>
            <div className="p-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">7 Stops with 0% Attendance</h4>
                  <p className="text-xs text-amber-700 mt-1">Removing these stops will save an estimated $2,340 in fuel this month.</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['R-04 Stop 3', 'R-07 Stop 1', 'R-12 Stop 5'].map(stop => (
                      <span key={stop} className="bg-white border border-amber-200 text-amber-800 text-[11px] font-mono font-bold px-2 py-1 rounded">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <div className="section-card-title">Route Directory</div>
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
              {routes.map(r => (
                <tr key={r.id} onClick={() => setSelected(r)} className="cursor-pointer">
                  <td><span className="font-mono text-sm font-bold text-violet-800">{r.id}</span></td>
                  <td className="font-medium text-violet-700">{r.name}</td>
                  <td className="text-sm text-violet-500 font-mono">{r.distance} km</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-violet-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${r.efficiency}%` }} />
                      </div>
                      <span className="text-xs font-bold text-violet-600 w-8">{r.efficiency}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${r.status==='on-time'?'status-live':r.status==='delayed'?'status-delayed':'status-standby'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="text-right"><ChevronRight size={16} className="text-violet-300 inline-block" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SlidePanel
          open={!!selected}
          onClose={() => setSelected(null)}
          title={selected?.name || ''}
          subtitle={`Route ID: ${selected?.id}`}
        >
          {selected && (
            <div className="space-y-6">
              <div className="section-card">
                <div className="section-card-header py-3"><span className="section-card-title text-sm">Route Metrics</span></div>
                <div className="p-4 space-y-3">
                  <div className="metric-row"><span className="metric-key">Distance</span><span className="metric-val">{selected.distance} km</span></div>
                  <div className="metric-row"><span className="metric-key">Efficiency Score</span><span className="metric-val">{selected.efficiency}%</span></div>
                  <div className="metric-row"><span className="metric-key">Current Status</span>
                    <span className={`status-badge ${selected.status==='on-time'?'status-live':selected.status==='delayed'?'status-delayed':'status-standby'}`}>
                      {selected.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                 <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3 pl-1">Scheduled Stops</div>
                 <div className="bg-violet-50 border border-violet-200 rounded-xl p-2 space-y-1">
                   {['Depot', 'Green Park', 'Sunrise Colony', 'Central School'].map((stop, i) => (
                     <div key={stop} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-violet-100">
                       <MapPin size={14} className="text-violet-400 shrink-0" />
                       <span className="text-sm font-medium text-violet-700 flex-1">{stop}</span>
                       <span className="text-xs font-mono font-bold text-violet-500">
                         {['07:00', '07:18', '07:34', '08:10'][i]}
                       </span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </SlidePanel>

      </div>
    </>
  );
}
