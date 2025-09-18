import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
            <div className="relative flex items-center justify-center">
                 <div className="absolute h-24 w-24 bg-brand-primary rounded-full animate-ping opacity-50"></div>
                 <div className="relative h-20 w-20 bg-brand-primary rounded-full flex items-center justify-center">
                    <SparklesIcon className="text-white h-10 w-10"/>
                 </div>
            </div>
            <p className="mt-6 text-lg font-medium text-brand-text">페이지를 생성하는 중입니다...</p>
            <p className="text-brand-subtle mt-1">잠시만 기다려 주세요.</p>
        </div>
    );
};

export default Loader;