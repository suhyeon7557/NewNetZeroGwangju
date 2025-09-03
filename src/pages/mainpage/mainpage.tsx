'use client';
import React from 'react';
import Link from 'next/link';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

import "./mainpage.scss";

const MainPage = () => {
    React.useEffect(() => {
        const subNav = document.querySelector('.sub_nav');
        const subNavGnb = document.getElementById('sub_nav_gnb');
        if (!subNav || !subNavGnb) return;

        const lnbAreas = Array.from(subNavGnb.querySelectorAll(':scope > li.lnb_area')) as HTMLLIElement[];
        if (lnbAreas.length < 2) return;

        const firstArea = lnbAreas[0];
        const secondArea = lnbAreas[1];

        const firstAnchor = firstArea.querySelector(':scope > a') as HTMLAnchorElement | null;
        const secondAnchor = secondArea.querySelector(':scope > a') as HTMLAnchorElement | null;
        const firstList = firstArea.querySelector(':scope > .lnb_list') as HTMLUListElement | null;
        const secondList = secondArea.querySelector(':scope > .lnb_list') as HTMLUListElement | null;
        if (!firstAnchor || !secondAnchor || !firstList || !secondList) return;

        let openedList: HTMLUListElement | null = null;

        const closeAll = () => {
            if (firstList) firstList.classList.remove('open');
            if (secondList) secondList.classList.remove('open');
            openedList = null;
        };

        const toggleList = (list: HTMLUListElement) => {
            const willOpen = !list.classList.contains('open');
            closeAll();
            if (willOpen) {
                list.classList.add('open');
                openedList = list;
            }
        };

        const rebuildSecondFromSubUl = (subUl: HTMLUListElement | null) => {
            secondList.innerHTML = '';
            if (subUl) {
                const subLis = Array.from(subUl.querySelectorAll(':scope > li')) as HTMLLIElement[];
                subLis.forEach((li) => {
                    const link = li.querySelector('a');
                    const text = link ? (link.textContent || '').trim() : (li.textContent || '').trim();
                    const newLi = document.createElement('li');
                    const newA = document.createElement('a');
                    newA.setAttribute('href', '#');
                    newA.textContent = text;
                    newLi.appendChild(newA);
                    secondList.appendChild(newLi);
                });
                const firstSubItem = secondList.querySelector('li > a') as HTMLAnchorElement | null;
                secondAnchor.textContent = firstSubItem ? (firstSubItem.textContent || '').trim() : '메뉴 선택';
            } else {
                secondAnchor.textContent = '메뉴 선택';
            }
        };

        // 1콤보 중복 제거 (텍스트 기준)
        const dedupeFirstCombo = () => {
            const seen = new Set<string>();
            const items = Array.from(firstList.querySelectorAll(':scope > li')) as HTMLLIElement[];
            items.forEach((li) => {
                const a = li.querySelector(':scope > a');
                const txt = a ? (a.textContent || '').trim() : (li.textContent || '').trim();
                const key = txt.replace(/\s+/g, ' ');
                if (seen.has(key)) {
                    li.parentElement?.removeChild(li);
                } else {
                    seen.add(key);
                }
            });
        };

        const onClickFirstAnchor = (e: Event) => {
            e.preventDefault();
            toggleList(firstList);
        };
        const onClickSecondAnchor = (e: Event) => {
            e.preventDefault();
            toggleList(secondList);
        };

        const onOutsideClick = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!subNav.contains(t)) {
                closeAll();
            }
        };

        const onKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeAll();
        };

        // 첫 번째 콤보 내부 항목 클릭 시: 두 번째 콤보에 서브메뉴 동기화
        const bindFirstListItemClicks = () => {
            const firstItems = Array.from(firstList.querySelectorAll(':scope > li > a')) as HTMLAnchorElement[];
            firstItems.forEach((a) => {
                a.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    const selectedText = (a.textContent || '').trim();
                    if (selectedText) firstAnchor.textContent = selectedText;

                    const parentLi = a.parentElement as HTMLLIElement | null;
                    const subUl = parentLi ? (parentLi.querySelector(':scope > ul') as HTMLUListElement | null) : null;

                    rebuildSecondFromSubUl(subUl);

                    // 첫 번째 닫고 두 번째는 자동으로 열지 않음
                    firstList.classList.remove('open');
                    secondList.classList.remove('open');
                    openedList = null;
                });
            });
        };

        // 두 번째 콤보 리스트 항목 클릭 시: 텍스트만 반영하고 닫기
        const bindSecondListClicks = () => {
            secondList.addEventListener('click', (ev) => {
                const target = ev.target as HTMLElement;
                const a = target.closest('a');
                if (a && secondList.contains(a)) {
                    ev.preventDefault();
                    const txt = (a.textContent || '').trim();
                    if (txt) secondAnchor.textContent = txt;
                    closeAll();
                }
            });
        };

        // 초기 바인딩
        dedupeFirstCombo();
        firstAnchor.addEventListener('click', onClickFirstAnchor);
        secondAnchor.addEventListener('click', onClickSecondAnchor);
        document.addEventListener('click', onOutsideClick);
        document.addEventListener('keydown', onKeydown);
        bindFirstListItemClicks();
        bindSecondListClicks();

        // 초기 진입 시: 첫 콤보의 현재 텍스트 기준으로 두 번째 콤보 동기화
        const currentMain = (firstAnchor.textContent || '').trim();
        let matchAnchor = Array.from(firstList.querySelectorAll(':scope > li > a')).find((a) => {
            return (a.textContent || '').trim() === currentMain;
        }) as HTMLAnchorElement | undefined;
        if (!matchAnchor) {
            matchAnchor = firstList.querySelector(':scope > li > a') as HTMLAnchorElement | null || undefined;
            if (matchAnchor) {
                const txt = (matchAnchor.textContent || '').trim();
                if (txt) firstAnchor.textContent = txt;
            }
        }
        if (matchAnchor) {
            const li = matchAnchor.parentElement as HTMLLIElement | null;
            const subUl = li ? (li.querySelector(':scope > ul') as HTMLUListElement | null) : null;
            rebuildSecondFromSubUl(subUl);
            // 초기에는 모두 닫은 상태 유지
            firstList.classList.remove('open');
            secondList.classList.remove('open');
            openedList = null;
        }

        // 언마운트 시 정리
        return () => {
            firstAnchor.removeEventListener('click', onClickFirstAnchor);
            secondAnchor.removeEventListener('click', onClickSecondAnchor);
            document.removeEventListener('click', onOutsideClick);
            document.removeEventListener('keydown', onKeydown);
        };
    }, []);

    // 간단한 JSP 호환형 지도 오버레이 토글 스크립트
    React.useEffect(() => {
        var buttons = document.querySelectorAll('.map_canvas .gu_label');
        var overlays = document.querySelectorAll('.map_canvas img.overlay');
        if (!buttons || !buttons.length || !overlays || !overlays.length) return;
        var active = null as any;

        function showCode(code: string, btn?: any) {
            var key = code.substring(0,2); // GS/BK/SE/DO/NM
            overlays.forEach(function (img: any) { img.classList.remove('on'); });
            var target = document.querySelector('.map_canvas img.overlay.ov_' + key) as any;
            if (target) { target.classList.add('on'); }
            active = code;
            buttons.forEach(function (b: any) { b.classList.remove('active'); });
            if (btn) btn.classList.add('active');
            // 그래프 타이틀 동기화
            var title = document.getElementById('graphGuTitle');
            var guName = (btn && btn.textContent) ||
                (key === 'GS' ? '광산구' : key === 'BK' ? '북구' : key === 'SE' ? '서구' : key === 'DO' ? '동구' : key === 'NM' ? '남구' : '');
            if (title && guName) title.textContent = guName + ' 온실가스 배출량';
        }

        function clickHandler(e: any) {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            var btn = e.currentTarget;
            var code = btn && btn.getAttribute('data-code');
            if (!code) return;
            if ((active as any) === code) {
                overlays.forEach(function (img: any) { img.classList.remove('on'); });
                active = null;
                buttons.forEach(function (b: any) { b.classList.remove('active'); });
            } else {
                showCode(code, btn);
            }
        }
        buttons.forEach(function (btn: any) { btn.addEventListener('click', clickHandler); });
        // 탭 on/off 토글
        var tabs = document.querySelectorAll('.graph_tabs a');
        function tabClick(e: any) {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            tabs.forEach(function (t: any) { t.classList.remove('on'); });
            var t = e.currentTarget; if (t) t.classList.add('on');
        }
        tabs.forEach(function (t: any) { t.addEventListener('click', tabClick); });
        return function () {
            buttons.forEach(function (btn: any) { btn.removeEventListener('click', clickHandler); });
            tabs.forEach(function (t: any) { t.removeEventListener('click', tabClick); });
        };
    }, []);

    // notice 슬라이더 - Swiper 수직(아래 방향) 자동재생
    React.useEffect(() => {
        const container = document.querySelector('.notice_slider') as HTMLElement | null;
        const wrapper = container?.querySelector('.notice_list') as HTMLElement | null;
        if (!container || !wrapper) return;

        // li들을 슬라이드로 마킹 (JSP 변환 시에도 간단히 유지)
        const items = Array.from(wrapper.querySelectorAll(':scope > li')) as HTMLElement[];
        items.forEach((li) => li.classList.add('swiper-slide'));
        wrapper.classList.add('swiper-wrapper');

        // 초기 on 클래스 제거 (한 개만 보이도록 Swiper가 관리)
        items.forEach((li) => li.classList.remove('on'));

        // 컨테이너 높이를 1개 슬라이드 높이로 고정
        const resize = () => {
            const first = items[0];
            if (!first) return;
            const h = Math.ceil(first.getBoundingClientRect().height);
            container.style.height = (h || 40) + 'px';
        };
        resize();
        window.addEventListener('resize', resize);

        // Swiper 초기화 (수직 아래 방향, 자동재생)
        const swiper = new Swiper(container as any, {
            modules: [Autoplay],
            direction: 'vertical',
            slidesPerView: 1,
            loop: true,
            allowTouchMove: false,
            speed: 400,
            autoplay: { delay: 3000, disableOnInteraction: false, reverseDirection: true },
        });

        // 컨트롤 버튼 바인딩
        const prevBtn = document.querySelector('.notice_prev') as HTMLButtonElement | null;
        const nextBtn = document.querySelector('.notice_next') as HTMLButtonElement | null;
        const playBtn = document.querySelector('.notice_play') as HTMLButtonElement | null;

        const syncPlayStateVisual = (playing: boolean) => {
            if (!playBtn) return;
            playBtn.dataset.state = playing ? 'playing' : 'paused';
            // playing=true → 정지 아이콘, playing=false → 재생 아이콘
            if (playing) {
                playBtn.classList.remove('on');
                playBtn.setAttribute('aria-label', '정지');
            } else {
                playBtn.classList.add('on');
                playBtn.setAttribute('aria-label', '재생');
            }
        };

        // 초기 상태 정돈
        const isPlaying = playBtn?.dataset.state !== 'paused';
        syncPlayStateVisual(!!isPlaying);
        if (isPlaying) swiper.autoplay.start(); else swiper.autoplay.stop();

        const onPrev = (e: Event) => { e.preventDefault(); swiper.slidePrev(); };
        const onNext = (e: Event) => { e.preventDefault(); swiper.slideNext(); };
        const onPlayToggle = (e: Event) => {
            e.preventDefault();
            const nowPlaying = playBtn?.dataset.state === 'playing';
            if (nowPlaying) {
                swiper.autoplay.stop();
                syncPlayStateVisual(false);
            } else {
                swiper.autoplay.start();
                syncPlayStateVisual(true);
            }
        };

        prevBtn?.addEventListener('click', onPrev);
        nextBtn?.addEventListener('click', onNext);
        playBtn?.addEventListener('click', onPlayToggle);

        return () => {
            prevBtn?.removeEventListener('click', onPrev);
            nextBtn?.removeEventListener('click', onNext);
            playBtn?.removeEventListener('click', onPlayToggle);
            window.removeEventListener('resize', resize);
            try { swiper.destroy(true, false); } catch {}
        };
    }, []);

    const [activeGu, setActiveGu] = React.useState<null | 'GSgu' | 'BKgu' | 'SEgu' | 'DOgu' | 'NMgu'>(null);
    const guItems: { code: 'GSgu' | 'BKgu' | 'SEgu' | 'DOgu' | 'NMgu'; label: string }[] = [
        { code: 'GSgu', label: '광산구' },
        { code: 'BKgu', label: '북구' },
        { code: 'SEgu', label: '서구' },
        { code: 'DOgu', label: '동구' },
        { code: 'NMgu', label: '남구' },
    ];
    return (
        <div aria-label='탄소중립 메인 페이지 영역' className='main_page'>
            <main className='main_wrap' aria-label='메인 콘텐츠 영역'>
                <section>
                    <div className='main_visual_silde' aria-label='메인 비주얼 슬라이드 영역'>
                        <div className='bg bg1' aria-hidden='true'></div>
                        <div className='bg bg2' aria-hidden='true'></div>
                    <div className='main_visual_layer' aria-label='메인 비주얼 레이어 영역'>
                        <div className='main_top_wrap'>
                            <div className='main_title'>
                                <h2 className='main_visual_title'>일상 속 작은 실천이 <br/>지구를 되찾는 시작이 됩니다.</h2>
                            </div>
                            <div className='emission_wrap' aria-label='온실가스 배출량 그래프 영역'>
                                <div className='map_wrap' aria-label='지도 영역'>
                                    <div className='map_canvas'>
                                        <img className='base_map' src='/image_map.svg' alt='광주 지도' />
                                        {/* 전체 크기의 오버레이 이미지 (기본은 숨김, on 클래스 시 노출) */}
                                        <img className='overlay ov_GS' src='/image_map_gsgu.png' alt='광산구' />
                                        <img className='overlay ov_BK' src='/image_map_bkgu.png' alt='북구' />
                                        <img className='overlay ov_SE' src='/image_map_segu.png' alt='서구' />
                                        <img className='overlay ov_DO' src='/image_map_dogu.png' alt='동구' />
                                        <img className='overlay ov_NM' src='/image_map_nmgu.png' alt='남구' />
                                        {/* 지도 위 텍스트 라벨 클릭으로 토글 */}
                                        <a href='#' className='gu_label gu_GS' data-code='GSgu'>광산구</a>
                                        <a href='#' className='gu_label gu_BK' data-code='BKgu'>북구</a>
                                        <a href='#' className='gu_label gu_SE' data-code='SEgu'>서구</a>
                                        <a href='#' className='gu_label gu_DO' data-code='DOgu'>동구</a>
                                        <a href='#' className='gu_label gu_NM' data-code='NMgu'>남구</a>
                                    </div>
                                </div>
                                <div className='emission_graph' aria-label='그래프 영역'>
                                    <div className='graph_header'>
                                        <h3 id='graphGuTitle'>북구 온실가스 배출량</h3>
                                        <ul className='graph_tabs' aria-label='분류 탭 영역'>
                                            <li><a href='#' data-tab='ALL' className='on'>전체</a></li>
                                            <li><a href='#' data-tab='TRANS'>전환</a></li>
                                            <li><a href='#' data-tab='BUILD'>건물</a></li>
                                            <li><a href='#' data-tab='MOVE'>수송</a></li>
                                            <li><a href='#' data-tab='FARM'>농·축산</a></li>
                                            <li><a href='#' data-tab='WASTE'>폐기물</a></li>
                                            <li><a href='#' data-tab='INDUS'>산업</a></li>
                                            <li><a href='#' data-tab='SINK'>흡수원</a></li>
                                        </ul>
                                    </div>
                                    <div className='graph_placeholder' aria-label='그래프 영역'></div>
                                </div>
                            </div>
                            <div className='main_notice' aria-label='공지사항 슬라이드 영역'>
                                <div className='notice_wrap'>
                                    <div className='notice_badge'>
                                        <p>공지사항입니다.</p>
                                    </div>                   
                                    <div className='notice_row'>
                                        <div className='notice_slider'>
                                            <ul className='notice_list'>
                                                <li className='on'>
                                                    <span className='date'>2025-07-01</span>
                                                    <a className='txt_cut1' href='#'>중소·중견기업 탄소중립 이행 국가지원사업 설명회 개최</a>
                                                </li>
                                                <li>
                                                    <span className='date'>2025-06-22</span>
                                                    <a className='txt_cut1' href='#'>광주시 탄소중립 시민실천 캠페인 안내</a>
                                                </li>
                                                <li>
                                                    <span className='date'>2025-06-10</span>
                                                    <a className='txt_cut1' href='#'>탄소발자국 계산기 업데이트 공지</a>
                                                </li>
                                                <li>
                                                    <span className='date'>2025-05-28</span>
                                                    <a className='txt_cut1' href='#'>넷제로광주 홈페이지 개설 안내 안녕하세요 넷제로 광주 홈페이지를 새로 오픈하였습니다.
                                                        새롭게 오픈된 홈페이지에서 광주광역시 탄소중립 사업 및 시민실천 활동을 확인해 보세요. </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='notice_controls'>
                                            <button type='button' className='notice_prev' aria-label='이전'>
                                                <img src='/ic_prev_white.svg' alt='' />
                                            </button>
                                            <button type='button' className='notice_play on' data-state='playing' aria-label='정지'>
                                                <img src='/ic_stop_white.svg' alt='' />
                                            </button>
                                            <button type='button' className='notice_next' aria-label='다음'>
                                                <img src='/ic_next_white.svg' alt='' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className='main_content'>

                    </div>
                </section>
            </main>
        </div>
    );
}

export default MainPage;