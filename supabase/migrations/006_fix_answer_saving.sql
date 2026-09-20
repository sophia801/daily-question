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
declare v_question_id uuid; v_answer_id uuid;
begin
  if answer_mode not in ('fun', 'reflective') then raise exception 'Invalid mode'; end if;
  if answer_visibility not in ('friends', 'private') then raise exception 'Invalid visibility'; end if;
  if answer_visibility = 'friends' and (target_circle is null or not is_circle_member(target_circle)) then
    raise exception 'Circle membership required';
  end if;

  insert into questions(question_date, mode, body, follow_up)
  values (answer_date, answer_mode, question_body, question_follow_up)
  on conflict (question_date, mode) do update set body = excluded.body, follow_up = excluded.follow_up
  returning questions.id into v_question_id;

  insert into answers(question_id, user_id, circle_id, body, visibility)
  values (v_question_id, auth.uid(), case when answer_visibility = 'friends' then target_circle else null end, answer_body, answer_visibility)
  on conflict (question_id, user_id) do update
    set circle_id = excluded.circle_id, body = excluded.body, visibility = excluded.visibility
  returning answers.id into v_answer_id;
  return v_answer_id;
end;
$$;

grant execute on function public.save_daily_answer(date, text, text, text, text, text, uuid) to authenticated;
