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
          className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center gap-4 group overflow-hidden ${
            dragActive ? 'border-brand bg-brand/10 shadow-glow' : 'border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand/50 hover:shadow-glow'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-brand/20 transition-colors"></div>
          <div className="p-5 bg-dark-card border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-full text-brand drop-shadow-glow relative z-10 transition-transform group-hover:scale-110 duration-300"><Upload size={36} /></div>
          <div className="text-center relative z-10">
            <p className="text-xl font-bold text-white drop-shadow-md tracking-wide">동영상 업로드</p>
            <p className="text-sm text-slate-400 mt-2 font-medium tracking-wider">MP4, WebM 등 (Max 100MB)</p>
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept="video/*"
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
          
          {/* 동영상 미리보기 */}
          <div className="w-full max-h-[400px] flex justify-center items-center overflow-hidden rounded-2xl bg-dark-card border border-white/5 shadow-inner relative group z-10">
            <div className="absolute inset-0 bg-brand/5 pointer-events-none group-hover:bg-transparent transition-colors z-10"></div>
            <video src={preview} className="max-w-full max-h-full relative z-0" controls />
          </div>

          <button
            onClick={() => selectedFile && onAnalyze(selectedFile)}
            disabled={loading}
            className="w-full mt-5 py-4 bg-brand text-dark rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-light hover:shadow-glow active:scale-[0.98] disabled:bg-white/10 disabled:text-slate-500 disabled:shadow-none transition-all shadow-lg text-lg tracking-wider relative z-10"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : '딥페이크 조작 분석 시작'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
