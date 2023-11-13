create table "public"."users" (
    "id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "email" character varying not null,
    "name" character varying
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

create policy "Enable insert for authenticated users only"
on "public"."users"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users based on email"
on "public"."users"
as permissive
for update
to public
using (((auth.jwt() ->> 'email'::text) = (email)::text))
with check (((auth.jwt() ->> 'email'::text) = (email)::text));



