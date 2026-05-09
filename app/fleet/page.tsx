'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Bus, AlertTriangle, MessageSquare, Phone } from 'lucide-react';
import Topbar from '@/components/Topbar';
import SlidePanel from '@/components/SlidePanel';
import { buses } from '@/lib/data';

type Bus = typeof buses[number];

function MapCanvas({ buses, selectedBus, onSelectBus }: {
  buses: Bus[]; selectedBus: Bus | null; onSelectBus: (b: Bus) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const latMin = 27.705, latMax = 27.730, lngMin = 85.300, lngMax = 85.340;
    const toX = (lng: number) => ((lng - lngMin) / (lngMax - lngMin)) * W;
    const toY = (lat: number) => H - ((lat - latMin) / (latMax - latMin)) * H;

    let frame: number, tick = 0;

    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, W, H);

      // Clean Light Background
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = '#F1F5F9'; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Roads
      const roads: [number,number][][] = [
        [[85.300,27.715],[85.340,27.715]],
        [[85.315,27.705],[85.315,27.730]],
        [[85.300,27.722],[85.340,27.718]],
        [[85.305,27.705],[85.325,27.730]],
        [[85.300,27.708],[85.335,27.725]],
      ];
      roads.forEach(road => {
        ctx.beginPath();
        road.forEach(([lng,lat],i) => { const x=toX(lng),y=toY(lat); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
        ctx.strokeStyle='#E2E8F0'; ctx.lineWidth=10; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.stroke();
        ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=6; ctx.stroke();
      });

      // School
      const sx = toX(85.318), sy = toY(27.712);
      ctx.fillStyle='#F0FDF4'; ctx.beginPath(); ctx.arc(sx,sy,24,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#22C55E'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(sx,sy,24,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle='#16A34A'; ctx.font='bold 9px Inter'; ctx.textAlign='center'; ctx.fillText('SCHOOL',sx,sy+3);

      // Buses
      buses.forEach(bus => {
        const jx = bus.status==='moving' ? Math.sin(tick*0.05+bus.id.charCodeAt(4))*1.5 : 0;
        const jy = bus.status==='moving' ? Math.cos(tick*0.04+bus.id.charCodeAt(4))*1 : 0;
        const x = toX(bus.lng)+jx, y = toY(bus.lat)+jy;
        const col = bus.status==='moving' ? '#2563EB' : bus.status==='delayed' ? '#D97706' : '#6B7280';
        const sel = selectedBus?.id===bus.id;

        // Pulse
        if (bus.status==='moving'||sel) {
          const pr = 16+Math.sin(tick*0.1)*3;
          ctx.fillStyle=bus.status==='moving' ? 'rgba(37,99,235,0.15)' : 'rgba(217,119,6,0.15)';
          ctx.beginPath(); ctx.arc(x,y,pr,0,Math.PI*2); ctx.fill();
        }

        // Bus marker
        ctx.fillStyle = sel ? col : '#FFFFFF';
        ctx.beginPath(); ctx.arc(x,y,12,0,Math.PI*2); ctx.fill();
        ctx.lineWidth=2; ctx.strokeStyle=col; ctx.stroke();
        
        ctx.fillStyle = sel ? '#FFFFFF' : col;
        ctx.font=`bold 9px Inter`; ctx.textAlign='center';
        ctx.fillText(bus.id.replace('BUS-',''),x,y+3);

        // Alert
        if (bus.idleTime>3 || bus.status === 'delayed') {
          ctx.fillStyle='#EF4444'; ctx.beginPath(); ctx.arc(x+10,y-10,6,0,Math.PI*2); ctx.fill();
          ctx.fillStyle='white'; ctx.font='bold 9px Inter'; ctx.fillText('!',x+10,y-7);
        }
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [buses, selectedBus]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX-rect.left)*(canvas.width/rect.width);
    const my = (e.clientY-rect.top)*(canvas.height/rect.height);
    const latMin=27.705,latMax=27.730,lngMin=85.300,lngMax=85.340;
    const toX=(lng:number)=>((lng-lngMin)/(lngMax-lngMin))*canvas.width;
    const toY=(lat:number)=>canvas.height-((lat-latMin)/(latMax-latMin))*canvas.height;
    for (const b of buses) {
      if (Math.hypot(mx-toX(b.lng),my-toY(b.lat))<20) { onSelectBus(b); return; }
    }
  };

  return <canvas ref={canvasRef} onClick={handleClick} className="w-full h-full cursor-pointer" style={{ display:'block' }} />;
}

export default function FleetCommand() {
  const [selected, setSelected] = useState<Bus | null>(null);

  return (
    <>
      <Topbar title="Live Fleet Map" action={{ label: 'Dispatch Bus' }} />
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        
        {/* Left Sidebar List */}
        <div className="w-[320px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Active Fleet</h3>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">24 Vehicles</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
            {buses.map(b => {
              const isSel = selected?.id===b.id;
              return (
                <div key={b.id} 
                  onClick={() => setSelected(b===selected?null:b)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${isSel ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${b.status==='moving'?'bg-green-500':b.status==='delayed'?'bg-amber-500':'bg-gray-400'}`} />
                      <span className="font-bold text-slate-800 text-sm">{b.id}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{b.route}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {b.driver.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-slate-700">{b.driver}</span>
                  </div>

                  <div className="text-xs text-slate-500 flex justify-between items-center">
                    <span>{b.speed} km/h</span>
                    <span>ETA {b.eta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapCanvas buses={buses} selectedBus={selected} onSelectBus={setSelected} />
          
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <div className="live-dot" />
            <span className="text-xs font-bold text-slate-700 tracking-wider">LIVE TELEMETRY</span>
          </div>
        </div>
      </div>

      <SlidePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? ''}
        subtitle={`Driver: ${selected?.driver}`}
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <button className="flex-1 btn-outline justify-center"><MessageSquare size={14} /> Message</button>
              <button className="flex-1 btn-dark justify-center"><Phone size={14} /> Call Driver</button>
            </div>

            <div className="section-card">
              <div className="section-card-header py-3">
                <span className="section-card-title text-sm">Trip Details</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="metric-row"><span className="metric-key">Route</span><span className="metric-val">{selected.route}</span></div>
                <div className="metric-row"><span className="metric-key">Status</span>
                  <span className={`status-badge ${selected.status==='moving'?'status-live':selected.status==='delayed'?'status-delayed':'status-standby'}`}>
                    {selected.status}
                  </span>
                </div>
                <div className="metric-row"><span className="metric-key">Students</span><span className="metric-val">{selected.students}/{selected.capacity}</span></div>
                <div className="metric-row"><span className="metric-key">Speed</span><span className="metric-val">{selected.speed} km/h</span></div>
                <div className="metric-row"><span className="metric-key">Fuel</span><span className="metric-val">{selected.fuel}%</span></div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">Route Progress</div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-500">Completion</span>
                  <span className="text-slate-900">{selected.progress}%</span>
                </div>
                <div className="prog-track mb-5">
                  <div className={`prog-fill ${selected.status==='moving'?'prog-fill-green':selected.status==='delayed'?'prog-fill-amber':''}`} style={{ width: `${selected.progress}%` }}></div>
                </div>

                <div className="space-y-4">
                  {selected.stops.map((stop, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${stop.done ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`} />
                        {i < selected.stops.length - 1 && <div className={`w-px h-6 my-1 ${stop.done ? 'bg-green-500' : 'bg-slate-200'}`} />}
                      </div>
                      <div className="-mt-1">
                        <div className={`text-sm font-medium ${stop.done ? 'text-slate-400' : 'text-slate-800'}`}>{stop.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{stop.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </>
  );
}
