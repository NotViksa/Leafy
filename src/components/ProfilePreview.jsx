import { DEFAULT_AVATAR } from "../lib/profile";

const STAMP = new Date().toLocaleString();

export default function ProfilePreview({ name, avatar }) {
  const shownName = name.trim() || "Your name";
  const shownAvatar = avatar.trim() || DEFAULT_AVATAR;

  return (
    <div className="preview">
      <span className="preview-label">How you appear</span>
      <div className="preview-card">
        <div className="author-line">
          <img
            className="avatar avatar-md"
            src={shownAvatar}
            alt=""
            width="40"
            height="40"
          />
          <div>
            <span className="author-line-name">{shownName}</span>
            <span className="author-line-label">Author</span>
          </div>
        </div>

        <ul className="comment-list preview-comment-list">
          <li className="comment">
            <span className="comment-num">01</span>
            <img
              className="avatar avatar-md"
              src={shownAvatar}
              alt=""
              width="40"
              height="40"
            />
            <div className="comment-content">
              <div className="comment-head">
                <span className="comment-author">{shownName}</span>
                <span className="comment-date">{STAMP}</span>
              </div>
              <p className="comment-body">
                Looks happy on that bright windowsill.
              </p>            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
