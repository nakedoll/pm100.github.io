import React, { useState, useCallback } from 'react';
import { PodcastData } from './types';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import PodcastPreview from './components/PodcastPreview';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { AudioWaveIcon } from './components/icons/AudioWaveIcon';

type AppStep = 'upload' | 'processing' | 'preview';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('upload');
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type === 'audio/mpeg') {
      setMp3File(file);
      setError(null);
    } else if (file) {
      setError('잘못된 파일 형식입니다. MP3 파일을 업로드해주세요.');
      setMp3File(null);
    } else {
      setMp3File(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!mp3File) {
      setError('MP3 파일을 업로드해주세요.');
      return;
    }

    setStep('processing');
    setError(null);

    try {
      const audioUrl = URL.createObjectURL(mp3File);
      const audioBase64 = await fileToBase64(mp3File);

      const d = new Date();
      const creationDate = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

      setPodcastData({
        title: "오후 1시 창업이야기 뉴스 브리핑",
        audioUrl,
        audioFileName: mp3File.name,
        audioBase64,
        creationDate,
      });

      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setStep('upload');
    }
  }, [mp3File]);

  const handleReset = () => {
    setStep('upload');
    setMp3File(null);
    setPodcastData(null);
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'processing':
        return <Loader />;
      case 'preview':
        return podcastData && <PodcastPreview data={podcastData} onReset={handleReset} />;
      case 'upload':
      default:
        return (
          <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-brand-text mb-2">오디오 페이지 생성하기</h2>
            <p className="text-center text-brand-subtle mb-8">시작하려면 MP3 오디오 파일을 업로드하세요.</p>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

            <div className="space-y-6">
              <FileUpload onFileChange={handleFileChange} file={mp3File} />
              
              <button
                onClick={handleSubmit}
                disabled={!mp3File}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <SparklesIcon />
                페이지 생성
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <header className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-4">
                <AudioWaveIcon />
                <h1 className="text-4xl font-extrabold text-brand-text">팟캐스트 오디오 페이지 생성기</h1>
            </div>
            <p className="text-lg text-brand-subtle max-w-2xl mx-auto">
                MP3 오디오 파일을 업로드하여 바로 공유할 수 있는 간단한 웹페이지를 만드세요.
            </p>
        </header>
        <main className="w-full">
            {renderContent()}
        </main>
        <footer className="text-center mt-10 text-gray-500 text-sm">
            <p>React 기반</p>
        </footer>
    </div>
  );
};

export default App;