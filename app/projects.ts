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
