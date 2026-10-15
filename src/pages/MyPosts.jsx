import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPostsByOwner, deletePost } from "../api/posts";
import EmptyState from "../components/EmptyState";
import { POST_TYPES } from "../lib/postForm";
import SearchBar from "../components/SearchBar";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const TYPE_LABELS = {
  guide: "Guide",
  question: "Question",
  showcase: "Showcase",
  tip: "Tip",
};

const FILTERS = [{ value: "", label: "All" }, ...POST_TYPES];

export default function MyPosts() {
  const { user, accessToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();

    setLoading(true);
    setError("");

    getPostsByOwner(user.id, controller.signal)
      .then(setPosts)
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Could not load your entries");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [user]);

  async function handleDelete(id) {
    if (!confirm("Delete this entry? This cannot be undone.")) return;

    try {
      await deletePost(id, accessToken);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete entry");
    }
  }

  const filtered = useMemo(() => {
    let result = posts;
    if (filter) result = result.filter((p) => p.post_type === filter);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.plant_name ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, filter, debouncedSearch]);

  const counts = useMemo(() => {
    const map = { "": posts.length };
    for (const p of posts) {
      map[p.post_type] = (map[p.post_type] ?? 0) + 1;
    }
    return map;
  }, [posts]);

  return (
    <>
      <header className="feed-header">
        <h1>My entries</h1>
        <p className="feed-sub">
          {posts.length} {posts.length === 1 ? "entry" : "entries"} filed
        </p>
      </header>

      <div className="my-posts-bar">
        <SearchBar
          value={search}
          onChange={setSearch}
          label="Find in your entries"
          placeholder="Search by title, description, or plant…"
        />

        <div className="my-posts-bar">
          <nav className="feed-filters">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`feed-filter ${filter === f.value ? "active" : ""}`}
                onClick={() => setFilter(f.value)}
                disabled={counts[f.value] === 0 && f.value !== ""}
              >
                {f.label}
                {counts[f.value] > 0 && (
                  <span className="feed-filter-count">{counts[f.value]}</span>
                )}
              </button>
            ))}
          </nav>

          <Link to="/create" className="btn btn-primary">New entry</Link>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading && <p className="page-loading">Loading your entries…</p>}

      {!loading && !error && posts.length === 0 && (
        <EmptyState
          kicker="Nothing yet"
          title="You have not written an entry."
          message="Start with a care guide for a plant you know well, or ask the community a question."
          ctaTo="/create"
          ctaLabel="Write your first entry"
        />
      )}

      {!loading && posts.length > 0 && filtered.length === 0 && (
        <EmptyState
          kicker="No matches"
          title={
            debouncedSearch.trim()
              ? `Nothing matches “${debouncedSearch.trim()}”.`
              : "Nothing under this filter."
          }
          message={
            debouncedSearch.trim()
              ? "Try a different word, or clear the search."
              : "You have not written any entries of this type yet."
          }
        />
      )}

      {!loading && filtered.length > 0 && (
        <div className="entry-grid">
          {filtered.map((post) => (
            <EntryTile key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}

function EntryTile({ post, onDelete }) {
  const type = post.post_type ?? "guide";
  const num = String(post.id).padStart(3, "0");

  return (
    <article className={`entry-tile entry-tile-${type}`}>
      <span className="entry-tile-ghost" aria-hidden="true">{num}</span>

      <header className="entry-tile-head">
        <span className={`type type-${type}`}>{TYPE_LABELS[type]}</span>
      </header>

      <h3 className="entry-tile-title">
        <Link to={`/feed/${post.id}`}>{post.title}</Link>
      </h3>

      {post.plant_name && (
        <p className="entry-tile-plant">{post.plant_name}</p>
      )}

      <p className="entry-tile-desc">{post.description}</p>

      <footer className="entry-tile-actions">
        <Link to={`/feed/${post.id}/edit`} className="entry-tile-action">
          Edit
        </Link>
        <button
          onClick={() => onDelete(post.id)}
          className="entry-tile-action entry-tile-action-danger"
        >
          Delete
        </button>
      </footer>
    </article>
  );
}