"use client";

import { useRef, useState } from "react";
import { projects, type Project } from "./projects";

export default function Projects({ readmes }: { readmes: Record<string, string> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  const open = (p: Project) => {
    setActive(p);
    dialog.current?.showModal();
  };

  return (
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
            <div className="actions">
              <button type="button" className="btn" onClick={() => open(p)}>자세히 보기</button>
              {p.videoUrl && (
                <a className="btn btn-outline" href={p.videoUrl} target="_blank" rel="noreferrer">
                  <span style={{ fontSize: 11 }}>▶</span>영상 보기
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* 배경 클릭 닫기만 직접 처리. Esc·포커스 트랩·배경 비활성화는 <dialog>가 해준다 */}
      <dialog
        ref={dialog}
        aria-labelledby="readme-modal-title"
        onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}
        onClose={() => setActive(null)}
      >
        {active && (
          <>
            <div className="modal-head">
              <div className="kicker">README</div>
              <h2 className="title" id="readme-modal-title">{active.name}</h2>
              <button type="button" className="modal-close" aria-label="닫기" onClick={() => dialog.current?.close()}>✕</button>
            </div>
            <div className="modal-body">
              <div className="readme" dangerouslySetInnerHTML={{ __html: readmes[active.repo] }} />
            </div>
            <div className="modal-foot">
              <a className="btn" href={`https://github.com/${active.repo}`} target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
