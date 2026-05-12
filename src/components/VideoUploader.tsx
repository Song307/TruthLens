import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface Props {
  onAnalyze: (file: File) => void;
  loading: boolean;
}

const VideoUploader: React.FC<Props> = ({ onAnalyze, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback((file: File) => {
    // 동영상 파일만 허용
    if (!file.type.startsWith('video')) {
      return alert('동영상 파일만 업로드 가능합니다.');
    }

    if (file.size > 100 * 1024 * 1024) return alert('최대 100MB까지 업로드 가능합니다.');

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

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
          <div className="p-4 bg-slate-50 rounded-full text-slate-400"><Upload size={32} /></div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-700">동영상 업로드</p>
            <p className="text-sm text-slate-400">MP4, WebM 등 (Max 100MB)</p>
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept="video/*"
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
          
          {/* 동영상 미리보기 */}
          <div className="w-full max-h-[400px] flex justify-center items-center overflow-hidden rounded-2xl bg-slate-50">
            <video src={preview} className="max-w-full max-h-full" controls />
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

export default VideoUploader;
