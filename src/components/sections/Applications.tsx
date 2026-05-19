import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';

const showcaseItems = [
  {
    title: "언론·미디어",
    headline: "가장 빠르고 정확한 AI 팩트체크",
    subheadline: "PRESS MEETING ROOM & FACT-CHECK",
    desc: "실시간으로 쏟아지는 뉴스 기사의 진위를 판별하고, 언론중재위 소송 및 신뢰도 추락을 방지합니다.",
    bgImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "금융·투자",
    headline: "1,400만 투자자를 위한 정보 보호",
    subheadline: "FINANCIAL MARKET SECURITY",
    desc: "허위 공시와 가짜뉴스로 인한 수천억 원의 시가총액 증발을 막고 안전한 투자 환경을 조성합니다.",
    bgImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "소셜 미디어",
    headline: "SNS 및 커뮤니티 정보의 진위 확인",
    subheadline: "SOCIAL MEDIA & COMMUNITY",
    desc: "SNS상의 가짜 뉴스나 커뮤니티에 변조되어 올라온 '짤방', 낚시성 게시글의 진위를 신속하게 파악합니다.",
    bgImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "디지털 창작",
    headline: "AI 생성 콘텐츠 및 저작권 보호",
    subheadline: "CREATIVE MEDIA & AI CONTENT",
    desc: "생성형 AI로 만든 이미지인지 확인하고, 창작물의 출처와 변조 여부를 투명하게 관리하여 저작권을 보호합니다.",
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
  }
];

const Applications: React.FC = () => {
  const [hoveredShowcase, setHoveredShowcase] = useState<number>(0);

  return (
    <>
      {/* --- TruthLens 적용 분야 및 서비스 영역 (Interactive Expanding Accordion Showcase) --- */}
      <section id="applications" className="w-full bg-slate-950 overflow-hidden">
        {/* Expanding Accordion Container */}
        <div className="w-full h-[710px] md:h-[960px] flex flex-col md:flex-row overflow-hidden bg-slate-950">
          {showcaseItems.map((item, idx) => {
            const isActive = hoveredShowcase === idx;
            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredShowcase(idx)}
                onClick={() => setHoveredShowcase(idx)}
                animate={{ 
                  flex: isActive ? 4 : 1
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
                className={`relative overflow-hidden cursor-pointer transition-colors duration-500 flex flex-col justify-between select-none group ${
                  isActive ? 'bg-slate-800' : 'bg-slate-900 hover:bg-slate-850'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
                  <img 
                    src={item.bgImage} 
                    alt={item.title} 
                    className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                      isActive ? 'scale-105 opacity-100' : 'scale-100 opacity-80 group-hover:opacity-90'
                    }`} 
                  />
                </div>

                {/* Top Header / Title Tab */}
                <div className="relative z-10 p-6 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-colors duration-500 ${
                      isActive ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                    }`}>
                      0{idx + 1}
                    </div>
                    <h3 className={`font-bold tracking-wider transition-all duration-500 whitespace-nowrap ${
                      isActive ? 'text-lg text-white font-black' : 'text-base text-slate-200'
                    }`}>
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Expanded Content */}
                <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full pointer-events-none overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-3 pointer-events-auto max-w-xl bg-slate-900/85 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl"
                      >
                        <div className="text-xs font-bold text-brand-light uppercase tracking-widest">{item.subheadline}</div>
                        <h4 className="text-xl md:text-3xl font-black text-white leading-tight">{item.headline}</h4>
                        <p className="text-slate-300 text-sm md:text-base line-clamp-2 font-medium leading-relaxed">{item.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- 5. 브랜드 강조 Quote --- */}
      <section className="w-full py-20 px-[20%] bg-[#F8FAFC]">
        <div className="w-full">
          <ScrollReveal>
            <div className="border-2 border-brand/20 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-[36px] p-12 md:p-16 relative shadow-2xl overflow-hidden text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="text-brand/40 text-8xl font-serif leading-none absolute top-6 left-12 select-none pointer-events-none">“</div>
              <p className="text-xl md:text-3xl font-bold text-white leading-relaxed mb-8 relative z-10 max-w-2xl mx-auto">
                복잡한 팩트체크 과정 전에 한 번 돌려보기에 딱 좋아요.<br />
                내가 본 시각 정보가 조작되었는지 바로 알 수 있거든요.
              </p>
              <div className="w-12 h-0.5 bg-brand mx-auto mb-6 relative z-10"></div>
              <p className="text-brand-light font-bold text-lg relative z-10">- 20대 대학생 체험단 후기</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default Applications;
