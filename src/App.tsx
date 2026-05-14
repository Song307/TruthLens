import React, { useState } from 'react';
import { ShieldCheck, MessageSquareText, Image as ImageIcon, Loader2, Search, Film } from 'lucide-react';
import api from './api/axios';
import { AnalysisResponse, FactCheckData, MediaAnalysisData, VideoAnalysisData } from './types/analysis';
import ResultDetails from './components/ResultDetails';
import MediaUploader from './components/MediaUploader';
import VideoUploader from './components/VideoUploader';
import MediaResult from './components/MediaResult';
import VideoAnalysisResult from './components/VideoAnalysisResult';

const App: React.FC = () => {
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
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center p-6 md:p-12 z-0">
      {/* Background Effects */}
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-dark/20 via-dark to-dark"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/20 blur-[120px] rounded-full z-[-1]"></div>

      {/* 고정 헤더 */}
      <header className="mb-12 text-center relative z-10 mt-4">
        <div className="flex items-center justify-center gap-3 text-brand mb-3 animate-float">
          <ShieldCheck size={56} strokeWidth={2} className="drop-shadow-glow" />
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-glow">TruthLens</h1>
        </div>
        <p className="text-brand-light opacity-80 tracking-widest uppercase text-sm font-bold mt-2">AI Multimodal Fact-Checking System</p>
      </header>

      <main className="w-full max-w-3xl">
        {/* 탭 네비게이션 시스템 */}
        <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl mb-10 border border-white/10 shadow-lg gap-1 relative z-10">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'text' ? 'bg-brand/20 text-brand-light shadow-glow border border-brand/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquareText size={20} /> 텍스트
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'image' ? 'bg-brand/20 text-brand-light shadow-glow border border-brand/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon size={20} /> 이미지
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'video' ? 'bg-brand/20 text-brand-light shadow-glow border border-brand/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film size={20} /> 동영상
          </button>
        </div>

        {/* 탭별 컨텐츠 렌더링 */}
        <div className="min-h-[400px]">
          {activeTab === 'text' ? (
            /* --- 텍스트 분석 모드 --- */
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="group relative flex items-center z-10">
                <input
                  type="text"
                  className="w-full p-5 pr-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white/10 outline-none transition-all text-lg text-white placeholder-slate-500"
                  placeholder="검증할 뉴스 기사 URL을 입력하세요"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  onClick={handleTextAnalyze}
                  disabled={loading}
                  className="absolute right-2 p-3 bg-brand text-dark rounded-xl hover:bg-brand-light hover:shadow-glow active:scale-95 disabled:bg-white/10 disabled:text-slate-500 disabled:shadow-none transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
                </button>
              </div>

              {loading && (
                <div className="p-4 bg-white/5 border border-brand/30 rounded-2xl animate-in fade-in duration-300 z-10">
                  <p className="text-sm text-slate-300 text-center leading-relaxed">
                    <span className="text-brand font-semibold">분석 중입니다...</span> 네트워크 속도에 따라 <br/>
                    <span className="text-slate-400">몇 초에서 수십 초</span>가 소요될 수 있습니다.
                  </p>
                </div>
              )}

              {textResult && (
                <div className="glass-panel p-8 md:p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 z-10 relative">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-white leading-tight flex-1">{textResult.title}</h2>
                    <div className={`px-4 py-2 rounded-xl font-bold text-lg border backdrop-blur-md whitespace-nowrap ${
                      textResult.verdict === '진실' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                      textResult.verdict === '거짓' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {textResult.verdict}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">신뢰도 점수</span>
                      <span className="text-brand text-lg font-black drop-shadow-glow">{textResult.score}/100</span>
                    </div>
                    <div className="w-full bg-dark-border h-3 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-dark to-brand transition-all duration-1000 ease-out relative" 
                        style={{ width: `${textResult.score}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-lg mb-8">{textResult.summary}</p>
                  <ResultDetails data={textResult} />
                </div>
              )}
            </div>
          ) : activeTab === 'image' ? (
            /* --- 이미지 분석 모드 --- */
            <div className="space-y-10 animate-in fade-in duration-500">
              <MediaUploader onAnalyze={handleImageAnalyze} loading={loading} fileType="image" />
              {mediaResult && <MediaResult data={mediaResult} />}
            </div>
          ) : (
            /* --- 동영상 분석 모드 --- */
            <div className="space-y-10 animate-in fade-in duration-500 max-w-[512px] mx-auto">
              <VideoUploader onAnalyze={handleVideoAnalyze} loading={loading} />
              {videoResult && (
                <div className="glass-panel p-8 md:p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 z-10 relative">
                  <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                    <Film className="text-brand" /> 동영상 분석 결과
                  </h3>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">조작 감지 확률</span>
                      <span className="text-rose-400 font-black text-xl drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                        {Math.round(videoResult.overall_probability * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-border h-3 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-1000 ease-out relative" 
                        style={{ width: `${videoResult.overall_probability * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <VideoAnalysisResult data={videoResult} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;