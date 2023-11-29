create table "public"."posts" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "body" text not null,
    "user_id" uuid not null,
    "image" uuid,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now()
);


alter table "public"."posts" enable row level security;

alter table "public"."users" alter column "updated_at" set data type timestamp with time zone using "updated_at"::timestamp with time zone;

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."posts" add constraint "posts_image_fkey" FOREIGN KEY (image) REFERENCES storage.objects(id) not valid;

alter table "public"."posts" validate constraint "posts_image_fkey";

alter table "public"."posts" add constraint "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."posts" validate constraint "posts_user_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."posts"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."posts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."posts"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."posts"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



