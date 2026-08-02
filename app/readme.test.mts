import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchReadme, renderReadme } from "./readme.ts";

test("마크다운을 HTML로 변환한다", () => {
  const html = renderReadme("# 제목\n\n본문 **강조**", "owner/repo");
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

test("fetch가 예외를 던지면 안내 문구를 반환한다", async () => {
  const html = await fetchReadme("owner/repo", async () => {
    throw new Error("network down");
  });
  assert.match(html, /README를 불러올 수 없습니다/);
});

test("script 태그와 on* 속성을 제거한다", () => {
  const html = renderReadme(
    '<script>alert(1)</script>\n\n<img src="x.png" onerror="alert(1)">',
    "owner/repo",
  );
  assert.doesNotMatch(html, /<script/);
  assert.doesNotMatch(html, /onerror/);
});

test("상대 이미지 경로를 raw.githubusercontent 절대 URL로 치환한다", () => {
  const html = renderReadme("![diagram](docs/architecture.svg)", "owner/repo", "abc123");
  assert.match(
    html,
    /src="https:\/\/raw\.githubusercontent\.com\/owner\/repo\/abc123\/docs\/architecture\.svg"/,
  );
});

test("상대 링크 경로를 github blob 절대 URL로 치환한다", () => {
  const html = renderReadme("[문서](docs/troubleshooting.md)", "owner/repo", "abc123");
  assert.match(
    html,
    /href="https:\/\/github\.com\/owner\/repo\/blob\/abc123\/docs\/troubleshooting\.md"/,
  );
});

test("절대 URL은 치환하지 않는다", () => {
  const html = renderReadme("[ext](https://example.com/page)", "owner/repo");
  assert.match(html, /href="https:\/\/example\.com\/page"/);
});

test("본문을 읽다가 실패해도 안내 문구를 반환한다", async () => {
  const res = new Response("ok", { status: 200 });
  res.text = () => Promise.reject(new Error("stream reset"));
  const html = await fetchReadme("owner/repo", async () => res);
  assert.match(html, /README를 불러올 수 없습니다/);
});

test("루트 상대 경로(단일 /)는 저장소 루트 기준 절대 URL로 치환하고 // 를 겹치지 않는다", () => {
  const html = renderReadme("[문서](/docs/x.md)", "owner/repo", "abc123");
  assert.match(
    html,
    /href="https:\/\/github\.com\/owner\/repo\/blob\/abc123\/docs\/x\.md"/,
  );
});

test("프로토콜 상대 URL(//)은 치환하지 않는다", () => {
  const html = renderReadme("![img](//example.com/x.png)", "owner/repo");
  assert.match(html, /src="\/\/example\.com\/x\.png"/);
});

test("mermaid 코드 블록은 mermaid.ink 이미지로 렌더한다", () => {
  const md = "```mermaid\nflowchart LR\n    A --> B\n```";
  const html = renderReadme(md, "owner/repo");
  assert.match(html, /<img src="https:\/\/mermaid\.ink\/svg\//);
  assert.doesNotMatch(html, /<pre/);
  assert.doesNotMatch(html, /flowchart LR/);
});

test("mermaid가 아닌 코드 블록은 그대로 pre/code로 렌더한다", () => {
  const html = renderReadme("```bash\nnpm test\n```", "owner/repo");
  assert.match(html, /<pre><code[^>]*>npm test/);
  assert.doesNotMatch(html, /mermaid\.ink/);
});
