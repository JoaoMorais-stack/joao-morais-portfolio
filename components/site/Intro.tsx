import type { Dictionary } from "@/content/site";

export default function Intro({ t }: { t: Dictionary }) {
  const words = t.intro.statement.split(" ");
  return (
    <section className="intro" id="intro" data-scene aria-labelledby="intro-statement">
      <div className="intro-inner">
        <p id="intro-statement" className="intro-statement" data-reveal-words>
          {words.map((w, i) => (
            <span key={i} className="word">
              {w}{" "}
            </span>
          ))}
        </p>
        <dl className="intro-list">
          {t.intro.items.map((item) => (
            <div key={item.title} className="intro-item" data-reveal>
              <dt>
                <span className="intro-title">{item.title}</span>
                <span className="intro-status">{item.status}</span>
              </dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
