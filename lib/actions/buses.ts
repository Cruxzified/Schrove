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

export async function getBuses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('buses')
    .select('id, bus_name, plate_number, capacity, status')
    .order('bus_name');
  if (error) { console.error('getBuses:', error); return []; }
  return data ?? [];
}

export async function getRoutes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('routes')
    .select('id, route_name')
    .order('route_name');
  if (error) { console.error('getRoutes:', error); return []; }
  return data ?? [];
}

export async function addBus(formData: FormData) {
  const schoolId = await getSchoolId();
  if (!schoolId) return { error: 'Not authenticated' };

  const payload = {
    school_id:    schoolId,
    bus_name:     (formData.get('bus_name') as string)?.trim(),
    plate_number: (formData.get('plate_number') as string)?.trim() || null,
    capacity:     parseInt(formData.get('capacity') as string, 10) || 40,
    status: 'idle',
  };

  if (!payload.bus_name) return { error: 'Bus name is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('buses').insert(payload);
  if (error) return { error: error.message };
  revalidatePath('/fleet');
  return { success: true };
}

export async function addRoute(formData: FormData) {
  const schoolId = await getSchoolId();
  if (!schoolId) return { error: 'Not authenticated' };

  const payload = {
    school_id:   schoolId,
    route_name:  (formData.get('route_name') as string)?.trim(),
    distance_km: parseFloat(formData.get('distance_km') as string) || null,
  };

  if (!payload.route_name) return { error: 'Route name is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('routes').insert(payload);
  if (error) return { error: error.message };
  revalidatePath('/routes');
  return { success: true };
}
