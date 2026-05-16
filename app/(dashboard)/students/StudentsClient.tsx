'use client';
import { useState, useMemo } from 'react';
import { Filter, Download, Search, MapPin, AlertTriangle, Clock, Bus, ChevronLeft, ChevronRight, X, UserPlus, Save } from 'lucide-react';
import Topbar from '@/components/Topbar';
import SlidePanel from '@/components/SlidePanel';
import { addStudent, updateStudent, deleteStudent } from '@/lib/actions/students';

type Student = any; // We'll rely on any for now to handle Supabase join shape
type BusType = any;
type RouteType = any;

const statusBadge: Record<string, { bg: string; color: string }> = {
  'Onboard':  { bg: 'var(--green-bg)', color: 'var(--green)' },
  'At Stop':  { bg: 'var(--amber-bg)', color: 'var(--amber)' },
  'Absent':   { bg: 'var(--sidebar-active-bg)', color: 'var(--text-3)' },
  'active':   { bg: 'var(--accent-muted)', color: 'var(--accent)' },
};

export default function StudentsClient({ initialStudents, buses, routes }: { initialStudents: Student[], buses: BusType[], routes: RouteType[] }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Slide Panel State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive unique buses from the data plus the available buses
  const busNumbers = useMemo(() => {
    const fromBuses = buses.map((b: any) => ({ id: b.id, name: b.bus_name }));
    return fromBuses;
  }, [buses]);

  const filtered = students.filter(s => {
    const matchBus = !selectedBus || s.bus_id === selectedBus;
    const matchSearch = !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    return matchBus && matchSearch;
  });

  async function handleAdd(formData: FormData) {
    setIsSubmitting(true);
    const res = await addStudent(formData);
    if (res.error) alert(res.error);
    else {
      setIsAddOpen(false);
      window.location.reload(); // Quick refresh to get new data
    }
    setIsSubmitting(false);
  }

  async function handleEdit(formData: FormData) {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    const res = await updateStudent(selectedStudent.id, formData);
    if (res.error) alert(res.error);
    else {
      setSelectedStudent(null);
      window.location.reload();
    }
    setIsSubmitting(false);
  }

  async function handleDelete() {
    if (!selectedStudent) return;
    if (!confirm('Are you sure you want to delete this student?')) return;
    setIsSubmitting(true);
    const res = await deleteStudent(selectedStudent.id);
    if (res.error) alert(res.error);
    else {
      setSelectedStudent(null);
      window.location.reload();
    }
    setIsSubmitting(false);
  }

  return (
    <>
      <Topbar title="Students" subtitle="Monitor student transportation in real-time" action={{ label: 'Add Student', icon: UserPlus, onClick: () => setIsAddOpen(true) }} />
      <div className="page-content" style={{ display: 'flex', gap: 24 }}>

        {/* LEFT FILTER PANEL */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>Filters</div>
            <div style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 18 }}>Refine student results</div>

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

            {/* Bus filter */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Bus Number</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {busNumbers.map((b: any) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBus(selectedBus === b.id ? null : b.id)}
                    style={{
                      padding: '5px 10px', borderRadius: 7, fontSize: 12.5, fontWeight: 600,
                      border: `1px solid ${selectedBus === b.id ? 'var(--accent)' : 'var(--border)'}`,
                      background: selectedBus === b.id ? 'var(--accent-muted)' : 'var(--bg)',
                      color: selectedBus === b.id ? 'var(--accent)' : 'var(--text-2)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >{b.name}</button>
                ))}
                <button
                  onClick={() => setSelectedBus(null)}
                  style={{
                    padding: '5px 10px', borderRadius: 7, fontSize: 12.5, fontWeight: 600,
                    border: `1px solid ${!selectedBus ? 'var(--accent)' : 'var(--border)'}`,
                    background: !selectedBus ? 'var(--accent)' : 'var(--bg)',
                    color: !selectedBus ? 'white' : 'var(--text-2)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >All</button>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }}>
              <Filter size={14} /> Apply Filters
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Students Overview</h1>
                <span style={{ fontSize: 12, fontWeight: 700, background: 'var(--accent-muted)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 99 }}>{filtered.length}</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-4)' }}>Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Table */}
          <div className="section-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Bus</th>
                    <th>Pickup Point</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => {
                    const sb = statusBadge[s.status] || statusBadge['active'];
                    const initials = s.full_name?.split(' ').map((n:string)=>n[0]).join('').substring(0,2).toUpperCase();
                    return (
                      <tr key={s.id} onClick={() => setSelectedStudent(s)} style={{ cursor: 'pointer' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 12, background: 'var(--accent)',
                              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 13, fontWeight: 700, flexShrink: 0,
                            }}>{initials}</div>
                            <div>
                              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)' }}>{s.full_name}</div>
                              <div style={{ fontSize: 11.5, color: 'var(--text-4)', marginTop: 1 }}>{s.routes?.route_name || 'No Route'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{s.class_name}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Bus size={14} style={{ color: 'var(--text-4)' }} />
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)' }}>{s.buses?.bus_name || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-3)' }}>{s.pickup_stop || '--'}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: sb.bg, color: sb.color }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sb.color, display: 'inline-block' }} />
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-4)', fontSize: 13 }}>
                        No students match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Panel for ADD STUDENT */}
      <SlidePanel open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Student" subtitle="Register a new student for transport">
        <form action={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Full Name</label>
            <input name="full_name" required className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} placeholder="e.g. John Doe" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Class / Grade</label>
            <input name="class_name" required className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} placeholder="e.g. Grade 10" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Assign Bus</label>
              <select name="bus_id" className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
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
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Pickup Stop</label>
            <input name="pickup_stop" className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} placeholder="e.g. Maple Ridge Dr" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Parent Name</label>
              <input name="parent_name" className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Parent Phone</label>
              <input name="parent_phone" className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} placeholder="e.g. +1 555-0192" />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}>
            {isSubmitting ? 'Saving...' : <><Save size={15} /> Save Student</>}
          </button>
        </form>
      </SlidePanel>

      {/* Slide Panel for EDIT STUDENT */}
      <SlidePanel open={!!selectedStudent} onClose={() => setSelectedStudent(null)} title={selectedStudent?.full_name || ''} subtitle={`Class: ${selectedStudent?.class_name}`}>
        {selectedStudent && (
          <form action={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Full Name</label>
              <input name="full_name" defaultValue={selectedStudent.full_name} required className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Class / Grade</label>
              <input name="class_name" defaultValue={selectedStudent.class_name} required className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Assign Bus</label>
                <select name="bus_id" defaultValue={selectedStudent.bus_id || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                  <option value="">Unassigned</option>
                  {buses.map((b: any) => <option key={b.id} value={b.id}>{b.bus_name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Assign Route</label>
                <select name="route_id" defaultValue={selectedStudent.route_id || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                  <option value="">Unassigned</option>
                  {routes.map((r: any) => <option key={r.id} value={r.id}>{r.route_name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Pickup Stop</label>
              <input name="pickup_stop" defaultValue={selectedStudent.pickup_stop || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Parent Name</label>
                <input name="parent_name" defaultValue={selectedStudent.parent_name || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>Parent Phone</label>
                <input name="parent_phone" defaultValue={selectedStudent.parent_phone || ''} className="form-input" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {isSubmitting ? 'Saving...' : 'Update Details'}
              </button>
              <button type="button" disabled={isSubmitting} onClick={handleDelete} className="btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
                Remove Student
              </button>
            </div>
          </form>
        )}
      </SlidePanel>
    </>
  );
}
