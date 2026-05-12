import React from 'react';
import { CheckCircle2, Link as LinkIcon, Info } from 'lucide-react';
import { FactCheckData } from '../types/analysis';

interface Props {
  data: FactCheckData;
}

const ResultDetails: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-top-2 duration-700">
      {/* 1. 주요 분석 근거 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="text-brand" size={22} />
          <h3 className="text-xl font-bold text-slate-800">주요 분석 근거</h3>
        </div>
        <div className="grid gap-3">
          {data.details.map((detail, index) => (
            <div 
              key={index} 
              className="flex gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 transition-hover hover:border-brand/30"
            >
              <Info className="text-slate-400 shrink-0" size={18} />
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 검증 참조 자료 (Sources) 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="text-slate-400" size={22} />
          <h3 className="text-xl font-bold text-slate-800">검증에 참조된 자료</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.sources.map((source, index) => (
            <a 
              key={index}
              href={source.startsWith('http') ? source : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-brand font-semibold hover:bg-brand hover:text-white transition-all shadow-sm flex items-center gap-2"
            >
              {source.length > 30 ? `${source.substring(0, 30)}...` : source}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultDetails;