import { SUPABASE_URL, SUPABASE_KEY } from "./config";

export function authHeaders(token) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token || SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

export function tableUrl(table, params = {}) {
  const url = new URL(`/rest/v1/${table}`, SUPABASE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

function readError(data) {
  if (!data) return "Request failed";
  return (
    data.msg ||
    data.message ||
    data.error_description ||
    data.error ||
    "Request failed"
  );
}

export async function handleResponse(response) {
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(readError(data));
  return data;
}