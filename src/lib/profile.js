import { authorNameFromEmail } from "./postForm";

const AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><circle cx="32" cy="32" r="32"/></clipPath></defs><g clip-path="url(#a)"><circle cx="32" cy="32" r="32" fill="#c4c4c4"/><circle cx="32" cy="25" r="11.5" fill="#ffffff"/><path d="M32 41c-13.3 0-24 10.7-24 24v4h48v-4c0-13.3-10.7-24-24-24Z" fill="#ffffff"/></g></svg>`;

export const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(AVATAR_SVG)}`;

export function profileName(user) {
  const name = user?.user_metadata?.display_name?.trim();
  return name || authorNameFromEmail(user?.email);
}

export function profileAvatar(user) {
  return user?.user_metadata?.avatar_url?.trim() || DEFAULT_AVATAR;
}
