import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { MediaAnalysisData } from '../types/analysis';

interface Props {
  data: MediaAnalysisData;
}

const MediaResult: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-8">
      {/* 분석 결과 헤더 */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
        <div className={`p-5 rounded-2xl border-2 shadow-lg ${
          data.is_manipulated 
            ? 'bg-rose-50 text-rose-600 border-rose-200' 
            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
        }`}>
          {data.is_manipulated ? <ShieldAlert size={40} /> : <AlertTriangle size={40} />}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
            분석 결과: <span className={data.is_manipulated ? 'text-rose-600' : 'text-emerald-600'}>{data.is_manipulated ? '조작 의심' : '정상'}</span>
          </h3>
          <div className="flex items-center gap-6">
            <p className="text-slate-500 font-bold text-lg">
              조작 확률: <span className={`text-2xl ml-2 font-black ${data.is_manipulated ? 'text-rose-600' : 'text-emerald-600'}`}>{data.fake_probability.toFixed(2)}%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full transition-all group-hover:bg-cyan-500/10" />
        <h4 className="text-xs font-black text-cyan-600 mb-4 uppercase tracking-[0.2em] relative z-10">
          AI 분석 시스템 코멘트
        </h4>
        <p className="text-slate-700 leading-relaxed text-lg md:text-xl font-medium relative z-10">
          {data.analysis_note}
        </p>
      </div>

      {data.heatmap_image && (
        <div className="mt-12">
          <h4 className="text-slate-600 font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            조작 의심 지점 (Digital Forensic 시각화)
          </h4>
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-xl transition-transform hover:scale-[1.01] duration-500">
            <img 
              src={data.heatmap_image} 
              alt="Digital Forensic Visualization" 
              className="w-full h-auto object-contain transition-all duration-700"
            />
          </div>
          <p className="mt-4 text-slate-400 text-sm italic text-center">
            * 붉은색에 가까울수록 AI에 의한 생성 또는 변조 가능성이 높음을 의미합니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaResult;