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

export async function getPostsPage(offset, limit, signal) {
  const url = new URL("/rest/v1/posts", SUPABASE_URL);
  url.searchParams.set("select", "*");
  url.searchParams.set("order", "created_at.desc");
  url.searchParams.set("offset", offset);
  url.searchParams.set("limit", limit);

  const response = await fetch(url, { headers: headers(), signal });
  return handle(response);
}

export async function getPostById(id, signal) {
  const url = new URL("/rest/v1/posts", SUPABASE_URL);
  url.searchParams.set("id", `eq.${id}`);
  url.searchParams.set("select", "*");

  const response = await fetch(url, { headers: headers(), signal });
  const data = await handle(response);
  return data?.[0] ?? null;
}

export async function getPostsByOwner(ownerId, signal) {
  const url = new URL("/rest/v1/posts", SUPABASE_URL);
  url.searchParams.set("owner_id", `eq.${ownerId}`);
  url.searchParams.set("order", "created_at.desc");
  url.searchParams.set("select", "*");

  const response = await fetch(url, { headers: headers(), signal });
  return handle(response);
}

export async function createPost(post, token) {
  const url = new URL("/rest/v1/posts", SUPABASE_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify(post),
  });
  const data = await handle(response);
  return data?.[0] ?? null;
}

export async function updatePost(id, post, token) {
  const url = new URL("/rest/v1/posts", SUPABASE_URL);
  url.searchParams.set("id", `eq.${id}`);

  const response = await fetch(url, {
    method: "PATCH",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify(post),
  });
  const data = await handle(response);
  return data?.[0] ?? null;
}

export async function deletePost(id, token) {
  const url = new URL("/rest/v1/posts", SUPABASE_URL);
  url.searchParams.set("id", `eq.${id}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: { ...headers(token), Prefer: "return=representation" },
  });
  const data = await handle(response);
  return data?.[0] ?? null;
}