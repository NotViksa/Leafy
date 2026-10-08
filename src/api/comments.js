import { authHeaders, handleResponse, tableUrl } from "./client";

export async function getCommentsForPost(postId, signal) {
  const url = tableUrl("comments", {
    post_id: `eq.${postId}`,
    order: "created_at.asc",
    select: "*",
  });
  const response = await fetch(url, { headers: authHeaders(), signal });
  return handleResponse(response);
}

export async function createComment({ post_id, comment }, token) {
  const url = tableUrl("comments");
  const response = await fetch(url, {
    method: "POST",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify({ post_id, comment }),
  });
  const data = await handleResponse(response);
  return data?.[0] ?? null;
}