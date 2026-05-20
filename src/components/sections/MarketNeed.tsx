import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';

const marketThreatItems = [
  {
    title: "딥페이크·가짜뉴스 문제 심각도",
    stat: "89.5%",
    bgText: "89.5%",
    subheadline: "국민 10명 중 9명이 심각하게 인식",
    headline: "일상 속으로 침투한 조작의 공포",
    desc: "압도적인 다수의 국민이 가짜뉴스와 딥페이크를 단순한 불편을 넘어 심각한 사회적 위협으로 체감하고 있습니다.",
    bgImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80",
    align: "left",
    barPercentage: 89.5,
  },
  {
    title: "진짜·가짜 구분 걱정",
    stat: "53%",
    bgText: "53%",
    subheadline: "스스로 판별 능력 부족 → AI 도구 필수",
    headline: "육안 검증의 한계와 불안감 증폭",
    desc: "정교해진 생성형 AI 기술로 인해 절반 이상의 국민이 스스로 진짜와 가짜를 구별할 수 없다는 깊은 불안을 느끼고 있습니다.",
    bgImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80",
    align: "right",
    barPercentage: 53,
  },
  {
    title: "뉴스 신뢰도",
    stat: "28%",
    bgText: "28%",
    subheadline: "46개국 중 41위 (최하위권)",
    headline: "무너져 내린 미디어 생태계의 신뢰",
    desc: "계속되는 가짜뉴스 논란으로 인해 한국의 뉴스 신뢰도는 조사 대상 46개국 중 41위라는 충격적인 수준에 머물러 있습니다.",
    bgImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80",
    align: "left",
    barPercentage: 28,
  },
  {
    title: "지능정보사회 부작용 1위",
    stat: "1위",
    bgText: "1위",
    subheadline: "생성형 AI 대중화 → 조작 진입장벽 붕괴",
    headline: "가짜뉴스·허위정보 유포의 일상화",
    desc: "누구나 클릭 몇 번으로 정교한 가짜뉴스를 생성하고 유포할 수 있게 되면서, 허위정보가 지능정보사회의 가장 큰 부작용 1위로 등극했습니다.",
    bgImage: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
    align: "right",
    barPercentage: 100,
  }
];

const MarketNeed: React.FC = () => {
  const [activeThreatIdx, setActiveThreatIdx] = useState<number>(0);
  const marketThreatRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: threatScrollProgress } = useScroll({
    target: marketThreatRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(threatScrollProgress, "change", (latest) => {
    if (latest < 0.25) setActiveThreatIdx(0);
    else if (latest < 0.5) setActiveThreatIdx(1);
    else if (latest < 0.75) setActiveThreatIdx(2);
    else setActiveThreatIdx(3);
  });

  const activeItem = marketThreatItems[activeThreatIdx];

  return (
    <section id="market-need" ref={marketThreatRef} className="w-full h-[350vh] relative bg-white border-t border-slate-100">
      {/* Sticky Scroll Slideshow Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center z-10">
        
        {/* 1. Background Text Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeThreatIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[120px] md:text-[250px] lg:text-[320px] font-black text-slate-100/80 tracking-tighter text-center whitespace-nowrap"
            >
              {activeItem.bgText}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. Interactive Card Content Layer */}
        <div className="w-full px-[10%] md:px-[20%] relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeThreatIdx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full flex flex-col gap-8 md:gap-16 items-center ${
                activeItem.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              {/* Large Image */}
              <div className="w-full lg:w-1/2 h-[300px] md:h-[450px] relative rounded-none overflow-hidden shadow-2xl border border-slate-200/60 group">
                <img
                  src={activeItem.bgImage}
                  alt={activeItem.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white z-10">
                  <span className="text-xs md:text-sm font-bold tracking-widest uppercase bg-rose-600/90 backdrop-blur-md px-3 py-1 rounded-full">
                    {activeItem.stat}
                  </span>
                  <span className="text-xs text-white/80 font-medium">TruthLens AI Fact-Check</span>
                </div>
              </div>

              {/* Text Details & Visual Bar Chart */}
              <div className="w-full lg:w-1/2 space-y-6 px-4 md:px-8 py-6">
                <div className="space-y-3">
                  <div className="text-4xl md:text-6xl font-black text-rose-600 tracking-tight">
                    {activeItem.stat}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {activeItem.title}
                  </h3>
                  <div className="text-lg md:text-xl font-bold text-slate-700">
                    {activeItem.subheadline}
                  </div>
                  <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed pt-2 border-t border-slate-200">
                    {activeItem.desc}
                  </p>
                </div>

                {/* Visual Bar Chart */}
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>심각도 지표 (Severity Index)</span>
                    <span>{activeItem.barPercentage}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <motion.div 
                      key={activeThreatIdx}
                      initial={{ width: 0 }}
                      animate={{ width: `${activeItem.barPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. Bottom Footer Source Credit */}
        <div className="absolute bottom-6 left-0 w-full px-[10%] md:px-[20%] text-center z-10">
          <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-relaxed">
            출처: 한국언론진흥재단(KPF), 딥페이크 관련 인식 조사 (2024) / 로이터 저널리즘 연구소 & 한국언론진흥재단, 디지털 뉴스 리포트 (2023/2024) / 방송통신위원회 & KISDI, 지능정보사회 이용자 패널조사 (2023/2024)
          </p>
        </div>

      </div>
    </section>
  );
};

export default React.memo(MarketNeed);
