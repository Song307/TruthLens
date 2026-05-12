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
          className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center gap-4 ${
            dragActive ? 'border-brand bg-brand/5' : 'border-slate-200 bg-white'
          }`}
        >
          {/* 생략: 업로드 UI */}
          <div className="p-4 bg-slate-50 rounded-full text-slate-400"><Upload size={32} /></div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-700">
              {fileType === 'image' ? '이미지 업로드' : '동영상 업로드'}
            </p>
            <p className="text-sm text-slate-400">
              {fileType === 'image' ? 'JPG, PNG (Max 10MB)' : 'MP4, WebM (Max 10MB)'}
            </p>
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept={fileType === 'image' ? 'image/*' : 'video/*'}
          />
        </div>
      ) : (
        <div className="relative bg-white p-4 rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col items-center">
          <button 
            onClick={() => { setPreview(null); setSelectedFile(null); }}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
          >
            <X size={20} />
          </button>
          
          {/* 미리보기 컨테이너 크기 제한: max-h-96 설정 */}
          <div className="w-full max-h-[400px] flex justify-center items-center overflow-hidden rounded-2xl bg-slate-50">
            {selectedFile?.type.startsWith('video') ? (
              <video src={preview} className="max-w-full max-h-full" controls />
            ) : (
              <img src={preview} alt="preview" className="max-w-full max-h-full object-contain" />
            )}
          </div>

          <button
            onClick={() => selectedFile && onAnalyze(selectedFile)}
            disabled={loading}
            className="w-full mt-4 py-4 bg-brand text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 disabled:bg-slate-300 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : '딥페이크 조작 분석 시작'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;