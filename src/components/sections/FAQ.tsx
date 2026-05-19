import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

interface FAQProps {
  onAnalyzeStart?: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onAnalyzeStart }) => {
  return (
    <section id="faq" className="w-full min-h-[calc(100vh-96px)] py-40 bg-white border-t border-slate-100 flex flex-col items-center">
      <div className="w-full px-[20%] mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-6 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 text-brand rounded-full text-xs font-bold tracking-wider">
              FAQ
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              자주 묻는 질문
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">
              궁금하신 점이 있으신가요? TruthLens에 대한 자세한 정보를 확인해보세요.
            </p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 hidden lg:block space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Lock size={18} className="text-brand" /> 강력한 보안 및 프라이버시
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                업로드하신 모든 파일은 검증 즉시 서버에서 완전 삭제되며, AI 학습이나 외부에 절대 공유되지 않습니다.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-4">
            {[
              { q: "검증 결과는 100% 정확한가요?", a: "현재 TruthLens는 최신 AI 모델과 RAG 기술을 기반으로 높은 정확도를 제공하며 지속적으로 학습 중입니다. 단, 최종 의사결정 전 참고용으로 활용하시길 권장합니다." },
              { q: "기존 AI 탐지 서비스들과 무엇이 다른가요?", a: "단순히 AI 생성 여부만 따지는 기존 서비스와 달리, TruthLens는 공공 DB를 연동해 '맥락 조작'까지 탐지하며, 텍스트·이미지·동영상을 모두 지원하는 All-in-One 플랫폼입니다." },
              { q: "기업이나 공공기관에서도 도입할 수 있나요?", a: "네, TruthLens는 B2C 웹서비스뿐만 아니라 금융기관, 언론사, 정부기관을 위한 전용 SaaS 및 API/SDK 형태의 B2B 솔루션을 제공합니다." },
              { q: "업로드한 파일이나 개인정보는 안전한가요?", a: "업로드하신 모든 파일은 검증 즉시 서버에서 완전 삭제되며, AI 학습이나 외부에 절대 공유되지 않으므로 안심하고 사용하실 수 있습니다." }
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={0.1 * i}>
                <details className="group bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm transition-colors">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 text-lg">
                    {faq.q}
                    <span className="text-brand group-open:rotate-45 transition-transform text-2xl leading-none font-normal">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed font-medium text-base border-t border-slate-200/60 pt-4 mt-2">
                    {faq.a}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* 분석 유도 섹션 (디자인 및 문구 전면 개편) */}
      <div className="w-full bg-slate-900 py-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        </div>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                망설임 없는 진실 확인,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-cyan-300 to-white">
                  TruthLens와 함께 시작하세요.
                </span>
              </h3>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                인공지능이 팩트체크의 번거로움을 즉각적인 확신으로 바꿔드립니다.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onAnalyzeStart}
                className="group flex items-center justify-center gap-3 px-12 py-5 bg-white text-slate-950 hover:bg-brand-light hover:text-white rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-brand/20 hover:-translate-y-1"
              >
                무료로 분석 시작하기 <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-white font-bold text-2xl">HYBRID</div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">CNN + ViT</div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center">
                <div className="text-white font-bold text-2xl">REAL-TIME</div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">RAG 기술 기반</div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center">
                <div className="text-white font-bold text-2xl">SAFE</div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">데이터 보안</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQ;
