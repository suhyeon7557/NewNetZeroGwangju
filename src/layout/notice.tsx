"use client";
import React, { useEffect, useRef, useState } from "react";

type NoticeItem = {
    id: string | number;
    title: string;
    url?: string;
};

interface NoticeProps {
    notices?: NoticeItem[];
}

const DEFAULT_NOTICES: NoticeItem[] = [
    { id: 1, title: "공지사항 예시 1", url: "#" },
    { id: 2, title: "공지사항 예시 2", url: "#" },
    { id: 3, title: "공지사항 예시 3", url: "#" },
];

const Notice: React.FC<NoticeProps> = ({ notices = DEFAULT_NOTICES }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const noticeCount = notices.length;

    const toggleOpen = () => setIsOpen(prev => !prev);
    const closePanel = () => setIsOpen(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    return (
        <div ref={containerRef}>
            <button
                type="button"
                className="notice-fab"
                aria-label="공지사항 열기"
                aria-expanded={isOpen}
                onClick={toggleOpen}
            >
                <img src="/ic_side_notice.svg" alt="공지사항 아이콘" />
                {noticeCount > 0 && (
                    <span className="notice-badge" aria-label={`공지 ${noticeCount}개`}>{noticeCount}</span>
                )}
            </button>

            <div className={`notice-panel${isOpen ? " open" : ""}`} role="dialog" aria-label="공지사항">
                <div className="notice-panel-header">
                    <strong>공지사항</strong>
                    <button type="button" className="notice-panel-close" aria-label="공지사항 닫기" onClick={closePanel}>
                        <img src="/ic_close_black.svg" alt="닫기" />
                    </button>
                </div>
                <ul className="notice-list">
                    {notices.map(item => (
                        <li key={item.id} className="notice-item">
                            {item.url ? (
                                <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                            ) : (
                                <span>{item.title}</span>
                            )}
                        </li>
                    ))}
                    {notices.length === 0 && (
                        <li className="notice-empty">등록된 공지사항이 없습니다.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Notice;



