import { Link } from "react-router-dom";

const DATE_STAMP = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function About() {
  return (
    <article className="about">
      <header className="about-head">
        <h1 className="about-title">
          Leafy is a field journal, <em>not a shop.</em>
        </h1>
      </header>

      <div className="about-grid">
        <div className="about-main">
          <p className="about-lede">
            It is a place to write down what you have learned about keeping
            plants indoors - and to read what other people have figured out.
          </p>

          <h2 className="about-heading">How it works</h2>
          <p>
            Anyone can read the feed and the entries. Sign in to publish your
            own: a care guide for a plant you know well, a question about one
            you do not, a photograph of something thriving, or a small tip.
          </p>
          <p>
            Every entry belongs to the person who wrote it. Only that author
            can edit or delete it, and the rule is enforced on the server, not
            just hidden in the interface.
          </p>

          <h2 className="about-heading">On plants</h2>
          <p>
            Most houseplants die of kindness, too much water, too much light,
            too much attention. The best guides here are written by people who
            killed the plant first and learned from it.
          </p>

          <h2 className="about-heading">On the tech</h2>
          <p>
            Built with React and Supabase. Client-side routing, session-based
            authentication, row-level security on every table, and a small
            custom design system. No tracking, no ads, no notifications.
          </p>
        </div>

        <aside className="about-side">
          <div className="about-card">
            <dl className="about-facts">
              <div>
                <dt>Issue</dt>
                <dd>{DATE_STAMP}</dd>
              </div>
              <div>
                <dt>Frontend</dt>
                <dd>React + Vite</dd>
              </div>
              <div>
                <dt>Backend</dt>
                <dd>Supabase</dd>
              </div>
              <div>
                <dt>Typography</dt>
                <dd>Fraunces &amp; Inter</dd>
              </div>
            </dl>
          </div>

          <Link to="/feed" className="about-link">
            Read the latest entries →
          </Link>
        </aside>
      </div>
    </article>
  );
}