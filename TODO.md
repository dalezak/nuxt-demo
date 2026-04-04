# TODO

## Bugs

- [x] Fix undefined `offset`/`limit` variables in `pages/tabs/posts/index.vue` — should be `state.offset + state.limit` (line 22)
- [x] Fix null reference risk on `profile.id` in `pages/tabs/posts/new.vue` — add null guard before accessing profile
- [x] Fix `useFetch` in `pages/tabs/home.vue` — destructure `error` and guard against null `items.value` before spread (lines 42-50)
- [x] Fix `consoleLog` → `consoleError` in `pages/tabs/products/index.vue` catch block (line 79)

## Improvements

- [x] Pass full product fields (category, price, image) when calling `saveProduct()` in `pages/tabs/products/new.vue`
- [x] Replace top-level `await loadData()` (SSR anti-pattern) with `onMounted` in `home.vue`, `profile.vue`, and `posts/index.vue`
- [x] Fix unnecessary nested spread `[...this.posts, ...[post]]` → `[...this.posts, post]` in `stores/posts.js` and `stores/products.js`
- [x] Add bounds checking for `limit` and `offset` query params in `server/api/items.get.js` to prevent abuse
- [x] Add explicit radix to `parseInt(value, 10)` calls in `server/api/items.get.js` (lines 5-6)
- [x] Replace loose equality `==` with strict `===` in `pages/tabs/home.vue` (line 52)
- [x] Remove or make configurable the hard-coded 800ms `setTimeout` delay in `server/api/items.get.js`
- [x] Add null-safe access for `product.description` and `product.rating.rate` in `pages/tabs/products/[id].vue`

## Code Quality

- [x] Add composables for shared search/pagination logic to reduce duplication across pages

## nuxt-supabase Improvements

- [x] Add `createSupaStore(name, ModelClass, CollectionClass)` factory to eliminate boilerplate store duplication across consumer apps
- [x] Declare `@pinia/nuxt` as a module in `nuxt-supabase/nuxt.config.ts` so consumers don't need to re-declare it
- [x] Configure `pinia.storesDirs` and `vite.resolve.dedupe` inside the layer so consumers don't need to copy this boilerplate

## nuxt-ionic Improvements

- [x] Declare `@pinia/nuxt` as a module dependency in `nuxt-ionic/nuxt.config.ts` since it owns pages that use stores
- [x] Move `profile.vue` into `nuxt-ionic` layer alongside `login.vue`, `logout.vue`, `reset.vue`

## nuxt-supabase Storage Improvements

- [x] Fix `search()` calling `sortByProperties()` without `this.` — sort silently fails
- [x] Remove unnecessary `import.meta.client` guards inside `sortByProperty` and `sortByProperties` — wrong return type (`[]` instead of a comparator function), and callers already guard
- [x] Extract shared item-matching logic from `count()` and `search()` into a private `_matches(item, search, haystack)` helper
- [x] Replace per-method `import.meta.client` checks with a single `this.unstorage` null check since `unstorage` is only initialized on the client
