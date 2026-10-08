import { SUPABASE_URL, SUPABASE_KEY } from "./config";
import { handleResponse } from "./client";

const AUTH_HEADERS = {
  apikey: SUPABASE_KEY,
  "Content-Type": "application/json",
};

async function postAuth(path, body) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: "POST",
    headers: AUTH_HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(response);
}

export function signUp(email, password) {
  return postAuth("/auth/v1/signup", { email, password });
}

export function signIn(email, password) {
  return postAuth("/auth/v1/token?grant_type=password", { email, password });
}

export function refreshSession(refreshToken) {
  return postAuth("/auth/v1/token?grant_type=refresh_token", {
    refresh_token: refreshToken,
  });
}

export async function signOut(accessToken) {
  await fetch(`${SUPABASE_URL}/auth/v1/logout?scope=local`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}