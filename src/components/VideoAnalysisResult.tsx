import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { PlayCircle, AlertCircle, Image as ImageIcon, Info } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="space-y-8 mt-8">
      {/* 1. 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 blur-2xl rounded-full" />
          <span className="text-xs font-black text-slate-500 mb-3 uppercase tracking-[0.2em] relative z-10">최대 변조 가능성</span>
          <div className={`text-5xl font-black relative z-10 drop-shadow-sm ${data.overall_probability > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {(data.overall_probability * 100).toFixed(1)}%
          </div>
        </div>
        <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-3xl p-8 flex items-start gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shrink-0 shadow-sm group-hover:border-cyan-500/30 transition-colors">
            <AlertCircle className="text-cyan-600 w-8 h-8" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-xl mb-3">AI 정밀 분석 리포트</h4>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">{data.analysis_note}</p>
          </div>
        </div>
      </div>

      {/* 2. 타임라인 그래프 (확률 변화) */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm">
        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <PlayCircle size={28} className="text-rose-500" /> 프레임별 조작 감지 타임라인
        </h4>
        <div className="h-72 w-full mt-4">
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
              <XAxis 
                dataKey="timestamp" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} 
                dy={10}
              />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: '1px solid rgba(0,0,0,0.05)', 
                  backgroundColor: '#ffffff', 
                  color: '#0f172a', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px 16px'
                }}
                itemStyle={{ color: '#f43f5e', fontWeight: 'bold' }}
                cursor={{ stroke: '#f43f5e', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <ReferenceLine y={50} stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={1} label={{ position: 'right', value: '변조 임계치', fill: '#f43f5e', fontSize: 11, fontWeight: 'bold' }} />
              <Line 
                type="monotone" 
                dataKey="probability" 
                stroke="#f43f5e" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#ffffff', strokeWidth: 3, stroke: '#f43f5e' }}
                activeDot={{ r: 9, strokeWidth: 0, fill: '#f43f5e' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-2 mt-6 text-slate-400 text-sm font-medium">
          <Info size={14} />
          <span>타임라인의 포인트를 클릭하여 시점별 위조 분석 패널을 전환하십시오.</span>
        </div>
      </div>

      {/* 3. 특정 시점 히트맵 슬라이더/상세 */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full" />
        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon size={28} className="text-cyan-600" />
            <span className="text-slate-500 font-medium">[{currentFrame.timestamp}]</span> 지점 정밀 분석
          </div>
          <div className={`text-2xl font-black ${currentFrame.probability > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {(currentFrame.probability * 1).toFixed(1)}%
          </div>
        </h4>
        
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-xl relative group">
             <img 
              src={currentFrame.heatmap} 
              alt="Deepfake Detection Visualization" 
              className="w-full h-auto object-contain max-h-[500px] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white/80 to-transparent">
              <p className="text-slate-900 text-xs font-bold text-center uppercase tracking-widest opacity-40">Digital Forensic Scan Result</p>
            </div>
          </div>
          
          <div className="xl:w-80 flex flex-col justify-center">
            <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm relative z-10">
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">조작 의심 지표</span>
              <div className={`text-4xl font-black mt-2 mb-6 ${currentFrame.probability > 50 ? 'text-rose-600' : 'text-cyan-600'}`}>
                {currentFrame.probability > 50 ? 'HIGH' : 'SAFE'}
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4 border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentFrame.probability}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${currentFrame.probability > 50 ? 'bg-rose-500' : 'bg-cyan-500'}`} 
                />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                해당 프레임의 {currentFrame.probability > 50 ? '변조 확률이 높습니다. 픽셀 불연속성과 인공적인 질감이 감지되었습니다.' : '변조 징후가 희박합니다. 자연스러운 이미지 일관성을 유지하고 있습니다.'}
              </p>
            </div>
          </div>
        </div>

        {/* 썸네일 슬라이더 (하단 네비게이션) */}
        <div className="mt-12 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {data.frames.map((frame, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFrameIdx(idx)}
              className={`flex-shrink-0 w-32 group transition-all duration-300 ${selectedFrameIdx === idx ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'}`}
            >
              <div className={`aspect-video rounded-xl overflow-hidden border-2 mb-3 shadow-md transition-all ${selectedFrameIdx === idx ? 'border-cyan-500 shadow-cyan-500/10' : 'border-slate-100 group-hover:border-slate-200'}`}>
                <img src={frame.heatmap} className="w-full h-full object-cover" alt="" />
              </div>
              <div className={`text-xs font-black text-center tracking-wider ${selectedFrameIdx === idx ? 'text-cyan-600' : 'text-slate-500'}`}>
                {frame.timestamp}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisResult;