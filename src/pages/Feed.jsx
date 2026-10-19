import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import PostCard from "../components/PostCard";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import { PostCardSkeleton } from "../components/Skeleton";
import { POST_TYPES } from "../lib/postForm";

const FILTERS = [{ value: "", label: "All" }, ...POST_TYPES];

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get("type") ?? "";
  const urlQuery = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  useEffect(() => {
    if (debouncedSearch === urlQuery) return;
    const next = {};
    if (typeFilter) next.type = typeFilter;
    if (debouncedSearch.trim()) next.q = debouncedSearch.trim();
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, typeFilter, urlQuery, setSearchParams]);

  function setFilter(value) {
    const next = {};
    if (value) next.type = value;
    if (urlQuery) next.q = urlQuery;
    setSearchParams(next);
  }

  return (
    <>
      <header className="feed-header">
        <h1>The Feed</h1>
        <p className="feed-sub">Volume 01 · A community of plant keepers</p>
      </header>

      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        label="Find in the feed"
        placeholder="Search by title or description…"
      />

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

      <FeedResults
        key={`${typeFilter}|${urlQuery}`}
        postType={typeFilter || null}
        search={urlQuery || null}
        urlQuery={urlQuery}
        typeFilter={typeFilter}
      />
    </>
  );
}

function FeedResults({ postType, search, urlQuery, typeFilter }) {
  const { posts, loading, error, loadMore, hasLoadedOnce } = useInfinitePosts(
    postType,
    search
  );

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

  const isInitialLoad = loading && !hasLoadedOnce;
  const isEmpty = !loading && posts.length === 0 && !error;

  return (
    <>
      {error && (
        <p className="form-error" role="alert" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}

      {isInitialLoad && (
        <div className="feed-list" aria-busy="true">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )}

      {isEmpty && (
        <EmptyState
          kicker={urlQuery ? "No matches" : typeFilter ? "No matches" : "Blank page"}
          title={
            urlQuery
              ? `Nothing matches “${urlQuery}”.`
              : typeFilter
              ? "Nothing under this filter yet."
              : "The feed is empty."
          }
          message={
            urlQuery
              ? "Try a different word, or clear the search."
              : "Be the first to share a plant guide with the community."
          }
          ctaTo={urlQuery ? undefined : "/create"}
          ctaLabel={urlQuery ? undefined : "Write the first entry"}
        />
      )}

      {!isInitialLoad && posts.length > 0 && (
        <div className="feed-list">
          {posts.map((post) => (
            <PostCard key={post._key} post={post} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="sentinel" />
      {loading && posts.length > 0 && (
        <p className="page-loading">Loading more…</p>
      )}
    </>
  );
}
