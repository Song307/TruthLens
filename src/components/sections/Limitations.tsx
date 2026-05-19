import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, XCircle, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const toolsData = [
  { 
    title: "Hive Moderation (글로벌 1위)", 
    limitation: "이미지·영상의 AI 생성 확률만 판별할 뿐, 진짜 사진을 다른 맥락으로 사용하는 '맥락 조작'은 전혀 탐지하지 못합니다.",
    solution: "공공 DB 및 신뢰할 수 있는 언론 보도와 실시간 교차 검증하여 맥락 조작까지 완벽히 잡아냅니다."
  },
  { 
    title: "DeepBrain AI / Intel FakeCatcher", 
    limitation: "혈류 변화·픽셀 왜곡 분석으로 딥페이크를 판별하지만, B2B 전용으로 일반 사용자가 뉴스 URL을 입력해 종합 검증하는 UX는 제공하지 않습니다.",
    solution: "일반 사용자도 클릭 한 번으로 텍스트, 이미지, 동영상을 모두 검증할 수 있는 직관적인 All-in-One UX를 제공합니다."
  },
  { 
    title: "Perplexity / ChatGPT", 
    limitation: "기사 요약 및 검색이 가능하나, 오염된 검색 결과를 그대로 신뢰해 가짜뉴스가 검색 상단에 있으면 '사실'이라고 오답을 냅니다.",
    solution: "korea.kr 등 검증된 정부·공공기관 DB 및 공식 보도만을 타겟팅하는 고도화된 RAG 기술로 환각(Hallucination)을 원천 차단합니다."
  },
  { 
    title: "SNU 팩트체크 / 커뮤니티 노트", 
    limitation: "언론인·유저의 직접 교차 검증 방식이지만, 100% 수동 작업에 의존해 실시간으로 쏟아지는 가짜뉴스를 즉시 차단하지 못합니다.",
    solution: "AI 자동화 분석 모델을 통해 실시간으로 접수되는 허위 정보를 단 몇 초 만에 신속하게 판별합니다."
  }
];

const Limitations: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<number>(0);

  return (
    <section id="limitations" className="w-full py-20 bg-[#F8FAFC] border-t border-slate-100">
      <div className="w-full px-[20%]">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 text-brand rounded-full text-xs font-bold mb-4 tracking-wider">
              LIMITATIONS & SOLUTION
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">
              기존 팩트체크 도구들의 치명적인 사각지대
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium">
              시장에는 이미 다양한 검증 도구가 존재하지만, 실시간성과 종합적인 맥락 파악에서 명확한 한계를 갖습니다.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Selector Tabs */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">비교 대상 서비스 선택</h3>
            {toolsData.map((tool, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTool(idx)}
                className={`w-full text-left p-6 rounded-3xl transition-all border flex items-center justify-between ${
                  selectedTool === idx 
                    ? 'bg-white border-brand shadow-lg text-brand font-black translate-x-2' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 font-bold'
                }`}
              >
                <span className="text-base md:text-lg">{tool.title}</span>
                <ChevronRight size={24} className={`transition-transform ${selectedTool === idx ? 'text-brand translate-x-1' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>

          {/* Right Column: Dynamic Display Box */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[36px] border border-slate-200 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTool}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-10 z-10"
              >
                {/* Service Title Badge */}
                <div>
                  <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider mb-3 inline-block">분석 대상 서비스</span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900">{toolsData[selectedTool].title}</h3>
                </div>

                {/* Limitation Box */}
                <div className="p-8 bg-rose-50/60 border border-rose-100 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2.5 text-rose-600 font-bold text-base">
                    <XCircle size={22} /> 기존 방식의 결정적 한계점
                  </div>
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium pl-8">
                    {toolsData[selectedTool].limitation}
                  </p>
                </div>

                {/* Solution Box */}
                <div className="p-8 bg-blue-50 border border-blue-100 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2.5 text-brand font-bold text-base">
                    <CheckCircle2 size={22} /> TruthLens의 혁신적 해결책
                  </div>
                  <p className="text-slate-900 text-base md:text-lg leading-relaxed font-bold pl-8">
                    {toolsData[selectedTool].solution}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Limitations;
