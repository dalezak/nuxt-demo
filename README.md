# Nuxt Hybrid App

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## NPM

Install packages

```bash
npm install
```

## Development

Local environment on `http://localhost:3000`

```bash
npm run dev -- -o
```

## Production

Production build

```bash
npm run build
```

## Clean

Clean cache

```bash
npx nuxi cleanup
```

## Supabase

Container start on `http://localhost:54323`

```bash
supabase start
```

Container stop
```bash
supaqbase stop
```

Database migrate

```bash
supabase db diff --use-migra -f my_table
```

Database reset

```bash
supabase db reset
```
