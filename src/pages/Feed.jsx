import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import PostCard from "../components/PostCard";
import { POST_TYPES } from "../lib/postForm";

const FILTERS = [{ value: "", label: "All" }, ...POST_TYPES];

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get("type") ?? "";

  const { posts, loading, error, loadMore } = useInfinitePosts(typeFilter || null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  function setFilter(value) {
    if (value) setSearchParams({ type: value });
    else setSearchParams({});
  }

  return (
    <>
      <header className="feed-header">
        <h1>The Feed</h1>
        <p className="feed-sub">Volume 01 · A community of plant keepers</p>
      </header>

      <nav className="feed-filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`feed-filter ${typeFilter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </nav>

      {error && <p className="form-error" style={{ marginTop: 16 }}>{error}</p>}

      {!loading && posts.length === 0 && !error && (
        <p className="empty">
          Nothing here yet. {typeFilter ? "Try a different filter." : "Be the first to share."}
        </p>
      )}

      <div className="feed-list">
        {posts.map((post) => (
          <PostCard key={post._key} post={post} />
        ))}
      </div>

      <div ref={sentinelRef} className="sentinel" />
      {loading && <p className="page-loading">Loading more…</p>}
    </>
  );
}