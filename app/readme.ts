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
