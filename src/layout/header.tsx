"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';


const Header = () => {
    const gnbRef = useRef<HTMLUListElement | null>(null);
    const headerWrapRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLElement | null>(null);
    const [isGnb2Open, setIsGnb2Open] = useState(false);
    const closeGnb2TimeoutRef = useRef<number | null>(null);
    const isGnb2OpenRef = useRef<boolean>(false);
    const isMouseOverGnb2Ref = useRef<boolean>(false);

    const scheduleGnb2Close = (delayMs: number = 300) => {
        if (closeGnb2TimeoutRef.current) {
            window.clearTimeout(closeGnb2TimeoutRef.current);
            closeGnb2TimeoutRef.current = null;
        }
        closeGnb2TimeoutRef.current = window.setTimeout(() => {
            setIsGnb2Open(false);
            closeGnb2TimeoutRef.current = null;
        }, delayMs);
    };

    const cancelGnb2Close = () => {
        if (closeGnb2TimeoutRef.current) {
            window.clearTimeout(closeGnb2TimeoutRef.current);
            closeGnb2TimeoutRef.current = null;
        }
    };

    useEffect(() => {
        isGnb2OpenRef.current = isGnb2Open;
    }, [isGnb2Open]);

    useEffect(() => {
        const gnb = gnbRef.current;
        if (!gnb) return;

        // 동적 컬럼 폭 계산
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

    // 상단 메뉴 클릭 시 배경 오버레이 및 서브메뉴 오픈 토글
    useEffect(() => {
        const anchors = Array.from(document.querySelectorAll('#gnb1 > ul > li > a')) as HTMLAnchorElement[];
        const headerWrap = headerWrapRef.current;
        if (!headerWrap) return;

        const openMenu = (e: Event) => {
            e.preventDefault();
            headerWrap.classList.add('menu-open');
            setIsGnb2Open(false);
        };
        anchors.forEach(a => a.addEventListener('click', openMenu));

        const closeIfOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const menuInner = document.getElementById('menu_inner');
            const gnb2El = document.getElementById('gnb2');
            const isInsideMenuInner = menuInner ? menuInner.contains(target) : false;
            const isInsideGnb2 = gnb2El ? gnb2El.contains(target) : false;
            const isGnb2Active = gnb2El ? gnb2El.classList.contains('active') : false;
            if (headerWrap.classList.contains('menu-open') || isGnb2Active) {
                if (!isInsideMenuInner && !isInsideGnb2) {
                    headerWrap.classList.remove('menu-open');
                    setIsGnb2Open(false);
                }
            }
        };
        const onKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                headerWrap.classList.remove('menu-open');
                setIsGnb2Open(false);
            }
        };
        document.addEventListener('click', closeIfOutside);
        document.addEventListener('keydown', onKeydown);

        return () => {
            anchors.forEach(a => a.removeEventListener('click', openMenu));
            document.removeEventListener('click', closeIfOutside);
            document.removeEventListener('keydown', onKeydown);
        };
    }, []);

    // :has() 미지원 환경 폴백: gnb hover 시 오버레이/서브메뉴 표시
    useEffect(() => {
        const headerWrap = headerWrapRef.current;
        const gnb = document.getElementById('gnb1');
        if (!headerWrap || !gnb) return;

        const onEnter = () => {
            headerWrap.classList.add('menu-hover');
            // 상단 메뉴 호버 시 gnb2가 열려 있고, gnb2 위에 포인터가 없으면 지연 닫기
            if (isGnb2OpenRef.current && !isMouseOverGnb2Ref.current) {
                scheduleGnb2Close(600);
            }
        };
        const onLeave = () => headerWrap.classList.remove('menu-hover');

        gnb.addEventListener('mouseenter', onEnter);
        gnb.addEventListener('mouseleave', onLeave);
        return () => {
            gnb.removeEventListener('mouseenter', onEnter);
            gnb.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    // gnb2가 열려 있을 때 상단 메뉴 항목 hover/포커스 시 gnb2 지연 닫기
    useEffect(() => {
        const anchors = Array.from(document.querySelectorAll('#gnb1 > ul > li > a')) as HTMLAnchorElement[];
        if (anchors.length === 0) return;
        const maybeScheduleClose = () => {
            if (!isGnb2OpenRef.current) return;
            if (isMouseOverGnb2Ref.current) return;
            scheduleGnb2Close(600);
        };
        anchors.forEach(a => {
            a.addEventListener('mouseenter', maybeScheduleClose);
            a.addEventListener('focus', maybeScheduleClose);
        });
        return () => {
            anchors.forEach(a => {
                a.removeEventListener('mouseenter', maybeScheduleClose);
                a.removeEventListener('focus', maybeScheduleClose);
            });
        };
    }, []);

    // 언마운트 시 대기 중인 타이머 정리
    useEffect(() => {
        return () => {
            if (closeGnb2TimeoutRef.current) {
                window.clearTimeout(closeGnb2TimeoutRef.current);
                closeGnb2TimeoutRef.current = null;
            }
        };
    }, []);
    // 스크롤 시 헤더 상단 고정 상태에서 배경/텍스트/아이콘 색 전환
    useEffect(() => {
        const headerEl = headerRef.current;
        if (!headerEl) return;
        const computeOffset = () => {
            // 요청에 따라 헤더 오프셋을 40px로 고정 적용
            document.documentElement.style.setProperty('--header-offset', `40px`);
        };
        const onScroll = () => {
            if (window.scrollY > 0) {
                headerEl.classList.add('scrolled');
            } else {
                headerEl.classList.remove('scrolled');
            }
            computeOffset();
        };
        computeOffset();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', computeOffset);
        const ro = new ResizeObserver(computeOffset);
        ro.observe(headerEl);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', computeOffset);
            ro.disconnect();
        };
    }, []);
    const onClickHamburger = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsGnb2Open(prev => {
            const next = !prev;
            return next;
        });
    };

    // gnb2 열림 상태를 html 클래스에 반영하여 전역 스타일 제어
    useEffect(() => {
        const rootEl = document.documentElement;
        if (isGnb2Open) {
            rootEl.classList.add('gnb2-open');
        } else {
            rootEl.classList.remove('gnb2-open');
        }
        return () => rootEl.classList.remove('gnb2-open');
    }, [isGnb2Open]);

    const gnb2Markup = (
        <div id='gnb2-layer' className={isGnb2Open ? 'open' : ''}>
            <div className='gnb2-backdrop' onClick={() => setIsGnb2Open(false)} />
            <nav
                id='gnb2'
                className={isGnb2Open ? 'active' : ''}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => { isMouseOverGnb2Ref.current = true; cancelGnb2Close(); }}
                onMouseLeave={(e) => { isMouseOverGnb2Ref.current = false; }}
                onFocus={cancelGnb2Close}
            >
                <ul className='topmenu_all'>
                <li className='lnb2'>
                    <a href='#'>기후변화</a>
                    <div className='submenu'>
                        <ul className='sub'>
                            <li>
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
                <li className='lnb2'>
                    <a href='#'>탄소중립</a>
                    <div className='submenu'>
                        <ul className='sub'>
                            <li>
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
                <li className='lnb2'>
                    <a href='#'>광주의 탄소중립</a>
                    <div className='submenu'>
                        <ul className='sub'>
                            <li>
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
                <li className='lnb2'>
                    <a href='#'>정책지표</a>
                    <div className='submenu'>
                        <ul className='sub'>
                            <li>
                                <a href='#'>온실가스 배출량</a>
                            </li>
                            <li>
                                <a href='#'>정책지표 신호등</a>
                            </li>
                            <li>
                                <a href='#'>부문별 정책지표</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className='lnb2'>
                    <a href='#'>시민실천</a>
                    <div className='submenu'>
                        <ul className='sub'>
                            <li>
                                <a href='#'>생활실천안내</a>
                            </li>
                            <li>
                                <a href='#'>시민참여사업</a>
                            </li>
                            <li>
                                <a href='#'>시민실천과제</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className='lnb2'>
                    <a href='#'>소통하기</a>
                    <div className='submenu'>
                        <ul className='sub'>
                            <li>
                                <a href='#'>공지사항</a>
                            </li>
                            <li>
                                <a href='#'>연구보고서</a>
                            </li>
                            <li>
                                <a href='#'>탄소중립지원센터</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className='lnb2'>
                    <a href='#'>우리동네 배출지도</a>
                    <div className='submenu'>
                        <ul className='sub'>
                            <li>
                                <a href='#'>우리동네 배출지도</a>
                            </li>
                        </ul>
                    </div>
                </li>
                </ul>
            </nav>
        </div>
    );

    return (
        <>
        <header id='header' ref={headerRef}>
            <h2 className='notext' style={{display: 'none'}}>헤더영역</h2>
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
            <div className='header_wrap' ref={headerWrapRef}>
                {/*menu_inner*/}
                <div id='menu_inner'>
                    {/*logo*/}
                    <div id='logo'>
                        <a href='#' aria-label='홈'>
                        </a>
                    </div>
                    {/*gnb*/}
                    <nav id='gnb1'>
                        <ul id='' className='topmenu' ref={gnbRef}>
                            <li className='lnb'>
                                <a href='#'>
                                    기후변화
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub'>
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
                                        <li className='sub'>
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
                                        <li className='sub'>
                                            <a href='#'>탄소중립 히스토리</a>
                                        </li>
                                        <li>
                                            <a href='#'>탄소중립 기본계획</a>
                                        </li>
                                        <li>
                                            <a href='#'>부문별 주요시책</a>
                                        </li>
                                        <li>
                                            <a href='#'>온실가스 <br/>감축인지 예산제</a>
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
                                    정책지표
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub'>
                                            <a href='#'>온실가스 배출량</a>
                                        </li>
                                        <li>
                                            <a href='#'>정책지표 신호등</a>
                                        </li>
                                        <li>
                                            <a href='#'>부문별 정책지표</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className='lnb'>
                                <a href='#'>
                                    시민실천
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub'>
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
                                    소통하기
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li className='sub'>
                                            <a href='#'>공지사항</a>
                                        </li>
                                        <li>
                                            <a href='#'>연구보고서</a>
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
                                    우리동네 배출지도
                                </a>
                                <div className='submenu'>
                                    <ul>
                                        <li>
                                            <a href='#'>우리동네 배출지도</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </nav>
                    <div className='btn_hamburger'>
                        <a
                            href='#'
                            className={`btn_hamburger_inner${isGnb2Open ? ' open' : ''}`}
                            aria-label={isGnb2Open ? '메뉴 닫기' : '메뉴 열기'}
                            aria-expanded={isGnb2Open}
                            onClick={onClickHamburger}
                        ></a>
                    </div>
                </div>
            </div>
        </header>
        {typeof document !== 'undefined' && createPortal(gnb2Markup, document.body)}
        </>
    );
}

export default Header;