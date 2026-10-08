import { authHeaders, handleResponse, tableUrl } from "./client";

export async function getPostsPage(offset, limit, postType, signal) {
  const params = {
    select: "*",
    order: "created_at.desc",
    offset,
    limit,
  };
  if (postType) params.post_type = `eq.${postType}`;

  const url = tableUrl("posts", params);
  const response = await fetch(url, { headers: authHeaders(), signal });
  return handleResponse(response);
}

export async function getPostById(id, signal) {
  const url = tableUrl("posts", { id: `eq.${id}`, select: "*" });
  const response = await fetch(url, { headers: authHeaders(), signal });
  const data = await handleResponse(response);
  return data?.[0] ?? null;
}

export async function getPostsByOwner(ownerId, signal) {
  const url = tableUrl("posts", {
    owner_id: `eq.${ownerId}`,
    order: "created_at.desc",
    select: "*",
  });
  const response = await fetch(url, { headers: authHeaders(), signal });
  return handleResponse(response);
}

export async function createPost(post, token) {
  const url = tableUrl("posts");
  const response = await fetch(url, {
    method: "POST",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify(post),
  });
  const data = await handleResponse(response);
  return data?.[0] ?? null;
}

export async function updatePost(id, post, token) {
  const url = tableUrl("posts", { id: `eq.${id}` });
  const response = await fetch(url, {
    method: "PATCH",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify(post),
  });
  const data = await handleResponse(response);
  return data?.[0] ?? null;
}

export async function deletePost(id, token) {
  const url = tableUrl("posts", { id: `eq.${id}` });
  const response = await fetch(url, {
    method: "DELETE",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
  });
  const data = await handleResponse(response);
  return data?.[0] ?? null;
}