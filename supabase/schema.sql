-- EXTENSIONS
create extension if not exists "uuid-ossp";

-- 1. SCHOOLS
create table if not exists public.schools (
  id uuid primary key default uuid_generate_v4(),
  school_name text not null,
  school_code text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USERS (Admins)
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  role text not null default 'admin',
  email text not null,
  full_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function to get the current user's school_id for RLS policies
create or replace function public.get_auth_school_id()
returns uuid as $$
  select school_id from public.users where id = auth.uid() limit 1;
$$ language sql security definer;

-- 3. BUSES
create table if not exists public.buses (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references public.schools(id) on delete cascade,
  bus_name text not null,
  status text not null default 'idle',
  lat double precision,
  lng double precision,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ROUTES
create table if not exists public.routes (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references public.schools(id) on delete cascade,
  route_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. STUDENTS
create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references public.schools(id) on delete cascade,
  full_name text not null,
  class_name text not null,
  bus_id uuid references public.buses(id) on delete set null,
  attendance_percentage integer default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. DRIVERS
create table if not exists public.drivers (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references public.schools(id) on delete cascade,
  full_name text not null,
  assigned_bus_id uuid references public.buses(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE ROW LEVEL SECURITY (RLS)
alter table public.schools enable row level security;
alter table public.users enable row level security;
alter table public.buses enable row level security;
alter table public.routes enable row level security;
alter table public.students enable row level security;
alter table public.drivers enable row level security;

-- POLICIES

-- Schools: A user can view their own school
create policy "Users can view their own school" on public.schools
  for select using (id = public.get_auth_school_id());

-- Users: A user can view users of their own school
create policy "Users can view users of their own school" on public.users
  for select using (school_id = public.get_auth_school_id());

-- Buses
create policy "Users can view buses of their school" on public.buses
  for all using (school_id = public.get_auth_school_id());

-- Routes
create policy "Users can view routes of their school" on public.routes
  for all using (school_id = public.get_auth_school_id());

-- Students
create policy "Users can view students of their school" on public.students
  for all using (school_id = public.get_auth_school_id());

-- Drivers
create policy "Users can view drivers of their school" on public.drivers
  for all using (school_id = public.get_auth_school_id());

-- TRIGGER: Ensure new rows automatically get the user's school_id if not provided
-- Actually, it's safer to enforce it in the application logic.

-- We also need a way for the very first user (the admin who signs up) to create the school and their user record.
-- Since RLS blocks inserts by default, we need to allow inserts during the signup flow.
-- Usually, signup uses the Service Role Key from the server to bypass RLS and provision the tenant securely.
