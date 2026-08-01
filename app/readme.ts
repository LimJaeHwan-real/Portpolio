import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const FALLBACK =
  "<p>README를 불러올 수 없습니다.</p>" +
  "<p>비공개 저장소이거나 README 파일이 없을 수 있습니다.</p>" +
  "<p>아래 GitHub 버튼으로 저장소를 직접 확인해 주세요.</p>";

// 스킴이 있거나(https:, mailto:) 프로토콜 상대(//)거나 페이지 내부 앵커(#)면 절대 URL로 본다.
const ABSOLUTE_URL = /^([a-z][a-z0-9+.-]*:|\/\/|#)/i;

function resolve(url: string, base: string): string {
  return ABSOLUTE_URL.test(url) ? url : base + url.replace(/^\.\//, "");
}

/**
 * ponytail: marked 출력은 sanitize-html을 거친 뒤 dangerouslySetInnerHTML로 들어간다.
 * repo 셋 중 na-man-mu-303-team2/Orbit은 팀 저장소(단독 소유가 아님)라 README 내용을
 * 신뢰할 수 없다고 보고, 태그/속성 allowlist + 커밋 SHA 고정(fetchReadme의 ref)으로 방어한다.
 */
export function renderReadme(md: string, repo: string, ref: string = "HEAD"): string {
  const html = marked.parse(md, { async: false }) as string;
  const rawBase = `https://raw.githubusercontent.com/${repo}/${ref}/`;
  const blobBase = `https://github.com/${repo}/blob/${ref}/`;
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "ul", "ol", "li", "blockquote", "hr",
      "pre", "code", "a", "strong", "em",
      "table", "thead", "tbody", "tr", "th", "td",
      "br", "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.src ? { src: resolve(attribs.src, rawBase) } : {}),
        },
      }),
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href ? { href: resolve(attribs.href, blobBase) } : {}),
          target: "_blank",
          rel: "noreferrer",
        },
      }),
    },
  });
}

export async function fetchReadme(
  repo: string,
  f: typeof fetch = fetch,
  ref: string = "HEAD",
): Promise<string> {
  let res: Response;
  try {
    res = await f(`https://raw.githubusercontent.com/${repo}/${ref}/README.md`, {
      next: { revalidate: 3600 },
    });
  } catch {
    return FALLBACK;
  }
  if (!res.ok) return FALLBACK;
  return renderReadme(await res.text(), repo, ref);
}
