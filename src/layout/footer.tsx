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
        const containerEl = swiperContainerRef.current as HTMLElement;

        swiperRef.current = new Swiper(containerEl, {
            modules: [Navigation, Autoplay, A11y],
            slidesPerView: 'auto',
            spaceBetween: 30,
            loop: true,
            speed: 600,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
                stopOnLastSlide: false,
                pauseOnMouseEnter: false,
            },
            navigation: {
                nextEl: '.footer_banner .swiper-button-next',
                prevEl: '.footer_banner .swiper-button-prev',
            },
            observer: true,
            observeParents: true,
            allowTouchMove: true,
            breakpoints: {
                0: { spaceBetween: 12 },
                768: { spaceBetween: 16 },
                1024: { spaceBetween: 20 },
                1200: { spaceBetween: 24 },
                1500: { spaceBetween: 30 },
            },
            a11y: { enabled: true },
            on: {
                init: (sw) => {
                    if (sw.autoplay && typeof sw.autoplay.start === 'function') {
                        sw.autoplay.start();
                    }
                },
            },
        });

        const onResize = () => {
            swiperRef.current?.update();
        };

        window.addEventListener('resize', onResize);

        return () => {
            swiperRef.current?.destroy(true, true);
            swiperRef.current = null;
            window.removeEventListener('resize', onResize);
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
                            <div className='swiper-slide'><a href='https://www.gen.go.kr/main/main.php' target='_blank' title='새창' rel='noopener'>광주광역시 교육청</a></div>
                            <div className='swiper-slide'><a href='https://www.me.go.kr/ysg/web/main.do' target='_blank' title='새창' rel='noopener'>영산강유역환경청</a></div>
                            <div className='swiper-slide'><a href='https://welfare.gwangju.go.kr/main' target='_blank' title='새창' rel='noopener'>광주복지플랫폼</a></div>
                            <div className='swiper-slide'><a href='https://gjenergyvillage.com/' target='_blank' title='새창' rel='noopener'>에너지전환마을 지원 플랫폼</a></div>
                            <div className='swiper-slide'><a href='https://gjeec.or.kr/' target='_blank' title='새창' rel='noopener'>광주광역시 환경교육통합시스템</a></div>
                            <div className='swiper-slide'><a href='https://gcea.or.kr/network/' target='_blank' title='새창' rel='noopener'>기후환경네트워크</a></div>
                            <div className='swiper-slide'><a href='https://blog.naver.com/seseguide' target='_blank' title='새창' rel='noopener'>에너지관리공단 광주전남지역본부</a></div>
                            <div className='swiper-slide'><a href='https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml&menuCd=index3' target='_blank' title='새창' rel='noopener'>홈텍스</a></div>
                            <div className='swiper-slide'><a href='https://www.gwangju.go.kr/main.do' target='_blank' title='새창' rel='noopener'>광주광역시</a></div>
                            <div className='swiper-slide'><a href='https://www.keiti.re.kr/site/keiti/main.do' target='_blank' title='새창' rel='noopener'>한국환경산업기술원</a></div>
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