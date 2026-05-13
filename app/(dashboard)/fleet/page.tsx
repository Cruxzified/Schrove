'use client';
import { useState } from 'react';
import Topbar from '@/components/Topbar';
import SlidePanel from '@/components/SlidePanel';
import { buses } from '@/lib/data';
import { MessageSquare, Phone } from 'lucide-react';

export default function FleetPage() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Topbar title="Live Fleet Overview" />
      
      <main className="flex-1 flex overflow-hidden relative bg-surface-container">
        {/* Fleet Side Panel */}
        <aside className="w-[320px] bg-surface-container-lowest border-r border-outline-variant/50 flex flex-col z-10 shadow-sm h-full">
          <div className="p-sm border-b border-outline-variant/30 bg-surface-bright">
            <div className="flex items-center justify-between mb-sm">
              <h3 className="font-headline-sm text-on-surface">Active Fleet</h3>
              <span className="bg-primary-container text-on-primary-container px-xs py-[2px] rounded-full font-label-caps text-[10px]">
                {buses.length} ONLINE
              </span>
            </div>
            <div className="flex gap-xs">
              <button className="flex-1 py-xs bg-surface-container-low rounded-lg text-on-surface font-label-sm border border-outline-variant/50">All</button>
              <button className="flex-1 py-xs text-on-surface-variant font-label-sm hover:bg-surface-container-lowest rounded-lg transition-colors border border-transparent">Delayed</button>
              <button className="flex-1 py-xs text-on-surface-variant font-label-sm hover:bg-surface-container-lowest rounded-lg transition-colors border border-transparent">Idle</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-xs flex flex-col gap-xs custom-scrollbar">
            {buses.map((bus) => (
              <div 
                key={bus.id}
                onClick={() => setSelected(bus)}
                className={`bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-sm hover:bg-surface-bright cursor-pointer transition-all flex flex-col gap-xs shadow-sm ${
                  selected?.id === bus.id ? 'border-primary ring-1 ring-primary/20' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-xs">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      bus.status === 'delayed' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                    </div>
                    <div>
                      <h4 className="font-label-sm font-semibold text-on-surface">{bus.id} - {bus.route}</h4>
                      <p className="text-[11px] font-body-base text-on-surface-variant">Driver: {bus.driver}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full shadow-sm ${
                      bus.status === 'delayed' ? 'bg-[#f59e0b]' : 'bg-surface-tint'
                    }`}></div>
                    <span className={`font-label-caps text-[10px] ${
                      bus.status === 'delayed' ? 'text-[#f59e0b]' : 'text-surface-tint'
                    }`}>
                      {bus.status === 'delayed' ? `+${bus.delay}` : 'ON TIME'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-xs border-t border-outline-variant/20 mt-xs">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant">SPEED</span>
                    <span className="font-body-base text-on-surface font-medium">{bus.speed} mph</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-label-caps text-[10px] text-on-surface-variant">NEXT STOP ETA</span>
                    <span className="font-body-base text-on-surface font-medium">{bus.eta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Canvas Area */}
        <div 
          className="flex-1 relative bg-[#e2e8f0] overflow-hidden"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGoevRwDdzTAjH6DMOf5WEI5SWOFHRNz58BQR0kYTtMl6skPHyeiE3sWydydQGUNtg5bQLrdMnNJo49qm8B_TKkcde3oVnJdjt0aX5HzRra-CU3rXSox1HUUCrQeUQbJKHBCT5Famz_PLtBtS0emRfkwiMiLS0LxZAft3J6aWhnsyvrHDrsyAnRzHsEoxhRWm6Hm3ha758dcg8WWkW7EX2-GdIxDI9hjUB2DOTcr7dIcP3Q77iJCJbSKwSECIixcFUwmbVD3SzJg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay to simulate UI map style */}
          <div className="absolute inset-0 bg-surface/40 backdrop-blur-[1px] mix-blend-overlay pointer-events-none"></div>

          {/* Floating Map Controls */}
          <div className="absolute bottom-lg right-lg flex flex-col gap-sm z-30">
            <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-lg shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
              <button className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors border-b border-outline-variant/30">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
            </div>
            <button className="w-10 h-10 bg-surface-container-lowest/90 backdrop-blur-md rounded-lg shadow-sm border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
          </div>

          {/* Global Stats Overlay */}
          <div className="absolute top-md left-md right-md flex justify-center pointer-events-none z-30">
            <div className="bg-surface-container-lowest/80 backdrop-blur-[20px] rounded-full px-lg py-sm shadow-md border border-white/50 flex items-center gap-xl pointer-events-auto">
              <div className="flex flex-col items-center">
                <span className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">System Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                  <span className="font-headline-sm text-[14px] text-on-surface">Optimal</span>
                </div>
              </div>
              <div className="w-px h-8 bg-outline-variant/40"></div>
              <div className="flex flex-col items-center">
                <span className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">On-Time Performance</span>
                <span className="font-headline-sm text-[14px] text-on-surface">94.2%</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/40"></div>
              <div className="flex flex-col items-center">
                <span className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">Active Incidents</span>
                <span className="font-headline-sm text-[14px] text-[#f59e0b]">2 Warnings</span>
              </div>
            </div>
          </div>

          {/* Vehicle Markers (Mock) */}
          {buses.slice(0, 3).map((bus, i) => (
            <div 
              key={bus.id}
              onClick={() => setSelected(bus)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
              style={{ 
                top: i === 0 ? '285px' : i === 1 ? '465px' : '200px',
                left: i === 0 ? '500px' : i === 1 ? '600px' : '800px'
              }}
            >
              <div className={`px-xs py-[2px] rounded font-label-caps text-[10px] mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md text-white ${
                bus.status === 'delayed' ? 'bg-[#f59e0b]' : 'bg-surface-tint'
              }`}>
                {bus.id} {bus.status === 'delayed' ? `(+${bus.delay})` : ''}
              </div>
              <div className={`w-4 h-4 rounded-full border-2 border-surface shadow-md relative ${
                bus.status === 'delayed' ? 'bg-[#f59e0b]' : 'bg-surface-tint'
              }`}>
                {bus.status !== 'delayed' && (
                  <div className="absolute inset-0 rounded-full border border-surface-tint animate-ping opacity-50"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <SlidePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? ''}
        subtitle={`Driver: ${selected?.driver}`}
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <button className="flex-1 rounded-xl border border-outline-variant bg-white py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all flex items-center justify-center gap-2">
                <MessageSquare size={16} /> Message
              </button>
              <button className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-on-primary hover:bg-on-primary-fixed-variant transition-all flex items-center justify-center gap-2">
                <Phone size={16} /> Call Driver
              </button>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant">
                <h4 className="text-sm font-bold text-on-surface">Trip Details</h4>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: 'Route', value: selected.route },
                  { label: 'Status', value: selected.status, isBadge: true },
                  { label: 'Students', value: `${selected.students}/${selected.capacity}` },
                  { label: 'Speed', value: `${selected.speed} mph` },
                  { label: 'Fuel', value: `${selected.fuel}%` }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-medium">{item.label}</span>
                    {item.isBadge ? (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        selected.status === 'moving' ? 'bg-[#dcfce7] text-[#166534]' : 
                        selected.status === 'delayed' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {selected.status}
                      </span>
                    ) : (
                      <span className="text-on-surface font-semibold">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">Route Progress</div>
              <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-on-surface-variant">Completion</span>
                  <span className="text-primary">{selected.progress}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-primary transition-all duration-700" style={{ width: `${selected.progress}%` }}></div>
                </div>

                <div className="space-y-4">
                  {selected.stops?.map((stop: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${stop.done ? 'bg-primary border-primary' : 'bg-white border-outline'}`} />
                        {i < selected.stops.length - 1 && <div className={`w-px h-6 my-1 ${stop.done ? 'bg-primary' : 'bg-outline-variant'}`} />}
                      </div>
                      <div className="-mt-1">
                        <div className={`text-sm font-bold ${stop.done ? 'text-on-surface' : 'text-on-surface-variant'}`}>{stop.name}</div>
                        <div className="text-[11px] text-outline mt-0.5">{stop.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
