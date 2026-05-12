import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { MediaAnalysisData } from '../types/analysis';

interface Props {
  data: MediaAnalysisData;
}

const MediaResult: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-8 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500">
      {/* 분석 결과 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-2xl ${data.is_manipulated ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {data.is_manipulated ? <ShieldAlert size={32} /> : <AlertTriangle size={32} />}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">분석 결과: {data.is_manipulated ? '조작 의심' : '정상'}</h3>
          <p className="text-slate-500 font-medium">조작 확률: {data.fake_probability}%</p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">AI 분석 코멘트</h4>
        <p className="text-slate-700 leading-relaxed font-medium">{data.analysis_note}</p>
      </div>

      {data.heatmap_image && (
        <div className="mt-6 flex flex-col items-center">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">조작 의심 지점 (Grad-CAM 시각화)</h4>
          {/* 이미지 크기 고정 및 비율 유지: max-h-96, w-fit */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 max-h-[500px] w-full flex justify-center bg-black/5">
            <img 
              src={data.heatmap_image} 
              alt="Grad-CAM 히트맵" 
              className="max-w-full max-h-full object-contain shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaResult;