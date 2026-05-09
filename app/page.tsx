'use client';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, ResponsiveContainer, YAxis, Tooltip
} from 'recharts';
import { AlertTriangle, ChevronRight, Plus } from 'lucide-react';
import Topbar from '@/components/Topbar';

const efficiencyData = [
  { time: '06:00 AM', value: 30 },
  { time: '06:30 AM', value: 35 },
  { time: '07:00 AM', value: 32 },
  { time: '07:30 AM', value: 28 },
  { time: '08:00 AM', value: 45 },
  { time: '08:30 AM', value: 70 },
  { time: '08:45 AM', value: 85 },
  { time: '09:00 AM', value: 82 },
];

const delayedRoutes = [
  { id: '104', delay: '+12m', name: 'Canyon Ridge Run', driver: 'Michael Chen', img: 'MC' },
  { id: '218', delay: '+08m', name: 'Westside Loop', driver: 'Sarah Jenkins', img: 'SJ' },
  { id: '088', delay: '+05m', name: 'North Station Exp.', driver: 'David Miller', img: 'DM' },
];

const attendanceRoutes = [
  { id: 'R-12', perc: '100%', name: 'Lakeside Heights', students: '24/24', prog: 100 },
  { id: 'R-45', perc: '82%', name: 'Oakwood Academy', students: '18/22', prog: 82 },
  { id: 'R-09', perc: '96%', name: 'Hillcrest Valley', students: '31/32', prog: 96 },
  { id: 'R-03', perc: '64%', name: 'Pine Street', students: '9/14', prog: 64 },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Topbar searchPlaceholder="Search routes, buses or students..." />
      
      <div className="page-content">
        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card relative">
            <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <div className="stat-label">Active Buses</div>
            <div className="stat-value">42 <span className="stat-delta pos">+3</span></div>
            <div className="stat-sub">Fleet in operation</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Delayed Buses</div>
            <div className="stat-value text-red-600">3 <span className="stat-delta neg">-1</span></div>
            <div className="stat-sub">Action required</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Efficiency</div>
            <div className="stat-value">98.4%</div>
            <div className="flex gap-1 mt-4">
               {[1,2,3,4].map(i => <div key={i} className="h-3 flex-1 bg-slate-200 rounded-sm"></div>)}
               <div className="h-3 flex-1 bg-slate-900 rounded-sm"></div>
               <div className="h-3 flex-1 bg-slate-500 rounded-sm"></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Routes Completed</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="stat-value">12<span className="text-2xl text-slate-400 font-medium">/45</span></div>
                <div className="stat-sub">Morning Run<br/>Progress</div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                   <circle cx="30" cy="30" r="28" fill="none" stroke="#0F172A" strokeWidth="4" strokeDasharray="175" strokeDashoffset="130" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 card-white flex flex-col">
            <div className="card-header">
              <div>
                <div className="card-title text-2xl">Live Efficiency</div>
                <div className="card-subtitle">Performance over the morning run</div>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-4 py-1.5 text-sm font-semibold bg-white rounded-md shadow-sm">Real-time</button>
                <button className="px-4 py-1.5 text-sm font-medium text-slate-500">Historical</button>
              </div>
            </div>
            <div className="flex-1 p-6 pt-0 min-h-[300px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={efficiencyData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F172A" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid rgba(15,23,42,0.05)', boxShadow: '0 10px 25px -5px rgba(15,23,42,0.1)', padding: '12px' }}
                      itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0F172A" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, fill: '#0F172A', stroke: '#fff', strokeWidth: 3, boxShadow: '0 0 10px rgba(0,0,0,0.2)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div className="w-full h-full bg-slate-50 rounded-lg animate-pulse" />}
              <div className="flex justify-between text-xs font-bold text-slate-500 mt-2 px-2 uppercase tracking-wider">
                <span>06:00 AM</span>
                <span>07:00 AM</span>
                <span>08:00 AM</span>
                <span>09:00 AM</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 card-white flex flex-col">
            <div className="card-header border-b-0 pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                <div className="card-title">Delayed Routes</div>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-3">
              {delayedRoutes.map((route, i) => (
                <div key={i} className="hover-lift border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors bg-white">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded uppercase">Bus #{route.id}</span>
                      <span className="text-red-600 font-bold text-xs">{route.delay}</span>
                    </div>
                    <div className="font-bold text-[15px] text-slate-900 mb-2">{route.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-bold">{route.img}</div>
                      <span className="text-sm text-slate-600 font-medium">{route.driver}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="relative">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-xl font-bold text-slate-900">Attendance Overview</div>
              <div className="text-sm text-slate-500 mt-1">Real-time student boarding status across active routes</div>
            </div>
            <button className="text-sm font-bold flex items-center gap-1 hover:text-blue-600 transition-colors">
              View All Reports <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 pb-12">
            {attendanceRoutes.map((rt, i) => (
              <div key={i} className="card-white p-5">
                <div className="flex justify-between items-center mb-4 text-xs font-bold font-mono tracking-wide">
                  <span className="text-slate-900">ROUTE {rt.id}</span>
                  <span className="text-slate-600">{rt.perc}</span>
                </div>
                <div className="font-bold text-[15px] text-slate-900 mb-1">{rt.name}</div>
                <div className="text-[13px] text-slate-500 font-medium mb-6">{rt.students} Students Boarded</div>
                
                {i === 0 ? (
                  <div className="flex">
                     <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white z-10"></div>
                     <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white -ml-2 z-20"></div>
                     <div className="w-7 h-7 rounded-full bg-slate-400 border-2 border-white -ml-2 z-30"></div>
                     <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white -ml-2 z-40 text-white flex items-center justify-center text-[10px] font-bold">+21</div>
                  </div>
                ) : (
                  <div className="prog-track h-1.5">
                    <div className="prog-fill bg-slate-900" style={{ width: `${rt.prog}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FLOATING ACTION */}
          <div className="absolute right-0 bottom-6 z-10">
            <button className="glass text-white px-6 py-4 rounded-xl font-bold text-sm flex items-center gap-3">
              <Plus size={18} /> Dispatch Emergency Bus
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
