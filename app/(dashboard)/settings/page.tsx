'use client';
import { useState } from 'react';
import { Globe, Bell, Shield, Save, ChevronRight, Check } from 'lucide-react';
import Topbar from '@/components/Topbar';

type SettingItem = { label: string; type: 'text' | 'number' | 'select' | 'toggle'; val: string };
type Section = { title: string; desc: string; icon: React.ElementType; color: string; bg: string; items: SettingItem[] };

const defaultSections: Section[] = [
  {
    title: 'General',
    desc: 'School identity and regional configuration',
    icon: Globe, color: '#6366F1', bg: '#EEF2FF',
    items: [
      { label: 'School Name',    type: 'text',   val: 'Central International School' },
      { label: 'Academic Year',  type: 'text',   val: '2025–2026'                   },
      { label: 'Timezone',       type: 'select', val: 'Asia/Kathmandu (UTC+5:45)'   },
      { label: 'Contact Email',  type: 'text',   val: 'admin@centralschool.edu'     },
    ],
  },
  {
    title: 'Notifications',
    desc: 'Alert thresholds and communication preferences',
    icon: Bell, color: '#F59E0B', bg: '#FFFBEB',
    items: [
      { label: 'Idle Time Alert Threshold', type: 'number', val: '3'       },
      { label: 'Fuel Low Warning (%)',       type: 'number', val: '25'      },
      { label: 'Email Digest',              type: 'toggle', val: 'true'    },
      { label: 'Parent SMS Alerts',         type: 'toggle', val: 'true'    },
      { label: 'Driver Push Alerts',        type: 'toggle', val: 'false'   },
    ],
  },
  {
    title: 'Safety & Compliance',
    desc: 'Speed limits, attendance rules, and reporting schedules',
    icon: Shield, color: '#10B981', bg: '#ECFDF5',
    items: [
      { label: 'Speed Limit Default (km/h)', type: 'number', val: '50'     },
      { label: 'Attendance Minimum (%)',     type: 'number', val: '75'     },
      { label: 'Safety Report Frequency',   type: 'select', val: 'Daily'  },
      { label: 'Require Pre-trip Check',    type: 'toggle', val: 'true'   },
    ],
  },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 42, height: 24, borderRadius: 99,
        background: on ? 'var(--accent)' : 'var(--border)',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: 'white', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const [sections, setSections] = useState(defaultSections);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('General');

  const updateVal = (sIdx: number, iIdx: number, val: string) => {
    setSaved(false);
    setSections(prev => prev.map((s, si) =>
      si !== sIdx ? s : {
        ...s,
        items: s.items.map((item, ii) => ii !== iIdx ? item : { ...item, val }),
      }
    ));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const current = sections.find(s => s.title === activeSection)!;
  const currentIdx = sections.findIndex(s => s.title === activeSection);

  return (
    <>
      <Topbar title="Settings" subtitle="Configure your fleet intelligence platform" />
      <div className="page-content" style={{ display: 'flex', gap: 24, maxWidth: 960 }}>

        {/* Left nav */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Configuration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sections.map(s => {
              const Icon = s.icon;
              const active = s.title === activeSection;
              return (
                <button
                  key={s.title}
                  onClick={() => setActiveSection(s.title)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 9, border: 'none',
                    background: active ? 'var(--accent-muted)' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.15s', width: '100%', textAlign: 'left',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? s.bg : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                    <Icon size={15} style={{ color: active ? s.color : 'var(--text-4)' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? 'var(--accent)' : 'var(--text-2)' }}>{s.title}</span>
                  {active && <ChevronRight size={14} style={{ color: 'var(--accent)', marginLeft: 'auto' }} />}
                </button>
              );
            })}
          </div>

          {/* Save button */}
          <div style={{ marginTop: 24 }}>
            <button
              className="btn-primary"
              style={{ width: '100%', background: saved ? '#10B981' : undefined, transition: 'background 0.3s' }}
              onClick={handleSave}
            >
              {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1 }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: current.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <current.icon size={20} style={{ color: current.color }} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{current.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-4)', marginTop: 1 }}>{current.desc}</div>
            </div>
          </div>

          {/* Settings items */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {current.items.map((item, iIdx) => (
              <div
                key={item.label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: iIdx < current.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-1)' }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-4)', marginTop: 2 }}>
                    {item.type === 'toggle' ? (item.val === 'true' ? 'Currently enabled' : 'Currently disabled') : 'Click to edit'}
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {item.type === 'toggle' ? (
                    <Toggle
                      on={item.val === 'true'}
                      onToggle={() => updateVal(currentIdx, iIdx, item.val === 'true' ? 'false' : 'true')}
                    />
                  ) : item.type === 'select' ? (
                    <select
                      value={item.val}
                      onChange={e => updateVal(currentIdx, iIdx, e.target.value)}
                      style={{
                        border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px',
                        fontSize: 13, color: 'var(--text-1)', background: 'var(--bg)',
                        outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                      }}
                    >
                      <option>{item.val}</option>
                      {item.label === 'Timezone' && <option>UTC+0:00 (London)</option>}
                      {item.label === 'Timezone' && <option>Asia/Kolkata (UTC+5:30)</option>}
                      {item.label === 'Safety Report Frequency' && ['Daily', 'Weekly', 'Monthly'].filter(v => v !== item.val).map(v => <option key={v}>{v}</option>)}
                    </select>
                  ) : (
                    <input
                      type={item.type}
                      value={item.val}
                      onChange={e => updateVal(currentIdx, iIdx, e.target.value)}
                      style={{
                        width: 220, height: 36,
                        border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px',
                        fontSize: 13, color: 'var(--text-1)', background: 'var(--bg)',
                        outline: 'none', fontFamily: 'inherit', fontWeight: 500,
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)'; e.target.style.boxShadow = 'none'; }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div style={{ marginTop: 20, border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', background: '#FEF2F2', borderBottom: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={14} style={{ color: '#EF4444' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>Danger Zone</span>
            </div>
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Reset All Settings</div>
                <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>Restore factory defaults for all configuration values.</div>
              </div>
              <button
                className="btn-danger"
                onClick={() => { if (confirm('Reset all settings to defaults?')) { setSections(defaultSections); setSaved(false); } }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
