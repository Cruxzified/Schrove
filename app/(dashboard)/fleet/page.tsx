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
      // Background
      ctx.fillStyle = '#F8FAFC'; ctx.fillRect(0, 0, W, H);
      // Grid
      ctx.strokeStyle = '#F1F5F9'; ctx.lineWidth = 1;
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
        ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
        ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 10; ctx.stroke();
      });
      // School marker
      const sx = toX(85.318), sy = toY(27.712);
      ctx.fillStyle = '#ECFDF5'; ctx.beginPath(); ctx.arc(sx, sy, 22, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, 22, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#059669'; ctx.font = 'bold 8px Inter'; ctx.textAlign = 'center'; ctx.fillText('SCHOOL', sx, sy + 3);
      // Buses
      buses.forEach(bus => {
        const jx = bus.status === 'moving' ? Math.sin(tick * 0.05 + bus.id.charCodeAt(4)) * 1.5 : 0;
        const jy = bus.status === 'moving' ? Math.cos(tick * 0.04 + bus.id.charCodeAt(4)) * 1 : 0;
        const x = toX(bus.lng) + jx, y = toY(bus.lat) + jy;
        const col = bus.status === 'moving' ? '#6366F1' : bus.status === 'delayed' ? '#F59E0B' : '#94A3B8';
        const sel = selectedBus?.id === bus.id;
        if (bus.status === 'moving' || sel) {
          const pr = 18 + Math.sin(tick * 0.1) * 3;
          ctx.fillStyle = sel ? `${col}28` : `${col}18`;
          ctx.beginPath(); ctx.arc(x, y, pr, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = sel ? col : '#FFFFFF';
        ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = col; ctx.stroke();
        ctx.fillStyle = sel ? '#FFFFFF' : col;
        ctx.font = 'bold 8.5px Inter'; ctx.textAlign = 'center';
        ctx.fillText(bus.id.replace('BUS-', ''), x, y + 3);
        if (bus.status === 'delayed') {
          ctx.fillStyle = '#EF4444'; ctx.beginPath(); ctx.arc(x + 11, y - 11, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'white'; ctx.font = 'bold 8px Inter'; ctx.fillText('!', x + 11, y - 8);
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
      if (Math.hypot(mx - toX(b.lng), my - toY(b.lat)) < 22) { onSelectBus(b); return; }
    }
  };

  return <canvas ref={canvasRef} onClick={handleClick} className="w-full h-full cursor-pointer" style={{ display: 'block' }} />;
}

const statusConfig = {
  moving: { label: 'Moving',  bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
  idle:    { label: 'Idle',    bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
  delayed: { label: 'Delayed', bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B' },
};

export default function FleetCommand() {
  const [selected, setSelected] = useState<Bus | null>(null);

  return (
    <>
      <Topbar title="Live Fleet" subtitle="Real-time vehicle telemetry" action={{ label: 'Dispatch Bus' }} />

      <div style={{ display: 'flex', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>

        {/* Sidebar list */}
        <div style={{ width: 300, flexShrink: 0, background: 'white', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>Active Fleet</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--accent-muted)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6 }}>
              {buses.length} Vehicles
            </span>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderBottom: '1px solid var(--border)' }}>
            {[
              { label: 'Moving',  val: buses.filter(b => b.status === 'moving').length,  color: '#10B981' },
              { label: 'Idle',    val: buses.filter(b => b.status === 'idle').length,    color: '#94A3B8' },
              { label: 'Delayed', val: buses.filter(b => b.status === 'delayed').length, color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} style={{ padding: '10px 0', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-4)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {buses.map(b => {
              const isSel = selected?.id === b.id;
              const sc = statusConfig[b.status as keyof typeof statusConfig];
              return (
                <div
                  key={b.id}
                  onClick={() => setSelected(b === selected ? null : b)}
                  style={{
                    padding: '12px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
                    border: `1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                    background: isSel ? 'var(--accent-muted)' : 'var(--bg)',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: isSel ? 'var(--accent)' : 'var(--text-1)' }}>{b.id}</span>
                    </div>
                    <span style={{ fontSize: 11, background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                      {sc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>{b.driver} · {b.route}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-4)' }}>
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
        <div style={{ flex: 1, position: 'relative', background: '#F8FAFC' }}>
          <MapCanvas buses={buses} selectedBus={selected} onSelectBus={setSelected} />
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'white', border: '1px solid var(--border)',
            borderRadius: 10, padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div className="live-dot" />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.06em' }}>LIVE TELEMETRY</span>
          </div>

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14,
            background: 'white', border: '1px solid var(--border)',
            borderRadius: 10, padding: '10px 14px',
            display: 'flex', gap: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            {Object.entries(statusConfig).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.dot }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-3)', fontWeight: 500 }}>{v.label}</span>
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
        accentColor="#6366F1"
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }}><MessageSquare size={14} /> Message</button>
              <button className="btn-primary" style={{ flex: 1 }}><Phone size={14} /> Call Driver</button>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[
                { icon: Gauge, label: 'Speed', val: `${selected.speed} km/h`, color: '#6366F1' },
                { icon: Fuel, label: 'Fuel', val: `${selected.fuel}%`, color: selected.fuel < 30 ? '#EF4444' : '#10B981' },
                { icon: Users, label: 'Students', val: `${selected.students}/${selected.capacity}`, color: '#F59E0B' },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                  <Icon size={16} style={{ color, margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-1)' }}>{val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>Route Progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{selected.progress}%</span>
              </div>
              <div className="prog-track" style={{ marginBottom: 16 }}>
                <div className={`prog-fill ${selected.status === 'delayed' ? 'prog-fill-amber' : ''}`} style={{ width: `${selected.progress}%` }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selected.stops.map((stop, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 12, height: 12, borderRadius: '50%', border: '2px solid',
                        borderColor: stop.done ? '#10B981' : 'var(--border)',
                        background: stop.done ? '#10B981' : 'white',
                        marginTop: 2,
                      }} />
                      {i < selected.stops.length - 1 && (
                        <div style={{ width: 2, height: 24, background: stop.done ? '#10B981' : 'var(--border)', margin: '3px 0' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: stop.done ? 'var(--text-4)' : 'var(--text-1)', textDecoration: stop.done ? 'line-through' : 'none' }}>
                        {stop.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-4)', marginTop: 1 }}>{stop.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next stop */}
            <div style={{ background: 'var(--accent-muted)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Navigation size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Next Stop</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)' }}>{selected.nextStop}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{selected.eta}</div>
            </div>
          </div>
        )}
      </SlidePanel>
    </>
  );
}
