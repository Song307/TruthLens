import React from 'react';
import { CheckCircle2, Link as LinkIcon, Info } from 'lucide-react';
import { FactCheckData } from '../types/analysis';

interface Props {
  data: FactCheckData;
}

const ResultDetails: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-8 space-y-12">
      {/* 1. 주요 분석 근거 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="text-cyan-600" size={24} />
          <h3 className="text-xl font-bold text-slate-900">주요 분석 근거</h3>
        </div>
        <div className="grid gap-4">
          {data.details.map((detail, index) => (
            <div 
              key={index} 
              className="flex gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100 hover:border-slate-200 group"
            >
              <Info className="text-slate-400 shrink-0 mt-1 group-hover:text-cyan-600 transition-colors" size={18} />
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 검증 참조 자료 (Sources) 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <LinkIcon className="text-slate-500" size={22} />
          <h3 className="text-xl font-bold text-slate-900">검증에 참조된 자료</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {data.sources.map((source, index) => (
            <a 
              key={index}
              href={source.startsWith('http') ? source : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm md:text-base text-cyan-600 font-bold hover:bg-white hover:border-cyan-500/30 transition-all shadow-sm"
            >
              {source.length > 40 ? `${source.substring(0, 40)}...` : source}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultDetails;