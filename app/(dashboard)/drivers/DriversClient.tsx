'use client';
import { useState } from 'react';
import { Search, Bus, UserPlus, Save, X } from 'lucide-react';
import Topbar from '@/components/Topbar';
import SlidePanel from '@/components/SlidePanel';
import { addDriver, updateDriver, deleteDriver } from '@/lib/actions/drivers';

type Driver = any;
type BusType = any;
type RouteType = any;

const statusBadge: Record<string, { bg: string; color: string }> = {
  'active':   { bg: '#ECFDF5', color: '#059669' },
  'inactive': { bg: '#F1F5F9', color: '#475569' },
  'on-leave': { bg: '#FFFBEB', color: '#B45309' },
};

export default function DriversClient({ initialDrivers, buses, routes }: { initialDrivers: Driver[], buses: BusType[], routes: RouteType[] }) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState('');

  // Slide Panel State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = drivers.filter(d => {
    const matchSearch = !search || d.full_name?.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  async function handleAdd(formData: FormData) {
    setIsSubmitting(true);
    const res = await addDriver(formData);
    if (res.error) alert(res.error);
    else {
      setIsAddOpen(false);
      window.location.reload();
    }
    setIsSubmitting(false);
  }

  async function handleEdit(formData: FormData) {
    if (!selectedDriver) return;
    setIsSubmitting(true);
    const res = await updateDriver(selectedDriver.id, formData);
    if (res.error) alert(res.error);
    else {
      setSelectedDriver(null);
      window.location.reload();
    }
    setIsSubmitting(false);
  }

  async function handleDelete() {
    if (!selectedDriver) return;
    if (!confirm('Are you sure you want to delete this driver?')) return;
    setIsSubmitting(true);
    const res = await deleteDriver(selectedDriver.id);
    if (res.error) alert(res.error);
    else {
      setSelectedDriver(null);
      window.location.reload();
    }
    setIsSubmitting(false);
  }

  return (
    <>
      <Topbar title="Drivers" subtitle="Manage fleet operators and assignments" action={{ label: 'Add Driver', icon: UserPlus, onClick: () => setIsAddOpen(true) }} />
      <div className="page-content" style={{ display: 'flex', gap: 24 }}>

        {/* LEFT FILTER PANEL */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: '18px 18px 20px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>Filters</div>
            
            {/* Search */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Search</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '0 10px', height: 36 }}>
                <Search size={13} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Name or ID…"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12.5, width: '100%', color: 'var(--text-1)' }}
                />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}><X size={12} /></button>}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Drivers Directory</h1>
                <span style={{ fontSize: 12, fontWeight: 700, background: 'var(--accent-muted)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 99 }}>{filtered.length}</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="section-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Phone</th>
                    <th>License</th>
                    <th>Assigned Bus</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => {
                    const sb = statusBadge[d.status] || statusBadge['active'];
                    const initials = d.full_name?.split(' ').map((n:string)=>n[0]).join('').substring(0,2).toUpperCase();
                    return (
                      <tr key={d.id} onClick={() => setSelectedDriver(d)} style={{ cursor: 'pointer' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 10, background: '#10B981',
                              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 700, flexShrink: 0,
                            }}>{initials}</div>
                            <div>
                              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)' }}>{d.full_name}</div>
                              <div style={{ fontSize: 11.5, color: 'var(--text-4)', marginTop: 1 }}>{d.routes?.route_name || 'No Route'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-3)' }}>{d.phone || '--'}</td>
                        <td style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-3)' }}>{d.license_number || '--'}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Bus size={14} style={{ color: 'var(--text-4)' }} />
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)' }}>{d.buses?.bus_name || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: sb.bg, color: sb.color }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sb.color, display: 'inline-block' }} />
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-4)', fontSize: 13 }}>
                        No drivers match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Panel for ADD DRIVER */}
      <SlidePanel open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Driver" subtitle="Register a new operator to the fleet">
        <form action={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Full Name</label>
            <input name="full_name" required className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} placeholder="e.g. Marcus Thompson" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Phone Number</label>
              <input name="phone" className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} placeholder="e.g. +1 555-0198" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>License Number</label>
              <input name="license_number" className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} placeholder="e.g. CDL-123456" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Assign Bus</label>
              <select name="assigned_bus_id" className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <option value="">Unassigned</option>
                {buses.map((b: any) => <option key={b.id} value={b.id}>{b.bus_name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Assign Route</label>
              <select name="route_id" className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <option value="">Unassigned</option>
                {routes.map((r: any) => <option key={r.id} value={r.id}>{r.route_name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}>
            {isSubmitting ? 'Saving...' : <><Save size={15} /> Save Driver</>}
          </button>
        </form>
      </SlidePanel>

      {/* Slide Panel for EDIT DRIVER */}
      <SlidePanel open={!!selectedDriver} onClose={() => setSelectedDriver(null)} title={selectedDriver?.full_name || ''} subtitle={`Driver ID: ${selectedDriver?.id?.split('-')[0]}`}>
        {selectedDriver && (
          <form action={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Full Name</label>
              <input name="full_name" defaultValue={selectedDriver.full_name} required className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Phone Number</label>
                <input name="phone" defaultValue={selectedDriver.phone || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>License Number</label>
                <input name="license_number" defaultValue={selectedDriver.license_number || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Assign Bus</label>
                <select name="assigned_bus_id" defaultValue={selectedDriver.assigned_bus_id || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                  <option value="">Unassigned</option>
                  {buses.map((b: any) => <option key={b.id} value={b.id}>{b.bus_name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Assign Route</label>
                <select name="route_id" defaultValue={selectedDriver.route_id || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                  <option value="">Unassigned</option>
                  {routes.map((r: any) => <option key={r.id} value={r.id}>{r.route_name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Status</label>
              <select name="status" defaultValue={selectedDriver.status || 'active'} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {isSubmitting ? 'Saving...' : 'Update Details'}
              </button>
              <button type="button" disabled={isSubmitting} onClick={handleDelete} className="btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
                Remove Driver
              </button>
            </div>
          </form>
        )}
      </SlidePanel>
    </>
  );
}
