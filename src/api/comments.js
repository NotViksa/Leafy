import { SUPABASE_URL, SUPABASE_KEY } from "./config";

const headers = (token) => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${token || SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

async function handle(response) {
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
}

export async function getCommentsForPost(postId, signal) {
  const url = new URL("/rest/v1/comments", SUPABASE_URL);
  url.searchParams.set("post_id", `eq.${postId}`);
  url.searchParams.set("order", "created_at.asc");
  url.searchParams.set("select", "*");

  const response = await fetch(url, { headers: headers(), signal });
  return handle(response);
}

export async function createComment({ post_id, comment }, token) {
  const url = new URL("/rest/v1/comments", SUPABASE_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify({ post_id, comment }),
  });
  const data = await handle(response);
  return data?.[0] ?? null;
}