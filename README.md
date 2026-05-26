# TruthLens
### AI-Powered Multi-modal Fact-Checking Platform

<div align="center">
  <p align="center">
    <strong>"가짜를 만드는 기술로, 진실을 보는 눈을 제작하다."</strong><br />
    AI-generated misinformation is rising. TruthLens is the counter-measure.
  </p>

  <p align="center">
    <a href="https://truthlens.kro.kr/">
      <img src="https://img.shields.io/badge/Live_Demo-Visit%20Site-00D1FF?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" />
    </a>
    <a href="https://huggingface.co/spaces/truthlens/api">
      <img src="https://img.shields.io/badge/API_Server-HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="API Server" />
    </a>
    <a href="https://github.com/song307/truthlens-web">
      <img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Frontend" />
    </a>
  </p>
</div>

---

## 프로젝트 개요 (Project Overview)
**TruthLens**는 생성형 AI의 발전으로 육안 구별이 불가능해진 딥페이크 이미지, 영상, 정교한 가짜 뉴스로부터 사회적 신뢰를 회복하기 위해 탄생했습니다. 픽셀(CNN), 프레임(3D-CNN), 사실 관계(RAG)라는 **3중 레이어 검증 시스템**을 통해 디지털 콘텐츠의 진위를 판별합니다.

## 핵심 검증 시스템 (Key Features)

### 뉴스 기사 팩트체크 (RAG Engine)
단순한 문맥 파악을 넘어, 실시간으로 신뢰할 수 있는 정보와 대조합니다.
- **RAG(Retrieval-Augmented Generation)**: LLM(Llama 3.3)이 기사의 핵심 주장을 추출하고, Serper API를 통해 공공기관/언론사 DB에서 정보를 검색하여 교차 검증합니다.
- **출력**: 진실/거짓/판단보류 판정 및 근거 자료 리스트 제공.

### 이미지 조작 탐지 (Vision Engine)
이미지의 주파수 영역과 전역적 문맥을 동시에 분석합니다.
- **CNN & ViT 하이브리드**: `EfficientNet-B0`로 미세한 픽셀 왜곡을 감지하고, Vision Transformer로 광원 불일치 등 구조적 부자연스러움을 포착합니다.
- **출력**: 조작 의심 영역 **Heatmap(CAM)** 시각화 및 위조 확률(%).

### 동영상 딥페이크 탐지 (Video Analysis)
이미지의 연속성을 넘어 '시공간 일관성'을 추적합니다.
- **3D-CNN**: 시간(Time) 축을 포함한 3차원 필터 분석으로 프레임 간의 미세한 떨림(Flickering)과 부자연스러운 변화를 탐지합니다.
- **출력**: 타임라인별 위험도 그래프 및 변조 의심 구간 로그.

---

## 사용자 흐름 및 시스템 구조

### User Flow
```mermaid
graph LR
    A[홈페이지 진입] --> B{데이터 입력}
    B -- "URL 입력" --> C[기사 추출 및 RAG 분석]
    B -- "이미지 업로드" --> D[CNN/ViT 왜곡 탐지]
    B -- "동영상 업로드" --> E[3D-CNN 시공간 분석]
    C --> F[종합 Truth Score 결과 리포트]
    D --> F
    E --> F
```

### System Architecture
```mermaid
sequenceDiagram
    participant U as User (Frontend)
    participant F as FastAPI (Backend)
    participant A as AI Models (CNN/3D-CNN)
    participant L as LLM (Llama 3.3 + RAG)
    participant S as Search API (Serper)

    U->>F: 분석 요청 (File/URL)
    alt Text Analysis
        F->>S: 관련 뉴스/DB 검색
        S-->>F: 검색 결과 반환
        F->>L: 본문-검색결과 대조 분석
        L-->>F: 신뢰도 및 근거 도출
    else Media Analysis
        F->>A: 딥러닝 추론 (GPU/CPU)
        A-->>F: 확률 및 Heatmap 생성
    end
    F-->>U: JSON 리포트 & 시각화 데이터 반환
```

---

## 기술 스택 (Technical Stack)

| 구분 | 기술 스택 |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Framer Motion, Recharts |
| **Backend** | FastAPI (Python), OpenCV, FFmpeg, yt-dlp |
| **AI/ML** | PyTorch, HuggingFace Transformers, Groq (Llama 3.3 70B) |
| **Infrastructure** | Vercel (Web), HuggingFace Spaces (API), Docker |

---

## 엔지니어링 전략 (Engineering Strategy)
- **추론 최적화**: GPU 없는 환경을 고려하여 모델 경량화(Quantization)를 통한 CPU 추론 속도 개선.
- **연산 효율화**: 동영상 분석 시 초당 3~5프레임 샘플링 기법을 적용하여 연산량을 80% 절감.
- **보안**: API Key 등의 민감 정보는 Secrets 변수로 관리하여 안전하게 운영.

## 기대 효과
- **사회적 신뢰 회복**: 조작 정보로 인한 갈등 및 사회적 비용 감소.
- **리터러시 지원**: 디지털 취약계층에게 직관적인 진위 판단 도구 제공.
- **선순환 구조**: AI의 역기능(가짜 제작)을 AI(진실 판별)로 해결하는 기술적 모델 제시.

---
<div align="center">
  <p>© 2026 TruthLens Team. All rights reserved.</p>
</div>

o
