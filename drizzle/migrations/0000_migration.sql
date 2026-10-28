create type public.app_role as enum ('super_admin','org_admin','it_admin','security_analyst','technician','end_user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select, insert, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.is_user_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role in ('super_admin','org_admin')) $$;

create policy "Own profile readable" on public.profiles for select to authenticated using (id = auth.uid() or public.is_user_admin(auth.uid()));
create policy "Own profile editable" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "Read own or admin reads all roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_user_admin(auth.uid()));
create policy "Admins grant roles" on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(),'super_admin') or (public.has_role(auth.uid(),'org_admin') and role <> 'super_admin'));
create policy "Admins revoke roles" on public.user_roles for delete to authenticated
  using ((public.has_role(auth.uid(),'super_admin') and user_id <> auth.uid()) or (public.has_role(auth.uid(),'org_admin') and role <> 'super_admin' and user_id <> auth.uid()));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  if not exists (select 1 from public.user_roles where role = 'super_admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'super_admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'end_user');
  end if;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;