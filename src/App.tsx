import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { MessageSquareText, Image as ImageIcon, Loader2, Search, Film, UploadCloud, Cpu, FileCheck, ArrowRight, ArrowLeft, TrendingDown, ShieldAlert, Users, FileWarning, Database, Layers, CheckCircle2, XCircle, ChevronRight, Sparkles, Activity, Lock, RefreshCw, Check } from 'lucide-react';
import api from './api/axios';
import { AnalysisResponse, FactCheckData, MediaAnalysisData, VideoAnalysisData } from './types/analysis';
import ResultDetails from './components/ResultDetails';
import MediaUploader from './components/MediaUploader';
import VideoUploader from './components/VideoUploader';
import MediaResult from './components/MediaResult';
import VideoAnalysisResult from './components/VideoAnalysisResult';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import titleBgImage from './assets/TL_Title_background.png';

const App: React.FC = () => {
  // 현재 SPA 페이지 상태
  const [currentPage, setCurrentPage] = useState<'main' | 'analyze-text' | 'analyze-image' | 'analyze-video'>('main');

  // 포털 아이템 정의
  const portalItems = [
    {
      id: 'text',
      title: '기사 분석',
      subtitle: 'ARTICLE & TEXT',
      desc: '뉴스 기사 URL이나 의심되는 텍스트를 입력하여 RAG 기반 공공 DB와 실시간 교차 검증합니다.',
      icon: MessageSquareText,
      badgeBg: 'bg-white/10 text-cyan-300 border-white/20',
      hoverBorder: 'hover:border-cyan-400/50 hover:shadow-[0_8px_32px_rgba(6,182,212,0.25)]',
      textColor: 'text-cyan-300',
      action: () => { setActiveTab('text'); setCurrentPage('analyze-text'); }
    },
    {
      id: 'image',
      title: '이미지 분석',
      subtitle: 'IMAGE & SYNTHESIS',
      desc: '조작이 의심되는 이미지를 업로드하여 CNN+ViT 하이브리드 모델로 픽셀 왜곡을 탐지합니다.',
      icon: ImageIcon,
      badgeBg: 'bg-white/10 text-fuchsia-300 border-white/20',
      hoverBorder: 'hover:border-fuchsia-400/50 hover:shadow-[0_8px_32px_rgba(217,70,239,0.25)]',
      textColor: 'text-fuchsia-300',
      action: () => { setActiveTab('image'); setCurrentPage('analyze-image'); }
    },
    {
      id: 'video',
      title: '동영상 분석',
      subtitle: 'VIDEO & DEEPFAKE',
      desc: '딥페이크 영상이나 조작 파일을 업로드하여 3D-CNN 모델로 시공간 일관성을 정밀 분석합니다.',
      icon: Film,
      badgeBg: 'bg-white/10 text-rose-300 border-white/20',
      hoverBorder: 'hover:border-rose-400/50 hover:shadow-[0_8px_32px_rgba(244,63,94,0.25)]',
      textColor: 'text-rose-300',
      action: () => { setActiveTab('video'); setCurrentPage('analyze-video'); }
    }
  ];

  // 탭 상태 및 공통 로딩 상태
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video'>('text');
  const [loading, setLoading] = useState<boolean>(false);
  
  // 텍스트 분석 관련 상태
  const [url, setUrl] = useState<string>('');
  const [textResult, setTextResult] = useState<FactCheckData | null>(null);

  // 이미지 분석 관련 상태
  const [mediaResult, setMediaResult] = useState<MediaAnalysisData | null>(null);

  // 동영상 분석 관련 상태
  const [videoResult, setVideoResult] = useState<VideoAnalysisData | null>(null);

  // 기존 서비스 한계 탭 선택 상태
  const [selectedTool, setSelectedTool] = useState<number>(0);

  // 적용 분야 아코디언 쇼케이스 호버 상태
  const [hoveredShowcase, setHoveredShowcase] = useState<number>(0);
  const [hoveredThreat, setHoveredThreat] = useState<number>(0);

  // 설문조사 기반 사회적 위협 스크롤 스토리텔링 상태
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

  // [기능 1] 텍스트 분석 핸들러
  const handleTextAnalyze = async () => {
    if (!url) return alert('URL을 입력해주세요.');
    setLoading(true);
    setTextResult(null); // 이전 결과 초기화
    try {
      const response = await api.post<AnalysisResponse<FactCheckData>>('/analyze/text', { url });
      setTextResult(response.data.data);
    } catch (error) {
      console.error('텍스트 분석 실패:', error);
      alert('텍스트 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // [기능 2] 이미지 분석 핸들러 (Multipart/Form-data)
  const handleImageAnalyze = async (file: File) => {
    setLoading(true);
    setMediaResult(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<AnalysisResponse<MediaAnalysisData>>('/analyze/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMediaResult(response.data.data);
    } catch (error) {
      console.error('이미지 분석 실패:', error);
      alert('이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // [기능 3] 동영상 분석 핸들러 (Multipart/Form-data)
  const handleVideoAnalyze = async (file: File) => {
    setLoading(true);
    setVideoResult(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<AnalysisResponse<VideoAnalysisData>>('/analyze/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setVideoResult(response.data.data);
    } catch (error) {
      console.error('동영상 분석 실패:', error);
      alert('동영상 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      title: "공공·정부",
      headline: "국가적 허위 정보 및 딥페이크 대응",
      subheadline: "PUBLIC SECTOR & OFFICIAL DB",
      desc: "korea.kr 등 정부 공식 브리핑 DB와 연동하여 국가 안보와 사회적 혼란을 야기하는 조작을 차단합니다.",
      bgImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
    },
    {
      title: "엔터·SNS",
      headline: "유명인 사칭 및 초상권 완벽 보호",
      subheadline: "CELEBRITY & SOCIAL MEDIA",
      desc: "유명인 사칭 딥페이크 사기 및 불법 합성물을 실시간으로 탐지하여 개인과 브랜드의 명예를 지킵니다.",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    },
    {
      title: "기업 보안",
      headline: "전용 SaaS 및 API/SDK 솔루션",
      subheadline: "ENTERPRISE B2B INTEGRATION",
      desc: "기업 내부망 및 기존 서비스에 TruthLens의 강력한 AI 검증 엔진을 손쉽게 연동할 수 있습니다.",
      bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    }
  ];

  return (
    <div className="min-h-screen relative flex flex-col bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans">
      <Header currentPage={currentPage} onNavigate={(page) => setCurrentPage(page)} />

      <main className="flex-grow w-full">
        {currentPage === 'main' ? (
          <>
            {/* --- 1. Centered Hero Section + Portal Buttons --- */}
            <section className="w-full relative min-h-[calc(100vh-96px)] pt-24 pb-12 flex flex-col items-center justify-center text-center overflow-hidden">
              {/* Static Background Layer (Fixed image with default blue filter overlay) */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none bg-slate-950">
                {/* 1. Static Background Image */}
                <img 
                  src={titleBgImage} 
                  alt="Title Background" 
                  className="w-full h-full object-cover absolute inset-0 blur-[6px] scale-[1.35] opacity-80"
                />
                {/* 2. Default Blue Filter & Tint Overlay */}
                <div className="absolute inset-0 w-full h-full bg-blue-600/40 mix-blend-color" />
                {/* 3. Dimming & Contrast overlay for perfect text readability */}
                <div className="absolute inset-0 w-full h-full bg-slate-950/65 backdrop-blur-[2px]" />
              </div>

              {/* Title Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full px-[10%] md:px-[20%] mb-8 md:mb-12"
              >
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold text-white mb-6 backdrop-blur-md shadow-lg drop-shadow">
                  <Sparkles size={16} className="animate-pulse text-cyan-300" />
                  가짜뉴스 및 딥페이크 판별 AI 보안 솔루션
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.2] mb-6 drop-shadow-md">
                  진짜와 가짜의 경계를 허무는<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white drop-shadow">
                    AI 보안 솔루션, TruthLens.
                  </span>
                </h1>
                <p className="text-slate-200 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-0 drop-shadow">
                  연간 30조 원에 달하는 가짜뉴스 피해. <br />
                  일상 속 딥페이크부터 금융·언론의 허위 정보까지 All-in-One으로 즉시 검증하세요.
                </p>
              </motion.div>

              {/* 3-Column Minimalist Verification Navigation Grid */}
              <div className="w-full max-w-5xl mx-auto px-4 md:px-8 z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center justify-center">
                  {portalItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-center p-4">
                      <motion.div
                        whileHover={{ y: -6, scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={item.action}
                        className="w-48 h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center gap-4 cursor-pointer group transition-all duration-500 border border-transparent hover:border-white/40 hover:bg-white/10 hover:backdrop-blur-md hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)]"
                      >
                        {/* Pure Floating Icon (No border or box by default) */}
                        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
                          <item.icon size={56} className="text-white drop-shadow-md" />
                        </div>
                        
                        {/* Minimalist Title (Reduced font size) */}
                        <h3 className="text-lg md:text-xl font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors drop-shadow-md">
                          {item.title}
                        </h3>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- Sticky Section Header Framework --- */}
            <div className="sticky top-0 z-40 w-full h-24 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all px-[10%] md:px-[20%] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-black text-xl md:text-2xl text-slate-900 tracking-tight">TruthLens 검증 포털</span>
                <span className="hidden md:inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full">AI Security</span>
              </div>
              <div className="flex items-center gap-6 text-base font-bold text-slate-600">
                <a href="#market-need" className="hover:text-brand transition-colors">문제의 심각성</a>
                <a href="#applications" className="hover:text-brand transition-colors">핵심 영역</a>
                <a href="#architecture" className="hover:text-brand transition-colors">기술 아키텍처</a>
              </div>
            </div>

        {/* --- 2. 시장 및 사회적 문제점 (Market Need) Section -> Kakao-style Natural Vertical Scroll Storytelling --- */}
        <section id="market-need" ref={marketThreatRef} className="w-full relative bg-white border-t border-slate-100 overflow-hidden">
          
          {/* Sticky Background Text Container (Stays fixed in the center of the viewport while scrolling through this section) */}
          <div className="sticky top-0 w-full h-screen flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeThreatIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[120px] md:text-[250px] lg:text-[320px] font-black text-slate-100/80 tracking-tighter text-center whitespace-nowrap"
              >
                {marketThreatItems[activeThreatIdx].bgText}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Vertical Stacked Content Container (Placed over the sticky background) */}
          <div className="relative z-10 -mt-[100vh]">
            
            {/* Top Section Header */}
            <div className="w-full px-[20%] pt-20 mb-12">
              <ScrollReveal>
                <div className="text-left max-w-4xl">
                  <div className="inline-block px-4 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-full text-xs font-bold mb-4 tracking-wider">
                    MARKET THREAT
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    설문조사로 본 문제의 심각성
                  </h2>
                  <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
                    아래 조사 결과는 가짜뉴스·딥페이크 문제가 이미 전 국민적 과제임을 명확히 보여줍니다.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* 4 Vertical Sections Stacked */}
            <div className="space-y-32 md:space-y-48 pb-32">
              {marketThreatItems.map((item, idx) => (
                <div key={idx} className="min-h-[80vh] flex items-center justify-center w-full px-[20%]">
                  <motion.div
                    initial={{ opacity: 0, y: 120 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full flex flex-col gap-8 md:gap-16 items-center ${
                      item.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    }`}
                  >
                    {/* Large Image sliding up naturally from below */}
                    <div className="w-full lg:w-1/2 h-[350px] md:h-[500px] relative rounded-none overflow-hidden shadow-2xl border border-slate-200/60 group">
                      <img
                        src={item.bgImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white z-10">
                        <span className="text-xs md:text-sm font-bold tracking-widest uppercase bg-rose-600/90 backdrop-blur-md px-3 py-1 rounded-full">
                          {item.stat}
                        </span>
                        <span className="text-xs text-white/80 font-medium">TruthLens AI Fact-Check</span>
                      </div>
                    </div>

                    {/* Text Details & Visual Bar Chart (No background card, no border, sits directly on background) */}
                    <div className="w-full lg:w-1/2 space-y-6 px-4 md:px-8 py-6">
                      <div className="space-y-3">
                        <div className="text-4xl md:text-6xl font-black text-rose-600 tracking-tight">
                          {item.stat}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                          {item.title}
                        </h3>
                        <div className="text-lg md:text-xl font-bold text-slate-700">
                          {item.subheadline}
                        </div>
                        <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed pt-2 border-t border-slate-200">
                          {item.desc}
                        </p>
                      </div>

                      {/* Visual Bar Chart representing the statistic */}
                      <div className="space-y-2 pt-4">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <span>심각도 지표 (Severity Index)</span>
                          <span>{item.barPercentage}%</span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.barPercentage}%` }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Bottom Footer Source Credit */}
            <div className="w-full px-[20%] border-t border-slate-100 pt-6 pb-12">
              <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed text-center md:text-left">
                출처: 한국언론진흥재단(KPF), 딥페이크 관련 인식 조사 (2024) / 로이터 저널리즘 연구소 & 한국언론진흥재단, 디지털 뉴스 리포트 (2023/2024) / 방송통신위원회 & KISDI, 지능정보사회 이용자 패널조사 (2023/2024)
              </p>
            </div>
          </div>
        </section>

        {/* --- 3. 기존 서비스의 한계 (Limitations) Section -> Interactive Tabbed Showcase --- */}
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

        {/* --- 4. TruthLens 3대 핵심 기술 (Core Tech) Section -> Alternating Rows (Zig-Zag) --- */}
        <section id="core-tech" className="w-full py-20 bg-white border-t border-slate-100">
          <div className="w-full px-[20%]">
            <ScrollReveal>
              <div className="text-center mb-20">
                <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 text-brand rounded-full text-xs font-bold mb-4 tracking-wider">
                  CORE TECHNOLOGIES
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">
                  진짜와 가짜를 구별하는 TruthLens 3대 핵심 기술
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium">
                  텍스트, 이미지, 동영상 각 분야에 특화된 최첨단 AI 모델을 결합하여 독보적인 검증 정확도를 달성합니다.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-20">
              {/* Row 1: Text Verification */}
              <ScrollReveal delay={0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-[36px] border border-slate-200/60">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-brand font-black text-xs rounded-full shadow-sm tracking-widest">TECH 01</div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 text-brand shrink-0">
                        <Database size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900">텍스트 검증</h3>
                        <p className="text-brand font-bold text-sm md:text-base mt-1">RAG 기반 교차 검증 DB</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                      korea.kr 등 공공 DB 및 신뢰할 수 있는 공식 언론 보도와 실시간으로 대조하여 기사의 진위 여부와 정밀한 Fact-score를 산출합니다. 오염된 웹 검색 결과를 배제하여 환각(Hallucination)을 원천 차단합니다.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#공공DB연동</span>
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#실시간팩트스코어</span>
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#환각원천차단</span>
                    </div>
                  </div>
                  <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="font-bold text-slate-900 flex items-center gap-2"><RefreshCw size={18} className="text-brand animate-spin" /> RAG Pipeline</span>
                      <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">실시간 연동 중</span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">정부 공식 브리핑 DB (korea.kr)</span>
                        <Check size={18} className="text-emerald-500" />
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">주요 언론사 팩트체크 보도망</span>
                        <Check size={18} className="text-emerald-500" />
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">법원 판결문 및 통계청 자료</span>
                        <Check size={18} className="text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Row 2: Image Verification (Reversed) */}
              <ScrollReveal delay={0.2}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-[36px] border border-slate-200/60">
                  <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6 order-2 lg:order-1">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="font-bold text-slate-900 flex items-center gap-2"><Activity size={18} className="text-brand" /> Hybrid Detection</span>
                      <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-brand rounded-full border border-blue-200">CNN + ViT</span>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 p-6 text-white flex flex-col items-center justify-center min-h-[200px] text-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-overlay"></div>
                      <Layers size={48} className="text-brand mb-4 animate-bounce" />
                      <div className="font-bold text-lg mb-1">Grad-CAM 히트맵 활성화</div>
                      <div className="text-xs text-slate-400">픽셀 단위 조작 지점 및 전체 맥락 왜곡 동시 탐지</div>
                    </div>
                  </div>
                  <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                    <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-brand font-black text-xs rounded-full shadow-sm tracking-widest">TECH 02</div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 text-brand shrink-0">
                        <Layers size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900">이미지 검증</h3>
                        <p className="text-brand font-bold text-sm md:text-base mt-1">CNN + ViT 하이브리드 탐지</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                      미세한 픽셀 왜곡을 탐지하는 CNN과 전체 맥락을 이해하는 ViT를 결합하여 조작 의심 지점을 Grad-CAM 히트맵으로 직관적으로 시각화합니다. 생성형 AI가 만든 가짜 이미지뿐만 아니라 정교한 합성 사진까지 완벽히 판별합니다.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#픽셀왜곡탐지</span>
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#Grad-CAM시각화</span>
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#하이브리드AI</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Row 3: Video Verification */}
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-[36px] border border-slate-200/60">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-brand font-black text-xs rounded-full shadow-sm tracking-widest">TECH 03</div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 text-brand shrink-0">
                        <Cpu size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900">동영상 검증</h3>
                        <p className="text-brand font-bold text-sm md:text-base mt-1">3D-CNN 시공간 일관성 분석</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                      영상 프레임 간의 시공간적 흐름과 입모양의 부자연스러움을 3차원 AI 모델로 분석하여 정교한 딥페이크 조작까지 완벽하게 탐지합니다. 초 단위 구간별 확률 추이 그래프와 히트맵을 제공하여 조작 시점을 한눈에 파악할 수 있습니다.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#3D-CNN</span>
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#시공간일관성</span>
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#프레임정밀분석</span>
                    </div>
                  </div>
                  <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="font-bold text-slate-900 flex items-center gap-2"><Film size={18} className="text-brand" /> Frame Analysis</span>
                      <span className="text-xs font-bold px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-200">위험 감지</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>00:12 지점 프레임</span>
                          <span className="text-rose-500">89.4% 조작 의심</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 w-[89%]"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>00:25 지점 프레임</span>
                          <span className="text-emerald-500">12.1% 정상</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[12%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* --- TruthLens 적용 분야 및 서비스 영역 (Interactive Expanding Accordion Showcase) --- */}
        <section id="applications" className="w-full py-24 bg-white text-slate-900 overflow-hidden border-t border-slate-100">
          {/* Section Header (인터랙션 영역 바깥 상단 좌측) */}
          <div className="w-full px-[20%] mb-12">
            <ScrollReveal>
              <div className="text-left max-w-4xl">
                <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 text-brand rounded-full text-xs font-bold mb-4 tracking-wider">
                  APPLICATION FIELDS
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                  사회 전반의 신뢰를 재구축하는 5대 핵심 영역
                </h2>
                <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
                  언론 보도부터 금융, 공공 안보까지 TruthLens의 AI 검증 엔진이 활약하는 주요 분야를 확인해보세요.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Expanding Accordion Container (Full Width edge-to-edge) */}
          <div className="w-full h-[700px] md:h-[950px] flex flex-col md:flex-row overflow-hidden bg-slate-950">
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
                  {/* Background Image (Pure 100% photo, NO gradient mask) */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
                    <img 
                      src={item.bgImage} 
                      alt={item.title} 
                      className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                        isActive ? 'scale-105 opacity-100' : 'scale-100 opacity-80 group-hover:opacity-90'
                      }`} 
                    />
                  </div>

                  {/* Top Header / Title Tab (Inside Card - Floating Glassmorphism Pill for readability over pure photos) */}
                  <div className="relative z-10 p-6 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-colors duration-500 ${
                        isActive ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                      }`}>
                        0{idx + 1}
                      </div>
                      <h3 className={`font-bold tracking-wider transition-all duration-500 whitespace-nowrap ${
                        isActive ? 'text-lg text-white font-black' : 'text-base text-slate-200 md:rotate-0'
                      }`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Expanded Content (Floating Glassmorphism Panel for readability over pure photos) */}
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

        {/* --- 5. 브랜드 강조 Quote -> Elegant Minimalist Card --- */}
        <section className="w-full py-20 px-[20%] bg-[#F8FAFC]">
          <div className="w-full">
            <ScrollReveal>
              <div className="border-2 border-brand/20 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-[36px] p-12 md:p-16 relative shadow-2xl overflow-hidden text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="text-brand/40 text-8xl font-serif leading-none absolute top-6 left-12 select-none pointer-events-none">“</div>
                <p className="text-xl md:text-3xl font-bold text-white leading-relaxed mb-8 relative z-10 max-w-2xl mx-auto">
                  복잡한 팩트체크 과정 전에 한 번 돌려보기에 딱 좋아요.<br />
                  내가 본 정보가 조작되었는지 바로 알 수 있거든요.
                </p>
                <div className="w-12 h-0.5 bg-brand mx-auto mb-6 relative z-10"></div>
                <p className="text-brand-light font-bold text-lg relative z-10">- 20대 대학생 체험단 후기</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* --- 6. 자주 묻는 질문 -> 2-Column Split --- */}
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
          </>
        ) : (
          /* Dedicated Analysis Page Container */
          <div className="w-full px-[20%] py-12 animate-in fade-in duration-300 min-h-[70vh]">
            {/* Back to Main Button */}
            <button 
              onClick={() => setCurrentPage('main')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all font-bold text-sm mb-8 shadow-sm cursor-pointer"
            >
              <ArrowLeft size={18} /> 메인 페이지로 돌아가기
            </button>

            {/* Page Header & Uploader Box */}
            <div className="bg-white rounded-[36px] p-8 md:p-12 border border-slate-200 shadow-xl mb-12">
              <div className="max-w-3xl">
                {currentPage === 'analyze-text' && (
                  <>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand font-bold text-xs mb-4">
                      <MessageSquareText size={16} /> ARTICLE & TEXT VERIFICATION
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">뉴스 기사 및 텍스트 AI 검증</h1>
                    <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-8">
                      의심되는 뉴스 기사의 URL 주소를 입력해주세요. TruthLens AI가 실시간으로 RAG 기반 공공 DB 및 신뢰할 수 있는 언론사 보도망과 대조하여 팩트체크를 진행합니다.
                    </p>

                    {/* Input Box */}
                    <div className="relative flex items-center mb-6">
                      <input
                        type="text"
                        className="w-full p-5 pr-32 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white shadow-inner focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-lg text-slate-900 placeholder-slate-400 font-medium"
                        placeholder="URL을 붙여넣기 해주세요 (예: https://news.naver.com/...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      <button
                        onClick={handleTextAnalyze}
                        disabled={loading}
                        className="absolute right-2.5 px-6 py-3.5 bg-brand text-white rounded-xl hover:bg-blue-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-md flex items-center gap-2 font-bold text-base cursor-pointer"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /><span>검증하기</span></>}
                      </button>
                    </div>
                  </>
                )}

                {currentPage === 'analyze-image' && (
                  <>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-bold text-xs mb-4">
                      <ImageIcon size={16} /> IMAGE & SYNTHESIS VERIFICATION
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">이미지 조작 및 합성 AI 검증</h1>
                    <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-8">
                      조작이나 딥페이크 합성이 의심되는 이미지를 업로드해주세요. CNN과 ViT 하이브리드 탐지 엔진이 픽셀 단위의 미세한 왜곡과 전체 맥락을 분석합니다.
                    </p>
                    <MediaUploader onAnalyze={handleImageAnalyze} loading={loading} fileType="image" />
                  </>
                )}

                {currentPage === 'analyze-video' && (
                  <>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs mb-4">
                      <Film size={16} /> VIDEO & DEEPFAKE VERIFICATION
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">동영상 및 딥페이크 AI 검증</h1>
                    <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-8">
                      딥페이크 조작이 의심되는 동영상 파일을 업로드해주세요. 3D-CNN 시공간 일관성 분석 모델이 프레임 간의 흐름과 부자연스러움을 정밀 탐지합니다.
                    </p>
                    <VideoUploader onAnalyze={handleVideoAnalyze} loading={loading} />
                  </>
                )}

                {loading && (
                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in duration-300 mt-6">
                    <p className="text-base text-brand text-center font-bold flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin" size={24} /> AI 보안 엔진이 실시간으로 교차 검증 및 정밀 분석을 진행 중입니다...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            {currentPage === 'analyze-text' && textResult && (
              <ScrollReveal>
                <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-slate-200/80 mb-12">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight flex-1">{textResult.title}</h2>
                    <div className={`px-5 py-2.5 rounded-full font-bold text-lg border whitespace-nowrap ${
                      textResult.verdict === '진실' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                      textResult.verdict === '거짓' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {textResult.verdict}
                    </div>
                  </div>
                  
                  <div className="mb-10 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200/60">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-600 font-bold uppercase tracking-wider text-sm md:text-base">신뢰도 점수 (Truth Score)</span>
                      <span className="text-slate-900 font-black text-3xl">{textResult.score} <span className="text-slate-400 text-xl font-medium">/ 100</span></span>
                    </div>
                    <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand transition-all duration-1000 ease-out" 
                        style={{ width: `${textResult.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-lg md:text-xl mb-10 font-medium">
                    {textResult.summary}
                  </p>
                  <ResultDetails data={textResult} />
                </div>
              </ScrollReveal>
            )}

            {currentPage === 'analyze-image' && mediaResult && (
              <ScrollReveal>
                <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-slate-200/80 mb-12">
                  <h3 className="text-2xl md:text-3xl font-black mb-8 text-slate-900 flex items-center gap-3">
                    <ImageIcon className="text-brand" size={32} /> 이미지 분석 결과
                  </h3>
                  <MediaResult data={mediaResult} />
                </div>
              </ScrollReveal>
            )}

            {currentPage === 'analyze-video' && videoResult && (
              <ScrollReveal>
                <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-slate-200/80 mb-12">
                  <h3 className="text-2xl md:text-3xl font-black mb-8 text-slate-900 flex items-center gap-3">
                    <Film className="text-brand" size={32} /> 동영상 분석 결과
                  </h3>
                  
                  <div className="mb-10 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200/60">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-600 font-bold uppercase tracking-wider text-sm md:text-base">조작 감지 확률</span>
                      <span className="text-rose-500 font-black text-3xl">
                        {Math.round(videoResult.overall_probability * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-1000 ease-out" 
                        style={{ width: `${videoResult.overall_probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <VideoAnalysisResult data={videoResult} />
                </div>
              </ScrollReveal>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;