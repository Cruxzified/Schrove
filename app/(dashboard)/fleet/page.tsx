'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Phone, Fuel, Gauge, Users, Navigation } from 'lucide-react';
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
      
      const isDark = document.documentElement.classList.contains('dark');
      const bg = isDark ? '#000000' : '#F5F5F7';
      const grid = isDark ? '#1C1C1E' : '#E5E5EA';
      const roadOutline = isDark ? '#2C2C2E' : '#D1D1D6';
      const roadFill = isDark ? '#1C1C1E' : '#FFFFFF';

      // Background
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // Grid
      ctx.strokeStyle = grid; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      // Roads
      const roads: [number, number][][] = [
        [[85.300, 27.715], [85.340, 27.715]],
        [[85.315, 27.705], [85.315, 27.730]],
        [[85.300, 27.722], [85.340, 27.718]],
        [[85.305, 27.705], [85.325, 27.730]],
        [[85.300, 27.708], [85.335, 27.725]],
      ];
      roads.forEach(road => {
        ctx.beginPath();
        road.forEach(([lng, lat], i) => { const x = toX(lng), y = toY(lat); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.strokeStyle = roadOutline; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
        ctx.strokeStyle = roadFill; ctx.lineWidth = 10; ctx.stroke();
      });
      // School marker
      const sx = toX(85.318), sy = toY(27.712);
      ctx.fillStyle = isDark ? 'rgba(50, 215, 75, 0.15)' : 'rgba(52, 199, 89, 0.1)'; 
      ctx.beginPath(); ctx.arc(sx, sy, 22, 0, Math.PI * 2); ctx.fill();
      const greenColor = isDark ? '#32D74B' : '#34C759';
      ctx.strokeStyle = greenColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, 22, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = greenColor; ctx.font = 'bold 9px Inter'; ctx.textAlign = 'center'; ctx.fillText('SCHOOL', sx, sy + 3);
      
      // Buses
      buses.forEach(bus => {
        const jx = bus.status === 'moving' ? Math.sin(tick * 0.05 + bus.id.charCodeAt(4)) * 1.5 : 0;
        const jy = bus.status === 'moving' ? Math.cos(tick * 0.04 + bus.id.charCodeAt(4)) * 1 : 0;
        const x = toX(bus.lng) + jx, y = toY(bus.lat) + jy;
        const accentCol = isDark ? '#0A84FF' : '#007AFF';
        const amberCol = isDark ? '#FF9F0A' : '#FF9500';
        const grayCol = isDark ? '#8E8E93' : '#86868B';
        
        const col = bus.status === 'moving' ? accentCol : bus.status === 'delayed' ? amberCol : grayCol;
        const sel = selectedBus?.id === bus.id;
        
        if (bus.status === 'moving' || sel) {
          const pr = 20 + Math.sin(tick * 0.1) * 3;
          ctx.fillStyle = sel ? `${col}40` : `${col}20`;
          ctx.beginPath(); ctx.arc(x, y, pr, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = sel ? col : (isDark ? '#1C1C1E' : '#FFFFFF');
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = col; ctx.stroke();
        ctx.fillStyle = sel ? '#FFFFFF' : col;
        ctx.font = 'bold 9px Inter'; ctx.textAlign = 'center';
        ctx.fillText(bus.id.replace('BUS-', ''), x, y + 3.5);
        if (bus.status === 'delayed') {
          const redCol = isDark ? '#FF453A' : '#FF3B30';
          ctx.fillStyle = redCol; ctx.beginPath(); ctx.arc(x + 12, y - 12, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'white'; ctx.font = 'bold 9px Inter'; ctx.fillText('!', x + 12, y - 9);
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
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const latMin = 27.705, latMax = 27.730, lngMin = 85.300, lngMax = 85.340;
    const toX = (lng: number) => ((lng - lngMin) / (lngMax - lngMin)) * canvas.width;
    const toY = (lat: number) => canvas.height - ((lat - latMin) / (latMax - latMin)) * canvas.height;
    for (const b of buses) {
      if (Math.hypot(mx - toX(b.lng), my - toY(b.lat)) < 24) { onSelectBus(b); return; }
    }
  };

  return <canvas ref={canvasRef} onClick={handleClick} className="w-full h-full cursor-pointer" style={{ display: 'block' }} />;
}

const statusConfig = {
  moving: { label: 'Moving',  bg: 'var(--green-bg)', color: 'var(--green)', dot: 'var(--green)' },
  idle:    { label: 'Idle',    bg: 'var(--sidebar-active-bg)', color: 'var(--text-3)', dot: 'var(--text-4)' },
  delayed: { label: 'Delayed', bg: 'var(--amber-bg)', color: 'var(--amber)', dot: 'var(--amber)' },
};

export default function FleetCommand() {
  const [selected, setSelected] = useState<Bus | null>(null);

  return (
    <>
      <Topbar title="Live Fleet" subtitle="Real-time vehicle telemetry" action={{ label: 'Dispatch Bus' }} />

      <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-h))', overflow: 'hidden' }}>

        {/* Sidebar list */}
        <div style={{ width: 320, flexShrink: 0, background: 'var(--surface-solid)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Active Fleet</span>
            <span style={{ fontSize: 12, fontWeight: 700, background: 'var(--accent-muted)', color: 'var(--accent)', padding: '4px 10px', borderRadius: 8 }}>
              {buses.length} Vehicles
            </span>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderBottom: '1px solid var(--border)' }}>
            {[
              { label: 'Moving',  val: buses.filter(b => b.status === 'moving').length,  color: 'var(--green)' },
              { label: 'Idle',    val: buses.filter(b => b.status === 'idle').length,    color: 'var(--text-4)' },
              { label: 'Delayed', val: buses.filter(b => b.status === 'delayed').length, color: 'var(--amber)' },
            ].map(s => (
              <div key={s.label} style={{ padding: '12px 0', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {buses.map(b => {
              const isSel = selected?.id === b.id;
              const sc = statusConfig[b.status as keyof typeof statusConfig];
              return (
                <div
                  key={b.id}
                  onClick={() => setSelected(b === selected ? null : b)}
                  style={{
                    padding: '16px', borderRadius: 12, marginBottom: 8, cursor: 'pointer',
                    border: `1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                    background: isSel ? 'var(--accent-muted)' : 'var(--surface)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.dot }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: isSel ? 'var(--accent)' : 'var(--text-1)' }}>{b.id}</span>
                    </div>
                    <span style={{ fontSize: 12, background: sc.bg, color: sc.color, padding: '4px 10px', borderRadius: 8, fontWeight: 600 }}>
                      {sc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 8 }}>{b.driver} · {b.route}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-4)' }}>
                    <span>{b.speed} km/h</span>
                    <span>ETA {b.eta}</span>
                    <span>{b.fuel}% fuel</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative', background: 'var(--bg)' }}>
          <MapCanvas buses={buses} selectedBus={selected} onSelectBus={setSelected} />
          <div style={{
            position: 'absolute', top: 20, left: 20,
            background: 'var(--surface-solid)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: 'var(--shadow-md)',
          }}>
            <div className="live-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.06em' }}>LIVE TELEMETRY</span>
          </div>

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 20, left: 20,
            background: 'var(--surface-solid)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '14px 20px',
            display: 'flex', gap: 20,
            boxShadow: 'var(--shadow-md)',
          }}>
            {Object.entries(statusConfig).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: v.dot }} />
                <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Panel */}
      <SlidePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? ''}
        subtitle={`Driver: ${selected?.driver} · Route ${selected?.route}`}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1 }}><MessageSquare size={16} /> Message</button>
              <button className="btn-primary" style={{ flex: 1 }}><Phone size={16} /> Call Driver</button>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { icon: Gauge, label: 'Speed', val: `${selected.speed} km/h`, color: 'var(--accent)' },
                { icon: Fuel, label: 'Fuel', val: `${selected.fuel}%`, color: selected.fuel < 30 ? 'var(--red)' : 'var(--green)' },
                { icon: Users, label: 'Students', val: `${selected.students}/${selected.capacity}`, color: 'var(--amber)' },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} style={{ background: 'var(--sidebar-active-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                  <Icon size={20} style={{ color, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ background: 'var(--sidebar-active-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)' }}>Route Progress</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{selected.progress}%</span>
              </div>
              <div className="prog-track" style={{ marginBottom: 20 }}>
                <div className={`prog-fill ${selected.status === 'delayed' ? 'prog-fill-amber' : ''}`} style={{ width: `${selected.progress}%` }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {selected.stops.map((stop, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%', border: '2px solid',
                        borderColor: stop.done ? 'var(--green)' : 'var(--border)',
                        background: stop.done ? 'var(--green)' : 'var(--surface-solid)',
                        marginTop: 2,
                      }} />
                      {i < selected.stops.length - 1 && (
                        <div style={{ width: 2, height: 28, background: stop.done ? 'var(--green)' : 'var(--border)', margin: '4px 0' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: stop.done ? 'var(--text-4)' : 'var(--text-1)', textDecoration: stop.done ? 'line-through' : 'none' }}>
                        {stop.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 2 }}>{stop.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next stop */}
            <div style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-light)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Navigation size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Next Stop</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{selected.nextStop}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{selected.eta}</div>
            </div>
          </div>
        )}
      </SlidePanel>
    </>
  );
}
