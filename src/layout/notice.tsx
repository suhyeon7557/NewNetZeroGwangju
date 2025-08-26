"use client";

import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import { Pagination, Autoplay } from "swiper/modules";

const Notice: React.FC = () => {
    const swiperContainerRef = useRef<HTMLDivElement | null>(null);
    const paginationRef = useRef<HTMLDivElement | null>(null);
    const swiperInstanceRef = useRef<Swiper | null>(null);
    const noticePanelRef = useRef<HTMLDivElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!swiperContainerRef.current || !paginationRef.current) return;

        const instance = new Swiper(swiperContainerRef.current, {
            modules: [Pagination, Autoplay],
            slidesPerView: 1,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: paginationRef.current,
                clickable: true,
                bulletClass: "dot",
                bulletActiveClass: "active",
            },
        });
        swiperInstanceRef.current = instance;

        // 초기 상태 동기화 및 이벤트 연결
        try {
            // @ts-ignore - Swiper 타입 정의 상 존재하지만 런타임 체크
            const running = !!instance.autoplay?.running;
            setIsPlaying(running);
            if (noticePanelRef.current) {
                noticePanelRef.current.classList.toggle("is-playing", running);
                noticePanelRef.current.classList.toggle("is-paused", !running);
            }
        } catch {}
        instance.on("autoplayStart", () => {
            setIsPlaying(true);
            if (noticePanelRef.current) {
                noticePanelRef.current.classList.add("is-playing");
                noticePanelRef.current.classList.remove("is-paused");
            }
        });
        instance.on("autoplayStop", () => {
            setIsPlaying(false);
            if (noticePanelRef.current) {
                noticePanelRef.current.classList.add("is-paused");
                noticePanelRef.current.classList.remove("is-playing");
            }
        });

        return () => {
            try {
                instance.destroy(true, true);
            } catch {}
        };
    }, []);

    const handlePlay = () => {
        const inst = swiperInstanceRef.current;
        if (inst && inst.autoplay) {
            inst.autoplay.start();
            if (noticePanelRef.current) {
                noticePanelRef.current.classList.add("is-playing");
                noticePanelRef.current.classList.remove("is-paused");
            }
        }
    };

    const handleStop = () => {
        const inst = swiperInstanceRef.current;
        if (inst && inst.autoplay) {
            inst.autoplay.stop();
            if (noticePanelRef.current) {
                noticePanelRef.current.classList.add("is-paused");
                noticePanelRef.current.classList.remove("is-playing");
            }
        }
    };

    return (
        <>
            <input type="checkbox" id="noticeToggle" className="notice-toggle" hidden />
            <label htmlFor="noticeToggle" className="notice-fab" aria-label="공지사항 열기">
                <img src="/ic_side_notice.svg" alt="공지사항 아이콘" />
                <span className="notice-badge" aria-label="공지 3개">3</span>
            </label>
            <div className="notice-panel" role="dialog" aria-label="공지사항" ref={noticePanelRef}>
                <div className="notice-swiper" ref={swiperContainerRef}>
                    <div className="swiper-wrapper">
                        <div className="swiper-slide notice-item">
                            <a href="#">
                                <img src="/image_notice_test.svg" alt="공지사항 이미지" />
                            </a>
                        </div>
                        <div className="swiper-slide notice-item">
                            <a href="#">
                                <img src="/image_notice_test02.svg" alt="공지사항 이미지" />
                            </a>
                        </div>
                        <div className="swiper-slide notice-item">
                            <a href="#">
                                <img src="/image_notice_test03.svg" alt="공지사항 이미지" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="notice-panel-footer">
                    <div className="controls">
                        <div className="playback_controls">
                            <button type="button" className="play_btn" aria-label="자동재생 시작" onClick={handlePlay}>
                                <img src="/ic_play_black.svg" alt="재생" />
                            </button>
                            <button type="button" className="stop_btn" aria-label="자동재생 정지" onClick={handleStop}>
                                <img src="/ic_stop_black.svg" alt="정지" />
                            </button>
                            <div className="progress_dots" ref={paginationRef}></div>
                        </div>
                    </div>
                    <div className="checkbox_container">
                        <label className="checkbox_label">
                            <input type="checkbox" className="today_checkbox" />
                            <span className="checkobox_custom checkbox_icon"></span>
                            <span className="checkbox_text">오늘 보지 않기</span>
                        </label>
                        <label htmlFor="noticeToggle" className="close_btn">닫기</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notice;


