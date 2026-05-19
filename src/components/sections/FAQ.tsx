import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

interface FAQProps {
  onAnalyzeStart?: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onAnalyzeStart }) => {
  return (
    <section id="faq" className="w-full bg-white border-t border-slate-100 flex flex-col items-center">
      <div className="w-full px-[20%] py-40 mb-0">
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
              { 
                q: "검증 결과는 100% 정확한가요?", 
                a: "현재 텍스트 분석은 AI 모델을 통한 키워드 추출과 RAG(검색 증강 생성) 기술을 활용해 공공 DB와 실시간 교차 검증을 수행하므로 신뢰도가 매우 높습니다. 다만, 이미지와 동영상 분야는 현재 AI 전처리 모델이 구축된 단계로, 정밀한 판별을 위한 학습 데이터를 지속적으로 확보하고 있는 과정입니다. 점진적인 학습을 통해 정확도를 높여갈 예정입니다." 
              },
              { 
                q: "기사 분석 결과는 어떤 원리로 도출되나요?", 
                a: "단순히 문맥을 파악하는 것을 넘어, AI가 기사 내 핵심 키워드를 추출한 뒤 신뢰할 수 있는 공공 기관 DB 및 실시간 뉴스 데이터와 대조합니다. RAG(검색 증강 생성) 기술을 통해 사실 관계의 일치 여부를 수치화하여 객관적인 지표로 제공합니다." 
              },
              { 
                q: "이미지나 동영상 분석은 언제쯤 완벽해지나요?", 
                a: "현재 개발팀은 CNN과 ViT 하이브리드 모델의 성능 고도화에 집중하고 있습니다. 다양한 가짜 콘텐츠 데이터셋을 확보하고 있으며, 정기적인 모델 업데이트를 통해 판별 성능을 비기기적으로 향상시킬 계획입니다. 현재는 팩트체크 보완 용도로 활용하시기를 권장드립니다." 
              },
              { q: "업로드한 파일이나 개인정보는 안전한가요?", a: "업로드하신 모든 파일은 검증 즉시 서버에서 완전 삭제되며, AI 학습이나 외부에 절대 공유되지 않으므로 안심하고 사용하실 수 있습니다." }
            ].map((faq, i) => {
              const [isOpen, setIsOpen] = React.useState(false);
              return (
                <ScrollReveal key={i} delay={0.1 * i}>
                  <div className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-colors">
                    <button 
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 text-lg text-left"
                    >
                      {faq.q}
                      <motion.span 
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className="text-brand text-2xl leading-none font-normal"
                      >
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 text-slate-600 leading-relaxed font-medium text-base border-t border-slate-200/60 pt-4 mt-2">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollReveal>
              );
            })}
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
