-- Enable row level security on journal_entries
alter table journal_entries enable row level security;

-- Allow authenticated users to insert their own journal entries
create policy "Users can insert their own journal entries"
on journal_entries for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow authenticated users to delete their own journal entries
create policy "Users can delete their own journal entries"
on journal_entries for delete
  to authenticated
  using (auth.uid() = user_id);
