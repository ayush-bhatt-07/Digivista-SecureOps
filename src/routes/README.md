# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | layout route (renders children via `<Outlet />`) |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.

## Project routes

| File | URL | Access |
| --- | --- | --- |
| `index.tsx` | `/` | Public marketing landing page |
| `auth.tsx` | `/auth` | Public sign-in / sign-up |
| `_authenticated/dashboard.tsx` | `/dashboard` | Signed-in app home |
| `_authenticated/tickets.tsx` | `/tickets` | Signed-in |
| `_authenticated/endpoints.tsx` | `/endpoints` | Signed-in |
| `_authenticated/assets.tsx` | `/assets` | Signed-in |
| `_authenticated/companies.tsx` | `/companies` | Signed-in (tenant scoped) |
| `_authenticated/engineers.tsx` | `/engineers` | Signed-in |
| `_authenticated/amc.tsx` | `/amc` | Signed-in |
| `_authenticated/audit.tsx` | `/audit` | Signed-in |
| `_authenticated/users.tsx` | `/users` | Signed-in (admin) |

`/` is intentionally public. Anything that used to link to `/` as the app home
must point at `/dashboard`, and `ROUTE_ACCESS` in `src/lib/rbac.ts` is keyed by
those same paths.
