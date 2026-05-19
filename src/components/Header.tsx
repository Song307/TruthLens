import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Code2, ChevronDown, MessageSquareText, ImageIcon, Film, AlertTriangle, XCircle, Zap, Layout, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  currentPage?: 'main' | 'analyze-text' | 'analyze-image' | 'analyze-video';
  onNavigate?: (page: 'main' | 'analyze-text' | 'analyze-image' | 'analyze-video', subSection?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'main', onNavigate }) => {
  const lastScrollY = useRef(0);
  const isAtTopRef = useRef(true);
  const isVisibleRef = useRef(true);

  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isFactCheckOpen, setIsFactCheckOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    // Reset refs on page mount/change
    lastScrollY.current = window.scrollY;
    isAtTopRef.current = window.scrollY < 20;
    setIsAtTop(window.scrollY < 20);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.75; // Approximate height of the hero section

      // 1. isAtTop State transition guard
      const nextIsAtTop = currentScrollY < 20;
      if (isAtTopRef.current !== nextIsAtTop) {
        isAtTopRef.current = nextIsAtTop;
        setIsAtTop(nextIsAtTop);
      }

      // 2. isVisible State transition guard
      let nextIsVisible = true;
      if (currentPage === 'main') {
        if (currentScrollY > heroHeight) {
          nextIsVisible = false;
        } else {
          nextIsVisible = true;
        }
      } else {
        if (currentScrollY > 100) {
          const lastScrollVal = lastScrollY.current;
          if (currentScrollY < lastScrollVal) {
            nextIsVisible = true;
          } else if (currentScrollY > lastScrollVal && currentScrollY > lastScrollVal + 5) {
            nextIsVisible = false;
          } else {
            nextIsVisible = isVisibleRef.current;
          }
        } else {
          nextIsVisible = true;
        }
      }

      if (isVisibleRef.current !== nextIsVisible) {
        isVisibleRef.current = nextIsVisible;
        setIsVisible(nextIsVisible);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Determine container classes based on state
  // 1. isAtTop: transparent background, full width, white text
  // 2. !isAtTop && isVisible: floating bold glassmorphic pill, white text
  // 3. !isVisible: translate-y out of view
  const headerContainerClass = isAtTop
    ? `fixed top-0 left-0 w-full h-16 ${currentPage === 'main' ? 'bg-transparent' : 'bg-slate-950'} border-b border-transparent z-50 transition-all duration-500 will-change-transform transform-gpu`
    : `fixed left-[5%] w-[90%] md:left-[15%] md:w-[70%] h-16 rounded-full ${currentPage === 'main' ? 'bg-slate-900/90' : 'bg-slate-950/90'} backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 transition-all duration-500 will-change-[transform,backdrop-filter] transform-gpu ${
        isVisible ? 'top-4 opacity-100 translate-y-0' : '-top-20 opacity-0 -translate-y-full'
      }`;

  const textColorClass = 'text-white';
  const navLinkClass = 'text-sm font-semibold text-slate-200 hover:text-white transition-colors drop-shadow-sm cursor-pointer';

  return (
    <header className={headerContainerClass}>
      <div className={`w-full h-full flex items-center justify-between transition-all duration-500 will-change-transform transform-gpu ${isAtTop ? 'px-[10%] md:px-[20%]' : 'px-6 md:px-10'}`}>
        {/* Logo Area */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate?.('main')}>
          <ShieldCheck size={26} strokeWidth={2.5} className="text-cyan-400 group-hover:scale-110 transition-transform drop-shadow" />
          <span className={`font-black text-xl tracking-tight ${textColorClass} drop-shadow-md`}>TruthLens</span>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Fact Check Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsFactCheckOpen(true)}
            onMouseLeave={() => setIsFactCheckOpen(false)}
          >
            <button className={`${navLinkClass} flex items-center gap-1 group/btn`}>
              팩트 체크 
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-300 ${isFactCheckOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {isFactCheckOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 p-2 border rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] overflow-hidden transition-colors duration-500 ${
                    (isAtTop && currentPage === 'main') 
                      ? 'bg-slate-900/40 backdrop-blur-2xl border-white/20' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {isAtTop && currentPage === 'main' && (
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  )}
                  
                  <div className="relative z-10 grid gap-1">
                    <button
                      onClick={() => { onNavigate?.('analyze-text'); setIsFactCheckOpen(false); }}
                      className={`flex items-center gap-4 w-full p-4 rounded-[18px] transition-all group/item text-left ${
                        (isAtTop && currentPage === 'main') ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-all group-hover/item:scale-110 ${
                        (isAtTop && currentPage === 'main') ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
                      }`}>
                        <MessageSquareText size={20} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${
                          (isAtTop && currentPage === 'main') ? 'text-white' : 'text-slate-900'
                        }`}>기사 분석</div>
                        <div className={`text-[11px] font-medium ${
                          (isAtTop && currentPage === 'main') ? 'text-slate-400' : 'text-slate-500'
                        }`}>뉴스 URL 및 텍스트 검증</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onNavigate?.('analyze-image'); setIsFactCheckOpen(false); }}
                      className={`flex items-center gap-4 w-full p-4 rounded-[18px] transition-all group/item text-left ${
                        (isAtTop && currentPage === 'main') ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-all group-hover/item:scale-110 ${
                        (isAtTop && currentPage === 'main') ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-fuchsia-50 text-fuchsia-600'
                      }`}>
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${
                          (isAtTop && currentPage === 'main') ? 'text-white' : 'text-slate-900'
                        }`}>이미지 분석</div>
                        <div className={`text-[11px] font-medium ${
                          (isAtTop && currentPage === 'main') ? 'text-slate-400' : 'text-slate-500'
                        }`}>이미지 위변조 및 AI 탐지</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onNavigate?.('analyze-video'); setIsFactCheckOpen(false); }}
                      className={`flex items-center gap-4 w-full p-4 rounded-[18px] transition-all group/item text-left ${
                        (isAtTop && currentPage === 'main') ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-all group-hover/item:scale-110 ${
                        (isAtTop && currentPage === 'main') ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600'
                      }`}>
                        <Film size={20} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${
                          (isAtTop && currentPage === 'main') ? 'text-white' : 'text-slate-900'
                        }`}>동영상 분석</div>
                        <div className={`text-[11px] font-medium ${
                          (isAtTop && currentPage === 'main') ? 'text-slate-400' : 'text-slate-500'
                        }`}>딥페이크 및 영상 조작 분석</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Service Intro Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsIntroOpen(true)}
            onMouseLeave={() => setIsIntroOpen(false)}
          >
            <button className={`${navLinkClass} flex items-center gap-1 group/btn`}>
              서비스 소개 
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-300 ${isIntroOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {isIntroOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 p-2 border rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] overflow-hidden transition-colors duration-500 ${
                    (isAtTop && currentPage === 'main') 
                      ? 'bg-slate-900/40 backdrop-blur-2xl border-white/20' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="relative z-10 grid gap-1">
                    {[
                      { id: 'market-need', label: '문제의 심각성', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
                      { id: 'limitations', label: '기존 서비스 한계', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
                      { id: 'core-tech', label: '핵심 기술', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { onNavigate?.('main', item.id); setIsIntroOpen(false); }}
                        className={`flex items-center gap-4 w-full p-4 rounded-[18px] transition-all group/item text-left ${
                          (isAtTop && currentPage === 'main') ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl transition-all group-hover/item:scale-110 ${
                          (isAtTop && currentPage === 'main') ? `${item.bg} ${item.color}` : `bg-slate-100 ${item.color.replace('-400', '-600')}`
                        }`}>
                          <item.icon size={20} />
                        </div>
                        <div className={`text-sm font-bold ${
                          (isAtTop && currentPage === 'main') ? 'text-white' : 'text-slate-900'
                        }`}>{item.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#applications" onClick={(e) => { e.preventDefault(); onNavigate?.('main', 'applications'); }} className={navLinkClass}>적용 분야</a>
          
          {/* Support Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsSupportOpen(true)}
            onMouseLeave={() => setIsSupportOpen(false)}
          >
            <button className={`${navLinkClass} flex items-center gap-1 group/btn`}>
              고객 지원 
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-300 ${isSupportOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {isSupportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`absolute top-full right-0 mt-4 w-60 p-2 border rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] overflow-hidden transition-colors duration-500 ${
                    (isAtTop && currentPage === 'main') 
                      ? 'bg-slate-900/40 backdrop-blur-2xl border-white/20' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="relative z-10 grid gap-1">
                    <button
                      onClick={() => { onNavigate?.('main', 'faq'); setIsSupportOpen(false); }}
                      className={`flex items-center gap-4 w-full p-4 rounded-[18px] transition-all group/item text-left ${
                        (isAtTop && currentPage === 'main') ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-all group-hover/item:scale-110 ${
                        (isAtTop && currentPage === 'main') ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        <HelpCircle size={20} />
                      </div>
                      <div className={`text-sm font-bold ${
                        (isAtTop && currentPage === 'main') ? 'text-white' : 'text-slate-900'
                      }`}>자주 묻는 질문</div>
                    </button>

                    <button
                      onClick={() => { alert('문의하기 기능은 준비 중입니다.'); setIsSupportOpen(false); }}
                      className={`flex items-center gap-4 w-full p-4 rounded-[18px] transition-all group/item text-left ${
                        (isAtTop && currentPage === 'main') ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-all group-hover/item:scale-110 ${
                        (isAtTop && currentPage === 'main') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        <MessageSquareText size={20} />
                      </div>
                      <div className={`text-sm font-bold ${
                        (isAtTop && currentPage === 'main') ? 'text-white' : 'text-slate-900'
                      }`}>문의하기</div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
            <Code2 size={22} className="drop-shadow" />
          </a>
          <button 
            onClick={() => onNavigate?.('analyze-text')}
            className="hidden md:block px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95 border border-white/20 cursor-pointer"
          >
            {currentPage === 'main' ? '분석 시작하기 →' : '다른 분석하기 →'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
