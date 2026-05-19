import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { MediaAnalysisData } from '../types/analysis';

interface Props {
  data: MediaAnalysisData;
}

const MediaResult: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-6 animate-in zoom-in-95 duration-500">
      {/* 분석 결과 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl border ${data.is_manipulated ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-emerald-50 text-emerald-500 border-emerald-200'}`}>
          {data.is_manipulated ? <ShieldAlert size={28} /> : <AlertTriangle size={28} />}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">분석 결과: <span className={data.is_manipulated ? 'text-rose-500' : 'text-emerald-500'}>{data.is_manipulated ? '조작 의심' : '정상'}</span></h3>
          <p className="text-slate-500 font-medium mt-1 text-sm">조작 확률: <span className={`font-bold ${data.is_manipulated ? 'text-rose-500' : 'text-emerald-500'}`}>{data.fake_probability.toFixed(2)}%</span></p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h4 className="text-sm font-bold text-brand mb-3 uppercase tracking-wider">
          AI 분석 코멘트
        </h4>
        <p className="text-slate-700 leading-relaxed text-base font-medium">{data.analysis_note}</p>
      </div>

      {data.heatmap_image && (
        <div className="mt-8">
          <h4 className="text-sm font-bold text-slate-500 mb-4">
            조작 의심 지점 (Grad-CAM 시각화)
          </h4>
          {/* 이미지 크기 고정 및 비율 유지 */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 max-h-[500px] w-full flex justify-center shadow-inner">
            <img 
              src={data.heatmap_image} 
              alt="Grad-CAM 히트맵" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaResult;