import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, file }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }, [onFileChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onFileChange(null);
      if (inputRef.current) {
          inputRef.current.value = "";
      }
  }

  const handleAreaClick = () => {
      inputRef.current?.click();
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">MP3 오디오 파일</label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleAreaClick}
        className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-brand-primary bg-brand-secondary' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg"
          onChange={handleChange}
          className="hidden"
        />
        {file ? (
          <div className="text-center">
            <p className="font-semibold text-brand-text">{file.name}</p>
            <p className="text-sm text-brand-subtle">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            <button
              onClick={handleRemoveFile}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              파일 삭제
            </button>
          </div>
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="mt-2 text-sm text-brand-subtle">
              <span className="font-semibold text-brand-primary">클릭하여 업로드</span>하거나 파일을 드래그 앤 드롭하세요
            </p>
            <p className="text-xs text-gray-500">MP3 형식만 가능</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;