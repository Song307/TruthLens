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
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-slate-400 mb-1">최대 조작 확률</span>
          <div className={`text-4xl font-black ${data.overall_probability > 50 ? 'text-red-500' : 'text-green-500'}`}>
            {data.overall_probability}%
          </div>
        </div>
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-3xl text-white flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl"><AlertCircle className="text-brand-light" /></div>
          <div>
            <h4 className="font-bold text-brand-light">AI 분석 리포트</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{data.analysis_note}</p>
          </div>
        </div>
      </div>

      {/* 2. 타임라인 그래프 (확률 변화) */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PlayCircle size={20} className="text-brand" /> 구간별 조작 가능성 추이
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
              />
              <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '위험', fill: '#ef4444', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="probability" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">그래프의 포인트를 클릭하면 해당 시점의 히트맵을 확인할 수 있습니다.</p>
      </div>

      {/* 3. 특정 시점 히트맵 슬라이더/상세 */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ImageIcon size={20} className="text-brand" /> {currentFrame.timestamp} 지점 상세 분석
        </h4>
        <div className="flex flex-col gap-8 items-center">
          <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <img 
              src={currentFrame.heatmap} 
              alt="Frame Analysis" 
              className="w-full h-auto object-contain max-h-[400px]"
            />
          </div>
          <div className="w-full space-y-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">해당 프레임 확률</span>
              <div className="text-3xl font-black text-slate-800">{currentFrame.probability}%</div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${currentFrame.probability > 50 ? 'bg-red-500' : 'bg-brand'}`}
                  style={{ width: `${currentFrame.probability}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              "본 프레임은 {currentFrame.timestamp} 초 지점에서 추출되었으며, {currentFrame.probability > 50 ? '특정 영역에서 인위적인 픽셀 왜곡이 감지되었습니다.' : '전반적으로 자연스러운 데이터 패턴을 유지하고 있습니다.'}"
            </p>
          </div>
        </div>

        {/* 썸네일 슬라이더 (하단 네비게이션) */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {data.frames.map((frame, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFrameIdx(idx)}
              className={`flex-shrink-0 w-24 group transition-all ${selectedFrameIdx === idx ? 'scale-105' : 'opacity-60'}`}
            >
              <div className={`aspect-video rounded-lg overflow-hidden border-2 mb-1 ${selectedFrameIdx === idx ? 'border-brand shadow-lg' : 'border-transparent'}`}>
                <img src={frame.heatmap} className="w-full h-full object-cover" alt="" />
              </div>
              <span className={`text-[10px] font-bold ${selectedFrameIdx === idx ? 'text-brand' : 'text-slate-400'}`}>
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