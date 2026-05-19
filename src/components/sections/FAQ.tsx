import React from 'react';
import { Lock } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="w-full py-20 bg-white border-t border-slate-100">
      <div className="w-full px-[20%]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 text-center lg:text-left">
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
    </section>
  );
};

export default FAQ;
