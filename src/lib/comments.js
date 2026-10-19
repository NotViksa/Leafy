export const COMMENT_MAX_LEN = 500;

export function validateCommentText(text) {
  const trimmed = text.trim();
  if (!trimmed) return "Comment cannot be empty.";
  if (trimmed.length > COMMENT_MAX_LEN)
    return `Comment is too long (max ${COMMENT_MAX_LEN} characters).`;
  return "";
}
