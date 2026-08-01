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
- `app/ProjectsSection.tsx` — 클라이언트 컴포넌트. 카드 그리드 + README 모달
- `app/projects.ts` — 프로젝트·스킬 데이터. 내용 수정은 여기만 고치면 된다
- `app/readme.ts` — README fetch + 마크다운 렌더링
- `app/globals.css` — 디자인 토큰과 전체 스타일 (단일 파일)
