import React from 'react';
import { ShieldCheck } from 'lucide-react';

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
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-zinc-500 hover:text-zinc-900 transition-colors">이용약관</a>
          <a href="#" className="text-zinc-500 hover:text-zinc-900 transition-colors">개인정보처리방침</a>
          <a href="#" className="text-zinc-500 hover:text-zinc-900 transition-colors">고객센터</a>
        </div>
      </div>
      
      <div className="w-full px-[20%] mt-8 pt-6 border-t border-zinc-100">
        <p className="text-xs text-zinc-400 flex items-center gap-1">
          <span className="text-amber-500">⚠️</span> 본 서비스의 검증 결과는 참고용이며, 법적 효력을 갖지 않습니다.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
