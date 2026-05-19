import React, { useState, useEffect } from 'react';
import { ShieldCheck, Code2 } from 'lucide-react';

interface HeaderProps {
  currentPage?: 'main' | 'analyze-text' | 'analyze-image' | 'analyze-video';
  onNavigate?: (page: 'main' | 'analyze-text' | 'analyze-image' | 'analyze-video') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'main', onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.75; // Approximate height of the hero section

      setIsAtTop(currentScrollY < 20);

      if (currentScrollY > heroHeight) {
        // Past hero section: show only when scrolling UP
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > lastScrollY + 5) {
          setIsVisible(false);
        }
      } else {
        // Inside hero section: always visible
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Determine container classes based on state
  // 1. isAtTop: transparent background, full width, white text
  // 2. !isAtTop && isVisible: floating bold glassmorphic pill, white text
  // 3. !isVisible: translate-y out of view
  const headerContainerClass = isAtTop
    ? 'fixed top-0 left-0 w-full h-16 bg-transparent border-b border-transparent z-50 transition-all duration-500'
    : `fixed left-[5%] w-[90%] md:left-[15%] md:w-[70%] h-16 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 transition-all duration-500 ${
        isVisible ? 'top-4 opacity-100 translate-y-0' : '-top-20 opacity-0 -translate-y-full'
      }`;

  const textColorClass = 'text-white';
  const navLinkClass = 'text-sm font-semibold text-slate-200 hover:text-white transition-colors drop-shadow-sm';

  return (
    <header className={headerContainerClass}>
      <div className={`w-full h-full flex items-center justify-between transition-all duration-500 ${isAtTop ? 'px-[10%] md:px-[20%]' : 'px-6 md:px-10'}`}>
        {/* Logo Area */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate?.('main')}>
          <ShieldCheck size={26} strokeWidth={2.5} className="text-cyan-400 group-hover:scale-110 transition-transform drop-shadow" />
          <span className={`font-black text-xl tracking-tight ${textColorClass} drop-shadow-md`}>TruthLens</span>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#market-need" onClick={() => onNavigate?.('main')} className={navLinkClass}>시장 문제점</a>
          <a href="#limitations" onClick={() => onNavigate?.('main')} className={navLinkClass}>기존 서비스 한계</a>
          <a href="#core-tech" onClick={() => onNavigate?.('main')} className={navLinkClass}>핵심 기술</a>
          <a href="#faq" onClick={() => onNavigate?.('main')} className={navLinkClass}>자주 묻는 질문</a>
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
            <Code2 size={22} className="drop-shadow" />
          </a>
          <button 
            onClick={() => onNavigate?.('analyze-text')}
            className="hidden md:block px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95 border border-white/20"
          >
            {currentPage === 'main' ? '분석 시작하기 →' : '다른 분석하기 →'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
