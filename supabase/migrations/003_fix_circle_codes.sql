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

grant execute on function public.create_circle(text) to authenticated;
