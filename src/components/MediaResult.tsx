import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Eye, HelpCircle } from 'lucide-react';
import { MediaAnalysisData } from '../types/analysis';
import { motion } from 'framer-motion';

interface Props {
  data: MediaAnalysisData;
}

const MediaResult: React.FC<Props> = ({ data }) => {
  const [displayProb, setDisplayProb] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = data.fake_probability;
    if (start === end) {
      setDisplayProb(end);
      return;
    }

    const duration = 1000; // 1 second
    const steps = 60;
    const increment = end / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayProb(end);
      } else {
        setDisplayProb(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [data.fake_probability]);

  // SVG Circular Gauge Calculations
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * displayProb) / 100;

  return (
    <div className="mt-8 space-y-8">
      {/* 1. 요약 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SVG 도넛 게이지 카드 */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full" />
          
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Progress Ring */}
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
                  data.is_manipulated ? 'stroke-rose-500' : 'stroke-emerald-500'
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
                data.is_manipulated ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {displayProb.toFixed(1)}%
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">FAKE RATIO</span>
            </div>
          </div>
          <span className="text-xs font-black text-slate-400 mt-4 uppercase tracking-[0.15em] relative z-10">위조 가능성 판별률</span>
        </div>

        {/* 조작 판별 및 코멘트 */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-fuchsia-500/5 blur-[80px] rounded-full" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">DETECTION STATUS</span>
              <h4 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                종합 판정: 
                <span className={`px-3 py-1 rounded-full text-sm font-black border transition-all ${
                  data.is_manipulated 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                }`}>
                  {data.is_manipulated ? '조작 의심 (Manipulated)' : '정상 파일 (Verified)'}
                </span>
              </h4>
            </div>
            
            <div className={`p-3 rounded-2xl border shrink-0 transition-all ${
              data.is_manipulated 
                ? 'bg-rose-50 border-rose-200/50 text-rose-600' 
                : 'bg-emerald-50 border-emerald-200/50 text-emerald-600'
            }`}>
              {data.is_manipulated ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
            </div>
          </div>

          <div className="bg-white/80 border border-slate-100/80 rounded-2xl p-4 md:p-5">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Cpu size={12} className="text-cyan-600" /> AI Diagnostic Feedback
            </h5>
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
              {data.analysis_note}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 시각화 스캔 영역 */}
      {data.heatmap_image && (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping shrink-0" />
              <Eye size={20} className="text-rose-500" /> 조작 의심 부위 시각 분석 (ELA Scan)
            </h4>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-200/50 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>Method: ResNet ELA</span>
            </div>
          </div>

          <div className="relative bg-black rounded-[24px] overflow-hidden border border-slate-900 shadow-2xl group max-w-3xl mx-auto">
            {/* Holographic Diagnostic Grid Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,24,38,0)_95%,rgba(244,63,94,0.3)_95%),linear-gradient(90deg,rgba(18,24,38,0)_95%,rgba(244,63,94,0.3)_95%)] bg-[size:30px_30px]" />
            

            {/* Diagnostic Corners HUD */}
            <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-rose-500/80 tracking-wider space-y-0.5 bg-black/60 px-2 py-1 rounded border border-rose-500/20 backdrop-blur-sm">
              <div>SYS.SCAN: ACTIVE</div>
              <div>ELA_COEF: 0.9412</div>
            </div>

            <div className="absolute bottom-4 right-4 z-10 font-mono text-[9px] text-rose-500/80 tracking-wider bg-black/60 px-2 py-1 rounded border border-rose-500/20 backdrop-blur-sm">
              <div>RESOLUTION: RAW_ELA</div>
            </div>

            <img 
              src={data.heatmap_image} 
              alt="Digital Forensic Scan" 
              className="w-full h-auto object-contain max-h-[500px] select-none mx-auto"
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-slate-400 text-xs md:text-sm font-medium">
            <HelpCircle size={14} className="text-slate-400 shrink-0" />
            <span>노이즈 및 아티팩트 레벨의 불일치가 감지된 지점이 붉은색 및 밝은 픽셀로 표시됩니다.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaResult;