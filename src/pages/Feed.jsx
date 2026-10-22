import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
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
  const searchTimerRef = useRef(null);
  const lastUrlQueryRef = useRef(urlQuery);

  useEffect(() => {
    if (urlQuery === lastUrlQueryRef.current) return;
    lastUrlQueryRef.current = urlQuery;
    clearTimeout(searchTimerRef.current);
    setSearchInput(urlQuery);
  }, [urlQuery]);

  useEffect(() => () => clearTimeout(searchTimerRef.current), []);

  function pushSearch(value) {
    clearTimeout(searchTimerRef.current);
    const query = value.trim();
    lastUrlQueryRef.current = query;
    if (query === urlQuery) return;

    const next = {};
    if (typeFilter) next.type = typeFilter;
    if (query) next.q = query;
    setSearchParams(next, { replace: true });
  }

  function handleSearchChange(value) {
    setSearchInput(value);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => pushSearch(value), 350);
  }

  function setFilter(value) {
    clearTimeout(searchTimerRef.current);
    const query = searchInput.trim();
    const next = {};
    if (value) next.type = value;
    if (query) next.q = query;
    lastUrlQueryRef.current = query;
    setSearchParams(next);
  }

  return (
    <>
      <header className="feed-header">
        <h1>The Feed</h1>
      </header>

      <SearchBar
        value={searchInput}
        onChange={handleSearchChange}
        placeholder="Search by title or description"
      />

      <nav className="feed-filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`feed-filter ${typeFilter === f.value ? "active" : ""}`}
            aria-pressed={typeFilter === f.value}
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
        <p className="form-error feed-error" role="alert">
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
          title={
            urlQuery
              ? `Nothing matches “${urlQuery}”.`
              : typeFilter
              ? "No entries of this type."
              : "The feed is empty."
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
