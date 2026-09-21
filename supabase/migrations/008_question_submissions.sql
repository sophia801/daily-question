create table if not exists public.question_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null check (mode in ('fun', 'reflective')),
  body text not null check (char_length(trim(body)) between 8 and 280),
  follow_up text check (follow_up is null or char_length(trim(follow_up)) <= 280),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.question_submissions enable row level security;

create policy "people submit their own questions" on public.question_submissions
for insert to authenticated
with check (user_id = auth.uid() and status = 'pending');

create policy "people see their own submissions" on public.question_submissions
for select to authenticated
using (user_id = auth.uid());

create or replace function public.get_community_question(
  target_date date,
  question_mode text,
  base_question_count integer
)
returns table(body text, follow_up text)
language plpgsql stable security definer set search_path = public
as $$
declare approved_count integer; selected_slot integer;
begin
  if question_mode not in ('fun', 'reflective') or base_question_count < 1 then
    return;
  end if;

  select count(*) into approved_count
  from question_submissions
  where mode = question_mode and status = 'approved';

  if approved_count = 0 then return; end if;
  selected_slot := mod(target_date - date '1970-01-01', base_question_count + approved_count);
  if selected_slot < base_question_count then return; end if;

  return query
  select qs.body, coalesce(qs.follow_up, '')
  from question_submissions qs
  where qs.mode = question_mode and qs.status = 'approved'
  order by coalesce(qs.reviewed_at, qs.created_at), qs.id
  offset selected_slot - base_question_count
  limit 1;
end;
$$;

grant execute on function public.get_community_question(date, text, integer) to authenticated;
