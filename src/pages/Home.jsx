import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SECTIONS = [
  {
    type: "guide",
    label: "Care guides",
    title: "Long-form notes",
    text: "How to keep a specific plant happy - light, water, soil, and the mistakes to avoid.",
  },
  {
    type: "question",
    label: "Questions",
    title: "Ask the community",
    text: "Something not going right? Describe the plant and the conditions and get real answers.",
  },
  {
    type: "showcase",
    label: "Showcases",
    title: "Things thriving",
    text: "A photograph of a plant that has done well, with a short note on what you did.",
  },
  {
    type: "tip",
    label: "Quick tips",
    title: "One-line lessons",
    text: "Small truths learned the hard way. Short enough to remember, useful enough to save.",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <section className="home-hero">
        <p className="home-kicker">Vol. 01 · A field journal for indoor gardeners</p>
        <h1 className="home-title">
          Notes on keeping <em>plants</em> alive indoors.
        </h1>
        <p className="home-lede">
          A quiet community of houseplant keepers. Write down what worked,
          ask about what did not, and read what other people have figured out.
        </p>
        <div className="home-actions">
          <Link to="/feed" className="btn btn-primary">Read the feed</Link>
          {!user && (
            <Link to="/register" className="btn btn-ghost">Join the community</Link>
          )}
        </div>
      </section>

      <section className="home-sections">
        <header className="home-section-head">
          <h2>What you will find</h2>
          <p>Four kinds of entry, all written by the community</p>
        </header>

        <div className="home-section-grid">
          {SECTIONS.map((s) => (
            <Link
              key={s.type}
              to={`/feed?type=${s.type}`}
              className="home-section-card"
            >
              <span className={`type type-${s.type}`}>{s.label}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-closing">
        <p className="home-closing-line">
          Have a plant you have finally figured out? Write it down.
        </p>
        <Link
          to={user ? "/create" : "/register"}
          className="btn btn-primary"
        >
          {user ? "New entry" : "Create an account"}
        </Link>
      </section>
    </>
  );
}