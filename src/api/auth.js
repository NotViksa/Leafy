import { SUPABASE_URL, SUPABASE_KEY } from "./config";

async function handle(response) {
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.msg || data.message || data.error_description || "Request failed"
    );
  }
  return data;
}

export async function signUp(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handle(response);
}

export async function signIn(email, password) {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );
  return handle(response);
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

export async function refreshSession(refreshToken) {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }
  );
  return handle(response);
}