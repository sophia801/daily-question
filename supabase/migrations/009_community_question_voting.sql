create table if not exists public.question_submission_votes (
  submission_id uuid not null references public.question_submissions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vote boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (submission_id, user_id)
);

alter table public.question_submission_votes enable row level security;

create or replace function public.list_question_candidates()
returns table(
  id uuid,
  mode text,
  body text,
  follow_up text,
  yes_votes bigint,
  no_votes bigint,
  my_vote boolean,
  mine boolean
)
language sql stable security definer set search_path = public
as $$
  select
    qs.id,
    qs.mode,
    qs.body,
    qs.follow_up,
    count(*) filter (where qsv.vote is true) as yes_votes,
    count(*) filter (where qsv.vote is false) as no_votes,
    bool_or(qsv.vote) filter (where qsv.user_id = auth.uid()) as my_vote,
    qs.user_id = auth.uid() as mine
  from question_submissions qs
  left join question_submission_votes qsv on qsv.submission_id = qs.id
  where qs.status = 'pending'
  group by qs.id
  order by qs.created_at desc
  limit 30;
$$;

create or replace function public.vote_on_question(candidate_id uuid, vote_yes boolean)
returns table(yes_votes bigint, no_votes bigint, status text)
language plpgsql security definer set search_path = public
as $$
declare owner_id uuid; current_status text; yes_count bigint; no_count bigint;
begin
  select user_id, question_submissions.status into owner_id, current_status
  from question_submissions where id = candidate_id;

  if owner_id is null then raise exception 'Question not found'; end if;
  if owner_id = auth.uid() then raise exception 'You cannot vote on your own question'; end if;
  if current_status <> 'pending' then raise exception 'Voting has closed'; end if;

  insert into question_submission_votes(submission_id, user_id, vote)
  values (candidate_id, auth.uid(), vote_yes)
  on conflict (submission_id, user_id) do update
    set vote = excluded.vote, updated_at = now();

  select
    count(*) filter (where vote is true),
    count(*) filter (where vote is false)
  into yes_count, no_count
  from question_submission_votes
  where submission_id = candidate_id;

  if yes_count >= 3 and yes_count > no_count then
    update question_submissions
    set status = 'approved', reviewed_at = now()
    where id = candidate_id;
    current_status := 'approved';
  elsif no_count >= 3 and no_count >= yes_count then
    update question_submissions
    set status = 'rejected', reviewed_at = now()
    where id = candidate_id;
    current_status := 'rejected';
  end if;

  return query select yes_count, no_count, current_status;
end;
$$;

grant execute on function public.list_question_candidates() to authenticated;
grant execute on function public.vote_on_question(uuid, boolean) to authenticated;
