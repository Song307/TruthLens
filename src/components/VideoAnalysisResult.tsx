import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { PlayCircle, AlertCircle, Image as ImageIcon, Cpu, Clock, HelpCircle } from 'lucide-react';
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
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const currentFrame = data.frames[selectedFrameIdx];
  const [displayProb, setDisplayProb] = useState(0);

  useEffect(() => {
    let start = 0;
    const rawVal = data.overall_probability;
    // Adaptively convert float fraction 0-1 to percentage 0-100
    const target = rawVal <= 1 ? rawVal * 100 : rawVal;

    if (start === target) {
      setDisplayProb(target);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        setDisplayProb(target);
      } else {
        setDisplayProb(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [data.overall_probability]);

  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * displayProb) / 100;

  return (
    <div className="space-y-8 mt-8">
      {/* 1. 요약 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SVG Circular Metric Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full" />
          
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-200/60"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className={`transition-all duration-300 ${
                  displayProb > 50 ? 'stroke-rose-500' : 'stroke-emerald-500'
                }`}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-2xl font-black ${
                displayProb > 50 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {displayProb.toFixed(1)}%
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">MAX RATIO</span>
            </div>
          </div>
          <span className="text-xs font-black text-slate-400 mt-4 uppercase tracking-[0.15em] relative z-10">최대 변조 비율</span>
        </div>

        {/* AI 정밀 분석 리포트 카드 */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 flex items-start gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 blur-3xl rounded-full" />
          
          <div className="p-4 bg-white rounded-2xl border border-slate-200/50 shrink-0 shadow-sm group-hover:border-cyan-500/30 transition-colors">
            <AlertCircle className="text-cyan-600 w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">AI FORENSIC REPORT</span>
            <h4 className="font-black text-slate-900 text-xl mb-3">AI 비디오 정밀 분석 코멘트</h4>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">{data.analysis_note}</p>
          </div>
        </div>
      </div>

      {/* 2. 타임라인 그래프 (확률 변화) */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-lg font-black text-slate-900 flex items-center gap-3">
            <PlayCircle size={24} className="text-rose-500 animate-pulse" /> 프레임별 조작 감지 타임라인
          </h4>
          <span className="hidden sm:inline-block px-3 py-1 bg-slate-200/50 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Click data point to view frame details
          </span>
        </div>
        
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data.frames} 
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setSelectedFrameIdx(e.activeTooltipIndex);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <defs>
                <linearGradient id="videoProbGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,23,42,0.05)" />
              <XAxis 
                dataKey="timestamp" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} 
                dy={10}
              />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid rgba(15,23,42,0.08)', 
                  backgroundColor: '#ffffff', 
                  color: '#0f172a', 
                  boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                  padding: '12px 16px'
                }}
                itemStyle={{ color: '#f43f5e', fontWeight: 'bold' }}
                cursor={{ stroke: '#f43f5e', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              />
              <ReferenceLine y={50} stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={1} label={{ position: 'right', value: '변조 임계치 (50%)', fill: '#f43f5e', fontSize: 10, fontWeight: 'black' }} />
              <Area 
                type="monotone" 
                dataKey="probability" 
                stroke="#f43f5e" 
                strokeWidth={3.5}
                fill="url(#videoProbGrad)" 
                dot={{ r: 5, fill: '#ffffff', strokeWidth: 2.5, stroke: '#f43f5e' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#f43f5e' }}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-2 mt-6 text-slate-400 text-xs md:text-sm font-medium">
          <HelpCircle size={14} />
          <span>타임라인 그래프의 포인트를 터치하거나 클릭하여 시점별 위조 분석 결과를 정밀 조회하십시오.</span>
        </div>
      </div>

      {/* 3. 특정 시점 히트맵 정밀 진단 */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full" />
        
        <h4 className="text-lg md:text-xl font-black text-slate-900 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ImageIcon size={24} className="text-cyan-600 shrink-0" />
            <span>프레임 진단: </span>
            <span className="text-cyan-600 font-black">[{currentFrame.timestamp}]</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-black border ${
            currentFrame.probability > 50 
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
          }`}>
            위변조 위험률: {(currentFrame.probability * 1).toFixed(1)}%
          </div>
        </h4>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Heatmap Frame with Laser Line */}
          <div className="flex-1 bg-black rounded-[24px] overflow-hidden border border-slate-900 shadow-2xl relative group max-w-2xl mx-auto">
            {/* Holographic grid */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,24,38,0)_95%,rgba(6,180,212,0.3)_95%),linear-gradient(90deg,rgba(18,24,38,0)_95%,rgba(6,180,212,0.3)_95%)] bg-[size:25px_25px]" />
            

            {/* Corner tags */}
            <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-cyan-500/80 tracking-wider bg-black/60 px-2 py-1 rounded border border-cyan-500/20 backdrop-blur-sm">
              <div>FRAME_TS: {currentFrame.timestamp}</div>
            </div>

            <img 
              src={currentFrame.heatmap} 
              alt="Deepfake Frame Detection" 
              className="w-full h-auto object-contain max-h-[450px] mx-auto select-none"
            />
          </div>
          
          {/* Detail stats bar */}
          <div className="lg:w-80 flex flex-col justify-center shrink-0">
            <div className="p-6 md:p-8 bg-white rounded-[24px] border border-slate-100 shadow-sm relative z-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Anomaly Diagnostic Indication</span>
              <div className={`text-3xl font-black mt-1 mb-5 ${currentFrame.probability > 50 ? 'text-rose-600' : 'text-cyan-600'}`}>
                {currentFrame.probability > 50 ? 'MANIPULATED' : 'SAFE'}
              </div>
              
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4 border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentFrame.probability}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${currentFrame.probability > 50 ? 'bg-rose-500' : 'bg-cyan-500'}`} 
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Cpu size={14} className="text-slate-400" />
                  <span>진단: </span>
                  <span className="text-slate-700">
                    {currentFrame.probability > 50 ? '프레임 간 조작 흔적 분석 완료' : '특이 아티팩트 미감지'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock size={14} className="text-slate-400" />
                  <span>탐지 시간대: </span>
                  <span className="text-slate-700">{currentFrame.timestamp}</span>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm leading-relaxed mt-5">
                {currentFrame.probability > 50 
                  ? '인접 프레임 간의 모션 노이즈 데이터에서 불연속성이 감지되었습니다. 딥페이크 합성 혹은 변조 프레임일 확률이 극히 큽니다.' 
                  : '얼굴 주위의 노이즈 및 아티팩트 분포가 정상 일관성 범위에 해당하여 프레임 변조 징후가 확인되지 않았습니다.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* 썸네일 슬라이더 (하단 네비게이션) */}
        <div className="mt-12">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">프레임 시퀀스 네비게이터</span>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {data.frames.map((frame, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFrameIdx(idx)}
                className={`flex-shrink-0 w-28 group transition-all duration-300 ${
                  selectedFrameIdx === idx ? 'opacity-100 scale-[1.03]' : 'opacity-40 hover:opacity-90'
                }`}
              >
                <div className={`aspect-video rounded-xl overflow-hidden border-2 mb-2 shadow transition-all ${
                  selectedFrameIdx === idx 
                    ? 'border-cyan-500 shadow-[0_0_12px_rgba(6,180,212,0.25)]' 
                    : 'border-slate-100 group-hover:border-slate-300'
                }`}>
                  <img src={frame.heatmap} className="w-full h-full object-cover select-none" alt="" />
                </div>
                <div className={`text-[10px] font-black text-center tracking-wider ${
                  selectedFrameIdx === idx ? 'text-cyan-600' : 'text-slate-500'
                }`}>
                  {frame.timestamp}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisResult;