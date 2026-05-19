import React from 'react';
import { ShieldCheck, Mail } from 'lucide-react';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-8">
      <div className="w-full px-[20%] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} strokeWidth={2} className="text-brand" />
            <span className="font-bold text-lg text-zinc-900 tracking-tight">TruthLens</span>
          </div>
          <p className="text-zinc-500 text-sm">
            가짜뉴스 및 딥페이크 판별 AI 보안 솔루션
          </p>
        </div>

        {/* Developer Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm font-medium">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Developer</span>
            <span className="text-zinc-700 font-semibold">Song307</span>
          </div>

          <div className="h-px w-full sm:h-6 sm:w-px bg-zinc-200" />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <a
              href="mailto:ssongsyj0203@gmail.com"
              className="flex items-center gap-2 text-zinc-500 hover:text-brand transition-colors group"
            >
              <Mail size={16} className="text-zinc-400 group-hover:text-brand transition-colors" />
              <span>ssongsyj0203@gmail.com</span>
            </a>
            <a
              href="https://github.com/Song307"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
            >
              <GithubIcon className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full px-[20%] mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-xs text-zinc-400 flex items-center gap-1">
          <span className="text-amber-500">⚠️</span> 본 서비스의 검증 결과는 참고용이며, 법적 효력을 갖지 않습니다.
        </p>
        <p className="text-xs text-zinc-400">
          © 2026 TruthLens. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
