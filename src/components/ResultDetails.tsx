import React from 'react';
import { CheckCircle2, Link as LinkIcon, Info } from 'lucide-react';
import { FactCheckData } from '../types/analysis';

interface Props {
  data: FactCheckData;
}

const ResultDetails: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-8 space-y-8">
      {/* 1. 주요 분석 근거 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="text-brand" size={20} />
          <h3 className="text-lg font-bold text-slate-900">주요 분석 근거</h3>
        </div>
        <div className="grid gap-3">
          {data.details.map((detail, index) => (
            <div 
              key={index} 
              className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:bg-slate-100/50"
            >
              <Info className="text-slate-400 shrink-0 mt-0.5" size={16} />
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 검증 참조 자료 (Sources) 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="text-slate-400" size={18} />
          <h3 className="text-lg font-bold text-slate-900">검증에 참조된 자료</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.sources.map((source, index) => (
            <a 
              key={index}
              href={source.startsWith('http') ? source : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-brand font-bold hover:bg-slate-50 transition-colors"
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