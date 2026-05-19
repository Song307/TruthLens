import React, { useState, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, Image as ImageIcon, Loader2, Film, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
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

const MarketNeed = lazy(() => import('./components/sections/MarketNeed'));
const Limitations = lazy(() => import('./components/sections/Limitations'));
const CoreTech = lazy(() => import('./components/sections/CoreTech'));
const Applications = lazy(() => import('./components/sections/Applications'));
const FAQ = lazy(() => import('./components/sections/FAQ'));

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

  const [activeInfoSection, setActiveInfoSection] = useState<string>('market-need');
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  const scrollToStickyHeader = () => {
    if (stickyHeaderRef.current) {
      const topOffset = stickyHeaderRef.current.offsetTop;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
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
          if (subSection) {
            setActiveInfoSection(subSection);
            setTimeout(() => {
              scrollToStickyHeader();
            }, 50);
          }
        }} 
      />

      <main className="flex-grow w-full">
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

            {/* --- Sticky Section Header Framework (Tab Navigation Bar) --- */}
            <div ref={stickyHeaderRef} className="sticky top-0 z-40 w-full h-24 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all px-[10%] md:px-[20%] flex items-center justify-start overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-8 md:gap-12 text-base md:text-lg font-bold text-slate-400 tracking-tight whitespace-nowrap">
                {[
                  { id: 'market-need', label: '문제의 심각성' },
                  { id: 'limitations', label: '기존 서비스 한계' },
                  { id: 'core-tech', label: '핵심 기술' },
                  { id: 'applications', label: '적용 분야' },
                  { id: 'faq', label: '자주 묻는 질문' },
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

                  {activeInfoSection === 'applications' && (
                    <motion.div
                      key="applications"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-screen"
                    >
                      <Applications />
                    </motion.div>
                  )}

                  {activeInfoSection === 'faq' && (
                    <motion.div
                      key="faq"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-screen"
                    >
                      <FAQ />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Suspense>
            </div>
          </motion.div>
        ) : (
          /* Dedicated Analysis Page Container */
          <motion.div
            key="analysis-page"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full px-[10%] md:px-[20%] pt-28 pb-12 min-h-[70vh]"
          >
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
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;