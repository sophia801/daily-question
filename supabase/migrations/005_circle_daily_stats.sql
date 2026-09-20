create or replace function public.get_circle_daily_stats(target_circle uuid, target_date date)
returns table(member_count bigint, answered_count bigint)
language plpgsql security definer set search_path = public
as $$
begin
  if not is_circle_member(target_circle) then
    raise exception 'Circle membership required';
  end if;

  return query
  select
    (select count(*) from circle_members cm where cm.circle_id = target_circle),
    (
      select count(distinct a.user_id)
      from answers a
      join questions q on q.id = a.question_id
      where a.circle_id = target_circle
        and a.visibility = 'friends'
        and q.question_date = target_date
    );
end;
$$;

grant execute on function public.get_circle_daily_stats(uuid, date) to authenticated;
