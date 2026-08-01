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
