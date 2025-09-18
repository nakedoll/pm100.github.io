import React from 'react';
import { PodcastData } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface PodcastPreviewProps {
  data: PodcastData;
  onReset: () => void;
}

const generateHTML = (data: PodcastData): string => {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://rsms.me/inter/inter.css');
        html { font-family: 'Inter', sans-serif; }
      </style>
    </head>
    <body class="bg-gray-50 text-gray-800 flex items-center justify-center min-h-screen">
      <div class="container mx-auto max-w-2xl p-4 sm:p-8">
        <main class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="p-8">
            <p class="text-sm text-gray-500 mb-2">${data.creationDate}</p>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">${data.title}</h1>
          </div>
          <div class="p-8 border-t border-gray-200">
            <audio controls class="w-full" src="data:audio/mpeg;base64,${data.audioBase64}">
              브라우저에서 오디오 요소를 지원하지 않습니다.
            </audio>
          </div>
        </main>
        
        <footer class="text-center mt-8 text-sm text-gray-500">
            <p>팟캐스트 페이지 생성기로 제작됨</p>
        </footer>
      </div>
    </body>
    </html>
  `;
};

const PodcastPreview: React.FC<PodcastPreviewProps> = ({ data, onReset }) => {
  const handleDownload = () => {
    const htmlContent = generateHTML(data);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `팟캐스트_${data.creationDate.replace(/[^0-9]/g, '')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">팟캐스트 페이지가 준비되었습니다!</h2>
             <div className="flex gap-4">
                 <button
                    onClick={onReset}
                    className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    새로 만들기
                </button>
                 <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <DownloadIcon />
                    페이지 다운로드
                </button>
             </div>
        </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
          <p className="text-sm text-gray-500 mb-2">팟캐스트 에피소드 &bull; {data.creationDate}</p>
          <h1 className="text-4xl font-extrabold text-brand-text tracking-tight">{data.title}</h1>
        </div>

        <div className="p-8 border-t border-gray-200">
          <audio controls className="w-full" src={data.audioUrl}>
            브라우저에서 오디오 요소를 지원하지 않습니다.
          </audio>
        </div>
      </div>
    </div>
  );
};

export default PodcastPreview;