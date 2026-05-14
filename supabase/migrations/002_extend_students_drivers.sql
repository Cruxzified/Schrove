-- Migration 002: Extend students, drivers, and buses tables
-- Run this in Supabase SQL Editor

-- Extend students table
alter table public.students
  add column if not exists phone text,
  add column if not exists parent_name text,
  add column if not exists parent_phone text,
  add column if not exists pickup_stop text,
  add column if not exists notes text,
  add column if not exists route_id uuid references public.routes(id) on delete set null,
  add column if not exists status text not null default 'active';

-- Extend drivers table
alter table public.drivers
  add column if not exists phone text,
  add column if not exists license_number text,
  add column if not exists route_id uuid references public.routes(id) on delete set null,
  add column if not exists status text not null default 'active';

-- Extend buses table
alter table public.buses
  add column if not exists capacity integer default 40,
  add column if not exists plate_number text;

-- Extend routes table
alter table public.routes
  add column if not exists distance_km numeric(6,2),
  add column if not exists stops_count integer default 0;
