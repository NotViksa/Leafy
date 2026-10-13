import { useCallback, useEffect, useRef, useState } from "react";
import { getPostsPage } from "../api/posts";

const PAGE_SIZE = 6;

export function useInfinitePosts(postType, search) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const offsetRef = useRef(0);
  const loopRef = useRef(0);
  const loadingRef = useRef(false);
  const seenRef = useRef(new Set());
  const genRef = useRef(0);

  const loadMore = useCallback(
    async (mode = "append") => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError("");

      const myGen = genRef.current;

      try {
        let page = await getPostsPage(
          offsetRef.current,
          PAGE_SIZE,
          postType,
          search
        );

        if (myGen !== genRef.current) return;

        if (page.length === 0 && offsetRef.current > 0) {
          offsetRef.current = 0;
          loopRef.current += 1;
          page = await getPostsPage(0, PAGE_SIZE, postType, search);
          if (myGen !== genRef.current) return;
        }

        if (page.length === 0) {
          if (mode === "reset") setPosts([]);
          setHasLoadedOnce(true);
          return;
        }

        const loop = loopRef.current;
        const fresh = [];
        for (const p of page) {
          const key = `${p.id}-${loop}`;
          if (!seenRef.current.has(key)) {
            seenRef.current.add(key);
            fresh.push({ ...p, _key: key });
          }
        }

        if (mode === "reset") {
          setPosts(fresh);
        } else if (fresh.length > 0) {
          setPosts((prev) => [...prev, ...fresh]);
        }

        if (page.length < PAGE_SIZE) {
          offsetRef.current = 0;
          loopRef.current = loop + 1;
        } else {
          offsetRef.current += PAGE_SIZE;
        }

        setHasLoadedOnce(true);
      } catch (err) {
        if (myGen !== genRef.current) return;
        setError(err.message || "Could not load posts");
      } finally {
        if (myGen === genRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    [postType, search]
  );

  useEffect(() => {
    genRef.current += 1;
    offsetRef.current = 0;
    loopRef.current = 0;
    loadingRef.current = false;
    seenRef.current = new Set();
    loadMore("reset");
  }, [postType, search, loadMore]);

  return { posts, loading, error, loadMore, hasLoadedOnce };
}