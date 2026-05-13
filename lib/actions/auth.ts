'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Admin client to bypass RLS for initial school/user creation
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function generateSchoolCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function signUpAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const schoolName = formData.get('schoolName') as string;

  if (!email || !password || !fullName || !schoolName) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();
  const adminClient = getAdminClient();

  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Auth Error:', authError);
    return { error: authError.message };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return { error: 'Failed to create user account.' };
  }

  // 2. Generate School Code
  const schoolCode = generateSchoolCode();

  // 3. Create School using Admin Client (bypass RLS)
  const { data: schoolData, error: schoolError } = await adminClient
    .from('schools')
    .insert({
      school_name: schoolName,
      school_code: schoolCode,
    })
    .select('id')
    .single();

  if (schoolError) {
    console.error('School Error:', schoolError);
    // Cleanup if possible, or handle gracefully
    return { error: 'Failed to provision school workspace: ' + schoolError.message };
  }

  // 4. Create User Profile
  const { error: userError } = await adminClient
    .from('users')
    .insert({
      id: userId,
      school_id: schoolData.id,
      email,
      full_name: fullName,
      role: 'admin',
    });

  if (userError) {
    console.error('User Error:', userError);
    return { error: 'Failed to create admin profile: ' + userError.message };
  }

  // Success
  return { success: true, schoolCode };
}

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const schoolCode = formData.get('schoolCode') as string;

  if (!email || !password || !schoolCode) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();
  const adminClient = getAdminClient();

  // 1. Authenticate user
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: 'Invalid email or password.' };
  }

  // 2. Verify School Code
  // Get the user's school_id
  const { data: userData, error: userError } = await adminClient
    .from('users')
    .select('school_id')
    .eq('id', authData.user.id)
    .single();

  if (userError || !userData) {
    await supabase.auth.signOut();
    return { error: 'Admin profile not found.' };
  }

  // Get the school code
  const { data: schoolData, error: schoolError } = await adminClient
    .from('schools')
    .select('school_code')
    .eq('id', userData.school_id)
    .single();

  if (schoolError || schoolData?.school_code !== schoolCode) {
    await supabase.auth.signOut();
    return { error: 'Invalid School Code for this account.' };
  }

  // Success
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
