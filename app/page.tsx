import { skills, projects } from "./projects";

export default function Page() {
  return (
    <>
      <header className="header">
        <a className="brand" href="#top">JAEHWAN&nbsp;LIM</a>
        <nav className="nav">
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a className="gh" href="https://github.com/LimJaeHwan-real" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">
          <span>Developer Portfolio</span>
          <span className="rule" />
          <span className="year">2026</span>
        </div>
        <h1>임재환<br />Jaehwan&nbsp;Lim</h1>
        <div className="hero-grid">
          <p className="lede">
            새로운 지식을 빠르게 학습한 뒤 AI를 활용해 구현할 수 있는 개발자입니다.
            <br />
            기능 구현에 그치지 않고&nbsp;<strong>테스트·배포·운영 상태</strong>까지 확인하는 개발을 지향합니다.
          </p>
          <div className="contact">
            <div className="label">Contact</div>
            <a href="mailto:shawncan1573@gmail.com">shawncan1573@gmail.com</a>
            <a href="https://LimJaeHwan-real.github.io/BlogLim" target="_blank" rel="noreferrer">기술 블로그 ↗</a>
            <a href="https://github.com/LimJaeHwan-real" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="section-head">
          <span className="num">01</span>
          <h2>Skills</h2>
        </div>
        <div className="skills-grid">
          {skills.map((group) => (
            <div key={group.name}>
              <div className="skill-head">
                <span className="name">{group.name}</span>
                <span className="n">{String(group.items.length).padStart(2, "0")}</span>
              </div>
              <div className="tags">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-head">
          <span className="num">02</span>
          <h2>Projects</h2>
          <span className="count">{projects.length} selected</span>
        </div>
        <div className="cards">
          {projects.map((p) => (
            <article className="card" key={p.repo}>
              <div className="card-head">
                <h3>{p.name}</h3>
                <span className="badge">{p.kind}</span>
              </div>
              <p>{p.desc}</p>
              <ul className="roles">
                {p.roles.map((role) => (
                  <li key={role}><span>{role}</span></li>
                ))}
              </ul>
              <div className="tech">
                {p.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 Jaehwan Lim</span>
        <span className="right">Developer Portfolio</span>
      </footer>
    </>
  );
}
