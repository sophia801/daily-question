create or replace function public.create_circle_with_members(circle_name text, member_usernames text[])
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

  insert into circle_members(circle_id, user_id)
  select new_id, p.id
  from profiles p
  where lower(p.username) = any(member_usernames)
    and exists (
      select 1 from friend_requests f
      where f.status = 'accepted'
        and ((f.sender_id = auth.uid() and f.recipient_id = p.id)
          or (f.recipient_id = auth.uid() and f.sender_id = p.id))
    )
  on conflict do nothing;

  return query select new_id, new_code;
end;
$$;

create or replace function public.save_daily_answer(
  answer_date date,
  answer_mode text,
  question_body text,
  question_follow_up text,
  answer_body text,
  answer_visibility text,
  target_circle uuid
)
returns uuid language plpgsql security definer set search_path = public
as $$
declare question_id uuid; answer_id uuid;
begin
  if answer_mode not in ('fun', 'reflective') then raise exception 'Invalid mode'; end if;
  if answer_visibility not in ('friends', 'private') then raise exception 'Invalid visibility'; end if;
  if answer_visibility = 'friends' and (target_circle is null or not is_circle_member(target_circle)) then
    raise exception 'Circle membership required';
  end if;

  insert into questions(question_date, mode, body, follow_up)
  values (answer_date, answer_mode, question_body, question_follow_up)
  on conflict (question_date, mode) do update set body = excluded.body, follow_up = excluded.follow_up
  returning id into question_id;

  insert into answers(question_id, user_id, circle_id, body, visibility)
  values (question_id, auth.uid(), case when answer_visibility = 'friends' then target_circle else null end, answer_body, answer_visibility)
  on conflict (question_id, user_id) do update
    set circle_id = excluded.circle_id, body = excluded.body, visibility = excluded.visibility
  returning id into answer_id;
  return answer_id;
end;
$$;

grant execute on function public.create_circle_with_members(text, text[]) to authenticated;
grant execute on function public.save_daily_answer(date, text, text, text, text, text, uuid) to authenticated;
