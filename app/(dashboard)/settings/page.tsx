'use client';
import Topbar from '@/components/Topbar';

const settingSections = [
  {
    title: 'General',
    icon: 'globe',
    items: [
      { label: 'School Name', type: 'text', val: 'Central International School' },
      { label: 'Academic Year', type: 'text', val: '2025–2026' },
      { label: 'Timezone', type: 'select', val: 'Asia/Kathmandu (UTC+5:45)' },
    ],
  },
  {
    title: 'Notifications',
    icon: 'notifications',
    items: [
      { label: 'Idle Time Alert Threshold', type: 'number', val: '3 minutes' },
      { label: 'Fuel Low Warning', type: 'number', val: '25%' },
      { label: 'Email Digest', type: 'toggle', val: 'Enabled' },
    ],
  },
  {
    title: 'Safety & Compliance',
    icon: 'shield',
    items: [
      { label: 'Speed Limit Default', type: 'number', val: '50 km/h' },
      { label: 'Attendance Minimum', type: 'number', val: '75%' },
      { label: 'Safety Report Frequency', type: 'select', val: 'Daily' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-surface-container-low">
      <Topbar title="Settings" />
      <div className="p-md space-y-md max-w-2xl mx-auto w-full">
        {settingSections.map(section => (
          <div key={section.title} className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-outline-variant flex items-center gap-3 bg-surface-bright">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[18px]">{section.icon}</span>
              </div>
              <h3 className="font-headline-sm text-sm text-on-surface">{section.title}</h3>
            </div>
            <div className="divide-y divide-outline-variant/30">
              {section.items.map(item => (
                <div key={item.label} className="px-5 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <span className="font-label-sm text-on-surface-variant">{item.label}</span>
                  <span className="font-body-base text-sm font-semibold text-on-surface">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-sm">
          <button className="rounded-lg bg-primary px-lg py-sm font-label-sm font-bold text-on-primary shadow-sm hover:bg-on-primary-fixed-variant transition-all active:scale-95">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
