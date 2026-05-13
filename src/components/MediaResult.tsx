import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { MediaAnalysisData } from '../types/analysis';

interface Props {
  data: MediaAnalysisData;
}

const MediaResult: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-8 glass-panel p-8 rounded-3xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent z-[-1]"></div>
      
      {/* 분석 결과 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-4 rounded-2xl shadow-glow ${data.is_manipulated ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
          {data.is_manipulated ? <ShieldAlert size={36} className="drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" /> : <AlertTriangle size={36} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
        </div>
        <div>
          <h3 className="text-2xl font-black text-white drop-shadow-glow tracking-wide">분석 결과: <span className={data.is_manipulated ? 'text-rose-400' : 'text-emerald-400'}>{data.is_manipulated ? '조작 의심' : '정상'}</span></h3>
          <p className="text-slate-400 font-bold mt-1 tracking-wider text-sm uppercase">조작 확률: <span className={`text-lg ${data.is_manipulated ? 'text-rose-400' : 'text-emerald-400'}`}>{data.fake_probability}%</span></p>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand group-hover:shadow-[0_0_15px_rgba(0,229,255,1)] transition-all"></div>
        <h4 className="text-sm font-bold text-brand uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
          AI 분석 코멘트
        </h4>
        <p className="text-slate-200 leading-relaxed font-medium text-lg">{data.analysis_note}</p>
      </div>

      {data.heatmap_image && (
        <div className="mt-8 flex flex-col items-center">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-brand">◈</span> 조작 의심 지점 (Grad-CAM 시각화) <span className="text-brand">◈</span>
          </h4>
          {/* 이미지 크기 고정 및 비율 유지: max-h-96, w-fit */}
          <div className="bg-dark-card rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 max-h-[500px] w-full flex justify-center relative group">
            <div className="absolute inset-0 bg-brand/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
            <img 
              src={data.heatmap_image} 
              alt="Grad-CAM 히트맵" 
              className="max-w-full max-h-full object-contain z-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaResult;