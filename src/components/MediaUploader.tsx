import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface Props {
  onAnalyze: (file: File) => void;
  loading: boolean;
  fileType?: 'image' | 'video'; // 파일 타입 구분 (기본값: image)
}

const MediaUploader: React.FC<Props> = ({ onAnalyze, loading, fileType = 'image' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- 추가된 다운스케일링 함수 ---
  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 512; // 최대 가로 길이를 1024px로 제한
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(resizedFile);
            }
          }, 'image/jpeg', 0.8); // 80% 품질의 JPEG로 압축
        };
      };
    });
  };

  const handleFile = useCallback(async (file: File) => {
    // 파일 타입 검증
    if (fileType === 'image' && !file.type.startsWith('image')) {
      return alert('이미지 파일만 업로드 가능합니다.');
    }
    if (fileType === 'video' && !file.type.startsWith('video')) {
      return alert('동영상 파일만 업로드 가능합니다.');
    }

    if (file.size > 10 * 1024 * 1024) return alert('최대 10MB까지 업로드 가능합니다.');

    let targetFile = file;
    
    // 이미지인 경우 다운스케일링 실행
    if (file.type.startsWith('image')) {
      targetFile = await resizeImage(file);
    }

    setSelectedFile(targetFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(targetFile);
  }, [fileType]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  return (
    <div className="w-full space-y-4">
      {!preview ? (
        <div
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center gap-4 group overflow-hidden ${
            dragActive ? 'border-brand bg-brand/10 shadow-glow' : 'border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand/50 hover:shadow-glow'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-brand/20 transition-colors"></div>
          {/* 생략: 업로드 UI */}
          <div className="p-5 bg-dark-card border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-full text-brand drop-shadow-glow relative z-10 transition-transform group-hover:scale-110 duration-300"><Upload size={36} /></div>
          <div className="text-center relative z-10">
            <p className="text-xl font-bold text-white drop-shadow-md tracking-wide">
              {fileType === 'image' ? '이미지 업로드' : '동영상 업로드'}
            </p>
            <p className="text-sm text-slate-400 mt-2 font-medium tracking-wider">
              {fileType === 'image' ? 'JPG, PNG (Max 10MB)' : 'MP4, WebM (Max 10MB)'}
            </p>
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept={fileType === 'image' ? 'image/*' : 'video/*'}
          />
        </div>
      ) : (
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent z-0 pointer-events-none"></div>
          <button 
            onClick={() => { setPreview(null); setSelectedFile(null); }}
            className="absolute top-6 right-6 z-20 p-2 bg-black/60 backdrop-blur-md text-white border border-white/10 rounded-full hover:bg-brand/20 hover:text-brand transition-all shadow-lg"
          >
            <X size={20} />
          </button>
          
          {/* 미리보기 컨테이너 크기 제한: max-h-96 설정 */}
          <div className="w-full max-h-[400px] flex justify-center items-center overflow-hidden rounded-2xl bg-dark-card border border-white/5 shadow-inner relative group z-10">
            <div className="absolute inset-0 bg-brand/5 pointer-events-none group-hover:bg-transparent transition-colors z-10"></div>
            {selectedFile?.type.startsWith('video') ? (
              <video src={preview} className="max-w-full max-h-full relative z-0" controls />
            ) : (
              <img src={preview} alt="preview" className="max-w-full max-h-full object-contain relative z-0" />
            )}
          </div>

          <button
            onClick={() => selectedFile && onAnalyze(selectedFile)}
            disabled={loading}
            className="w-full mt-5 py-4 bg-brand text-dark rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-light hover:shadow-glow active:scale-[0.98] disabled:bg-white/10 disabled:text-slate-500 disabled:shadow-none transition-all shadow-lg text-lg tracking-wider relative z-10"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : '딥페이크 조작 분석 시작'}
          </button>

          {loading && (
            <div className="w-full mt-4 p-4 bg-white/5 border border-brand/30 rounded-2xl relative z-10">
              <p className="text-sm text-slate-300 text-center leading-relaxed">
                <span className="text-brand font-semibold">분석 중입니다...</span> 파일 크기와 네트워크 속도에 따라 <br/>
                <span className="text-slate-400">몇 초에서 수십 초</span>가 소요될 수 있습니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;