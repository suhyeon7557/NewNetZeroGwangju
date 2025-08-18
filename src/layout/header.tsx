"use client";
import React, { useEffect, useRef } from 'react';

// 단일 LNB 사용: nav 하위에 하나의 LNB 컨테이너를 둡니다

const Header = () => {
    const gnbRef = useRef<HTMLUListElement | null>(null);
    useEffect(() => {
        const gnb = gnbRef.current;
        if (!gnb) return;
        const items = Array.from(gnb.querySelectorAll(':scope > li')) as HTMLLIElement[];
        const updateCols = () => {
            const widths = items.map(li => li.getBoundingClientRect().width);
            const pxValues = widths.map(w => `${Math.round(w)}px`);
            const root = gnb.closest('.menu');
            if (root) {
                (root as HTMLElement).style.setProperty('--lnb-cols', pxValues.join(' '));
            }
        };
        updateCols();
        const ro = new ResizeObserver(updateCols);
        items.forEach(li => ro.observe(li));
        window.addEventListener('resize', updateCols);
        return () => {
            window.removeEventListener('resize', updateCols);
            ro.disconnect();
        };
    }, []);
    return (
        <header id='header'>
            <h2 className='notext' style={{display: 'none'}}>헤더영역</h2>
            <div className='header_wrap'>
                {/*climateclock*/}
                <div id='climateclock'>
                    <div className='climateclock_inner'>
                        <img className='earth3d' src='/ic_3Dearth.svg' alt='지구아이콘'></img>
                        <p className='climateclock_text'>지구의 평균 온도가 <span className='highlight'>1.5°C</span> 상승하기까지 남은 시간</p>
                        <div className='clock_inner'>
                            <div className='year'>
                                <span className='year_num'>04</span>
                                <span className='year_text'>년</span>
                            </div>
                            <div className='month'>
                                <span className='day_num'>19</span>
                                <span className='day_text'>일</span>
                            </div>
                            <div className='hour'>
                                <span className='hour_num'>10:26:40</span>
                                <span className='hour_text'>시</span>
                            </div>
                            <div className='temperature'>
                                <img src='/ic_thermometer.svg' alt='온도아이콘'></img>
                                <span className='temperature_num'>+ 1.2°C</span>
                                <p className='txt_black'>현재 기온 상승</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/*menu_inner*/}
                <div id='menu_inner'>
                    {/*logo*/}
                    <div id='logo'>
                        <a href='#' aria-label='홈'>
                        </a>
                    </div>
                    {/*gnb*/}
                    <nav id='gnb1'>
                        <ul id='head_menu' className='topmenu'>
                            <li className='lnb'>
                                <a href='#'>
                                    기후변화
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub01'>
                                            <a href='#'>기후변화</a>
                                        </li>
                                        <li>
                                            <a href='#'>우리나라 기후변화</a>
                                        </li>
                                        <li>
                                            <a href='#'>광주의 기후변화</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='lnb'>
                                <a href='#'>
                                    탄소중립
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub01'>
                                            <a href='#'>탄소중립</a>
                                        </li>
                                        <li>
                                            <a href='#'>국가기본계획</a>
                                        </li>
                                        <li>
                                            <a href='#'>국가정책</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='lnb'>
                                <a href='#'>
                                    광주의 탄소중립
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub01'>
                                            <a href='#'>탄소중립 히스토리</a>
                                        </li>
                                        <li>
                                            <a href='#'>탄소중립 기본계획</a>
                                        </li>
                                        <li>
                                            <a href='#'>부문별 주요시책</a>
                                        </li>
                                        <li>
                                            <a href='#'>온실가스 감축인지 예산제</a>
                                        </li>
                                        <li>
                                            <a href='#'>기업탄소액션</a>
                                        </li>
                                        <li>
                                            <a href='#'>관련 조례 및 계획</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='lnb'>
                                <a href='#'>
                                    탄소중립 정책지표
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub01'>
                                            <a href='#'>온실가스 배출량</a>
                                        </li>
                                        <li>
                                            <a href='#'>정책지표 신호등등</a>
                                        </li>
                                        <li>
                                            <a href='#'>부문별 정책지표</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='lnb'>
                                <a href='#'>
                                    탄소중립 시민실천
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub01'>
                                            <a href='#'>생활실천안내</a>
                                        </li>
                                        <li>
                                            <a href='#'>시민참여사업</a>
                                        </li>
                                        <li>
                                            <a href='#'>시민실천과제</a>
                                        </li>
                                        <li>
                                            <a href='#'>탄소발자국</a>
                                        </li>
                                        <li>
                                            <a href='#'>약속하기</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='lnb'>
                                <a href='#'>
                                    탄소중립 소통하기기
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub01'>
                                            <a href='#'>공지사항</a>
                                        </li>
                                        <li>
                                            <a href='#'>연구보고서서</a>
                                        </li>
                                        <li>
                                            <a href='#'>탄소중립지원센터</a>
                                        </li>
                                        <li>
                                            <a href='#'>문의하기</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='lnb'>
                                <a href='#'>
                                    우리동네 탄소배출 지도
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <nav id='gnb2'>
                    </nav>
                    <div className='btn_hamburger'>
                        <a href='#' className='btn_hamburger_inner'></a>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;