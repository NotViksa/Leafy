import { useCallback, useEffect, useRef, useState } from "react";
import { getPostsPage } from "../api/posts";

const PAGE_SIZE = 6;

export function useInfinitePosts(postType) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const offsetRef = useRef(0);
  const loopRef = useRef(0);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      let page = await getPostsPage(offsetRef.current, PAGE_SIZE, postType);

      if (page.length === 0) {
        offsetRef.current = 0;
        loopRef.current += 1;
        page = await getPostsPage(0, PAGE_SIZE, postType);
      }

      if (page.length === 0) return;

      const loop = loopRef.current;
      const tagged = page.map((p) => ({ ...p, _key: `${p.id}-${loop}` }));
      setPosts((prev) => [...prev, ...tagged]);

      if (page.length < PAGE_SIZE) {
        offsetRef.current = 0;
        loopRef.current = loop + 1;
      } else {
        offsetRef.current += PAGE_SIZE;
      }
    } catch (err) {
      setError(err.message || "Could not load posts");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [postType]);

  useEffect(() => {
    offsetRef.current = 0;
    loopRef.current = 0;
    loadingRef.current = false;
    setPosts([]);
    setLoading(true);
    loadMore();
  }, [postType, loadMore]);

  return { posts, loading, error, loadMore };
}