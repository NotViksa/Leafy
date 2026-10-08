import { useEffect, useRef } from "react";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import PostCard from "../components/PostCard";

export default function Feed() {
  const { posts, loading, error, loadMore } = useInfinitePosts();
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

  return (
    <div className="page">
      <header className="page-header">
        <h1>Feed</h1>
        <p className="page-sub">Fresh plant care guides from the community</p>
      </header>

      {error && <p className="form-error">{error}</p>}

      {!loading && posts.length === 0 && !error && (
        <p className="empty">No posts yet. Be the first to share one.</p>
      )}

      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post._key} post={post} />
        ))}
      </div>

      <div ref={sentinelRef} className="sentinel" />

      {loading && <p className="page-loading">Loading more…</p>}
    </div>
  );
}