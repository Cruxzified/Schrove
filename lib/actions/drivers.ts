'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSchoolId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('users').select('school_id').eq('id', user.id).single();
  return data?.school_id ?? null;
}

// ─────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────
export async function getDrivers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('drivers')
    .select(`
      id, full_name, phone, license_number, status, created_at,
      assigned_bus_id, route_id,
      buses ( id, bus_name, plate_number ),
      routes ( id, route_name )
    `)
    .order('created_at', { ascending: false });

  if (error) { console.error('getDrivers:', error); return []; }
  return data ?? [];
}

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────
export async function addDriver(formData: FormData) {
  const schoolId = await getSchoolId();
  if (!schoolId) return { error: 'Not authenticated' };

  const payload = {
    school_id: schoolId,
    full_name:      (formData.get('full_name') as string)?.trim(),
    phone:          (formData.get('phone') as string)?.trim() || null,
    license_number: (formData.get('license_number') as string)?.trim() || null,
    assigned_bus_id:(formData.get('assigned_bus_id') as string) || null,
    route_id:       (formData.get('route_id') as string) || null,
    status: 'active',
  };

  if (!payload.full_name) return { error: 'Driver name is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('drivers').insert(payload);
  if (error) { console.error('addDriver:', error); return { error: error.message }; }

  revalidatePath('/drivers');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────
export async function updateDriver(id: string, formData: FormData) {
  const supabase = await createClient();
  const payload: Record<string, unknown> = {};

  const fields = ['full_name', 'phone', 'license_number', 'assigned_bus_id', 'route_id', 'status'];
  for (const f of fields) {
    const v = formData.get(f);
    if (v !== null) payload[f] = (v as string).trim() || null;
  }

  const { error } = await supabase.from('drivers').update(payload).eq('id', id);
  if (error) { console.error('updateDriver:', error); return { error: error.message }; }

  revalidatePath('/drivers');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// ASSIGN BUS
// ─────────────────────────────────────────────────────────────
export async function assignDriverBus(driverId: string, busId: string | null) {
  const supabase = await createClient();
  const { error } = await supabase.from('drivers').update({ assigned_bus_id: busId }).eq('id', driverId);
  if (error) return { error: error.message };
  revalidatePath('/drivers');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────
export async function deleteDriver(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('drivers').delete().eq('id', id);
  if (error) { console.error('deleteDriver:', error); return { error: error.message }; }
  revalidatePath('/drivers');
  return { success: true };
}
