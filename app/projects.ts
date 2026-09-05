export type Project = {
  name: string;
  kind: string;
  desc: string;
  roles: string[];
  tech: string[];
  /** "owner/repo" 형태 */
  repo: string;
  /** README를 가져올 커밋/브랜치. 기본값 "HEAD" — 팀 저장소처럼 내용을 신뢰할 수 없으면 커밋 SHA로 고정한다 */
  ref?: string;
  /** 있을 때만 "▶ 영상 보기" 버튼이 렌더된다 */
  videoUrl?: string;
  /** 있을 때만 "↗ 사이트 보기" 버튼이 렌더된다 (배포된 라이브 서비스 주소) */
  siteUrl?: string;
};

export const projects: Project[] = [
  {
    name: "Orbit",
    kind: "팀 프로젝트",
    desc: "발표자료 생성, 편집, 리허설 코칭, 실전 발표를 하나의 서비스로 연결하는 팀 프로젝트입니다.",
    roles: [
      "빌드·문법 검사·테스트를 자동 실행하는 CI를 GitHub Actions로 구축해, 문제 있는 코드가 merge 전에 걸러지게 했습니다.",
      "커밋 단위로 버전을 추적하는 EC2·CloudFront 자동 배포 파이프라인을 구축하고, 배포 전후 정상 동작을 자동 검증해 잘못된 배포가 사용자에게 노출되지 않게 했습니다.",
    ],
    tech: ["React", "TypeScript", "NestJS", "PostgreSQL"],
    repo: "na-man-mu-303-team2/Orbit",
    // 팀 저장소라 단독 소유가 아님 — README 내용이 바뀌지 않도록 커밋 SHA에 고정한다.
    ref: "ff098b08775bd1645747e77b4949f75b50188ecb",
    videoUrl: "https://www.youtube.com/watch?v=A8zEN_jbdo8&t=324s",
  },
  {
    name: "Jungle AI Mentor",
    kind: "개인 프로젝트",
    desc: "정글 학습자료 검색과 GitHub 코드 조회를 질문 유형에 따라 연결하는 RAG 기반 AI 멘토 서비스입니다.",
    roles: [
      "문서를 700자 단위·120자 중첩으로 나누고, pgvector 의미 검색과 단어 검색을 결합해 검색 정확도를 높였습니다.",
      "질문을 학습자료·FAQ·GitHub 코드·일반 답변으로 분기하고, 벡터 검색 실패 시 단어 검색으로 전환했습니다.",
    ],
    tech: ["React", "TypeScript", "NestJS", "PostgreSQL"],
    repo: "LimJaeHwan-real/jungle-ai-mentor",
  },
  {
    name: "Mini Redis",
    kind: "팀 프로젝트",
    desc: "Python으로 구현한 인메모리 키-값 저장소입니다.",
    roles: [
      "여러 클라이언트를 동시에 처리하는 TCP 서버를 만들고, 쓰기 요청을 한 줄로 세워 순서대로 처리해 동시 쓰기에도 데이터가 꼬이지 않게 설계했습니다.",
      "변경 기록을 파일에 남겨 재시작 시 복원하는 AOF 복구와 TTL 자동 만료를 구현하고, MongoDB와 응답 속도·처리량을 비교하는 벤치마크로 성능을 검증했습니다.",
    ],
    tech: ["Python"],
    repo: "LimJaeHwan-real/redis",
  },
];

export const skills: { name: string; items: string[] }[] = [
  { name: "Language", items: ["Python", "TypeScript", "JavaScript", "C"] },
  { name: "Frontend", items: ["React"] },
  { name: "Backend", items: ["NestJS"] },
  { name: "DevOps", items: ["Docker", "Redis"] },
];
