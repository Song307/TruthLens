import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer ${
            dragActive ? 'border-brand bg-brand/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-brand/50'
          }`}
        >
          <div className="p-4 bg-white shadow-sm border border-slate-100 rounded-full text-brand"><Upload size={32} /></div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">동영상 업로드</p>
            <p className="text-sm text-slate-500 mt-1">MP4, WebM 등 (Max 100MB)</p>
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept="video/*"
          />
        </motion.div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-6 relative flex flex-col items-center border border-slate-100">
          <button 
            onClick={() => { setPreview(null); setSelectedFile(null); }}
            className="absolute top-4 right-4 z-20 p-1.5 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-100 transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
          
          {/* 동영상 미리보기 */}
          <div className="w-full max-h-[400px] flex justify-center items-center overflow-hidden rounded-xl bg-slate-100">
            <video src={preview} className="max-w-full max-h-full" controls />
          </div>

          <motion.button
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            onClick={() => selectedFile && onAnalyze(selectedFile)}
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-brand text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm"
          >
            딥페이크 조작 분석 시작
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
