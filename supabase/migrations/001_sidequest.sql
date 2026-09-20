create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now()
);

create table public.circles (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 50),
  invite_code text not null unique check (invite_code ~ '^[A-Z0-9]{6}$'),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.circle_members (
  circle_id uuid not null references public.circles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  question_date date not null,
  mode text not null check (mode in ('fun', 'reflective')),
  body text not null,
  follow_up text not null default '',
  created_at timestamptz not null default now(),
  unique (question_date, mode)
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  circle_id uuid references public.circles(id) on delete cascade,
  body text not null check (char_length(body) >= 1),
  visibility text not null check (visibility in ('friends', 'private')),
  created_at timestamptz not null default now(),
  unique (question_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) >= 1),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.circles enable row level security;
alter table public.circle_members enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.messages enable row level security;

create or replace function public.is_circle_member(target_circle uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from circle_members where circle_id = target_circle and user_id = auth.uid()) $$;

create or replace function public.has_answered(target_question uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from answers where question_id = target_question and user_id = auth.uid()) $$;

create or replace function public.join_circle_by_code(code text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare target uuid;
begin
  select id into target from circles where invite_code = upper(trim(code));
  if target is null then raise exception 'Circle not found'; end if;
  insert into circle_members(circle_id, user_id) values (target, auth.uid()) on conflict do nothing;
  return target;
end;
$$;

create or replace function public.create_circle(circle_name text)
returns table(id uuid, invite_code text) language plpgsql security definer set search_path = public
as $$
declare new_id uuid; new_code text;
begin
  loop
    new_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists(select 1 from circles where circles.invite_code = new_code);
  end loop;
  insert into circles(name, invite_code, created_by)
  values (circle_name, new_code, auth.uid()) returning circles.id into new_id;
  insert into circle_members(circle_id, user_id) values (new_id, auth.uid());
  return query select new_id, new_code;
end;
$$;

grant execute on function public.join_circle_by_code(text) to authenticated;
grant execute on function public.create_circle(text) to authenticated;

create policy "profiles are readable by signed in users" on public.profiles for select to authenticated using (true);
create policy "users create their own profile" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "users update their own profile" on public.profiles for update to authenticated using (id = auth.uid());

create policy "members read circles" on public.circles for select to authenticated using (public.is_circle_member(id));
create policy "users create circles" on public.circles for insert to authenticated with check (created_by = auth.uid());
create policy "creators update circles" on public.circles for update to authenticated using (created_by = auth.uid());

create policy "members read memberships" on public.circle_members for select to authenticated using (public.is_circle_member(circle_id));
create policy "creators add initial membership" on public.circle_members for insert to authenticated
with check (user_id = auth.uid() and exists(select 1 from public.circles c where c.id = circle_id and c.created_by = auth.uid()));

create policy "questions are readable" on public.questions for select to authenticated using (true);

create policy "users read their own and eligible circle answers" on public.answers for select to authenticated using (
  user_id = auth.uid()
  or (
    visibility = 'friends'
    and circle_id is not null
    and public.is_circle_member(circle_id)
    and public.has_answered(question_id)
  )
);
create policy "users create their answers" on public.answers for insert to authenticated with check (
  user_id = auth.uid() and (circle_id is null or public.is_circle_member(circle_id))
);
create policy "users update their answers" on public.answers for update to authenticated using (user_id = auth.uid());

create policy "members read messages" on public.messages for select to authenticated using (public.is_circle_member(circle_id));
create policy "members send messages" on public.messages for insert to authenticated with check (user_id = auth.uid() and public.is_circle_member(circle_id));
create policy "authors delete messages" on public.messages for delete to authenticated using (user_id = auth.uid());

alter publication supabase_realtime add table public.messages;

insert into public.questions(question_date, mode, body, follow_up) values
  (current_date, 'fun', 'What was your favorite plushie as a kid?', 'What was its name and personality?'),
  (current_date, 'reflective', 'If you met yourself from five years ago, what would you tell them?', 'What would your younger self be proud to see?')
on conflict (question_date, mode) do update set body = excluded.body, follow_up = excluded.follow_up;
