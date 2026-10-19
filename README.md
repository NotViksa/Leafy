# Leafy

A houseplant community journal. Members write care guides, questions, showcases,
and tips; the UI is styled like a botanist's field notebook.

Live: https://leafy-viksa1.vercel.app · Repo: https://github.com/NotViksa/Leafy

Demo admin: `admin@leafy.app` / `leafyadmin123` - log in with it to try the
moderation role (can delete any entry or comment; editing stays author-only).

## Run locally

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

`.env.local` (values are in Supabase under Settings → API Keys):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Create the `posts` and `comments` tables, enable RLS, add the policies from
section 6, and turn "Confirm email" off. Scripts: `npm run build`, `npm run lint`, `npm run preview`.

**Stack:** React 19, Vite, React Router 7, Supabase (Postgres + Auth + REST),
plain CSS in four files. **Source:** `src/api`, `components`, `context`, `hooks`, `lib`, `pages`, `styles`; routes in `App.jsx`.

# Functional Guide

## 1. Project overview

**Name:** Leafy · **Category:** Community blog / journal for houseplant care

**Purpose:** Record what works when keeping plants alive and read what other
growers have learned. Entries are typed as guides, questions, showcases, or tips.

## 2. User access & permissions

- **Guest:** Home (`/`), Feed (`/feed`), Details (`/feed/:postId`), About, Login,
  Register - read-only. Published entries and comments are fetched from
  Supabase; every write action requires an account.
- **Authenticated:** adds Create (`/create`), My entries (`/my-posts`), Profile
  (`/profile`), and Edit (`/feed/:postId/edit`, author only); can post comments
  and edit/delete their own comments.
- **Admin:** `app_metadata.role = "admin"`. Can delete any entry or comment;
  editing stays author-only. Destructive actions use an in-app confirm dialog;
  successful actions show a toast.

## 3. Authentication & session handling

Register/Login call Supabase Auth. On success the session (tokens + user) lives
in `AuthContext` and `localStorage` (`leafy_session`). On load, an expired access
token is refreshed with the refresh token; if that fails the session is cleared.
Logout calls Supabase (`scope=local`) and clears both stores. Guards wait for
the auth loading state. Display name/avatar are optional at registration,
editable on `/profile` via `PUT /auth/v1/user`, and snapshotted onto entries and
comments when written.

## 4. Routing structure

Eleven routes: `/`, `/feed`, `/feed/:postId`, `/about`, `/login`, `/register`,
`/create`_, `/my-posts`_, `/profile`_, `/feed/:postId/edit`_, `*` (404).
`*` = authenticated.

- `ProtectedRoute` sends guests to `/login` and returns them afterwards;
  `GuestRoute` keeps logged-in users out of Login/Register.
- `Layout` (navbar, sidebar, footer) wraps pages; `AuthLayout` wraps only
  Login/Register.
- `/feed/:postId` and `/feed/:postId/edit` are parameterized; Details, Edit, and
  My entries are the dynamic pages.

## 5. List → details flow

- **Feed (catalog):** six posts per page, newest first, via `GET /posts`.
  Infinite scroll uses an `IntersectionObserver` and loops when the database
  runs out. Tabs write `?type=`; debounced search writes `?q=` and matches
  title/description with `ilike`.
- **Details:** opened via `Link`; reads `postId` with `useParams`, fetches the
  post and comments in parallel, aborts on unmount.
- **My entries:** the author's posts in a tile grid with client-side filter and
  search.

## 6. Data source & backend

Supabase BaaS; no custom server. `fetch` sends the publishable key plus the
user's token.

`posts`: `id`, `post_type`, `author_name`, `author_avatar`, `title`, `description`, `image_url`, `plant_name`, `care_level`, `light_need`, `water_frequency`, `content`, `owner_id`, `created_at`.

`comments`: `id`, `post_id`, `comment`, `author_name`, `author_avatar`, `owner_id`, `created_at`.

RLS: public read on both; posts insert/update/delete only when
`owner_id = auth.uid()`; comments insert/update by owner; comments delete by
owner or admin; admins may delete posts.

## 7. Data operations (CRUD)

- **Create:** `/create` validates, then `POST /posts` with the author snapshot;
  the database supplies `id`, `owner_id`, `created_at`. Redirects to the entry.
- **Read:** paginated feed GET, `?id=eq.` for Details, `?owner_id=eq.` for My entries.
- **Update/Delete:** Edit checks ownership and `PATCH`es the row; RLS also
  rejects non-owners. Delete asks for confirmation, then `DELETE`s; comments
  cascade. Details redirects to the feed, My entries removes the tile in place.
  Comments update/delete in place by their author (delete also by admins).

## 8. Forms & validation

Register, Login, Create, Edit, Comment, Profile - controlled inputs, synthetic
events, `noValidate`, per-field errors, API error blocks, loading labels.

- **Title:** required, 3–120 characters. **Description:** required, 10–500.
- **Comment:** required, max 500 characters (create and edit).
- **Image URL:** optional except showcases; must start with `http://` or
  `https://` if present. **Plant name:** required for guides/showcases, <80 chars.
- **Email/password:** email pattern, 6+ characters, confirmation must match;
  **profile:** display name 2–40 characters, avatar URL must be http(s).

## 9. React-specific techniques

- **Hooks:** `useState`, `useEffect`, `useRef`, `useContext`, `useCallback`,
  `useMemo`, plus `useParams`, `useNavigate`, `useLocation`, `useSearchParams`.
- **Lifecycle:** `useInfinitePosts` fetches page one on mount, resets on
  filter/search change, discards stale responses with a generation counter, and
  disconnects the observer on unmount; Details, Edit, My entries abort requests.
- **Context:** `AuthContext` (user, token, `isAdmin`, loading, auth actions) and
  `ToastContext` (notifier), consumed across guards, nav, forms, and pages.
- **Styling:** plain external CSS (`tokens`, `base`, `components`, `pages`);
  `ErrorBoundary` is the only class component and resets per route.

## 10. Typical user flow

1. Land on Home, open the Feed, filter or search.
2. Open an entry; log in if needed.
3. Publish a new entry via the live-preview form.
4. Comment, then edit or delete your comment later.
5. Update the profile, then log out.

## 11. Error & edge-case handling

- API/network errors show inline with `role="alert"`; successful mutations toast.
- Missing post IDs show a 404 state; empty feed/filter/search/My entries show
  `EmptyState`.
- Skeletons cover initial loading; buttons disable and relabel while submitting.
- Duplicate infinite-scroll keys are guarded with a `Set`; stale responses are
  ignored. Return-to-page after login; route-level `ErrorBoundary` keeps nav
  usable. RLS enforces ownership server-side even if the UI is bypassed.
