'use client';
import { TrafficCone, BellOff, CheckCircle2, ArrowRightCircle, ListFilter } from 'lucide-react';
import Topbar from '@/components/Topbar';

const alerts = [
  {
    id: 1,
    type: 'TRAFFIC DELAY',
    color: '#D97706',
    bg: '#FEF3C7',
    icon: TrafficCone,
    title: 'Route A-12 experiencing a 12-min delay on 5th Ave.',
    desc: 'Heavy congestion reported near central intersection. Automatic re-routing protocol initiated for downstream stops.',
    time: '10:42 AM',
    actions: ['View Map', 'Notify Parents']
  },
  {
    id: 2,
    type: 'ATTENDANCE CHANGE',
    color: '#2563EB',
    bg: '#DBEAFE',
    icon: BellOff,
    title: 'Sarah Smith marked absent for the afternoon run.',
    desc: 'Parent portal update received. Route B-08 manifesting stop list adjusted to bypass 42 Oak St.',
    time: '10:35 AM',
    actions: ['Confirm Stop Skip']
  },
  {
    id: 3,
    type: 'ROUTE COMPLETE',
    color: '#16A34A',
    bg: '#DCFCE7',
    icon: CheckCircle2,
    title: 'Route B-08 finished ahead of schedule.',
    desc: 'Final drop-off verified at 09:48 AM. Driver status set to \'Returning to Depot\'. Efficiency rating: +8%.',
    time: '09:50 AM',
    actions: ['View Log']
  },
  {
    id: 4,
    type: 'DRIVER UPDATE',
    color: '#9333EA',
    bg: '#F3E8FF',
    icon: ArrowRightCircle,
    title: 'Marcus Thompson signed in to Bus 12.',
    desc: 'Pre-trip inspection checklist submitted and approved. GPS sync active.',
    time: '08:15 AM',
    actions: ['View Inspection']
  }
];

export default function AlertsPage() {
  return (
    <>
      <Topbar title="Alerts & Notifications" searchPlaceholder="Search operational updates..." />
      <div className="page-content bg-[#F9FAFB] min-h-full">
        
        <div className="flex items-center justify-between mb-8">
          <div className="filter-tabs">
            <button className="filter-tab active">All Alerts</button>
            <button className="filter-tab">System</button>
            <button className="filter-tab">Traffic</button>
            <button className="filter-tab">Attendance</button>
            <button className="filter-tab">Safety</button>
          </div>
          <button className="text-sm font-semibold text-slate-500 flex items-center gap-2 hover:text-slate-800 transition-colors">
            <ListFilter size={16} /> Sort by Recent
          </button>
        </div>

        <div className="flex flex-col gap-4 max-w-5xl">
          {alerts.map(alert => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className="alert-card hover-lift relative group hover:border-slate-300">
                <div className="alert-icon-wrap" style={{ background: alert.bg, color: alert.color }}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start">
                    <div className="alert-title" style={{ color: alert.color }}>{alert.type}</div>
                    <div className="text-xs font-mono font-semibold text-slate-400">{alert.time}</div>
                  </div>
                  
                  <div className="alert-desc">{alert.title}</div>
                  <div className="alert-sub mb-4">{alert.desc}</div>
                  
                  <div className="flex gap-3 mt-4">
                    {alert.actions.map(act => (
                      <button key={act} className="btn-outline !h-8 !text-xs !px-4 !rounded shadow-sm">
                        {act}
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
