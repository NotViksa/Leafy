import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { getPostsByOwner, deletePost } from "../api/posts";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { POST_TYPE_LABELS, POST_TYPES } from "../lib/postForm";
import SearchBar from "../components/SearchBar";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const FILTERS = [{ value: "", label: "All" }, ...POST_TYPES];

export default function MyPosts() {
  const { user } = useAuth();
  return <MyPostsView key={user?.id ?? "guest"} user={user} />;
}

function MyPostsView({ user }) {
  const { accessToken } = useAuth();
  const notify = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();

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

  function openDelete(id) {
    setDeleteError("");
    setPendingDelete(id);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      const deleted = await deletePost(pendingDelete, accessToken);
      if (!deleted) {
        setDeleteError("Could not delete entry");
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== pendingDelete));
      setPendingDelete(null);
      notify("Entry deleted.");
    } catch (err) {
      setDeleteError(err.message || "Could not delete entry");
    } finally {
      setDeleting(false);
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
      </header>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by title, description, or plant"
      />

      <nav className="feed-filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`feed-filter ${filter === f.value ? "active" : ""}`}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            disabled={counts[f.value] === 0 && f.value !== ""}
          >
            {f.label}
            {counts[f.value] > 0 && (
              <span className="feed-filter-count">{counts[f.value]}</span>
            )}
          </button>
        ))}

        <Link to="/create" className="btn btn-primary my-posts-new">New entry</Link>
      </nav>

      {error && <p className="form-error" role="alert">{error}</p>}

      {loading && <p className="page-loading">Loading your entries…</p>}

      {!loading && !error && posts.length === 0 && (
        <EmptyState
          title="You have not written an entry."
          ctaTo="/create"
          ctaLabel="Write your first entry"
        />
      )}

      {!loading && posts.length > 0 && filtered.length === 0 && (
        <EmptyState
          title={
            debouncedSearch.trim()
              ? `Nothing matches “${debouncedSearch.trim()}”.`
              : "No entries of this type."
          }
        />
      )}

      {!loading && filtered.length > 0 && (
        <div className="entry-grid">
          {filtered.map((post) => (
            <EntryTile key={post.id} post={post} onDelete={openDelete} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this entry?"
        message="This cannot be undone. Its comments will be removed too."
        error={deleteError}
        confirmLabel="Delete entry"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

function EntryTile({ post, onDelete }) {
  const type = post.post_type ?? "guide";

  return (
    <article className={`entry-tile entry-tile-${type}`}>
      <header className="entry-tile-head">
        <span className={`type type-${type}`}>{POST_TYPE_LABELS[type]}</span>
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
