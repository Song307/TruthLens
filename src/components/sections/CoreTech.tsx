import React from 'react';
import { Database, Layers, Cpu, RefreshCw, Check, Activity, Film } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const CoreTech: React.FC = () => {
  return (
    <section id="core-tech" className="w-full py-20 bg-white border-t border-slate-100">
      <div className="w-full px-[20%]">
        <ScrollReveal>
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 text-brand rounded-full text-xs font-bold mb-4 tracking-wider">
              CORE TECHNOLOGIES
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">
              진짜와 가짜를 구별하는 TruthLens 3대 핵심 기술
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium">
              텍스트, 이미지, 동영상 각 분야에 특화된 최첨단 AI 모델을 결합하여 독보적인 검증 정확도를 달성합니다.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-20">
          {/* Row 1: Text Verification */}
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-[36px] border border-slate-200/60">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-brand font-black text-xs rounded-full shadow-sm tracking-widest">TECH 01</div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 text-brand shrink-0">
                    <Database size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">텍스트 검증</h3>
                    <p className="text-brand font-bold text-sm md:text-base mt-1">RAG 기반 교차 검증 DB</p>
                  </div>
                </div>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                  korea.kr 등 공공 DB 및 신뢰할 수 있는 공식 언론 보도와 실시간으로 대조하여 기사의 진위 여부와 정밀한 Fact-score를 산출합니다. 오염된 웹 검색 결과를 배제하여 환각(Hallucination)을 원천 차단합니다.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#공공DB연동</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#실시간팩트스코어</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#환각원천차단</span>
                </div>
              </div>
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="font-bold text-slate-900 flex items-center gap-2"><RefreshCw size={18} className="text-brand animate-spin" /> RAG Pipeline</span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">실시간 연동 중</span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">정부 공식 브리핑 DB (korea.kr)</span>
                    <Check size={18} className="text-emerald-500" />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">주요 언론사 팩트체크 보도망</span>
                    <Check size={18} className="text-emerald-500" />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">법원 판결문 및 통계청 자료</span>
                    <Check size={18} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Row 2: Image Verification (Reversed) */}
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-[36px] border border-slate-200/60">
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6 order-2 lg:order-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="font-bold text-slate-900 flex items-center gap-2"><Activity size={18} className="text-brand" /> Hybrid Detection</span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-brand rounded-full border border-blue-200">CNN + ViT</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 p-6 text-white flex flex-col items-center justify-center min-h-[200px] text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-overlay"></div>
                  <Layers size={48} className="text-brand mb-4 animate-bounce" />
                  <div className="font-bold text-lg mb-1">Grad-CAM 히트맵 활성화</div>
                  <div className="text-xs text-slate-400">픽셀 단위 조작 지점 및 전체 맥락 왜곡 동시 탐지</div>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-brand font-black text-xs rounded-full shadow-sm tracking-widest">TECH 02</div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 text-brand shrink-0">
                    <Layers size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">이미지 검증</h3>
                    <p className="text-brand font-bold text-sm md:text-base mt-1">CNN + ViT 하이브리드 탐지</p>
                  </div>
                </div>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                  미세한 픽셀 왜곡을 탐지하는 CNN과 전체 맥락을 이해하는 ViT를 결합하여 조작 의심 지점을 Grad-CAM 히트맵으로 직관적으로 시각화합니다. 생성형 AI가 만든 가짜 이미지뿐만 아니라 정교한 합성 사진까지 완벽히 판별합니다.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#픽셀왜곡탐지</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#Grad-CAM시각화</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#하이브리드AI</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Row 3: Video Verification */}
          <ScrollReveal delay={0.3}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-[36px] border border-slate-200/60">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-brand font-black text-xs rounded-full shadow-sm tracking-widest">TECH 03</div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 text-brand shrink-0">
                    <Cpu size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">동영상 검증</h3>
                    <p className="text-brand font-bold text-sm md:text-base mt-1">3D-CNN 시공간 일관성 분석</p>
                  </div>
                </div>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                  영상 프레임 간의 시공간적 흐름과 입모양의 부자연스러움을 3차원 AI 모델로 분석하여 정교한 딥페이크 조작까지 완벽하게 탐지합니다. 초 단위 구간별 확률 추이 그래프와 히트맵을 제공하여 조작 시점을 한눈에 파악할 수 있습니다.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#3D-CNN</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#시공간일관성</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">#프레임정밀분석</span>
                </div>
              </div>
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="font-bold text-slate-900 flex items-center gap-2"><Film size={18} className="text-brand" /> Frame Analysis</span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-200">위험 감지</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>00:12 지점 프레임</span>
                      <span className="text-rose-500">89.4% 조작 의심</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 w-[89%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>00:25 지점 프레임</span>
                      <span className="text-emerald-500">12.1% 정상</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[12%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CoreTech;
