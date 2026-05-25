import React from 'react';
import { CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { FactCheckData } from '../types/analysis';
import { motion } from 'framer-motion';

interface Props {
  data: FactCheckData;
}

const ResultDetails: React.FC<Props> = ({ data }) => {
  // Stagger container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Card animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 110,
        damping: 16
      }
    },
  };

  return (
    <div className="mt-12 space-y-12">
      {/* 1. 주요 분석 근거 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-600">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">주요 분석 근거</h3>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          {data.details.map((detail, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="flex gap-5 bg-gradient-to-r from-slate-50 to-white hover:from-white hover:to-white p-6 rounded-2xl border border-slate-100/80 transition-all hover:border-cyan-500/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] group"
            >
              {/* Technical Index Badge */}
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-400 font-bold text-sm shrink-0 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </div>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                {detail}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 2. 검증 참조 자료 (Sources) 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
            <LinkIcon size={20} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">검증에 참조된 자료</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.sources.map((source, index) => {
            const isUrl = source.startsWith('http');
            let displayDomain = source;
            try {
              if (isUrl) {
                const urlObj = new URL(source);
                displayDomain = urlObj.hostname;
              }
            } catch (e) {
              // ignore
            }
            
            return (
              <a 
                key={index}
                href={isUrl ? source : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 hover:border-cyan-500/20 rounded-xl hover:bg-white transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-slate-100 text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 rounded-lg transition-colors shrink-0">
                    <LinkIcon size={14} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Source Reference</span>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-cyan-600 transition-colors truncate">
                      {displayDomain}
                    </span>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-cyan-400 transition-colors pl-2">
                  <span className="text-xs">↗</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ResultDetails;