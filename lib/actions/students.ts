'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** Get the school_id for the currently logged-in admin */
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
export async function getStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('students')
    .select(`
      id, full_name, class_name, phone, parent_name, parent_phone,
      pickup_stop, notes, status, attendance_percentage, created_at,
      bus_id, route_id,
      buses ( id, bus_name, plate_number ),
      routes ( id, route_name )
    `)
    .order('created_at', { ascending: false });

  if (error) { console.error('getStudents:', error); return []; }
  return data ?? [];
}

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────
export async function addStudent(formData: FormData) {
  const schoolId = await getSchoolId();
  if (!schoolId) return { error: 'Not authenticated' };

  const payload = {
    school_id: schoolId,
    full_name:           (formData.get('full_name') as string)?.trim(),
    class_name:          (formData.get('class_name') as string)?.trim(),
    phone:               (formData.get('phone') as string)?.trim() || null,
    parent_name:         (formData.get('parent_name') as string)?.trim() || null,
    parent_phone:        (formData.get('parent_phone') as string)?.trim() || null,
    pickup_stop:         (formData.get('pickup_stop') as string)?.trim() || null,
    notes:               (formData.get('notes') as string)?.trim() || null,
    bus_id:              (formData.get('bus_id') as string) || null,
    route_id:            (formData.get('route_id') as string) || null,
    attendance_percentage: 100,
    status: 'active',
  };

  if (!payload.full_name || !payload.class_name) {
    return { error: 'Full name and class are required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('students').insert(payload);
  if (error) { console.error('addStudent:', error); return { error: error.message }; }

  revalidatePath('/students');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────
export async function updateStudent(id: string, formData: FormData) {
  const supabase = await createClient();
  const payload: Record<string, unknown> = {};

  const fields = ['full_name', 'class_name', 'phone', 'parent_name', 'parent_phone', 'pickup_stop', 'notes', 'bus_id', 'route_id', 'status'];
  for (const f of fields) {
    const v = formData.get(f);
    if (v !== null) payload[f] = (v as string).trim() || null;
  }
  const att = formData.get('attendance_percentage');
  if (att !== null) payload['attendance_percentage'] = parseInt(att as string, 10);

  const { error } = await supabase.from('students').update(payload).eq('id', id);
  if (error) { console.error('updateStudent:', error); return { error: error.message }; }

  revalidatePath('/students');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// ASSIGN BUS / ROUTE
// ─────────────────────────────────────────────────────────────
export async function assignStudentBus(studentId: string, busId: string | null) {
  const supabase = await createClient();
  const { error } = await supabase.from('students').update({ bus_id: busId }).eq('id', studentId);
  if (error) return { error: error.message };
  revalidatePath('/students');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────
export async function deleteStudent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) { console.error('deleteStudent:', error); return { error: error.message }; }
  revalidatePath('/students');
  return { success: true };
}
