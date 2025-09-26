'use client';
import React from 'react';
import './loadingpage.scss';

const LoadingPage: React.FC = () => {
    return (
        <div className="loading_page" aria-label="로딩중 영역">
            <div className="loading_inner">
                <div className="logo_mark" aria-hidden="true">
                    <span className="leaf left" />
                    <span className="leaf right" />
                    <span className="dot" />
                </div>
                <p className="loading_text" role="status" aria-live="polite">
                    데이터 불러오는 중...
                </p>
            </div>
        </div>
    );
};

export default LoadingPage;


