import { authHeaders, handleResponse, tableUrl } from "./client";

export async function getCommentsForPost(postId, signal) {
  const url = tableUrl("comments", {
    post_id: `eq.${postId}`,
    order: "created_at.asc,id.asc",
    select: "*",
  });
  const response = await fetch(url, { headers: authHeaders(), signal });
  return handleResponse(response);
}

export async function createComment(
  { post_id, comment, author_name, author_avatar },
  token
) {
  const url = tableUrl("comments");
  const response = await fetch(url, {
    method: "POST",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify({ post_id, comment, author_name, author_avatar }),
  });
  const data = await handleResponse(response);
  return data?.[0] ?? null;
}

export async function updateComment(id, comment, token) {
  const url = tableUrl("comments", { id: `eq.${id}` });
  const response = await fetch(url, {
    method: "PATCH",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify({ comment }),
  });
  const data = await handleResponse(response);
  return data?.[0] ?? null;
}

export async function deleteComment(id, token) {
  const url = tableUrl("comments", { id: `eq.${id}` });
  const response = await fetch(url, {
    method: "DELETE",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
  });
  const data = await handleResponse(response);
  return data?.[0] ?? null;
}