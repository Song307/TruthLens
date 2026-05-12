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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12 font-sans">
      {/* 고정 헤더 */}
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 text-brand mb-2">
          <ShieldCheck size={48} strokeWidth={2.5} />
          <h1 className="text-5xl font-black tracking-tight text-brand">TruthLens</h1>
        </div>
        <p className="text-slate-500 text-lg font-medium">AI Multimodal Fact-Checking System</p>
      </header>

      <main className="w-full max-w-3xl">
        {/* 탭 네비게이션 시스템 */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-10 shadow-inner gap-1">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'text' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <MessageSquareText size={20} /> 텍스트
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'image' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ImageIcon size={20} /> 이미지
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'video' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
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
              <div className="group relative flex items-center">
                <input
                  type="text"
                  className="w-full p-5 pr-20 rounded-2xl border-2 border-slate-200 bg-white shadow-xl focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-lg"
                  placeholder="검증할 뉴스 기사 URL을 입력하세요"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  onClick={handleTextAnalyze}
                  disabled={loading}
                  className="absolute right-3 p-3 bg-brand text-white rounded-xl hover:bg-blue-900 active:scale-95 disabled:bg-slate-300 transition-all shadow-md"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
                </button>
              </div>

              {textResult && (
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 leading-tight flex-1">{textResult.title}</h2>
                    <div className={`ml-4 px-4 py-2 rounded-xl font-bold text-lg ${
                      textResult.verdict === '진실' ? 'bg-green-100 text-green-700' : 
                      textResult.verdict === '거짓' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {textResult.verdict}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold uppercase text-sm tracking-wider">
                      <span>신뢰도 점수</span>
                      <span className="text-brand">{textResult.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand transition-all duration-1000 ease-out" 
                        style={{ width: `${textResult.score}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg mb-8">{textResult.summary}</p>
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
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold mb-8 text-slate-800">동영상 분석 결과</h3>
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold uppercase text-sm tracking-wider">
                      <span>조작 감지 확률</span>
                      <span className="text-red-600 text-lg">{Math.round(videoResult.overall_probability * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-1000 ease-out" 
                        style={{ width: `${videoResult.overall_probability * 100}%` }}
                      />
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