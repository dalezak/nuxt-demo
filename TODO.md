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
