# CLAUDE.md

## Project Overview

Nuxt 4 hybrid app combining Ionic (mobile) and web interfaces, backed by Supabase and Pinia state management. Extends two private layer packages: `dalezak/nuxt-ionic` and `dalezak/nuxt-supabase`.

## Stack

- **Framework**: Nuxt 4 (SSR enabled)
- **UI**: Ionic components via `@nuxtjs/ionic`
- **Auth & Database**: Supabase via `@nuxtjs/supabase`
- **State**: Pinia via `@pinia/nuxt`
- **Styling**: SCSS

## Language

**Use JavaScript, not TypeScript.** All source files (pages, components, composables, stores, models, utils) are `.js` or `.vue` with `<script setup>` — do not convert them to TypeScript or add `.ts` extensions. Config files (`nuxt.config.ts`, `tsconfig.json`) may remain TypeScript as required by the framework.

## Project Structure

```text
app/                 # Nuxt 4 source directory (srcDir)
  app.vue            # Root app component
  pages/tabs/        # App pages (home, posts, products, profile)
  components/        # Shared Vue components (item-card, post-card, product-card)
  composables/       # Shared composable logic
  stores/            # Pinia stores (posts.js, products.js)
  models/            # Data model classes (Post, Posts, Product, Products)
  utils/             # Navigation and action helpers (show-*.js, share-*.js)
  middleware/        # Route middleware
  plugins/           # Nuxt plugins
server/api/          # Nitro API routes (stays at project root)
```

## Conventions

- Pages use `<script setup>` with `definePageMeta({ middleware: 'auth' })`
- Reactive state uses `reactive({})`, not individual `ref()` calls
- Store access via `useXxxStore()` + `storeToRefs()` for reactive getters
- Data loading goes in `onMounted` — avoid top-level `await` (SSR anti-pattern)
- Use `consoleLog` / `consoleError` helpers (not raw `console.log`)
- Use `showError` / `showToast` / `showAlert` / `showLoading` / `hideLoading` helpers
- Use `parseInt(value, 10)` — always include the radix

## Search & Pagination

Pages with search/pagination use the `useSearchPagination(loadFn, errorTitle)` composable from the `dalezak/nuxt-ionic` layer. It returns `{ state, searchChanged, run }` — add page-specific fields (e.g. `breadcrumbs`) to `state` after initialization.
