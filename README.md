# Leafy

A houseplant community site. People write care guides, ask questions, show
off plants, or post quick tips. It's styled like a field journal.

Live: WIP

Repo: https://github.com/NotViksa/Leafy

## Running it

```bash
npm install
cp .env.example .env.local   # fill in the two values
npm run dev
```

You need a Supabase project. In `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Both are in Supabase under Settings → API Keys.

For the database: create two tables (`posts`, `comments`), enable RLS, add
the policies, and turn on the Email provider with "Confirm email" off. The
schema and policies are in the Functional Guide below. Set the Site URL to
`http://localhost:5173` in Supabase Auth settings.

## Stack

React 18 + Vite + React Router. Backend is Supabase (Postgres + Auth +
REST). Plain CSS in four files. No frameworks on top of that.

## Structure

```
src/
├── api/         Supabase REST calls
├── components/  layout, navbar, cards, forms, guards, states
├── context/     AuthContext
├── hooks/       useInfinitePosts
├── lib/         postForm (validation + payload helpers)
├── pages/       Home, Feed, Details, Create, Edit, MyPosts, Login,
│                Register, About, NotFound
├── styles/      tokens, base, components, pages
├── App.jsx
└── main.jsx
```

---

# Functional Guide

## 1. Overview

**Name:** Leafy

**Category:** Community blog / journal for indoor plant care

**Purpose:** A place to write down what you've learned about keeping
specific houseplants alive, and to read what others have figured out.

## 2. Access

**Guests** see Home, Feed, Details, About, Login, Register. They can read
posts and comments but can't write anything.

**Logged-in users** get everything above plus Create, My Posts, and Edit
on their own entries.

## 3. Auth

Register and Login both hit Supabase Auth endpoints. On success the session
(access token, refresh token, user) goes into `AuthContext` and
`localStorage` under `leafy_session`.

On page load `AuthContext` reads that key. If the access token is still
valid it's reused. If it's expired or about to expire, the refresh token is
exchanged for a new session. If that fails, the session is cleared and the
user is treated as a guest.

Logout posts to Supabase's logout endpoint and clears both Context and
localStorage. Passwords are never stored.

## 4. Routing

Routes:

- `/` - Home
- `/feed` - feed with filter tabs
- `/feed/:postId` - details
- `/feed/:postId/edit` - edit (author only)
- `/create` - new entry (logged in)
- `/my-posts` - own entries (logged in)
- `/login`, `/register` - guests only
- `/about`
- `*` - 404

`ProtectedRoute` redirects guests to `/login`. `GuestRoute` redirects
logged-in users to `/`. Both wait for the auth session to finish loading
before deciding, so a refresh doesn't bounce you to login.

`Layout` wraps the main pages with Navbar, Sidebar, and Footer. `AuthLayout`
wraps only Login and Register.

## 5. Feed and details

The feed fetches 6 posts at a time, newest first. An `IntersectionObserver`
on a sentinel at the bottom triggers the next page. When a fetch returns
fewer than 6 rows, the feed restarts from offset 0 with an incremented loop
counter so it scrolls forever. A `Set` of keys prevents duplicate appends
if two fetches race.

Filter tabs write to the URL (`?type=guide`), so a filtered feed is
shareable and survives refresh.

Details loads the post and its comments in parallel, aborts on cleanup.

## 6. Backend

Supabase, used as a backend-as-a-service. No custom server.

**`posts`** columns: `id`, `post_type` (guide/question/showcase/tip),
`author_name`, `title`, `description`, `image_url`, `plant_name`,
`care_level`, `light_need`, `water_frequency`, `content`, `owner_id`,
`created_at`.

**`comments`** columns: `id`, `post_id`, `comment`, `owner_id`,
`created_at`.

Both have RLS enabled. Policies:

- `posts`: public read; insert/update/delete allowed only when
  `owner_id = auth.uid()`
- `comments`: public read; insert allowed when `owner_id = auth.uid()`

The frontend talks to these tables via `/rest/v1/posts` and
`/rest/v1/comments` using the publishable key plus the user's access token.

## 7. CRUD

All four operations work on `posts`.

**Create** - `/create` validates locally, then `POST /rest/v1/posts`.
`owner_id` and `created_at` are filled by the database. Redirects to the
new entry.

**Read** - feed uses paginated GET, details uses `?id=eq.{id}`, my-posts
uses `?owner_id=eq.{userId}`.

**Update** - `/feed/:postId/edit` loads the post, checks ownership, then
`PATCH /rest/v1/posts?id=eq.{id}`. RLS rejects it server-side if the caller
isn't the owner.

**Delete** - confirm dialog, then `DELETE /rest/v1/posts?id=eq.{id}`.
Comments cascade. Redirects to `/feed`.

## 8. Forms

Register, Login, Create, Edit, and Comment. All controlled inputs with
`useState`, all use `noValidate` and show per-field errors plus an API error
block.

Validation:

- Email - required, must match a basic email pattern
- Password - required, 6+ characters on Register, confirm must match
- Title - 3–120 characters
- Image URL - optional except for showcase; must start with `http://` or
  `https://` if present
- Description - 10–500 characters
- Care fields (guide only) - care level and light required, watering
  required, content 30+ characters

## 9. React bits

Hooks used: `useState`, `useEffect`, `useRef`, `useContext`, `useCallback`,
`useMemo`, plus the router hooks (`useParams`, `useNavigate`, `useLocation`,
`useSearchParams`).

Mount / update / unmount example - `useInfinitePosts`. On mount it resets
refs and fetches page 1. When the filter changes it clears posts and
refetches. On unmount, an `AbortController` cancels the in-flight request
and the observer in `Feed` disconnects.

Context - `AuthContext` exposes `user`, `accessToken`, `loading`, `signIn`,
`signUp`, `signOut`. Used by Navbar, Sidebar, both guards, PostForm,
CommentForm, Details, and MyPosts.

Styling - plain CSS, four files: `tokens.css`, `base.css`,
`components.css`, `pages.css`.

## 10. Normal flow

Land on Home. Click into the Feed. Filter by type. Open a post. Log in.
Write an entry with the live preview form. Submit and land on the new
entry. Comment on it. Check My Entries. Log out.

## 11. Edge cases

- Login/register errors come straight from Supabase and show above the
  form fields
- Every fetch is wrapped in try/catch; errors show inline
- Missing post ID shows a styled 404 block with a link back to the feed
- Empty feed, empty filter, and empty My Entries all show an `EmptyState`
- Feed skeletons while loading, details skeleton while loading
- Duplicate keys guarded with a Set in the infinite scroll hook
- A 401 mid-session clears the stored session on next refresh
