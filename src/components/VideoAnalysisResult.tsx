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
    <div className="space-y-6">
      {/* 1. 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">최대 조작 확률</span>
          <div className={`text-4xl font-black ${data.overall_probability > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {data.overall_probability.toFixed(2)}%
          </div>
        </div>
        <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="p-2.5 bg-white rounded-lg border border-slate-200 shrink-0"><AlertCircle className="text-brand w-6 h-6" /></div>
          <div>
            <h4 className="font-bold text-slate-900 text-base mb-1">AI 분석 리포트</h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">{data.analysis_note}</p>
          </div>
        </div>
      </div>

      {/* 2. 타임라인 그래프 (확률 변화) */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: 'bold' }}
                cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <ReferenceLine y={50} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'right', value: '위험', fill: '#f43f5e', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="probability" 
                stroke="#2563EB" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#ffffff', strokeWidth: 2, stroke: '#2563EB' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">그래프의 포인트를 클릭하면 해당 시점의 히트맵을 확인할 수 있습니다.</p>
      </div>

      {/* 3. 특정 시점 히트맵 슬라이더/상세 */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ImageIcon size={20} className="text-brand" /> <span className="text-slate-600">{currentFrame.timestamp}</span> 지점 상세 분석
        </h4>
        <div className="flex flex-col gap-6">
          <div className="w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <img 
              src={currentFrame.heatmap} 
              alt="Frame Analysis" 
              className="w-full h-auto object-contain max-h-[400px]"
            />
          </div>
          <div className="w-full space-y-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">해당 프레임 확률</span>
              <div className="text-3xl font-black text-slate-900 mt-1 mb-4">{currentFrame.probability.toFixed(2)}%</div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${currentFrame.probability > 50 ? 'bg-rose-500' : 'bg-brand'}`}
                  style={{ width: `${currentFrame.probability}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-4 py-1">
              본 프레임은 <span className="font-bold">{currentFrame.timestamp}</span> 초 지점에서 추출되었으며, <span className={currentFrame.probability > 50 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{currentFrame.probability > 50 ? '특정 영역에서 인위적인 픽셀 왜곡이 감지되었습니다.' : '전반적으로 자연스러운 데이터 패턴을 유지하고 있습니다.'}</span>
            </p>
          </div>
        </div>

        {/* 썸네일 슬라이더 (하단 네비게이션) */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {data.frames.map((frame, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFrameIdx(idx)}
              className={`flex-shrink-0 w-24 group transition-all ${selectedFrameIdx === idx ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
            >
              <div className={`aspect-video rounded-lg overflow-hidden border-2 mb-2 transition-colors ${selectedFrameIdx === idx ? 'border-brand' : 'border-transparent group-hover:border-slate-300'}`}>
                <img src={frame.heatmap} className="w-full h-full object-cover" alt="" />
              </div>
              <span className={`text-xs font-bold ${selectedFrameIdx === idx ? 'text-brand' : 'text-slate-500'}`}>
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