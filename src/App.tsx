import React, { useState, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, Image as ImageIcon, Loader2, Film, ArrowRight, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';
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
import titleBgImage from './assets/TL_Title_background.webp';

const MarketNeed = lazy(() => import('./components/sections/MarketNeed'));
const Limitations = lazy(() => import('./components/sections/Limitations'));
const CoreTech = lazy(() => import('./components/sections/CoreTech'));
const Applications = lazy(() => import('./components/sections/Applications'));
const FAQ = lazy(() => import('./components/sections/FAQ'));

const App: React.FC = () => {
  // 현재 SPA 페이지 상태
  const [currentPage, setCurrentPage] = React.useState<'main' | 'analyze-text' | 'analyze-image' | 'analyze-video'>('main');

  React.useLayoutEffect(() => {
    if (currentPage !== 'main') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // 포털 아이템 정의
  const portalItems = [
    {
      id: 'text',
      title: '기사 분석',
      subtitle: 'ARTICLE & TEXT',
      desc: '뉴스 기사 URL이나 의심되는 텍스트를 입력하여 RAG 기반 공공 DB와 실시간 교차 검증합니다.',
      icon: MessageSquareText,
      hoverTextColor: 'group-hover:text-cyan-300',
      arrowColor: 'text-cyan-300',
      action: () => { 
        setActiveTab('text'); 
        setCurrentPage('analyze-text'); 
      }
    },
    {
      id: 'image',
      title: '이미지 분석',
      subtitle: 'IMAGE & SYNTHESIS',
      desc: '조작이 의심되는 이미지를 업로드하여 CNN+ViT 하이브리드 모델로 픽셀 왜곡을 탐지합니다.',
      icon: ImageIcon,
      hoverTextColor: 'group-hover:text-fuchsia-300',
      arrowColor: 'text-fuchsia-300',
      action: () => { 
        setActiveTab('image'); 
        setCurrentPage('analyze-image'); 
      }
    },
    {
      id: 'video',
      title: '동영상 분석',
      subtitle: 'VIDEO & DEEPFAKE',
      desc: '딥페이크 영상이나 조작 파일을 업로드하여 3D-CNN 모델로 시공간 일관성을 정밀 분석합니다.',
      icon: Film,
      hoverTextColor: 'group-hover:text-rose-300',
      arrowColor: 'text-rose-300',
      action: () => { 
        setActiveTab('video'); 
        setCurrentPage('analyze-video'); 
      }
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

  const [activeInfoSection, setActiveInfoSection] = useState<string>('market-need');
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  const scrollToStickyHeader = () => {
    const stickyElement = document.getElementById('sticky-header');
    if (stickyElement) {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const elementRect = stickyElement.getBoundingClientRect();
      const absoluteTop = elementRect.top + scrollY;

      window.scrollTo({
        top: absoluteTop,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'smooth' });
    }
  };

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



  return (
    <div className="min-h-screen relative flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      <Header 
        currentPage={currentPage} 
        onNavigate={(page, subSection) => {
          setCurrentPage(page);
          
          if (page !== 'main') {
            window.scrollTo({ top: 0});
            return;
          }

          if (subSection) {
            // Only update activeInfoSection if moving between internal tabs (market-need, limitations, core-tech)
            const isInternalTab = ['market-need', 'limitations', 'core-tech'].includes(subSection);
            if (isInternalTab) {
              setActiveInfoSection(subSection);
            }
            
            // Wait for potential layout changes and force scroll to target
            setTimeout(() => {
              const targetId = subSection === 'applications' ? 'applications' : (subSection === 'faq' ? 'faq' : 'sticky-header');
              const targetElement = document.getElementById(targetId);
              
              if (targetElement) {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                const elementRect = targetElement.getBoundingClientRect();
                const absoluteTop = elementRect.top + scrollY;
                
                window.scrollTo({
                  top: absoluteTop,
                  behavior: 'smooth'
                });
              }
            }, 300);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }} 
      />

      <main className="flex-grow w-full flex flex-col">
        <AnimatePresence mode="wait">
          {currentPage === 'main' ? (
            <motion.div
              key="main-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* --- 1. Centered Hero Section + Portal Buttons --- */}
            <section className="w-full relative min-h-[calc(100vh-96px)] pt-24 pb-12 flex flex-col items-center justify-center text-center overflow-hidden">
              {/* Static Background Layer (Fixed image with default blue filter overlay) */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none bg-slate-950">
                {/* 1. Static Background Image (Pre-blurred WebP for optimal rendering) */}
                <img 
                  src={titleBgImage} 
                  alt="Title Background" 
                  className="w-full h-full object-cover absolute inset-0 opacity-80 will-change-transform transform-gpu"
                />
                {/* 2. Default Blue Filter & Tint Overlay */}
                <div className="absolute inset-0 w-full h-full bg-blue-600/40 mix-blend-color" />
                {/* 3. Dimming & Contrast overlay for perfect text readability (No backdrop-blur needed since WebP is pre-blurred) */}
                <div className="absolute inset-0 w-full h-full bg-slate-950/70" />
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
              <div className="w-full max-w-3xl mx-auto px-4 md:px-8 z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center justify-center">
                  {portalItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-center p-4">
                      <motion.div
                        whileHover={{ y: -6 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={item.action}
                        className="w-48 h-40 md:w-52 md:h-44 flex flex-col items-center justify-center gap-5 cursor-pointer group transition-all duration-300"
                      >
                        {/* Pure Floating Icon (No border or box by default) */}
                        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
                          <item.icon size={56} className="text-white drop-shadow-md" />
                        </div>
                        
                        {/* Title with Arrow effect on Hover */}
                        <div className="flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-105">
                          <h3 className={`text-lg md:text-xl font-bold text-white tracking-wide transition-colors duration-300 drop-shadow-md ${item.hoverTextColor}`}>
                            {item.title}
                          </h3>
                          <ArrowRight 
                            size={18} 
                            className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out drop-shadow-md ${item.arrowColor}`} 
                          />
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- Info Sub-Section Wrapper (Container for Sticky Header) --- */}
            <div className="relative w-full">
              {/* --- Sticky Section Header Framework (Tab Navigation Bar) --- */}
              <div id="sticky-header" ref={stickyHeaderRef} className="sticky top-0 z-40 w-full h-24 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all px-[10%] md:px-[20%] flex items-center justify-start overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-8 md:gap-12 text-base md:text-lg font-bold text-slate-400 tracking-tight whitespace-nowrap">
                  {[
                    { id: 'market-need', label: '문제의 심각성' },
                    { id: 'limitations', label: '기존 서비스 한계' },
                    { id: 'core-tech', label: '핵심 기술' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveInfoSection(tab.id);
                        scrollToStickyHeader();
                      }}
                      className={`py-2 border-b-2 font-black transition-all cursor-pointer ${
                        activeInfoSection === tab.id
                          ? 'text-slate-900 border-slate-900 scale-105'
                          : 'border-transparent hover:text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- Dynamic Info Sub-Section Display --- */}
              <div className="w-full min-h-screen bg-white">
                <Suspense fallback={
                  <div className="w-full h-screen flex items-center justify-center bg-white">
                    <Loader2 className="animate-spin text-brand" size={48} />
                  </div>
                }>
                  <AnimatePresence mode="wait">
                    {activeInfoSection === 'market-need' && (
                      <motion.div
                        key="market-need"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-screen"
                      >
                        <MarketNeed />
                      </motion.div>
                    )}

                    {activeInfoSection === 'limitations' && (
                      <motion.div
                        key="limitations"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-screen"
                      >
                        <Limitations />
                      </motion.div>
                    )}

                    {activeInfoSection === 'core-tech' && (
                      <motion.div
                        key="core-tech"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-screen"
                      >
                        <CoreTech />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Suspense>
              </div>
            </div>

            {/* --- Static Content below Dynamic Tabs (Moved outside the sticky container) --- */}
            <div className="w-full bg-white">
              <Suspense fallback={null}>
                <Applications />
                <FAQ onAnalyzeStart={() => {
                   setActiveTab('text');
                   setCurrentPage('analyze-text');
                }} />
              </Suspense>
            </div>
          </motion.div>
        ) : (
          /* Dedicated Analysis Page Container */
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full px-[10%] md:px-[20%] pt-20 pb-16 bg-white relative overflow-hidden flex flex-col justify-center flex-grow"
          >
            {/* Background Light Effects (Softened for Light Mode) */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Page Header Area */}
            <div className="w-full mb-8 relative z-10">
              {currentPage === 'analyze-text' && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-600 font-bold text-xs mb-6 tracking-widest uppercase"
                  >
                    <MessageSquareText size={16} /> ARTICLE & TEXT VERIFICATION
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                    진실을 가리는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">텍스트 데이터</span> 분석
                  </h1>
                  <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
                    의심되는 뉴스 URL이나 문장을 입력하세요. TruthLens AI가 실시간으로 수억 개의 데이터셋과 대조하여 사실 여부를 확인합니다.
                  </p>
                </>
              )}

              {currentPage === 'analyze-image' && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-600 font-bold text-xs mb-6 tracking-widest uppercase"
                  >
                    <ImageIcon size={16} /> IMAGE & SYNTHESIS VERIFICATION
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                    픽셀 단위의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600">조작 흔적</span> 추적
                  </h1>
                  <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed mb-6">
                    이미지를 업로드하여 위변조 여부를 확인하세요. 육안으로 식별 불가능한 미세한 노이즈와 아티팩트를 AI가 잡아냅니다.
                  </p>
                  
                  {/* Warning Alert Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-700 text-left text-sm md:text-base font-medium w-full"
                  >
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800">안내: </span>
                      현재 이미지 분석은 AI 전처리 모델만 구현된 상태로, 학습 데이터가 부족하여 정확도가 낮습니다. 정밀 모델과 대용량 데이터셋은 추후 업데이트 예정입니다.
                    </div>
                  </motion.div>
                </>
              )}

              {currentPage === 'analyze-video' && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs mb-6 tracking-widest uppercase"
                  >
                    <Film size={16} /> VIDEO & DEEPFAKE VERIFICATION
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                    딥페이크 <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">시공간 일관성</span> 분석
                  </h1>
                  <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed mb-6">
                    프레임 간의 미세한 떨림과 부자연스러운 움직임을 탐지합니다. 최첨단 3D-CNN 모델이 영상의 진위를 정밀 판별합니다.
                  </p>

                  {/* Warning Alert Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-700 text-left text-sm md:text-base font-medium w-full"
                  >
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800">안내: </span>
                      현재 동영상 분석은 AI 전처리 모델만 구현된 상태로, 학습 데이터가 부족하여 정확도가 낮습니다. 정밀 모델과 대용량 데이터셋은 추후 업데이트 예정입니다.
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* Analysis Box */}
            <div className="relative z-10">
              <div className="bg-white rounded-[32px] p-6 md:p-10 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all overflow-hidden group">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-slate-50 rounded-full blur-3xl transition-all group-hover:bg-slate-100" />
                
                <div className="relative z-10">
                  {currentPage === 'analyze-text' && (
                    <div className="space-y-6">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-6 pr-40 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500/50 shadow-sm focus:ring-4 focus:ring-cyan-500/5 outline-none transition-all text-xl text-slate-900 placeholder-slate-400 font-medium"
                          placeholder="URL을 입력하거나 문장을 붙여넣으세요..."
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                        <button
                          onClick={handleTextAnalyze}
                          disabled={loading}
                          className="absolute right-3 top-3 bottom-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 active:scale-95 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 font-bold text-lg cursor-pointer"
                        >
                          {loading ? <Loader2 className="animate-spin" size={24} /> : <><ArrowRight size={24} /><span>분석</span></>}
                        </button>
                      </div>
                    </div>
                  )}

                  {currentPage === 'analyze-image' && (
                    <MediaUploader onAnalyze={handleImageAnalyze} loading={loading} fileType="image" />
                  )}

                  {currentPage === 'analyze-video' && (
                    <VideoUploader onAnalyze={handleVideoAnalyze} loading={loading} />
                  )}

                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 p-6 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex flex-col items-center justify-center gap-4"
                    >
                      <div className="flex items-center gap-3 text-cyan-400 font-bold text-lg">
                        <Loader2 className="animate-spin" size={28} />
                        AI 엔진이 정밀 분석을 수행 중입니다...
                      </div>
                      <div className="w-full max-w-md bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-cyan-500"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Display Area */}
            <div className="mt-12 relative z-10">
              {currentPage === 'analyze-text' && textResult && (
                <ScrollReveal>
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-slate-200/60 shadow-[0_30px_60px_rgba(15,23,42,0.04)] mb-12 overflow-hidden group">
                    {/* Decorative Color Glow */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />

                    {/* Header Area */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 text-cyan-600 shrink-0">
                          <MessageSquareText size={28} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest block mb-0.5">TEXT FACT-CHECK REPORT</span>
                          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{textResult.title}</h2>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-emerald-600 text-xs font-black uppercase tracking-wider shrink-0">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        COMPLETED
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100/60">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-slate-500 font-medium text-sm md:text-base">
                          <span className="flex items-center gap-1.5"><Sparkles size={16} className="text-cyan-600" /> 분석 완료</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span>RAG 기반 교차 검증</span>
                        </div>
                      </div>
                      <div className={`px-6 py-2.5 rounded-2xl font-black text-lg border shrink-0 transition-all ${
                        textResult.verdict === '진실' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.08)]' : 
                        textResult.verdict === '거짓' ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.08)]' : 
                        'bg-amber-500/10 border-amber-500/20 text-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                      }`}>
                        판정 결과: {textResult.verdict}
                      </div>
                    </div>
                    
                    <div className="mb-8 bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 relative overflow-hidden group shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">신뢰도 점수 (Truth Score)</span>
                          <span className="text-slate-900 font-black text-3xl">{textResult.score} <span className="text-slate-400 text-xl font-medium">/ 100</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${textResult.score}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${
                              textResult.score >= 70 ? 'from-emerald-500 to-cyan-500' : 
                              textResult.score >= 40 ? 'from-amber-500 to-orange-500' : 
                              'from-rose-500 to-red-600'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="max-w-none">
                      <p className="text-slate-800 leading-relaxed text-lg md:text-xl mb-10 font-medium bg-white p-6 rounded-3xl border-l-4 border-cyan-500 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                        {textResult.summary}
                      </p>
                    </div>

                    <ResultDetails data={textResult} />
                  </div>
                </ScrollReveal>
              )}

              {currentPage === 'analyze-image' && mediaResult && (
                <ScrollReveal>
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-slate-200/60 shadow-[0_30px_60px_rgba(15,23,42,0.04)] mb-12 overflow-hidden group">
                    {/* Decorative Color Glow */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-[90px] pointer-events-none" />

                    {/* Header Area */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-fuchsia-500/5 rounded-2xl border border-fuchsia-500/10 text-fuchsia-600 shrink-0">
                          <ImageIcon size={28} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest block mb-0.5">IMAGE FORENSIC REPORT</span>
                          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            이미지 정밀 분석 결과
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-emerald-600 text-xs font-black uppercase tracking-wider shrink-0">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        COMPLETED
                      </div>
                    </div>

                    <MediaResult data={mediaResult} />
                  </div>
                </ScrollReveal>
              )}

              {currentPage === 'analyze-video' && videoResult && (
                <ScrollReveal>
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-slate-200/60 shadow-[0_30px_60px_rgba(15,23,42,0.04)] mb-12 overflow-hidden group">
                    {/* Decorative Color Glow */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-rose-500/5 rounded-full blur-[90px] pointer-events-none" />

                    {/* Header Area */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-500/5 rounded-2xl border border-rose-500/10 text-rose-600 shrink-0">
                          <Film size={28} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-0.5">VIDEO DEEPFAKE REPORT</span>
                          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            동영상 딥페이크 분석 결과
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-emerald-600 text-xs font-black uppercase tracking-wider shrink-0">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        COMPLETED
                      </div>
                    </div>

                    <div className="mb-8 bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">최종 조작 감지 확률</span>
                          <span className="text-rose-600 font-black text-3xl">
                            {(videoResult.overall_probability).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${videoResult.overall_probability * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600"
                          />
                        </div>
                      </div>
                    </div>

                    <VideoAnalysisResult data={videoResult} />
                  </div>
                </ScrollReveal>
              )}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;