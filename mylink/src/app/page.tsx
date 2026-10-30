import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-indigo-500/25">
            M
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            MyLink
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/@alex.dev"
            className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            데모 프로필
          </Link>
          <Link
            href="/studio"
            className="text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition shadow-md shadow-indigo-500/25 transform hover:-translate-y-0.5"
          >
            스튜디오 열기 →
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-20 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-8 backdrop-blur-md">
          <span>✨</span>
          <span>모든 채널과 링크를 단 하나의 URL로 통합하세요</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-tight mb-6">
          나를 표현하는 가장 아름다운 <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            올인원 프로필 링크 허브
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed font-normal">
          포트폴리오, SNS, 기술 블로그, 유튜브 영상까지. <br className="hidden sm:inline" />
          실시간 스마트폰 미리보기가 탑재된 스튜디오에서 1분 만에 완성하고 즉시 공유하세요.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-16">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>🚀 내 링크 만들기 (스튜디오 체험)</span>
          </Link>

          <Link
            href="/@alex.dev"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm sm:text-base border border-zinc-800 transition flex items-center justify-center gap-2"
          >
            <span>📱 라이브 프로필 보기</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-16">
          <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg backdrop-blur-sm flex flex-col gap-2">
            <span className="text-2xl">📱</span>
            <h3 className="font-bold text-sm text-white">실시간 WYSIWYG 스튜디오</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              아이폰 프레임 속에서 변경 사항이 타이핑 즉시 반영되는 직관적인 2열 편집기.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg backdrop-blur-sm flex flex-col gap-2">
            <span className="text-2xl">🎨</span>
            <h3 className="font-bold text-sm text-white">6가지 하이엔드 테마</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              오로라, 네온 사이버, 선셋, 에메랄드 포레스트, 모노크롬, 펄 글래스 원클릭 전환.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg backdrop-blur-sm flex flex-col gap-2">
            <span className="text-2xl">📊</span>
            <h3 className="font-bold text-sm text-white">클릭 분석 & QR 코드 다운로드</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              어떤 링크가 가장 인기 있는지 실시간 CTR 집계와 고해상도 QR 다운로드 지원.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-xs text-zinc-500">
        <p>© 2026 MyLink. Built with Next.js 16, React 19 & Tailwind CSS v4.</p>
      </footer>
    </div>
  );
}
