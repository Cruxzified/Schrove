'use client';
import { Settings, Bell, Shield, Database, Palette, Globe } from 'lucide-react';
import Topbar from '@/components/Topbar';

const settingSections = [
  {
    title: 'General',
    icon: Globe,
    items: [
      { label: 'School Name', type: 'text', val: 'Central International School' },
      { label: 'Academic Year', type: 'text', val: '2025–2026' },
      { label: 'Timezone', type: 'select', val: 'Asia/Kathmandu (UTC+5:45)' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Idle Time Alert Threshold', type: 'number', val: '3 minutes' },
      { label: 'Fuel Low Warning', type: 'number', val: '25%' },
      { label: 'Email Digest', type: 'toggle', val: 'Enabled' },
    ],
  },
  {
    title: 'Safety & Compliance',
    icon: Shield,
    items: [
      { label: 'Speed Limit Default', type: 'number', val: '50 km/h' },
      { label: 'Attendance Minimum', type: 'number', val: '75%' },
      { label: 'Safety Report Frequency', type: 'select', val: 'Daily' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="main-content">
      <Topbar title="Settings" subtitle="Configure Wizor dashboard preferences and operational thresholds" />
      <div className="p-6 space-y-5 max-w-2xl">
        {settingSections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="glass-card overflow-hidden">
              <div className="px-5 py-3.5 border-b flex items-center gap-3" style={{ borderColor: 'rgba(226,232,240,0.6)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <Icon size={13} style={{ color: '#3B82F6' }} />
                </div>
                <h3 className="font-bold text-sm text-slate-700">{section.title}</h3>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(226,232,240,0.4)' }}>
                {section.items.map(item => (
                  <div key={item.label} className="px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">{item.label}</span>
                    <span className="font-mono text-xs text-slate-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button className="btn-primary">Save Configuration</button>
      </div>
    </div>
  );
}
