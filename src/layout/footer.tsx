"use client";
import React, { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Autoplay, A11y } from 'swiper/modules';

const Footer = () => {
    const swiperRef = useRef<Swiper | null>(null);
    const swiperContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!swiperContainerRef.current) return;
        swiperRef.current = new Swiper(swiperContainerRef.current, {
            modules: [Navigation, Autoplay, A11y],
            slidesPerView: 'auto',
            spaceBetween: 30,
            loop: true,
            speed: 600,
            navigation: {
                nextEl: '.footer_banner .swiper-button-next',
                prevEl: '.footer_banner .swiper-button-prev',
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
                stopOnLastSlide: false,
            },
            loopAdditionalSlides: 10,
            breakpoints: {
                0: { spaceBetween: 12 },
                768: { spaceBetween: 16 },
                1024: { spaceBetween: 20 },
                1200: { spaceBetween: 24 },
                1500: { spaceBetween: 30 },
            },
            a11y: { enabled: true },
        });
        return () => {
            swiperRef.current?.destroy(true, true);
            swiperRef.current = null;
        };
    }, []);

    const handleTogglePlay = () => {
        if (!swiperRef.current) return;
        if (isPlaying) {
            swiperRef.current.autoplay.stop();
            setIsPlaying(false);
        } else {
            swiperRef.current.autoplay.start();
            setIsPlaying(true);
        }
    };

    return (
        <footer id='footer'>
            <h2 className='notext' style={{display: 'none'}}>푸터영역</h2>
            <div className='footer_wrap'>
                <div className='footer_banner'>
                    <div className='swiper' id='banner_f_slider' ref={swiperContainerRef}>
                        <div className='swiper-wrapper'>
                            <div className='swiper-slide'><a href='https://me.go.kr/home/web/main.do' target='_blank' title='새창' rel='noopener'>환경부</a></div>
                            <div className='swiper-slide'><a href='https://www.keci.or.kr' target='_blank' title='새창' rel='noopener'>한국환경보전원</a></div>
                            <div className='swiper-slide'><a href='https://www.keco.or.kr/web/index.do' target='_blank' title='새창' rel='noopener'>한국환경공단</a></div>
                            <div className='swiper-slide'><a href='https://www.keco.or.kr/ecolove/main.do' target='_blank' title='새창' rel='noopener'>환경사랑홍보교육관</a></div>
                            <div className='swiper-slide'><a href='https://cpoint.or.kr/' target='_blank' title='새창' rel='noopener'>탄소중립포인트</a></div>
                            <div className='swiper-slide'><a href='https://keci.or.kr/gradcc' target='_blank' title='새창' rel='noopener'>기후변화특성화대학원</a></div>
                            <div className='swiper-slide'><a href='https://www.kei.re.kr/' target='_blank' title='새창' rel='noopener'>KEI한국환경연구원</a></div>
                            <div className='swiper-slide'><a href='https://www.keiti.re.kr/site/keiti/main.do' target='_blank' title='새창' rel='noopener'>KEITI</a></div>
                            <div className='swiper-slide'><a href='http://www.climateforum.or.kr/' target='_blank' title='새창' rel='noopener'>국회기후변화포럼</a></div>
                            <div className='swiper-slide'><a href='http://www.climate.go.kr/atlas' target='_blank' title='새창' rel='noopener'>기상청 기후변화상황지도</a></div>
                            <div className='swiper-slide'><a href='https://kaccc.kei.re.kr/' target='_blank' title='새창' rel='noopener'>국가기후위기적응센터</a></div>
                        </div>
                        <div className='swiper-controls'>
                            <div className='swiper-button-prev' aria-label='Previous slide'></div>
                            <div className='play_stop'>
                                <button
                                    className={`toggle ${isPlaying ? 'playing' : 'paused'}`}
                                    type='button'
                                    onClick={handleTogglePlay}
                                >
                                    <span className='sr_only'>{isPlaying ? '정지' : '재생'}</span>
                                </button>
                            </div>
                            <div className='swiper-button-next' aria-label='Next slide'></div>
                        </div>
                    </div>
                </div>
                <div className='section'>
                    {/*logo*/}
                    <div id='logo' className='black'>
                        <a href='#' aria-label='홈'></a>
                    </div>
                    <div className='footer_info'>
                        <p className='address'>(61954) 광주광역시 서구 천변우하로 181 TEL.062.601.1311 FAX.062.601.1313</p>
                        <p className='copyright'>© 2023 Gwangju Climate & Energy Agency. All Rights Reserved.</p>
                    </div>
                    <div className='footer_sns'>
                        <ul>
                            <li>
                                <a href='#' aria-label='페이스북'></a>
                            </li>
                            <li>
                                <a href='#' aria-label='인스타그램'></a>
                            </li>
                            <li>
                                <a href='#' aria-label='유튜브'></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;