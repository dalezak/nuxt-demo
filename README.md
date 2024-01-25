# Nuxt Hybrid App

## Packages

Install packages

```bash
npm install
```

Reinstall packages

```bash
npm run reinstall
```

Update packages
```bash
npm update
```

## Development

Local environment on `http://localhost:3000`

```bash
npm run local -- --open
```

Production environment

```bash
npm run prod -- --open
```

## Production

Production build

```bash
npm run build
```

## Clean

Clean cache

```bash
npm run clean
```

## Supabase

Container start on `http://localhost:54323`

```bash
supabase start
```

Container stop
```bash
supabase stop
```

Database migrate

```bash
supabase db diff --use-migra -f file_name
```

Database reset

```bash
supabase db reset
```

Database seed

```bash
npx snaplet generate --sql > supabase/seed.sql
```

Database push

```bash
supabase db push
```
