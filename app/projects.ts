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
    // 팀 저장소라 단독 소유가 아님 — README 내용이 바뀌지 않도록 커밋 SHA에 고정한다.
    ref: "ff098b08775bd1645747e77b4949f75b50188ecb",
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
    name: "Jungle AI Mentor",
    kind: "개인 프로젝트",
    desc: "정글 학습자료 검색과 GitHub 코드 조회를 질문 유형에 따라 연결하는 RAG 기반 AI 멘토 서비스입니다.",
    roles: [
      "문서를 700자 단위·120자 중첩으로 나누고, pgvector 의미 검색과 단어 검색을 결합해 검색 정확도를 높였습니다.",
      "질문을 학습자료·FAQ·GitHub 코드·일반 답변으로 분기하고, 벡터 검색 실패 시 단어 검색으로 전환했습니다.",
    ],
    tech: ["React", "TypeScript", "NestJS", "PostgreSQL", "pgvector", "OpenAI API", "GitHub MCP"],
    repo: "LimJaeHwan-real/jungle-ai-mentor",
  },
  {
    name: "Mini SQL Processor / DBMS HTTP API",
    kind: "팀 프로젝트 (2명)",
    desc: "C 기반 인메모리 SQL 처리기와 B+Tree 인덱스를 동시 요청을 처리하는 HTTP API 서버로 확장한 팀 프로젝트입니다.",
    roles: [
      "공용 DB 서버 하네스와 HTTP 런타임을 구축하고, SQL 요청 파싱과 JSON 응답 처리를 구현했습니다.",
      "Thread Pool·제한 큐·Read·Write Lock·backpressure·metrics를 구현하고 단위·스모크 테스트를 구성했습니다.",
    ],
    tech: ["C", "HTTP/Socket", "B+Tree", "Thread Pool", "Read·Write Lock", "Backpressure"],
    repo: "Jungle-12-303/wk8-team4-sql-api",
    // 팀 저장소라 단독 소유가 아님 — README 내용이 바뀌지 않도록 커밋 SHA에 고정한다.
    ref: "080510e7f6bfb67ee2b3189264409c90b1c73ef0",
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
