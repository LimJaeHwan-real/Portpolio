# 임재환 포트폴리오 사이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 디자인 핸드오프(`design_handoff_portfolio`)를 Next.js 한 페이지 사이트로 재구현하고 `https://jaehwanlim.site`에 배포한다.

**Architecture:** App Router 단일 라우트(`/`). 페이지는 서버 컴포넌트로 GitHub raw README 3개를 `revalidate: 3600`으로 가져와 `marked`로 HTML 변환한 뒤, Projects 섹션(클라이언트 컴포넌트)에 문자열로 넘긴다. 모달은 브라우저 기본 `<dialog>` + `showModal()`을 쓰므로 Esc 닫기·포커스 트랩·배경 비활성화·백드롭을 직접 구현하지 않는다. 스타일은 Tailwind 없이 `app/globals.css` 한 파일(CSS 변수 토큰 + 클래스).

**Tech Stack:** Next.js 15 (App Router, TypeScript), React 19, `marked`, Vercel, Node 24 내장 `node --test`

## Global Constraints

- **border-radius: 0 — 전역, 예외 없음**
- 폰트 스택: `Archivo, "IBM Plex Sans KR", system-ui, sans-serif` / 코드: `ui-monospace, SFMono-Regular, Menlo, monospace`
- 색: bg `#f3f2f2` / surface `#eae9e9` / ink `#201e1d` / divider `color-mix(in srgb, #201e1d 40%, transparent)`
- 액센트: `#1240e8` (레퍼런스 HTML `:root` 값. 핸드오프 README 본문의 `#0b63d6`과 불일치 — HTML을 정본으로 채택. 바꾸려면 `--accent` 한 줄만 수정)
- 경계선: 섹션·헤더·카드 = 2px ink, 카드 내부 구분선 = 1px divider
- 그림자는 카드 hover의 `10px 10px 0 var(--accent)` 오프셋 하나뿐. 블러 섀도우 금지
- 모션은 카드/버튼/링크 hover만. 스크롤 등장 애니메이션 없음
- 한국어 카피는 계획서에 적힌 문자열을 **그대로** 사용 (임의 윤문 금지)
- 브레이크포인트 없이 `auto-fit` + `clamp()`로 반응형
- `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }`
- 저장소: `https://github.com/LimJaeHwan-real/Portpolio.git` (현재 비어 있음), 로컬 경로 `C:\Users\home\workspace\Portpolio`

## 파일 구조

| 파일 | 책임 |
|---|---|
| `app/layout.tsx` | `<html lang="ko">`, 폰트 `<link>`, 메타데이터 |
| `app/globals.css` | 디자인 토큰(CSS 변수) + 전체 클래스. 유일한 스타일 파일 |
| `app/page.tsx` | 서버 컴포넌트. Header/Hero/Skills/Footer 마크업 + README 3개 prefetch |
| `app/projects.ts` | 프로젝트 데이터 배열 + `Project` 타입 |
| `app/readme.ts` | `fetchReadme(repo)` / `renderReadme(md)` |
| `app/readme.test.mts` | 위 두 함수의 단위 테스트 |
| `app/Projects.tsx` | 클라이언트 컴포넌트. 카드 그리드 + `<dialog>` README 모달 |

## 핸드오프 대비 의도적 차이

핸드오프 문서는 프로토타입 제약(순수 클라이언트 HTML)에서 나온 구현을 설명한다. 아래 4개는 결과가 같거나 더 나으면서 코드가 줄어드는 쪽으로 바꿨다. 룩앤필·카피·토큰은 100% 그대로다.

| 핸드오프 | 이 계획 | 이유 |
|---|---|---|
| 클라이언트에서 README fetch + 로딩 문구 + 레이스 가드 | 서버에서 prefetch(`revalidate: 3600`) 후 HTML로 전달 | 로딩 상태·레이스 가드·캐싱 코드가 전부 사라진다. 모달이 즉시 열린다 |
| `HEAD→main→master` × `README.md→readme.md` 6조합 순차 시도 | `HEAD/README.md` 1회 | 3개 저장소 모두 이 경로로 200 확인됨(ChickenTalk은 공개 전환 후). 실패 시 안내 문구는 그대로 유지 |
| 경량 자체 마크다운 렌더러 | `marked` + `.readme` CSS | 핸드오프도 "라이브러리로 교체 가능"이라 명시. 파서를 직접 쓸 이유 없음 |
| 오버레이 div + Esc 핸들러 + 포커스 트랩 직접 구현 | 브라우저 기본 `<dialog>` + `showModal()` | Esc·포커스 트랩·배경 비활성화·백드롭이 공짜. 핸드오프가 "권장"만 하고 프로토타입엔 없던 접근성이 기본으로 들어온다 |

그 외: README의 표(table)는 핸드오프에선 제거 대상이었지만 `marked`가 정상 렌더하므로 살려서 스타일만 입힌다. 헤더 nav의 `GitHub ↗` 링크는 레퍼런스 HTML에선 비어 있고 핸드오프 문서에만 기술되어 있어 **문서 기준으로 넣는다**.

## 사전 조건 (사람이 해야 함)

- `LimJaeHwan-real/ChickenTalk` 저장소를 **Public으로 전환** (현재 비공개라 README fetch가 404). Settings → General → Danger Zone → Change repository visibility.
- Vercel 계정 로그인 가능 상태, `jaehwanlim.site` 도메인 등록기관(DNS) 관리 페이지 접근 가능.

---

### Task 1: 프로젝트 스캐폴딩 + 디자인 토큰 + Header/Hero/Footer

**Files:**
- Create: `package.json`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (create-next-app 생성 후 덮어씀)
- Delete: `app/favicon.ico` 는 유지, `public/*.svg` 기본 애셋은 삭제

**Interfaces:**
- Produces: `app/globals.css`의 클래스 이름 전체 (`.header .brand .nav .hero .eyebrow .lede .contact .section .section-head .skills-grid .skill-head .tags .cards .card .badge .roles .tech .actions .btn .btn-outline .modal-head .modal-body .modal-foot .modal-close .readme .footer`) — Task 2·3이 이 이름을 그대로 쓴다.

- [ ] **Step 1: Next.js 프로젝트 생성**

`C:\Users\home\workspace` 에서 실행. (`docs/`가 이미 있어도 create-next-app이 허용하는 파일 목록에 포함되어 있어 문제없다.)

```bash
npx create-next-app@latest Portpolio --ts --app --no-tailwind --no-src-dir --no-eslint --import-alias "@/*" --use-npm
```

- [ ] **Step 2: 원격 저장소 연결 + 기본 애셋 정리**

```bash
cd Portpolio && git remote add origin https://github.com/LimJaeHwan-real/Portpolio.git && rm -f public/*.svg app/page.module.css
```

- [ ] **Step 3: `app/globals.css` 전체 교체**

create-next-app이 만든 내용을 전부 지우고 아래로 대체한다.

```css
:root {
  --bg: #f3f2f2;
  --surface: #eae9e9;
  --ink: #201e1d;
  --divider: color-mix(in srgb, var(--ink) 40%, transparent);
  --muted: color-mix(in srgb, var(--ink) 55%, transparent);
  --accent: #1240e8;
  --accent-200: color-mix(in srgb, var(--accent) 24%, #fff);
  --accent-600: color-mix(in srgb, var(--accent) 82%, #000);
  --accent-700: color-mix(in srgb, var(--accent) 62%, #000);
  --pad-x: clamp(20px, 5vw, 64px);
  --sec-y: clamp(40px, 6vw, 72px);
  --font: Archivo, "IBM Plex Sans KR", system-ui, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 { margin: 0; }
a { color: var(--ink); }
::selection { background: var(--accent); color: #fff; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
button { font-family: inherit; }

/* ---------- Header ---------- */
.header {
  position: sticky; top: 0; z-index: 20;
  display: flex; align-items: baseline; gap: 28px; flex-wrap: wrap;
  padding: 14px var(--pad-x);
  background: var(--bg);
  border-bottom: 2px solid var(--ink);
}
.brand {
  margin-right: auto;
  font-weight: 800; font-size: 17px; letter-spacing: -0.02em;
  text-decoration: none; color: var(--accent);
}
.brand:hover { color: var(--accent-600); }
.nav { display: flex; gap: 22px; align-items: baseline; }
.nav a {
  font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; text-decoration: none; color: var(--ink);
}
.nav a:hover { color: var(--accent); }
.nav .gh { color: var(--accent); border-bottom: 2px solid var(--accent); }
.nav .gh:hover { color: var(--ink); border-bottom-color: var(--ink); }

/* ---------- Hero ---------- */
.hero { padding: clamp(56px, 9vw, 120px) var(--pad-x) 0; }
.eyebrow {
  display: flex; gap: 14px; align-items: baseline;
  font-size: 12px; font-weight: 600; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--accent-700);
}
.eyebrow .rule { flex: 1; height: 2px; background: var(--ink); }
.eyebrow .year { color: var(--ink); }
.hero h1 {
  margin-top: 28px;
  font-size: clamp(44px, 8.5vw, 116px);
  line-height: 0.94; letter-spacing: -0.035em;
  font-weight: 800; text-transform: uppercase;
}
.hero-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(24px, 4vw, 64px);
  margin-top: clamp(32px, 5vw, 56px);
  padding-bottom: var(--sec-y);
}
.lede { margin: 0; font-size: clamp(17px, 1.6vw, 21px); line-height: 1.55; max-width: 46ch; text-wrap: pretty; }
.lede strong { font-weight: 700; box-shadow: inset 0 -0.32em 0 var(--accent-200); }
.contact { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.contact .label {
  font-size: 12px; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--muted);
}
.contact a {
  font-size: 16px; font-weight: 500; text-decoration: none;
  border-bottom: 2px solid var(--divider); color: var(--ink);
}
.contact a:hover { border-bottom-color: var(--accent); color: var(--accent-700); }

/* ---------- Section ---------- */
.section { border-top: 2px solid var(--ink); padding: var(--sec-y) var(--pad-x); }
.section-head {
  display: flex; gap: 16px; align-items: baseline;
  margin-bottom: clamp(28px, 4vw, 44px);
}
.section-head .num { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; color: var(--accent); }
.section-head h2 { font-size: clamp(26px, 3.4vw, 42px); letter-spacing: -0.02em; text-transform: uppercase; }
.section-head .count { margin-left: auto; font-size: 13px; font-weight: 600; color: var(--muted); }

/* ---------- Skills ---------- */
.skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: clamp(24px, 3vw, 40px); }
.skill-head {
  display: flex; align-items: baseline; gap: 10px;
  border-bottom: 2px solid var(--ink); padding-bottom: 10px; margin-bottom: 16px;
}
.skill-head .name { font-weight: 800; font-size: 18px; letter-spacing: -0.01em; }
.skill-head .n { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--accent); }
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tags span {
  font-size: 14px; font-weight: 600; padding: 6px 12px;
  border: 1px solid var(--divider); background: var(--surface);
}

/* ---------- Projects ---------- */
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: clamp(20px, 2.5vw, 32px); }
@media (max-width: 460px) { .cards { grid-template-columns: 1fr; } }
.card {
  display: flex; flex-direction: column; gap: 14px;
  border: 2px solid var(--ink); background: var(--bg);
  padding: clamp(20px, 2.2vw, 28px);
  transition: box-shadow .15s ease, transform .15s ease;
}
.card:hover { box-shadow: 10px 10px 0 var(--accent); transform: translate(-3px, -3px); }
.card-head { display: flex; align-items: baseline; gap: 12px; }
.card-head h3 { font-size: clamp(22px, 2.2vw, 30px); letter-spacing: -0.025em; }
.badge {
  margin-left: auto; white-space: nowrap;
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--bg); background: var(--ink); padding: 4px 8px;
}
.card p { margin: 0; font-size: 15px; line-height: 1.6; text-wrap: pretty; }
.roles {
  margin: 0; padding: 14px 0 0; list-style: none;
  display: flex; flex-direction: column; gap: 8px;
  border-top: 1px solid var(--divider);
}
.roles li { display: flex; gap: 10px; font-size: 14px; line-height: 1.5; }
.roles li::before { content: "—"; color: var(--accent); font-weight: 800; }
.tech { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 14px; }
.tech span { font-size: 12px; font-weight: 600; letter-spacing: 0.02em; padding: 4px 9px; border: 1px solid var(--ink); }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.btn {
  display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
  font-family: var(--font); font-weight: 800; font-size: 13px;
  letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none;
  color: var(--bg); background: var(--accent); border: 0; padding: 10px 16px;
}
.btn:hover { background: var(--accent-600); color: var(--bg); }
.btn-outline { color: var(--ink); background: transparent; border: 2px solid var(--ink); padding: 8px 14px; }
.btn-outline:hover { background: var(--ink); color: var(--bg); }

/* ---------- Modal (native <dialog>) ---------- */
dialog {
  width: min(860px, 100%); max-height: 86vh; padding: 0;
  background: var(--bg); color: var(--ink); border: 2px solid var(--ink);
}
dialog::backdrop { background: color-mix(in srgb, #201e1d 62%, transparent); }
dialog[open] { display: flex; flex-direction: column; }
.modal-head {
  display: flex; align-items: center; gap: 16px;
  padding: 16px clamp(18px, 2.4vw, 28px); border-bottom: 2px solid var(--ink);
}
.modal-head .kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-700); }
.modal-head .title { font-weight: 800; font-size: clamp(18px, 2vw, 24px); letter-spacing: -0.02em; }
.modal-close {
  margin-left: auto; cursor: pointer; font-weight: 800; font-size: 16px; line-height: 1;
  width: 36px; height: 36px; color: var(--ink); background: transparent; border: 2px solid var(--ink);
}
.modal-close:hover { background: var(--ink); color: var(--bg); }
.modal-body { overflow: auto; padding: clamp(18px, 2.4vw, 28px); }
.modal-foot { display: flex; flex-wrap: wrap; gap: 10px; padding: 14px clamp(18px, 2.4vw, 28px); border-top: 2px solid var(--ink); }

/* ---------- README markdown ---------- */
.readme { max-width: 72ch; }
.readme img, .readme picture { display: none; }
.readme h1, .readme h2, .readme h3, .readme h4, .readme h5, .readme h6 {
  font-weight: 800; margin: 24px 0 10px; letter-spacing: -0.01em;
}
.readme h1 { font-size: 26px; border-bottom: 2px solid var(--ink); padding-bottom: 8px; }
.readme h2 { font-size: 21px; border-bottom: 2px solid var(--ink); padding-bottom: 8px; }
.readme h3 { font-size: 17px; }
.readme h4 { font-size: 15px; }
.readme h5 { font-size: 14px; }
.readme h6 { font-size: 13px; }
.readme p { font-size: 15px; line-height: 1.65; }
.readme li { font-size: 15px; line-height: 1.65; margin: 4px 0; }
.readme ul { list-style: none; padding-left: 0; }
.readme ul ul { padding-left: 1.2em; }
.readme ul > li::before { content: "—"; color: var(--accent); font-weight: 800; margin-right: 8px; }
.readme ol { padding-left: 1.4em; }
.readme blockquote { margin: 16px 0; padding-left: 14px; border-left: 3px solid var(--accent); }
.readme hr { border: 0; border-top: 2px solid var(--divider); margin: 24px 0; }
.readme pre { background: var(--surface); padding: 14px; overflow: auto; font-family: var(--mono); font-size: 12.5px; }
.readme code { font-family: var(--mono); font-size: 12.5px; background: var(--surface); padding: 1px 5px; }
.readme pre code { background: transparent; padding: 0; }
.readme a { color: var(--accent-700); }
.readme table { border-collapse: collapse; font-size: 14px; display: block; overflow-x: auto; }
.readme th, .readme td { border: 1px solid var(--divider); padding: 6px 10px; text-align: left; }

/* ---------- Footer ---------- */
.footer {
  display: flex; flex-wrap: wrap; gap: 12px; align-items: baseline;
  padding: 22px var(--pad-x); border-top: 2px solid var(--ink);
  font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;
}
.footer .right { margin-left: auto; color: var(--muted); }
```

- [ ] **Step 4: `app/layout.tsx` 전체 교체**

```tsx
import type { Metadata } from "next";
import "./globals.css";

const DESCRIPTION =
  "새로운 지식을 빠르게 학습한 뒤 AI를 활용해 구현할 수 있는 개발자입니다. 기능 구현에 그치지 않고 테스트·배포·운영 상태까지 확인하는 개발을 지향합니다.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jaehwanlim.site"),
  title: "임재환 | Developer Portfolio",
  description: DESCRIPTION,
  openGraph: {
    title: "임재환 | Developer Portfolio",
    description: DESCRIPTION,
    url: "https://jaehwanlim.site",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* ponytail: next/font 대신 <link> — IBM Plex Sans KR의 korean 서브셋 설정을 피하려는 의도.
            LCP가 문제되면 next/font/google로 교체 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800&family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: `app/page.tsx` 전체 교체 (Header + Hero + Footer만, Skills/Projects는 Task 2)**

```tsx
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

      <footer className="footer">
        <span>© 2026 Jaehwan Lim</span>
        <span className="right">Developer Portfolio</span>
      </footer>
    </>
  );
}
```

- [ ] **Step 6: 빌드 통과 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully` 후 `Route (app) ┌ ○ /` 출력, 에러 0건.

- [ ] **Step 7: 육안 확인**

```bash
npm run dev
```

`http://localhost:3000` 에서 확인할 것:
- 헤더가 스크롤 시 상단에 고정되고 아래에 2px 검정 선이 있다
- `임재환 / JAEHWAN LIM` 이 화면 폭에 맞춰 커진다 (창을 좁혔다 넓혀볼 것)
- "테스트·배포·운영 상태" 에 연한 파란 형광펜 밑줄이 있다
- Contact 링크에 마우스를 올리면 밑줄과 글자가 파랗게 바뀐다
- 브라우저 창을 320px까지 좁혀도 가로 스크롤이 생기지 않는다

- [ ] **Step 8: 커밋**

```bash
git add -A && git commit -m "feat: Next.js 스캐폴딩 + 디자인 토큰 + Header/Hero/Footer"
```

---

### Task 2: Skills 섹션 + Projects 데이터/카드

**Files:**
- Create: `app/projects.ts`
- Modify: `app/page.tsx` (Task 1의 Hero와 Footer 사이에 두 섹션 삽입)

**Interfaces:**
- Consumes: Task 1의 `app/globals.css` 클래스
- Produces:
  - `export type Project = { name: string; kind: string; desc: string; roles: string[]; tech: string[]; repo: string; videoUrl?: string }`
  - `export const projects: Project[]` (기본 export 아님 — named export)

- [ ] **Step 1: `app/projects.ts` 생성**

```ts
export type Project = {
  name: string;
  kind: string;
  desc: string;
  roles: string[];
  tech: string[];
  /** "owner/repo" 형태 */
  repo: string;
  /** 있을 때만 "▶ 영상 보기" 버튼이 렌더된다 */
  videoUrl?: string;
};

export const projects: Project[] = [
  {
    name: "Orbit",
    kind: "팀 프로젝트",
    desc: "발표자료 생성, 편집, 리허설 코칭, 실전 발표를 하나의 서비스로 연결하는 팀 프로젝트입니다.",
    roles: [
      "TypeScript CI를 구성했습니다.",
      "커밋 SHA 기반 이미지 배포를 적용했습니다.",
      "EC2·CloudFront 상태 점검과 릴리스 사전 검증을 구성했습니다.",
    ],
    tech: ["React", "TypeScript", "NestJS", "PostgreSQL"],
    repo: "na-man-mu-303-team2/Orbit",
    videoUrl: "https://www.youtube.com/watch?v=A8zEN_jbdo8&t=324s",
  },
  {
    name: "ChickenTalk",
    kind: "개인 프로젝트",
    desc: "PUBG 전적 데이터에 한국어로 질문하면 LLM이 데이터 카탈로그를 참고해 SQL을 생성·실행하고 차트로 답하는 데이터 파이프라인 프로젝트입니다.",
    roles: [
      "Airflow 일 배치 DAG(수집→마트→품질→정합성 검증)로 14일 후 소멸되는 매치 데이터 1,500건·23만 행을 무인 증분 적재했습니다.",
      "YAML 데이터 카탈로그를 문서·정합성 검증 기준·LLM 프롬프트 컨텍스트 세 역할로 설계해 text-to-SQL 정확도를 확보했습니다.",
      "SELECT 전용·LIMIT 강제·타임아웃의 SQL 안전장치를 두고, 같은 데이터 기반을 REST API와 MCP 서버 두 경로로 노출했습니다.",
    ],
    tech: ["Python", "FastAPI", "Airflow", "PostgreSQL", "Docker", "AWS (EC2·S3)", "Claude API", "MCP"],
    repo: "LimJaeHwan-real/ChickenTalk",
  },
  {
    name: "Mini Redis",
    kind: "팀 프로젝트",
    desc: "Python으로 구현한 인메모리 키-값 저장소입니다.",
    roles: [
      "String·List·Set·Hash·Sorted Set 명령의 단위 테스트를 설계·구현했습니다.",
      "Hot Key 상황의 동시성 검증을 구현했습니다.",
    ],
    tech: ["Python"],
    repo: "LimJaeHwan-real/redis",
  },
];

export const skills: { name: string; items: string[] }[] = [
  { name: "Language", items: ["Python", "TypeScript", "JavaScript"] },
  { name: "Frontend", items: ["React"] },
  { name: "Backend", items: ["NestJS"] },
  { name: "DevOps", items: ["Docker", "Redis"] },
];
```

- [ ] **Step 2: `app/page.tsx`에 Skills 섹션 추가**

`app/page.tsx` 맨 위에 import를 추가하고,

```tsx
import { skills, projects } from "./projects";
```

`</section>` (hero 닫는 태그) 와 `<footer className="footer">` 사이에 아래를 삽입한다.

```tsx
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
```

- [ ] **Step 3: 빌드 통과 확인**

```bash
npm run build
```

Expected: 에러 0건. TypeScript가 `skills` / `projects` 타입을 잡아준다.

- [ ] **Step 4: 육안 확인**

```bash
npm run dev
```

- Skills: 4개 카드가 한 줄, 각 제목 우측에 `03 / 01 / 01 / 02`
- Projects: 데스크톱에서 2열(마지막 카드는 왼쪽 한 칸), 카드에 마우스를 올리면 파란 오프셋 그림자와 함께 좌상단으로 3px 이동
- 역할 목록 앞에 파란 `—` 불릿, 기술 태그는 카드 하단에 붙어 정렬
- 창을 좁히면 두 그리드 모두 1열로 접힌다

- [ ] **Step 5: 커밋**

```bash
git add -A && git commit -m "feat: Skills 섹션 + Projects 카드 그리드"
```

---

### Task 3: README 모달 (서버 fetch + native `<dialog>`)

**Files:**
- Create: `app/readme.ts`, `app/readme.test.mts`, `app/Projects.tsx`
- Modify: `app/page.tsx` (Projects 섹션을 `<Projects />` 호출로 교체)
- Modify: `package.json` (test 스크립트)

**Interfaces:**
- Consumes: Task 2의 `Project` 타입, `projects` 배열
- Produces:
  - `export function renderReadme(md: string): string`
  - `export async function fetchReadme(repo: string, f?: typeof fetch): Promise<string>`
  - `export default function Projects({ readmes }: { readmes: Record<string, string> }): JSX.Element` — `readmes`의 키는 `Project["repo"]` 문자열

- [ ] **Step 1: `marked` 설치**

```bash
npm i marked
```

- [ ] **Step 2: 실패하는 테스트 작성 — `app/readme.test.mts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchReadme, renderReadme } from "./readme.ts";

test("마크다운을 HTML로 변환한다", () => {
  const html = renderReadme("# 제목\n\n본문 **강조**");
  assert.match(html, /<h1[^>]*>제목<\/h1>/);
  assert.match(html, /<strong>강조<\/strong>/);
});

test("fetch 실패 시 안내 문구를 반환한다", async () => {
  const html = await fetchReadme("owner/none", async () => new Response("", { status: 404 }));
  assert.match(html, /README를 불러올 수 없습니다/);
});

test("fetch 성공 시 본문을 렌더링한다", async () => {
  const html = await fetchReadme("owner/repo", async () => new Response("## 설치", { status: 200 }));
  assert.match(html, /<h2[^>]*>설치<\/h2>/);
});

test("HEAD 브랜치의 README.md를 요청한다", async () => {
  let requested = "";
  await fetchReadme("a/b", async (url) => {
    requested = String(url);
    return new Response("x", { status: 200 });
  });
  assert.equal(requested, "https://raw.githubusercontent.com/a/b/HEAD/README.md");
});
```

- [ ] **Step 3: 테스트 스크립트 등록 후 실패 확인**

```bash
npm pkg set scripts.test="node --test app/*.test.mts" && npm test
```

Expected: FAIL — `Cannot find module './readme.ts'`

> `node --test`가 타입 스트리핑 문제로 실패하면 대체 명령은 `npx tsx --test app/*.test.mts` 이다. Node 24에서는 그대로 동작해야 한다.

- [ ] **Step 4: `app/readme.ts` 구현**

```ts
import { marked } from "marked";

const FALLBACK =
  "<p>README를 불러올 수 없습니다.</p>" +
  "<p>비공개 저장소이거나 README 파일이 없을 수 있습니다.</p>" +
  "<p>아래 GitHub 버튼으로 저장소를 직접 확인해 주세요.</p>";

export function renderReadme(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/**
 * ponytail: marked 출력을 그대로 dangerouslySetInnerHTML로 넣는다.
 * 소스가 본인 소유의 공개 저장소 3곳뿐이라 성립하는 가정 — 외부 입력 repo를
 * 받게 되면 sanitize-html 또는 rehype-sanitize를 붙일 것.
 */
export async function fetchReadme(repo: string, f: typeof fetch = fetch): Promise<string> {
  const res = await f(`https://raw.githubusercontent.com/${repo}/HEAD/README.md`, {
    next: { revalidate: 3600 },
  } as RequestInit);
  if (!res.ok) return FALLBACK;
  return renderReadme(await res.text());
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
npm test
```

Expected: `# pass 4` / `# fail 0`

- [ ] **Step 6: `app/Projects.tsx` 생성**

```tsx
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
              <button type="button" className="btn" onClick={() => open(p)}>README</button>
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
      <dialog ref={dialog} onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}>
        <div className="modal-head">
          <div className="kicker">README</div>
          <div className="title">{active?.name}</div>
          <button type="button" className="modal-close" aria-label="닫기" onClick={() => dialog.current?.close()}>✕</button>
        </div>
        <div className="modal-body">
          <div className="readme" dangerouslySetInnerHTML={{ __html: active ? readmes[active.repo] : "" }} />
        </div>
        <div className="modal-foot">
          <a className="btn" href={`https://github.com/${active?.repo}`} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </dialog>
    </section>
  );
}
```

- [ ] **Step 7: `app/page.tsx`를 async 서버 컴포넌트로 바꾸고 Projects 섹션 교체**

import 줄을 아래로 바꾼다.

```tsx
import { skills, projects } from "./projects";
import { fetchReadme } from "./readme";
import Projects from "./Projects";
```

함수 시그니처를 바꾸고 README를 미리 받는다.

```tsx
export default async function Page() {
  const entries = await Promise.all(
    projects.map(async (p) => [p.repo, await fetchReadme(p.repo)] as const),
  );
  const readmes = Object.fromEntries(entries);
```

그리고 Task 2에서 넣은 `<section className="section" id="projects"> … </section>` 블록 **전체**를 아래 한 줄로 교체한다.

```tsx
      <Projects readmes={readmes} />
```

- [ ] **Step 8: 빌드 + 테스트 통과 확인**

```bash
npm test && npm run build
```

Expected: 테스트 `# fail 0`, 빌드 에러 0건. 빌드 로그에서 `/` 라우트가 `ƒ (Dynamic)` 또는 `○ (Static)` 중 하나로 나오면 정상.

- [ ] **Step 9: 육안 확인**

```bash
npm run dev
```

- 각 카드의 `README` 버튼을 누르면 모달이 열리고 **로딩 없이 즉시** 내용이 보인다 (서버에서 미리 받아둠)
- 모달 안에서 Tab을 눌러도 포커스가 뒤 페이지로 새지 않는다
- `Esc` 로 닫힌다
- 어두운 배경을 클릭하면 닫히고, 모달 내부를 클릭하면 닫히지 않는다
- 마크다운의 이미지/뱃지는 보이지 않고, 코드블록은 회색 배경 고정폭이다
- ChickenTalk 카드가 안내 문구("README를 불러올 수 없습니다…")를 보여준다면 **사전 조건의 저장소 공개 전환이 아직 안 된 것** — 전환 후 `npm run dev` 재시작

- [ ] **Step 10: 커밋**

```bash
git add -A && git commit -m "feat: README 모달 (서버 prefetch + native dialog)"
```

---

### Task 4: GitHub 푸시 + Vercel 배포 + jaehwanlim.site 연결

**Files:**
- Create: `README.md` (저장소 설명)

**Interfaces:**
- Consumes: Task 1~3의 완성된 앱

> 이 태스크는 사용자 계정(GitHub, Vercel, 도메인 등록기관)에 접근한다. 브라우저 로그인·DNS 입력은 **사용자가 직접** 수행하고, 에이전트는 CLI 단계만 진행한다. 첫 공개 배포(`vercel --prod`)와 `git push` 직전에 사용자 확인을 받는다.

- [ ] **Step 1: 저장소 README 작성**

`README.md`:

```markdown
# Portfolio

임재환 개발자 포트폴리오 — https://jaehwanlim.site

Next.js(App Router) 한 페이지 사이트. 프로젝트 README는 서버에서 raw.githubusercontent로 받아
1시간마다 재검증하고, 모달은 브라우저 기본 `<dialog>`를 사용한다.

## 개발

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # app/readme.test.mts
npm run build
```

## 구조

- `app/page.tsx` — 서버 컴포넌트. Header / Hero / Skills / Footer + README prefetch
- `app/Projects.tsx` — 클라이언트 컴포넌트. 카드 그리드 + README 모달
- `app/projects.ts` — 프로젝트·스킬 데이터. 내용 수정은 여기만 고치면 된다
- `app/readme.ts` — README fetch + 마크다운 렌더링
- `app/globals.css` — 디자인 토큰과 전체 스타일 (단일 파일)
```

- [ ] **Step 2: 커밋 후 사용자에게 푸시 확인 요청**

```bash
git add -A && git commit -m "docs: 저장소 README"
```

사용자에게 "GitHub `LimJaeHwan-real/Portpolio` 에 푸시해도 될까요?" 확인을 받은 뒤 진행한다.

- [ ] **Step 3: 푸시**

```bash
git branch -M main && git push -u origin main
```

Expected: `branch 'main' set up to track 'origin/main'`

- [ ] **Step 4: Vercel 로그인 및 프로젝트 연결**

```bash
npx vercel login
```

브라우저가 열리면 사용자가 GitHub 계정으로 로그인한다. 이어서:

```bash
npx vercel link --yes
```

- [ ] **Step 5: 프리뷰 배포로 먼저 검증**

```bash
npx vercel
```

Expected: `https://portpolio-*.vercel.app` 형태의 URL 출력. 그 URL을 열어 Task 3 Step 9의 확인 항목을 다시 한 번 점검한다 (특히 3개 README가 모두 실제 내용으로 뜨는지).

- [ ] **Step 6: 사용자 확인 후 프로덕션 배포**

프리뷰가 정상이면 사용자에게 "프로덕션 배포할까요?" 확인을 받고:

```bash
npx vercel --prod
```

- [ ] **Step 7: 도메인 연결 (사용자 작업)**

Vercel 대시보드 → 해당 프로젝트 → **Settings → Domains** → `jaehwanlim.site` 추가 → 이어서 `www.jaehwanlim.site` 도 추가(리다이렉트 자동 설정).

Vercel이 화면에 표시하는 DNS 레코드를 **그대로** 도메인 등록기관 DNS 관리 화면에 입력한다. 보통 두 줄이다:

| Type | Name | Value |
|---|---|---|
| A | `@` | Vercel이 표시하는 IP |
| CNAME | `www` | Vercel이 표시하는 `*.vercel-dns.com` 호스트 |

> IP/호스트 값은 Vercel이 계정·리전별로 다르게 안내하므로 **여기 적힌 예시가 아니라 화면 값을 쓸 것**. 등록기관이 네임서버 위임을 지원하면 Vercel 네임서버로 넘기는 쪽이 더 간단하다.

- [ ] **Step 8: 전파 확인**

```bash
nslookup jaehwanlim.site
```

DNS 전파는 보통 수 분~수 시간. Vercel Domains 화면의 상태가 **Valid Configuration** 이 되고 HTTPS 인증서가 자동 발급되면 완료.

```bash
curl -sI https://jaehwanlim.site | head -3
```

Expected: `HTTP/2 200`

- [ ] **Step 9: 최종 확인**

`https://jaehwanlim.site` 를 데스크톱과 모바일 폭에서 열어 확인:
- 헤더 sticky, 앵커 스크롤(Skills/Projects 클릭) 동작
- 3개 카드의 README 모달이 모두 실제 내용 표시
- `http://jaehwanlim.site` 와 `https://www.jaehwanlim.site` 가 https 정식 주소로 리다이렉트

- [ ] **Step 10: 커밋**

```bash
git add -A && git commit -m "chore: Vercel 배포 설정" --allow-empty && git push
```

---

## 나중에 (지금은 안 함)

- OG 이미지: 필요해지면 `app/opengraph-image.tsx` 추가
- next/font 전환: Lighthouse에서 폰트 LCP가 문제될 때
- README 마크다운 sanitize: 남의 저장소 README를 렌더하게 되면
