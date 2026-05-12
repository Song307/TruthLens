// 팩트체크 분석 결과 상세 타입
export interface FactCheckData {
  title: string;
  verdict: '진실' | '거짓' | '판단보류';
  score: number;
  summary: string;
  details: string[];
  sources: string[];
}

// 미디어 분석 결과 상세 타입
export interface MediaAnalysisData {
  fake_probability: number;
  is_manipulated: boolean;
  analysis_note: string;
  heatmap_image?: string; // Base64 인코딩된 히트맵 이미지 (data:image/png;base64,...)
}

// 비디오 프레임 분석 데이터
export interface VideoFrame {
  timestamp: string;
  probability: number;
  heatmap: string;
}

// 비디오 분석 결과 상세 타입
export interface VideoAnalysisData {
  overall_probability: number;
  frames: VideoFrame[];
  analysis_note: string;
}

// 통합 API 응답 규격
export interface AnalysisResponse<T> {
  status: 'success' | 'error';
  data: T;
  timestamp?: string;
}