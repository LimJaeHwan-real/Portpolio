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
