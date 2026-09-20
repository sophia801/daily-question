create table if not exists public.answer_circle_shares (
  answer_id uuid not null references public.answers(id) on delete cascade,
  circle_id uuid not null references public.circles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (answer_id, circle_id)
);

insert into public.answer_circle_shares(answer_id, circle_id)
select id, circle_id from public.answers
where visibility = 'friends' and circle_id is not null
on conflict do nothing;

alter table public.answer_circle_shares enable row level security;

create policy "members read answer shares" on public.answer_circle_shares for select to authenticated using (
  public.is_circle_member(circle_id)
);
create policy "authors create answer shares" on public.answer_circle_shares for insert to authenticated with check (
  public.is_circle_member(circle_id)
  and exists(select 1 from public.answers a where a.id = answer_id and a.user_id = auth.uid())
);
create policy "authors delete answer shares" on public.answer_circle_shares for delete to authenticated using (
  exists(select 1 from public.answers a where a.id = answer_id and a.user_id = auth.uid())
);

create or replace function public.save_daily_answer_to_circles(
  answer_date date,
  answer_mode text,
  question_body text,
  question_follow_up text,
  answer_body text,
  answer_visibility text,
  target_circles uuid[]
)
returns uuid language plpgsql security definer set search_path = public
as $$
declare v_question_id uuid; v_answer_id uuid; v_circle uuid;
begin
  if answer_mode not in ('fun', 'reflective') then raise exception 'Invalid mode'; end if;
  if answer_visibility not in ('friends', 'private') then raise exception 'Invalid visibility'; end if;
  if answer_visibility = 'friends' and coalesce(array_length(target_circles, 1), 0) = 0 then
    raise exception 'At least one circle is required';
  end if;
  foreach v_circle in array coalesce(target_circles, array[]::uuid[]) loop
    if not is_circle_member(v_circle) then raise exception 'Circle membership required'; end if;
  end loop;

  insert into questions(question_date, mode, body, follow_up)
  values (answer_date, answer_mode, question_body, question_follow_up)
  on conflict (question_date, mode) do update set body = excluded.body, follow_up = excluded.follow_up
  returning questions.id into v_question_id;

  insert into answers(question_id, user_id, circle_id, body, visibility)
  values (
    v_question_id,
    auth.uid(),
    case when answer_visibility = 'friends' then target_circles[1] else null end,
    answer_body,
    answer_visibility
  )
  on conflict (question_id, user_id) do update
    set circle_id = excluded.circle_id, body = excluded.body, visibility = excluded.visibility
  returning answers.id into v_answer_id;

  delete from answer_circle_shares where answer_id = v_answer_id;
  if answer_visibility = 'friends' then
    insert into answer_circle_shares(answer_id, circle_id)
    select v_answer_id, circle from unnest(target_circles) as circle
    on conflict do nothing;
  end if;
  return v_answer_id;
end;
$$;

grant execute on function public.save_daily_answer_to_circles(date, text, text, text, text, text, uuid[]) to authenticated;

create or replace function public.load_circle_answers(target_circle uuid, answer_mode text, answer_date date)
returns table(id uuid, user_id uuid, body text, display_name text, username text, mine boolean)
language plpgsql security definer set search_path = public
as $$
begin
  if not is_circle_member(target_circle) then raise exception 'Circle membership required'; end if;
  if not exists (
    select 1 from answers own_answer
    join questions own_question on own_question.id = own_answer.question_id
    join answer_circle_shares own_share on own_share.answer_id = own_answer.id
    where own_answer.user_id = auth.uid()
      and own_share.circle_id = target_circle
      and own_question.question_date = $3
      and own_question.mode = $2
  ) then raise exception 'Submit your own answer first'; end if;

  return query
  select a.id, a.user_id, a.body, p.display_name, p.username, a.user_id = auth.uid()
  from answer_circle_shares acs
  join answers a on a.id = acs.answer_id
  join questions q on q.id = a.question_id
  left join profiles p on p.id = a.user_id
  where acs.circle_id = target_circle
    and a.visibility = 'friends'
    and q.question_date = $3
    and q.mode = $2
  order by a.created_at;
end;
$$;

grant execute on function public.load_circle_answers(uuid, text, date) to authenticated;

create or replace function public.get_circle_daily_stats(target_circle uuid, target_date date)
returns table(member_count bigint, answered_count bigint)
language plpgsql security definer set search_path = public
as $$
begin
  if not is_circle_member(target_circle) then raise exception 'Circle membership required'; end if;
  return query
  select
    (select count(*) from circle_members cm where cm.circle_id = target_circle),
    (
      select count(distinct a.user_id)
      from answer_circle_shares acs
      join answers a on a.id = acs.answer_id
      join questions q on q.id = a.question_id
      where acs.circle_id = target_circle
        and a.visibility = 'friends'
        and q.question_date = target_date
    );
end;
$$;
