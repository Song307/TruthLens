import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { PlayCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface FrameData {
  timestamp: string;
  probability: number;
  heatmap: string;
}

interface Props {
  data: {
    overall_probability: number;
    frames: FrameData[];
    analysis_note: string;
  };
}

const VideoAnalysisResult: React.FC<Props> = ({ data }) => {
  // 사용자가 선택한 프레임 인덱스 상태
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const currentFrame = data.frames[selectedFrameIdx];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors z-0"></div>
          <span className="text-sm font-bold text-slate-400 mb-1 z-10 uppercase tracking-widest">최대 조작 확률</span>
          <div className={`text-5xl font-black z-10 drop-shadow-glow ${data.overall_probability > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {data.overall_probability}%
          </div>
        </div>
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-glow z-10"><AlertCircle className="text-brand w-8 h-8" /></div>
          <div className="z-10">
            <h4 className="font-bold text-brand text-lg mb-1 tracking-wide">AI 분석 리포트</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{data.analysis_note}</p>
          </div>
        </div>
      </div>

      {/* 2. 타임라인 그래프 (확률 변화) */}
      <div className="glass-panel p-8 rounded-3xl relative">
        <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <PlayCircle size={24} className="text-brand drop-shadow-glow" /> 구간별 조작 가능성 추이
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data.frames} 
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setSelectedFrameIdx(e.activeTooltipIndex);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(17,24,39,0.9)', boxShadow: '0 0 20px rgba(0,229,255,0.2)', color: '#fff' }}
                cursor={{ stroke: '#00E5FF', strokeWidth: 2 }}
              />
              <ReferenceLine y={50} stroke="#FB7185" strokeDasharray="3 3" label={{ position: 'right', value: '위험', fill: '#FB7185', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="probability" 
                stroke="#00E5FF" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#0B0F19', strokeWidth: 2, stroke: '#00E5FF' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#00E5FF', filter: 'drop-shadow(0 0 10px #00E5FF)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6 tracking-wide">그래프의 포인트를 클릭하면 해당 시점의 히트맵을 확인할 수 있습니다.</p>
      </div>

      {/* 3. 특정 시점 히트맵 슬라이더/상세 */}
      <div className="glass-panel p-8 rounded-3xl">
        <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <ImageIcon size={24} className="text-brand drop-shadow-glow" /> <span className="text-brand-light">{currentFrame.timestamp}</span> 지점 상세 분석
        </h4>
        <div className="flex flex-col gap-8 items-center">
          <div className="w-full bg-dark-card rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative">
            <div className="absolute inset-0 bg-brand/5 pointer-events-none z-10"></div>
            <img 
              src={currentFrame.heatmap} 
              alt="Frame Analysis" 
              className="w-full h-auto object-contain max-h-[400px] z-0"
            />
          </div>
          <div className="w-full space-y-4">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand group-hover:shadow-[0_0_15px_rgba(0,229,255,1)] transition-shadow"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3">해당 프레임 확률</span>
              <div className="text-4xl font-black text-white mt-2 pl-3 drop-shadow-glow">{currentFrame.probability}%</div>
              <div className="w-full bg-dark-border h-3 rounded-full mt-4 overflow-hidden relative shadow-inner ml-3" style={{ width: 'calc(100% - 12px)' }}>
                <div 
                  className={`h-full transition-all duration-1000 relative ${currentFrame.probability > 50 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-brand-dark to-brand'}`}
                  style={{ width: `${currentFrame.probability}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-slate-600 pl-4 py-2">
              "본 프레임은 {currentFrame.timestamp} 초 지점에서 추출되었으며, <span className={currentFrame.probability > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{currentFrame.probability > 50 ? '특정 영역에서 인위적인 픽셀 왜곡이 감지되었습니다.' : '전반적으로 자연스러운 데이터 패턴을 유지하고 있습니다.'}</span>"
            </p>
          </div>
        </div>

        {/* 썸네일 슬라이더 (하단 네비게이션) */}
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {data.frames.map((frame, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFrameIdx(idx)}
              className={`flex-shrink-0 w-28 group transition-all duration-300 ${selectedFrameIdx === idx ? 'scale-105' : 'opacity-50 hover:opacity-100'}`}
            >
              <div className={`aspect-video rounded-xl overflow-hidden border-2 mb-2 transition-all ${selectedFrameIdx === idx ? 'border-brand shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'border-white/10 group-hover:border-white/30'}`}>
                <img src={frame.heatmap} className="w-full h-full object-cover" alt="" />
              </div>
              <span className={`text-[11px] font-bold tracking-wider ${selectedFrameIdx === idx ? 'text-brand drop-shadow-glow' : 'text-slate-500'}`}>
                {frame.timestamp}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisResult;