-- WashGo — Phase 1 backend foundation
-- Full platform schema, but only `profiles` and `addresses` are wired into
-- the app in this phase. Everything else (laundries, services, orders,
-- notifications, payments, favorites) is created now so later phases don't
-- need destructive migrations, but has no client integration yet.

-- ============================================================================
-- Extensions
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- Enums
-- ============================================================================

create type public.user_role as enum ('customer', 'rider', 'laundry_owner', 'admin');

create type public.laundry_approval_status as enum ('pending', 'approved', 'rejected');

create type public.pricing_unit as enum ('per_kg', 'per_item', 'flat');

create type public.order_status as enum (
  'pending',
  'rider_assigned',
  'picked_up',
  'at_laundry',
  'washing',
  'ready_for_delivery',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

create type public.payment_method_type as enum ('cash', 'card', 'wallet');

create type public.payment_status_type as enum ('pending', 'paid', 'failed', 'refunded');

create type public.notification_type as enum (
  'order_update',
  'promotion',
  'system'
);

-- ============================================================================
-- Helper: keep `updated_at` current on every row update
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- profiles
-- One row per auth.users row, created automatically by the trigger below.
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text,
  phone text,
  email text,
  avatar_url text,
  preferred_language text not null default 'en' check (preferred_language in ('en', 'km')),
  theme_preference text not null default 'light' check (theme_preference in ('light', 'dark')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Role is never client-writable: silently keep the previously stored value
-- if an UPDATE tries to change it, rather than rejecting the whole request
-- (which would also block legitimate updates to other fields in the same
-- call). Admin role changes are out of scope for this phase and should be
-- done with the Supabase service role or a future secure admin flow.
create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role then
    new.role := old.role;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_profile_role_change();

-- ============================================================================
-- addresses
-- ============================================================================

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null,
  address_line text not null,
  delivery_instructions text,
  latitude double precision,
  longitude double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses (user_id);

-- A user may have at most one default address — a partial unique index is
-- the cheapest way to guarantee this at the database level regardless of
-- how the client got there.
create unique index addresses_one_default_per_user
  on public.addresses (user_id)
  where is_default;

create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

-- Atomically move the "default" flag to a single address owned by the
-- caller. Runs as the caller (security invoker, the default), so normal
-- addresses RLS policies still apply to both updates inside the function —
-- it cannot be used to touch another user's rows.
create or replace function public.set_default_address(p_address_id uuid)
returns void
language plpgsql
security invoker
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1 from public.addresses where id = p_address_id and user_id = v_user_id
  ) then
    raise exception 'Address not found';
  end if;

  update public.addresses
  set is_default = false
  where user_id = v_user_id and is_default and id <> p_address_id;

  update public.addresses
  set is_default = true
  where id = p_address_id;
end;
$$;

grant execute on function public.set_default_address(uuid) to authenticated;

-- ============================================================================
-- laundries (schema foundation only — not connected to the app yet)
-- ============================================================================

create table public.laundries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete set null,
  name text not null,
  description text,
  phone text,
  address_line text,
  latitude double precision,
  longitude double precision,
  rating_average numeric(2, 1) not null default 0 check (rating_average >= 0 and rating_average <= 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  is_open boolean not null default true,
  approval_status public.laundry_approval_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index laundries_owner_id_idx on public.laundries (owner_id);

create trigger laundries_set_updated_at
  before update on public.laundries
  for each row execute function public.set_updated_at();

-- ============================================================================
-- laundry_services (schema foundation only — not connected to the app yet)
-- ============================================================================

create table public.laundry_services (
  id uuid primary key default gen_random_uuid(),
  laundry_id uuid not null references public.laundries (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  pricing_unit public.pricing_unit not null default 'per_kg',
  estimated_duration_minutes integer check (estimated_duration_minutes is null or estimated_duration_minutes >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index laundry_services_laundry_id_idx on public.laundry_services (laundry_id);

create trigger laundry_services_set_updated_at
  before update on public.laundry_services
  for each row execute function public.set_updated_at();

-- ============================================================================
-- orders (schema foundation only — not connected to the app yet)
-- ============================================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  laundry_id uuid not null references public.laundries (id) on delete restrict,
  pickup_rider_id uuid references public.profiles (id) on delete set null,
  delivery_rider_id uuid references public.profiles (id) on delete set null,
  -- Address snapshot at order time, so later edits/deletes of the saved
  -- address never change what a past order shows.
  address_label text,
  address_line text not null,
  address_latitude double precision,
  address_longitude double precision,
  delivery_instructions text,
  status public.order_status not null default 'pending',
  pickup_scheduled_at timestamptz,
  notes text,
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  pickup_fee numeric(10, 2) not null default 0 check (pickup_fee >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  discount numeric(10, 2) not null default 0 check (discount >= 0),
  total numeric(10, 2) not null default 0 check (total >= 0),
  payment_method public.payment_method_type not null default 'cash',
  payment_status public.payment_status_type not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_customer_id_idx on public.orders (customer_id);
create index orders_laundry_id_idx on public.orders (laundry_id);
create index orders_pickup_rider_id_idx on public.orders (pickup_rider_id);
create index orders_delivery_rider_id_idx on public.orders (delivery_rider_id);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================================
-- order_items (schema foundation only — not connected to the app yet)
-- ============================================================================

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  service_id uuid references public.laundry_services (id) on delete set null,
  -- Snapshot of the service name/price at order time, independent of later
  -- edits to the laundry's service catalog.
  service_name text not null,
  quantity numeric(10, 2) not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items (order_id);

-- ============================================================================
-- order_status_history (schema foundation only — not connected to the app yet)
-- ============================================================================

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index order_status_history_order_id_idx on public.order_status_history (order_id);

-- ============================================================================
-- notifications (schema foundation only — not connected to the app yet)
-- ============================================================================

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null default 'system',
  title text not null,
  message text not null,
  related_order_id uuid references public.orders (id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);

-- ============================================================================
-- payments (schema foundation only — no card/bank data, not connected yet)
-- ============================================================================

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  amount numeric(10, 2) not null check (amount >= 0),
  method public.payment_method_type not null,
  status public.payment_status_type not null default 'pending',
  -- Opaque reference to an external payment provider's record, if any.
  -- Never store card numbers, bank credentials, or other sensitive data here.
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_order_id_idx on public.payments (order_id);

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ============================================================================
-- favorites (schema foundation only — not connected to the app yet)
-- ============================================================================

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  laundry_id uuid not null references public.laundries (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, laundry_id)
);

create index favorites_user_id_idx on public.favorites (user_id);

-- ============================================================================
-- New auth user -> profile row
-- ============================================================================

-- Runs as the function owner (security definer) because the inserting
-- session is the Supabase auth service, not the new user, and RLS on
-- `profiles` only allows a user to touch their own row. Role always defaults
-- to 'customer' here — client-supplied metadata can never set it, closing
-- off self-service admin/rider/owner escalation at signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone, email, preferred_language)
  values (
    new.id,
    'customer',
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_language', ''), 'en')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.laundries enable row level security;
alter table public.laundry_services enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.notifications enable row level security;
alter table public.payments enable row level security;
alter table public.favorites enable row level security;

-- ---- profiles ----
-- No public "list all profiles" policy exists — only an authenticated user
-- reading/writing their own row is permitted.

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Row creation happens only via the handle_new_user trigger (security
-- definer); there is deliberately no client-facing INSERT policy.

-- ---- addresses ----

create policy "addresses_select_own"
  on public.addresses for select
  to authenticated
  using (user_id = auth.uid());

create policy "addresses_insert_own"
  on public.addresses for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "addresses_update_own"
  on public.addresses for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "addresses_delete_own"
  on public.addresses for delete
  to authenticated
  using (user_id = auth.uid());

-- ---- favorites ----

create policy "favorites_select_own"
  on public.favorites for select
  to authenticated
  using (user_id = auth.uid());

create policy "favorites_insert_own"
  on public.favorites for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "favorites_delete_own"
  on public.favorites for delete
  to authenticated
  using (user_id = auth.uid());

-- ---- notifications ----
-- Client can read and mark-as-read; rows are otherwise written by trusted
-- server-side logic (not implemented in this phase), so there is no
-- client-facing INSERT/DELETE policy.

create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---- laundries ----
-- Approval status, not the "open now" flag, is the read gate: a
-- temporarily-closed but approved shop should still be visible (e.g. so its
-- hours can be shown), just not bookable.

create policy "laundries_select_approved"
  on public.laundries for select
  to authenticated
  using (approval_status = 'approved');

create policy "laundries_owner_select_own"
  on public.laundries for select
  to authenticated
  using (owner_id = auth.uid());

create policy "laundries_owner_insert_own"
  on public.laundries for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "laundries_owner_update_own"
  on public.laundries for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "laundries_owner_delete_own"
  on public.laundries for delete
  to authenticated
  using (owner_id = auth.uid());

-- ---- laundry_services ----

create policy "laundry_services_select_active"
  on public.laundry_services for select
  to authenticated
  using (
    is_active
    and exists (
      select 1 from public.laundries l
      where l.id = laundry_id and l.approval_status = 'approved'
    )
  );

create policy "laundry_services_owner_all"
  on public.laundry_services for all
  to authenticated
  using (
    exists (select 1 from public.laundries l where l.id = laundry_id and l.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.laundries l where l.id = laundry_id and l.owner_id = auth.uid())
  );

-- ---- orders ----
-- Read-only from the client in this phase. Status/assignment changes are
-- deliberately left to a future secure server-side flow, so there is no
-- client-facing INSERT/UPDATE/DELETE policy — customers cannot freely
-- rewrite order status.

create policy "orders_select_customer"
  on public.orders for select
  to authenticated
  using (customer_id = auth.uid());

create policy "orders_select_laundry_owner"
  on public.orders for select
  to authenticated
  using (exists (select 1 from public.laundries l where l.id = laundry_id and l.owner_id = auth.uid()));

create policy "orders_select_rider"
  on public.orders for select
  to authenticated
  using (pickup_rider_id = auth.uid() or delivery_rider_id = auth.uid());

-- ---- order_items ----
-- Visible to whoever can already see the parent order; no direct writes.

create policy "order_items_select_via_order"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.customer_id = auth.uid()
          or o.pickup_rider_id = auth.uid()
          or o.delivery_rider_id = auth.uid()
          or exists (select 1 from public.laundries l where l.id = o.laundry_id and l.owner_id = auth.uid())
        )
    )
  );

-- ---- order_status_history ----

create policy "order_status_history_select_via_order"
  on public.order_status_history for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.customer_id = auth.uid()
          or o.pickup_rider_id = auth.uid()
          or o.delivery_rider_id = auth.uid()
          or exists (select 1 from public.laundries l where l.id = o.laundry_id and l.owner_id = auth.uid())
        )
    )
  );

-- ---- payments ----
-- Read-only from the client; payment records are written by a future
-- trusted server-side flow, never directly by the customer.

create policy "payments_select_via_order"
  on public.payments for select
  to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));
