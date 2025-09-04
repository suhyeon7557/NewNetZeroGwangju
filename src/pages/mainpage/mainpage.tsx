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

    // 탄소발자국 입력 → CO2 자동 계산 (JSP 호환 간단 스크립트)
    React.useEffect(() => {
        const panels = Array.from(document.querySelectorAll('.carbon_ft_panels .panel')) as HTMLElement[];
        if (!panels.length) return;

        type Binding = { el: HTMLInputElement; type: keyof HTMLElementEventMap; handler: (e: any) => void };
        const bindings: Binding[] = [];

        const getFactor = (key?: string) => {
            if (key === 'electricity') return 0.478;
            if (key === 'gas') return 2.176;
            if (key === 'water') return 0.237;
            return 0;
        };

        panels.forEach((panel) => {
            const key = panel.dataset.tab || '';
            const factor = getFactor(key);
            const form = panel.querySelector('.analysis_form') as HTMLFormElement | null;
            if (!form) return;

            const usageInput = form.querySelector('input[data-role="usageInput"]') as HTMLInputElement | null;
            const segmented = form.querySelector('.segmented_input') as HTMLElement | null;
            const digitInputs = segmented ? (Array.from(segmented.querySelectorAll('input[data-role="digit"]')) as HTMLInputElement[]) : [];
            if (!usageInput || !segmented || !digitInputs.length) return;

            const displayCO2ToDigits = (co2: number) => {
                const s = (Number.isFinite(co2) ? co2 : 0).toFixed(1).replace(/\./g, '');
                const total = digitInputs.length;
                // 채우기: 뒤에서부터 숫자 채우고, 남은 앞부분은 공백
                for (let i = 0; i < total; i += 1) {
                    digitInputs[i].value = '';
                }
                let j = s.length - 1;
                for (let i = total - 1; i >= 0; i -= 1) {
                    if (j >= 0) {
                        digitInputs[i].value = s[j];
                        j -= 1;
                    } else {
                        digitInputs[i].value = '';
                    }
                }
            };

            const onUsageInput = () => {
                const raw = (usageInput.value || '').replace(/,/g, '');
                const val = parseFloat(raw);
                if (isNaN(val)) {
                    // 비움
                    digitInputs.forEach((inp) => (inp.value = ''));
                } else {
                    const co2 = val * factor;
                    displayCO2ToDigits(co2);
                }
            };

            usageInput.addEventListener('input', onUsageInput);
            bindings.push({ el: usageInput, type: 'input', handler: onUsageInput });

            // 초기 1회 계산
            onUsageInput();
        });

        return () => {
            bindings.forEach(({ el, type, handler }) => el.removeEventListener(type, handler));
        };
    }, []);

    // 탄소발자국 탭 전환 (간단 DOM 스크립트)
    React.useEffect(() => {
        const tabs = Array.from(document.querySelectorAll('.carbon_ft_tab a')) as HTMLAnchorElement[];
        const panels = Array.from(document.querySelectorAll('.carbon_ft_panels .panel')) as HTMLElement[];
        const container = document.querySelector('.carbon_ft_panels') as HTMLElement | null;
        if (!tabs.length || !panels.length) return;

        const activate = (key: string) => {
            tabs.forEach((a) => a.classList.toggle('on', (a.dataset.tab || '') === key));
            panels.forEach((p) => p.classList.toggle('on', (p.dataset.tab || '') === key));
            if (container) container.setAttribute('data-active', key);
        };

        const onClick = (e: Event) => {
            e.preventDefault();
            const a = e.currentTarget as HTMLAnchorElement;
            const key = a?.dataset?.tab || '';
            if (!key) return;
            activate(key);
        };

        tabs.forEach((a) => a.addEventListener('click', onClick));

        // 초기 활성화 상태 동기화
        const initial = tabs.find((a) => a.classList.contains('on'))?.dataset.tab || tabs[0]?.dataset.tab || '';
        if (initial) activate(initial);

        return () => {
            tabs.forEach((a) => a.removeEventListener('click', onClick));
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
            // 같은 항목을 다시 클릭해도 해제하지 않고 유지
            if ((active as any) !== code) {
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

        // React state로 선택된 구역 관리
        const [selectedGu, setSelectedGu] = React.useState<string | null>(null);

        // path 클릭 핸들러
        const handlePathClick = (guCode: string, guName: string) => {
            
            // 클릭된 path 요소 찾기
            const clickedPath = document.querySelector(`.overlay.ov_${guCode}`);
            
            if (selectedGu === guCode) {
                // 이미 선택된 구역을 다시 클릭하면 해제
                setSelectedGu(null);
                clickedPath?.classList.remove('on');
                
                // 그래프 타이틀을 원래대로 되돌리기
                const title = document.getElementById('graphGuTitle');
                if (title) title.textContent = '온실가스 배출량';
            } else {
                // 모든 path에서 on 클래스 제거
                document.querySelectorAll('.overlay').forEach(path => path.classList.remove('on'));
                
                // 새로운 구역 선택
                setSelectedGu(guCode);
                clickedPath?.classList.add('on');
                
                // 그래프 타이틀 동기화
                const title = document.getElementById('graphGuTitle');
                if (title) title.textContent = guName + ' 온실가스 배출량';
            }
        };

        // 탭 관리용 useEffect
        React.useEffect(() => {
            // 탭 on/off 토글
            var tabs = document.querySelectorAll('.graph_tabs a');
            function tabClick(e: any) {
                if (e && typeof e.preventDefault === 'function') e.preventDefault();
                tabs.forEach(function (t: any) { t.classList.remove('on'); });
                var t = e.currentTarget; if (t) t.classList.add('on');
            }
            tabs.forEach(function (t: any) { t.addEventListener('click', tabClick); });
            return function () {
                tabs.forEach(function (t: any) { t.removeEventListener('click', tabClick); });
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
                                    <svg width="600" height="405" viewBox="0 0 600 405" fill="none">
                                    <path className='overlay ov_GS' onClick={() => handlePathClick('GS', '광산구')} d="M253.001 321.259C253.021 322.769 252.636 324.266 251.614 325.736C250.605 326.672 249.337 327.331 248.48 328.452C248.168 328.788 247.803 329.072 247.412 329.309C245.659 329.902 244.444 331.168 243.329 332.553C241.949 334.267 240.827 336.126 240.123 338.222C240.01 338.499 239.858 338.757 239.678 339C237.408 341.552 234.832 343.859 233.326 347.011C231.938 348.461 232.117 350.676 230.777 352.146C229.854 353.689 228.466 354.876 227.484 356.372C227.318 356.623 227.119 356.854 226.907 357.065C225.931 357.988 225.001 358.957 223.886 359.728C222.917 360.486 221.954 361.251 220.985 362.016C220.693 362.187 220.388 362.306 220.069 362.385C215.197 364.574 209.621 363.479 204.742 365.668C204.118 365.945 203.434 365.932 202.797 365.655C202.604 365.569 202.412 365.464 202.232 365.332C201.595 364.653 201.954 363.769 201.755 363.005C201.376 361.818 201.031 360.612 199.723 360.058C196.464 358.291 195.807 354.632 193.769 351.975C190.695 349.944 192.348 347.426 193.032 345.006C194.014 342.442 193.477 340.286 191.041 338.921C189.959 338.315 189.952 337.425 189.72 336.522C189.208 334.531 188.306 332.678 187.655 330.733C187.396 329.316 187.828 327.832 187.297 326.435C186.341 324.18 183.898 324.43 182.199 323.435C181.614 323.646 181.03 323.85 180.446 324.061C176.496 324.358 174.1 322.65 173.416 318.715C172.819 316.354 171.551 314.376 169.918 312.603C169.141 311.12 168.783 309.346 167.077 308.496C166.267 307.56 166.957 306.346 166.486 305.351C166.3 304.085 165.743 302.674 164.501 302.615C160.552 302.424 159.204 299.18 157.033 296.873C156.257 296.398 155.467 295.93 154.61 295.594C151.975 294.684 149.565 293.385 147.508 291.486C145.649 291.117 144.354 290.293 144.248 288.137C144.202 287.195 143.611 286.291 142.987 285.54C141.693 283.971 140.159 282.487 137.988 283.727C136.097 284.808 135.99 286.647 136.873 288.546C137.783 289.693 137.364 290.735 136.628 291.757C134.782 292.581 132.837 291.981 130.952 292.146C128.987 291.717 127.089 290.741 124.991 291.467C123.172 291.407 121.294 291.882 119.574 290.873C117.49 290.484 116.627 288.414 114.908 287.524C113.573 286.766 112.173 286.667 110.719 287.142C109.424 287.926 107.898 287.583 106.524 287.992C105.933 288.157 105.335 288.328 104.745 288.493C101.578 289.166 99.932 287.069 98.2791 284.993C96.0022 281.894 92.537 281.61 89.8486 284.307C88.9724 285.955 88.9259 287.933 87.7377 289.456C86.2706 290.405 84.9696 291.598 83.3698 292.35C82.4471 292.521 81.5775 292.489 81.0929 291.526C80.21 289.766 78.816 289.687 77.1897 290.28C74.3884 290.715 74.8464 288.045 73.8108 286.799C73.2267 285.731 72.2641 285.527 71.1357 285.553C70.1067 285.579 69.0048 285.79 68.1419 284.946C67.1727 283.911 65.7654 283.977 64.5573 283.72C61.663 283.1 60.8133 284.175 61.4971 287.274C61.736 287.755 62.0746 288.177 62.3335 288.638C63.9001 291.453 63.7872 291.711 60.5744 292.785C59.0277 292.93 57.4611 292.62 55.921 292.976C52.2833 295.831 48.1212 297.387 43.5542 297.961C42.7177 298.158 41.8681 298.086 41.025 298.04C39.8899 297.591 38.6618 297.901 37.5134 297.604C35.356 296.602 35.2896 295.211 36.8164 293.609C37.6462 292.739 38.3432 291.836 38.5955 290.649C39.1132 288.592 38.9738 286.522 38.7282 284.452C38.5224 284.01 38.2038 283.667 37.7657 283.43C35.2299 282.922 33.0327 281.841 31.2337 279.949C29.7335 278.373 27.9611 278.36 26.0759 279.244C24.4894 279.989 23.0091 281.004 21.2101 281.254C20.1613 281.281 19.1125 281.327 18.2495 280.569C18.1035 280.312 17.9574 280.055 17.8114 279.797C17.7649 279.593 17.6919 279.409 17.5923 279.23C16.7759 278.848 16.5833 278.143 16.6829 277.352C17.121 273.745 15.103 271.853 12.0097 270.706C12.0097 270.521 11.9234 270.429 11.7375 270.429C11.379 269.783 10.3368 269.196 10.7617 268.478C12.5208 265.491 11.5782 262.419 11.3259 259.353C11.7574 257.685 13.1249 256.373 13.1846 254.567C13.5497 253.051 13.251 251.508 13.3771 249.985C14.6649 246.313 14.5786 242.377 15.6275 238.652C16.1917 236.648 15.2624 234.848 13.9812 233.266C13.2842 232.389 13.3572 231.281 13.0651 230.279C13.0054 228.657 12.9855 227.029 13.0784 225.407C13.9613 222.731 12.8593 221.794 10.1842 221.946C8.09979 222.065 5.98222 222.15 3.93767 221.537C2.24494 221.036 0.6717 220.08 0.718167 218.247C0.764634 216.369 2.61668 216.56 4.02397 216.349C6.02869 216.039 7.79444 215.188 9.18181 213.666C9.93192 211.707 9.81907 209.262 12.2486 208.24C12.5009 207.805 12.7598 207.363 13.012 206.928C14.1737 205.471 13.5563 204.205 12.3947 203.216C10.7086 201.779 10.9741 200.625 12.3615 199.115C13.3838 198.001 14.1604 196.65 15.3155 195.634C16.8024 194.322 17.2272 192.793 16.3245 190.973L16.3643 191C14.3994 188.817 13.7754 186.431 15.2557 183.728C15.8399 182.858 16.4174 181.994 17.0015 181.124C17.3866 178.796 18.827 177.946 21.0906 178.256C22.956 178.882 25.047 177.867 26.8393 179.034C27.1247 179.04 27.4035 179.054 27.689 179.06C29.4946 176.68 31.4462 174.498 34.6391 173.984C37.0023 172.955 39.7439 172.79 41.7154 170.879C42.4257 169.929 43.5741 169.303 43.8661 168.037C43.428 166.356 44.8552 164.358 42.9766 162.928C41.888 161.978 40.5139 161.649 39.1995 161.181C38.0578 160.851 36.6173 161.233 35.9269 159.822C34.6458 157.752 33.1123 155.873 31.5856 153.981C31.34 153.546 31.0877 153.111 30.8421 152.676C29.5211 152.089 29.229 150.705 29.4016 149.703C29.7601 147.685 28.9104 146.222 27.9545 144.685C27.1646 143.275 26.0958 142.141 24.662 141.35C23.8654 140.743 22.8431 140.492 22.1328 139.754C21.3562 139.148 20.3472 138.778 19.9622 137.743C18.8337 136.207 17.6853 134.678 16.6298 133.089C16.0589 132.166 15.581 131.184 15.03 130.247C14.5521 128.955 14.2666 127.736 15.7536 126.832C17.0215 126.061 18.2562 126.213 19.4842 126.839C20.5596 127.393 21.2566 128.448 22.3187 129.034L23.6795 128.975C25.1001 127.155 26.5671 125.547 28.9502 127.722C29.3352 127.94 29.7202 128.151 30.0986 128.368C31.9175 129.074 33.4442 127.531 35.1901 127.716C36.4181 127.656 37.6595 127.867 38.861 127.465C39.173 127.412 39.485 127.34 39.7903 127.248C41.3237 126.7 42.5916 127.676 43.979 127.953C44.9216 128.349 45.2602 129.252 45.7447 130.03C46.4218 131.315 47.537 131.902 48.951 132.008C50.3848 132.535 51.2013 131.981 51.6062 130.577C51.9315 129.443 51.9846 128.25 52.4758 127.155C54.2416 125.395 52.582 123.866 52.1439 122.257C51.6859 121.545 51.4071 120.787 51.5332 119.923C52.0709 118.736 52.9339 117.728 53.4583 116.528C53.2591 116.126 53.06 115.724 52.8608 115.321C52.7812 111.999 53.0002 108.953 56.1799 106.672C57.9125 105.432 57.2951 102.821 57.7133 100.844C57.9988 99.4987 58.3373 98.4175 59.6583 98.1736C62.3866 97.6659 63.6478 95.7343 64.7033 93.5191C64.783 93.3147 64.8161 93.0972 64.8095 92.8796C64.4046 90.6381 65.4202 88.8712 66.7147 87.1901C68.1817 84.4277 70.7307 85.8187 72.8616 85.6078C75.0721 86.7615 74.4415 89.8997 76.6852 91.027C78.0858 91.5017 78.889 92.6554 79.7984 93.6905C80.9867 94.6992 82.6396 94.8113 83.8676 95.7606C87.346 97.4022 90.5257 100.125 94.8405 98.7735C95.6835 97.8967 96.1283 96.743 96.8651 95.787C97.8144 94.2311 99.4474 95.9189 100.536 95.0288C102.149 93.8949 103.656 92.6159 105.415 91.6863C106.457 91.1984 107.553 91.0402 108.694 91.1457C110.46 91.5808 112.226 91.8841 114.045 91.5017C114.655 91.0073 115.319 91.3765 115.956 91.383C116.999 88.6405 116.979 85.3111 120.205 83.7684C122.608 82.4762 121.552 80.1226 121.937 78.2107C122.648 76.813 121.579 75.7846 121.181 74.6177C121.254 74.5056 121.247 74.4001 121.167 74.2946C120.125 73.5298 118.924 72.8904 118.864 71.3674C118.671 68.5523 121.161 66.3042 120.583 63.4034C121.606 60.8784 124.135 60.0411 126.08 58.5445C126.398 58.2149 126.71 57.8852 126.916 57.4765C127.321 56.448 127.082 55.3734 127.175 54.3186C127.454 53.2967 127.195 52.0572 128.35 51.3848C128.655 51.0749 128.961 50.7651 129.273 50.4618C130.043 48.0818 129.923 45.2205 132.824 43.9877C132.937 44.0536 133.05 44.0536 133.163 43.9745C135.672 42.1681 136.926 39.7288 136.893 36.65C136.966 36.439 137.099 36.2082 137.052 36.0171C136.017 31.8636 136.814 28.3431 139.655 24.8951C140.856 23.4381 142.097 21.8888 143.266 20.3461C144.069 18.6385 145.729 17.6299 146.744 16.0937C147.01 15.1642 148.005 14.6895 148.224 13.7335C149.313 12.1315 150.448 11.4129 152.181 13.1006C154.418 15.2828 157.219 13.5423 159.728 13.9313C163.333 13.0215 166.479 11.67 167.641 7.60887C168.438 4.81354 170.993 4.59597 173.423 4.47731C174.624 4.41797 175.826 4.44434 177.021 4.47731C177.253 4.42456 177.492 4.37841 177.724 4.32567C180.805 1.12159 183.931 0.71284 187.761 3.01371C190.822 6.15187 191.041 7.86598 188.883 11.6239C187.967 13.1402 186.547 14.373 186.248 16.2388C185.856 19.0869 186.268 22.2184 183.367 24.1699C182.152 26.3784 180.134 27.8684 178.428 29.6419C177.379 30.7297 176.317 31.7713 175.945 33.2943C175.919 34.5798 175.965 35.872 175.912 37.1576C174.213 42.8142 174.903 45.5172 178.78 48.2994C180.831 49.5586 183.101 48.6686 185.252 48.9652C187.038 49.3212 188.989 49.2421 190.304 50.8508C191.12 50.9958 191.957 50.8639 192.78 50.9826C194.804 51.543 196.802 52.4067 198.973 51.6353C199.949 51.5562 201.15 51.1408 201.788 52.0177C203.905 54.9251 207.364 55.2283 210.271 56.6062C211.705 58.8082 213.57 60.6806 215.031 62.8628C217.407 64.6692 219.571 66.8712 222.831 67.0821C223.003 67.1085 223.176 67.1085 223.348 67.0755C224.583 67.8996 226.057 67.8667 227.438 68.1633C232.217 67.6227 235.032 70.9653 238.205 73.5628C239.134 74.321 239.831 75.3626 241.032 75.7912C242.148 76.1669 243.296 75.9296 244.431 75.9692C245.938 75.2703 247.279 76.3515 248.719 76.3515C248.865 76.3713 249.005 76.3581 249.144 76.3186C250.399 76.8064 251.169 75.9758 251.992 75.2835C252.795 74.5979 253.459 73.5694 254.78 74.1628C255.577 75.033 255.012 76.3054 255.703 77.202C257.309 79.2062 258.922 78.1316 260.535 77.2152C262.188 74.7759 265.029 74.2419 267.426 72.9958C268.003 72.4684 267.419 72.1651 267.193 71.7894C268.634 70.5763 270.473 70.0621 272.033 69.0534C272.444 68.8094 272.862 68.5721 273.274 68.3282C274.675 67.0624 276.474 68.4007 277.947 67.6096C279.202 66.9107 280.091 65.8097 281.1 64.834C282.143 63.7594 283.364 64.1615 284.572 64.4121C286.67 64.5769 288.104 63.7396 288.747 61.7024C288.708 60.7267 289.225 59.9817 289.743 59.2302C289.551 58.8148 289.352 58.4061 289.159 57.9907C288.834 56.8568 288.263 55.6833 289.451 54.7075C290.527 53.8241 291.715 54.0482 292.81 54.6284C294.065 55.2943 295.465 55.5646 296.733 56.1777C298.672 56.6062 299.86 58.1358 301.333 59.2499C302.322 59.7444 303.345 59.9422 304.347 59.362C305.024 58.9664 305.628 58.8873 306.199 59.151C306.438 59.2631 306.671 59.4345 306.896 59.6785C307.693 60.8454 308.35 62.0716 308.642 63.4627C310.049 67.2469 310.567 67.4909 314.543 66.2317C314.988 66.0141 315.453 65.902 315.944 65.8757C317.902 65.8757 319.9 64.8736 321.819 66.0603C322.25 66.3965 322.556 66.8382 322.781 67.3327C324.766 71.7103 325.357 71.9937 330.07 70.8136C333.183 70.2467 334.551 71.8619 334.982 74.6572C335.307 75.6461 335.142 76.701 335.361 77.7031C335.54 78.8568 336.403 79.1732 337.392 79.3644C338.527 79.582 339.403 80.0765 339.35 81.4214C338.852 83.2937 337.067 84.2365 336.144 85.8385C334.577 88.5679 334.02 91.2248 335.985 93.9806C336.097 94.2904 336.157 94.6135 336.177 94.9431C336.024 98.0154 337.956 100.692 337.883 103.744C337.75 106.546 338.222 109.375 337.551 112.15C337.113 114.115 335.56 115.466 334.69 117.2C333.801 118.967 333.913 120.325 336.011 121.037C337.485 121.657 339.164 121.617 340.585 122.428C345.55 125.217 346.639 127.103 345.683 131.263C344.886 133.234 345.085 135.199 345.743 137.163C345.822 139.477 346.207 141.818 345.119 144.02C344.727 145.028 344.123 145.885 343.32 146.611C341.906 147.507 340.591 148.602 338.905 148.997C337.518 149.241 336.064 148.892 334.71 149.459C333.562 149.841 332.035 149.551 331.623 151.219C331.504 151.502 331.358 151.76 331.185 152.017C330.475 152.88 329.738 153.698 328.649 154.107C327.123 154.535 325.702 154.278 324.374 153.454C324.102 153.282 323.87 153.065 323.651 152.828C322.662 151.502 321.713 150.138 320.007 149.604C316.595 149.043 314.981 151.166 313.694 153.77C313.149 154.561 312.744 155.425 312.373 156.302C311.815 157.634 311.344 159.012 310.594 160.251C309.757 161.312 310.142 162.433 310.421 163.561C310.487 164.187 310.414 164.8 310.175 165.387C308.443 167.187 309.903 170.213 307.679 171.821C305.489 173.232 302.814 172.434 300.524 173.364C298.572 174.636 296.302 175.289 294.33 176.515C291.489 179.1 288.17 181.414 288.82 185.996C289.345 187.644 290.56 188.883 291.409 190.34C292.418 192.292 292.166 194.223 291.336 196.142C289.577 199.234 289.079 202.227 291.794 205.148C293.062 206.506 293.454 208.503 294.961 209.736C295.372 210.27 295.645 210.857 295.711 211.529C295.445 213.329 295.167 215.129 295.95 216.883C296.282 218.861 295.724 220.918 296.481 222.862C297.085 224.768 297.224 226.739 297.158 228.71C297.105 230.339 296.295 232.02 294.987 232.6C290.009 234.808 287.3 239.865 282.421 242.113C280.848 242.845 279.992 244.065 279.912 245.805C279.228 247.394 279.972 248.693 280.755 249.985C283.138 252.761 285.116 255.661 283.842 259.597C283.152 261.364 281.93 262.828 280.417 263.83C276.792 266.216 276.905 269.605 277.443 273.211C277.702 274.358 277.403 275.295 276.361 275.934C274.681 276.567 272.935 276.251 271.216 276.277C269.43 276.132 267.479 274.378 265.945 276.791C265.302 278.228 264.883 279.718 264.817 281.307C264.452 283.608 262.812 284.149 260.794 284.294C259.613 284.379 258.491 284.973 257.263 284.801C254.866 284.05 253.844 284.986 254.375 287.353C254.747 289.021 254.84 290.873 256.413 292.067C258.086 293.748 257.296 295.983 257.774 297.928C257.814 298.033 257.84 298.139 257.887 298.237C259.885 302.78 259.254 303.775 254.222 304.039C252.39 304.25 251.527 305.562 250.797 307.032C250.492 309.874 248.905 312.755 251.136 315.491C251.488 315.84 251.753 316.242 251.972 316.684C252.57 318.213 253.001 319.743 253.021 321.253L253.001 321.259Z"/>
                                    <path className='overlay ov_BK' onClick={() => handlePathClick('BK', '북구')} d="M312.359 156.309C312.724 155.432 313.129 154.568 313.68 153.777C314.968 151.173 316.581 149.05 319.993 149.61C321.693 150.138 322.648 151.509 323.638 152.834C323.85 153.071 324.089 153.282 324.361 153.46C325.689 154.285 327.109 154.542 328.636 154.113C329.725 153.704 330.462 152.887 331.172 152.023C331.338 151.766 331.49 151.509 331.61 151.226C332.015 149.558 333.548 149.848 334.697 149.465C336.051 148.898 337.505 149.248 338.892 149.004C340.585 148.608 341.892 147.514 343.306 146.617C344.103 145.892 344.714 145.035 345.105 144.026C346.194 141.818 345.816 139.484 345.729 137.17C345.072 135.205 344.873 133.24 345.67 131.269C346.625 127.103 345.537 125.224 340.571 122.435C339.158 121.624 337.478 121.664 335.998 121.044C333.893 120.325 333.787 118.967 334.677 117.207C335.553 115.473 337.1 114.121 337.538 112.157C338.208 109.381 337.737 106.553 337.87 103.751C337.943 100.692 336.004 98.022 336.164 94.9497C336.144 94.6201 336.084 94.3037 335.971 93.9872C334.006 91.2314 334.571 88.5745 336.131 85.8451C337.047 84.2431 338.839 83.3003 339.337 81.428C339.383 80.0831 338.507 79.5886 337.378 79.371C336.389 79.1799 335.526 78.8634 335.347 77.7097C335.128 76.7076 335.301 75.6527 334.969 74.6638C334.537 71.8685 333.17 70.2533 330.057 70.8202C325.344 72.0003 324.759 71.7169 322.768 67.3393C322.542 66.8514 322.244 66.4097 321.805 66.0669C319.887 64.8736 317.889 65.8889 315.931 65.8823C315.439 65.9086 314.975 66.0207 314.53 66.2383C310.554 67.4975 310.036 67.2536 308.629 63.4693C308.337 62.0782 307.673 60.852 306.883 59.6851C306.657 59.4477 306.425 59.2763 306.186 59.1576C305.622 58.0171 306.478 57.4172 307.726 56.9623C309.604 57.1007 311.244 56.3755 312.837 55.525C313.933 54.0483 313.016 52.3407 313.395 50.7848C315.194 48.6158 318.261 48.7806 320.312 47.0731C321.653 46.671 321.301 45.5436 321.274 44.6404C321.241 43.3087 321.912 42.9329 323.087 43.0449C324.779 43.4537 326.034 46.1435 328.218 44.0273C328.689 44.0075 329.167 43.9943 329.638 43.9745C330.302 42.5241 331.763 41.944 332.924 41.0342C334.863 39.7881 337.378 40.9748 339.27 39.5376C341.156 38.8651 342.928 37.9619 344.634 36.9269C347.721 35.6281 347.362 32.7207 347.814 30.1957C349.506 28.7519 350.754 26.7872 352.892 25.8444C353.496 25.5807 354.153 25.172 354.751 25.2907C359.477 26.2202 362.763 23.8139 365.451 20.5175C367.376 18.1573 369.912 17.3398 372.62 16.6212C373.278 16.3113 373.689 15.362 374.572 15.6784C375.402 15.9751 375.037 16.786 375.037 17.3859C375.03 21.4273 375.86 22.5019 379.909 23.2073C381.104 23.4183 382.272 23.5633 383.314 24.2292C383.746 24.0183 384.177 23.8007 384.609 23.5897C387.649 25.6203 390.636 25.1852 393.59 23.3788C394.885 22.3832 394.931 20.6823 395.814 19.4561C398.303 15.8498 402.353 14.5181 406.004 12.626C407.066 12.0722 408.287 11.8151 409.27 11.0767L409.23 11.103C410.896 9.96908 411.706 8.19563 412.702 6.55403C413.883 4.60257 415.304 2.88846 417.527 2.02481C418.039 1.87977 418.563 1.85999 419.094 1.85339C421.696 1.84021 424.298 1.85339 426.901 1.85339C428.162 1.86658 429.423 1.82043 430.678 1.89954C433.439 4.69487 438.378 4.50368 440.137 8.6769C442.553 12.0656 446.078 12.4282 449.829 12.1908C452.013 13.3578 454.363 13.872 456.825 13.9445C459.036 14.5576 459.242 16.9047 460.609 18.2496C461.89 19.4627 462.627 20.9526 462.946 22.6667C462.879 24.0512 463.331 25.5016 462.435 26.7872L462.375 27.6575C462.574 29.1079 461.897 30.4198 461.678 31.7977C461.505 33.3074 461.127 34.8238 461.85 36.294C462.554 37.3422 463.782 37.6784 464.731 38.3971C468.502 40.4342 472.578 41.9967 475.525 45.2997C476.016 45.3194 476.501 45.3458 476.992 45.3656C478.758 46.7962 478.419 48.8795 478.691 50.7783C479.076 52.8418 479.674 54.7405 482.13 55.2284C485.522 55.2877 487.593 56.9359 488.589 60.1795C489.093 61.8277 490.069 63.3243 491.131 64.7153C491.603 66.2383 494.245 65.4076 494.145 67.0558C494.065 68.4666 491.948 68.0777 491.038 69.1391C489.83 70.5565 488.383 71.7696 487.865 73.6485C487.367 75.0132 487.414 76.3779 487.832 77.7492C489.007 80.1292 489.81 82.6345 490.434 85.2056C491.125 86.3792 492.519 87.078 492.724 88.5811C494.61 90.7765 496.004 93.2752 497.298 95.8398C498.254 97.244 499.309 98.556 499.807 100.257C500.431 102.38 503.053 102.169 504.268 103.665C506.054 104.41 506.95 106.171 508.444 107.245C509.778 108.03 511.258 107.417 512.646 107.694C515.951 109.942 515.792 111.3 513.137 114.069C511.019 116.277 508.251 118.328 508.065 121.881C507.813 122.119 507.554 122.356 507.302 122.593C502.881 125.217 503.784 129.028 504.985 132.898C504.54 135.996 507.401 136.464 509.028 137.915C510.488 140.268 513.097 141.626 514.431 144.086C515.619 145.622 516.781 147.197 517.027 149.175C517.226 150.771 518.454 151.483 519.456 152.419C520.99 152.696 521.574 155.089 523.605 154.252C524.807 153.751 524.581 152.557 524.9 151.621C524.886 150.342 525.411 149.175 525.676 147.956C525.709 146.953 525.603 145.945 525.769 144.949C526.692 143.189 528.418 142.925 530.124 142.629C531.465 142.543 532.812 142.589 534.153 142.596C535.866 143.064 537.047 144.567 538.787 144.982C539.955 145.312 541.01 146.116 542.325 145.852C543.559 145.213 543.991 144.066 544.276 142.82C544.402 142.193 544.768 141.574 544.734 140.974C544.575 138.014 546.162 137.025 548.857 137.17C551.406 137.796 552.368 140.769 555.017 141.257C556.524 141.165 558.057 141.554 559.524 140.928L559.816 140.961C560.467 140.104 561.071 139.214 561.635 138.297C564.184 135.634 567.875 135.403 571.36 137.631C572.07 138.086 572.422 139.088 573.484 138.996C573.836 139.471 574.195 139.945 574.546 140.413C576.153 142.418 578.987 142.714 580.6 144.705C583.368 146.433 585.493 148.832 587.544 151.298C587.862 151.364 588.174 151.43 588.493 151.496C589.947 152.821 591.772 153.876 591.971 156.124C591.985 157.245 592.635 158.161 592.954 159.183C594.501 161.926 597.919 163.383 598.318 166.91C598.364 167.912 598.351 168.914 598.337 169.916C598.331 170.621 598.132 171.261 597.733 171.848C597.694 172.065 597.667 172.283 597.66 172.5C597.68 174.491 597.109 176.298 595.948 177.926C593.976 180.735 590.923 179.759 588.241 180.089C586.814 180.438 586.707 181.743 586.263 182.798C585.353 185.093 586.495 187.004 587.418 188.962C587.862 189.965 588.075 190.973 587.57 192.022C586.601 194.883 585.028 197.302 582.386 198.924L582.413 198.904C581.722 200.553 582.24 202.273 582.107 203.948C582.824 206.209 583.68 208.424 584.298 210.712C584.902 212.677 583.561 213.896 582.552 215.248C582.512 215.485 582.466 215.716 582.426 215.953C581.782 216.593 581.749 217.404 581.762 218.234C581.138 221.583 580.634 224.755 583.388 227.715C584.623 229.046 583.202 231.301 583.355 233.154C582.804 235.745 583.216 238.375 583.09 240.979C583.076 243.867 583.979 246.563 584.822 249.273C585.506 251.112 586.289 252.906 587.736 254.31C589.31 256.683 586.422 258.041 586.422 260.059C585.944 261.166 585.134 261.859 583.933 262.089C580.939 262.854 578.177 263.968 576.551 266.83C576.066 267.126 575.602 267.317 575.137 267.429C572.555 268.062 570.231 266.19 567.769 265.841C564.974 265.445 562.438 263.711 559.451 264.054C556.331 263.757 556.112 260.758 554.612 258.945C553.298 256.894 550.888 255.721 550.018 253.301C549.852 252.167 549.759 251.02 549.507 249.893C549.029 248.535 548.631 247.137 547.834 245.911C547.084 244.111 546.148 242.41 545.212 240.702C544.436 238.817 543.958 236.654 541.263 236.589C540.3 236.186 539.278 235.942 538.315 235.534C537.174 235.171 536.032 234.934 534.857 235.402C530.177 234.558 525.663 234.789 521.527 237.452C518.925 237.729 516.967 236.483 515.181 234.828C514.219 234.037 513.183 233.325 512.201 232.56C510.375 231.024 508.417 230.279 505.921 230.906C504.388 231.288 502.708 231.196 501.108 230.859C498.958 230.589 497.756 228.697 495.931 227.873C494.517 226.429 492.532 225.486 491.908 223.35C492.3 221.728 493.826 221.379 494.995 220.627C496.03 219.962 495.99 218.992 495.698 217.997C495.34 216.771 495.393 215.617 496.103 214.523C496.92 213.534 497.723 212.532 497.842 211.187C497.982 209.829 498.486 208.339 496.548 207.758C495.957 207.271 495.473 206.677 494.942 206.13C493.003 204.119 490.321 204.271 487.892 203.908C485.024 203.486 483.272 202.102 482.628 199.326C482.163 197.335 481.586 195.47 479.037 195.351C477.098 195.694 475.213 195.694 473.514 194.5C472.558 194.019 471.662 193.386 470.54 193.314C468.947 193.202 467.911 192.285 467.134 191C466.743 190.373 466.53 189.628 465.966 189.108C463.882 187.598 462.023 188.633 460.257 189.701C459.062 190.426 458.04 191.422 456.805 192.12C455.916 192.641 454.933 192.641 453.951 192.661C450.194 192.74 449.45 192.068 448.295 187.578C447.187 185.231 444.737 185.554 442.799 184.868C440.17 184.163 438.146 184.479 437.827 187.73C437.342 188.857 436.612 189.826 435.809 190.743C435.291 191.27 434.793 191.804 434.468 192.483C433.101 194.085 433.32 196.498 431.673 197.962C430.578 198.918 429.602 199.959 429.184 201.403C428.168 203.19 426.602 204.416 424.969 205.589C424.212 206.282 423.455 206.77 422.692 206.994C421.384 207.383 420.07 207.013 418.749 205.636C417.089 204.62 415.901 202.959 414.042 202.207C411.606 201.179 410.06 199.3 409.017 196.959C407.71 194.547 404.742 195.259 402.93 193.795C401.842 193.063 400.7 192.443 399.425 192.094C398.529 191.975 397.626 192.028 396.724 192.035C395.92 192.068 395.15 192.41 394.327 192.246C391.307 192.054 390.603 189.681 389.634 187.459C388.977 185.956 388.426 184.433 387.948 182.877C387.789 177.656 384.868 174.28 380.473 171.887C376.026 171.472 371.558 171.195 367.184 170.246C362.53 168.815 357.711 168.644 352.912 168.294C345.65 169.125 339.211 165.835 332.426 164.246C328.377 162.822 324.228 161.721 320.113 160.488C318.672 160.04 317.218 159.618 315.911 158.847C315.639 158.682 315.373 158.504 315.088 158.365C313.309 157.482 312.479 157.073 312.339 156.368" />
                                    <path className='overlay ov_NM' onClick={() => handlePathClick('NM', '남구')} d="M252.676 321.319C253.067 320.244 253.645 319.282 254.866 318.668C255.835 317.778 256.227 316.519 256.924 315.458C257.707 314.271 258.59 313.394 259.971 314.785C260.482 315.451 260.482 316.269 260.628 317.04C260.967 318.22 261.684 319.163 262.421 320.125C264.952 323.439 267.91 323.894 271.296 321.49C274.29 319.328 276.394 321.22 278.511 323.046C279.633 324.707 280.841 325.472 282.78 323.969C284.758 322.433 287.499 322.393 289.524 320.857C291.695 319.4 293.6 317.627 295.578 315.946C296.401 315.352 296.813 314.462 297.277 313.618C297.961 312.366 298.924 311.746 300.444 311.911C302.522 312.135 304.513 311.634 306.412 310.79C307.66 309.88 308.038 308.311 309.113 307.276C310.248 306.762 311.145 305.905 312.087 305.114C314.623 304.883 316.462 303.835 317.949 301.58C319.701 298.93 323.445 299.141 325.768 297.123C328.304 296.774 331.013 297.268 333.303 295.66C335.759 295.106 338.208 294.381 340.691 295.501C341.156 295.554 341.6 295.673 342.038 295.818C343.764 295.488 346.061 295.943 345.822 293.003C345.218 291.163 346.068 290.392 347.834 290.234C349.334 290.102 350.881 290.458 352.334 289.818C352.991 289.43 353.576 288.922 354.273 288.586C356.045 287.353 358.315 289.027 360.054 287.61C360.785 286.548 361.243 285.335 361.873 284.221C362.829 283.133 362.776 282.085 361.84 280.984C360.114 278.947 360.732 277.193 362.517 275.539C363.805 274.345 365.066 273.099 365.962 271.563C367.058 270.363 368.319 269.809 369.912 270.581C371.226 271.392 372.587 272.124 374.048 272.658C376.65 273.613 379.046 274.998 381.522 276.204C384.343 276.738 386.308 274.372 388.95 274.042C390.377 273.864 389.136 271.906 389.674 270.864C390.072 267.186 390.371 263.52 389.455 259.868C387.815 256.044 386.707 252.161 387.988 247.987C389.322 245.647 389.023 243.689 387.317 241.434C385.591 239.147 385.246 235.942 382.817 233.984C383.932 231.321 386.029 229.396 387.994 227.398C388.831 226.548 389.992 226.007 389.388 224.524C388.937 223.423 388.154 222.533 387.497 221.55C386.204 219.296 386.631 217.094 388.778 214.945C389.176 214.668 389.614 214.483 390.092 214.397C392.462 213.329 394.752 212.083 397.361 211.589C398.682 211.338 399.631 210.349 400.501 209.36C402.552 207.02 405.446 206.651 408.247 206.044C412.124 205.669 412.881 208.866 414.321 211.272C416.492 214.371 419.552 214.45 422.845 213.738C423.615 213.58 424.205 212.973 425.002 212.868C425.334 212.835 425.633 212.861 425.911 212.934C426.535 213.099 427.033 213.514 427.465 214.074C428.321 215.314 428.454 216.916 429.47 218.089C430.386 219.269 431.388 220.364 432.676 221.161C433.572 221.748 434.302 222.493 434.893 223.377C435.504 224.366 436.201 225.295 437.103 226.053C437.422 226.37 437.674 226.732 437.88 227.128C438.431 228.822 439.387 230.253 440.721 231.446C441.558 232.534 442.155 233.76 442.733 234.993C443.038 237.901 445.282 239.173 447.459 240.505C447.698 240.709 447.89 240.953 448.056 241.21C449.118 244.23 451.316 246.623 452.683 249.464C453.606 251.389 455.703 251.04 457.058 252.068C458.837 255.371 458.253 257.929 454.688 259.09C451.435 260.144 449.145 262.017 447.173 264.555C446.41 265.531 445.892 266.645 445.381 267.759C442.865 269.915 441.465 272.948 439.334 275.407C439.088 275.591 438.816 275.723 438.524 275.822C436.38 276.402 434.083 275.961 431.972 276.758C431.016 277.358 429.702 277.747 430.479 279.336C431.488 281.189 430.532 283.061 430.226 284.788C429.695 287.775 430.1 290.333 431.899 292.726C431.169 295.277 431.846 297.308 434.169 298.732C436.951 301.079 438.756 303.881 438.431 307.685C438.225 310.111 440.814 310.21 441.816 311.627C442.367 312.26 442.673 312.979 442.64 313.829C442.142 314.976 442.115 316.124 442.64 317.284C442.66 317.614 442.62 317.937 442.54 318.26C442.381 318.886 442.348 319.532 442.195 320.165C441.909 321.325 441.71 322.169 441.465 322.782C440.841 324.384 439.971 324.411 436.825 324.503C435.424 324.872 434.196 325.512 433.233 326.626C432.41 327.582 431.348 328.083 430.06 328.037L428.952 328.683C426.854 328.815 425.48 329.731 425.141 331.94C424.962 333.133 424.338 334.161 423.482 335.038C422.918 336.126 422.267 337.122 421.105 337.675C420.183 338.117 419.114 338.829 418.961 339.633C418.012 344.558 414.069 344.163 410.538 344.571C410.206 344.611 409.887 344.69 409.568 344.789C408.918 344.888 408.267 344.888 407.617 344.749C404.039 343.991 401.125 344.723 398.622 347.716C396.06 350.775 395.887 350.511 392.502 348.435C390.198 347.024 387.722 345.89 385.764 343.965C384.901 344.143 384.038 344.314 383.175 344.492C380.195 345.666 378.256 348.323 375.462 349.799C372.873 351.171 370.078 352.258 368.425 355.074C367.881 355.997 365.969 355.674 364.734 356.122C363.347 356.999 361.82 357.19 360.353 356.544C357.061 355.08 353.622 354.23 350.064 353.775C349.526 353.709 349.095 353.294 348.703 352.918C348.272 352.575 348.046 352.1 347.807 351.619C346.201 348.382 345.231 348.046 341.733 349.483C339.031 348.323 337.956 349.951 336.874 352.048C335.48 354.737 334.876 358.159 331.178 359.029C330.986 359.22 330.8 359.418 330.608 359.609C328.968 359.741 327.72 360.605 326.585 361.699L326.618 361.68C324.574 362.332 324.886 364.653 323.618 365.859C322.841 367.646 321.128 368.872 320.617 370.817C320.391 372.459 319.927 373.916 317.955 374.206C317.557 374.193 317.159 374.186 316.76 374.173C315.234 374.173 313.7 374.377 312.187 373.995C310.375 374.054 308.536 371.964 306.75 374.067C306.285 377.146 304.301 378.524 301.347 378.801L299.973 379.546C298.778 379.895 297.775 380.607 296.72 381.227C292.75 380.733 289.099 381.339 286.013 384.108C285.747 384.345 285.189 384.352 284.784 384.088C284.539 384.121 284.293 384.154 284.048 384.194C281.611 387.774 279.262 391.406 278.279 395.711C277.695 397.518 277.655 399.937 274.588 398.948C271.455 398.915 268.322 398.922 265.189 398.948C262.958 399.225 261.67 400.986 260.024 402.179C257.263 402.443 254.9 401.922 253.791 398.995C253.008 397.34 253.512 395.415 252.669 393.773C252.277 392.738 251.673 391.815 251.109 390.879C249.775 388.215 248.281 385.882 244.61 386.983C243.595 387.286 243.117 386.416 242.612 385.657C241.49 383.956 240.242 382.803 238.092 384.444C237.116 385.189 235.722 384.543 234.573 384.965C233.81 385.117 233.179 385.598 232.443 385.809C229.701 389.013 225.864 390.899 222.811 393.727C219.817 396.371 216.027 396.661 212.336 397.274C210.962 397.432 210.158 398.797 208.771 398.922C207.43 398.942 206.083 398.962 204.742 398.909C203.268 398.454 201.828 397.9 200.347 397.485C196.517 395.87 195.647 394.261 196.066 389.6C196.066 388.242 196.663 387.002 196.895 385.69C198.137 383.937 196.776 382.368 196.53 380.719C196.517 380.291 196.504 379.862 196.49 379.44C195.395 378.636 194.247 377.95 192.893 377.667C191.027 377.509 189.169 377.238 187.336 377.871C182.809 379.467 181.004 383.165 180.094 387.398C178.348 387.629 178.488 385.98 177.645 385.44C177.286 385.011 176.921 384.55 176.994 383.983C177.419 380.673 175.242 378.544 173.469 376.223C173.064 374.516 173.854 373.27 175.043 372.175C176.669 370.164 178.966 369.782 181.355 369.63C181.74 369.4 182.125 369.169 182.511 368.945C183.878 369.452 185.133 368.45 186.48 368.668C187.071 368.892 187.688 368.945 188.312 368.945C189.268 368.945 190.224 368.945 191.187 368.945C194.798 368.852 198.342 368.51 201.449 366.407C201.648 366.136 201.901 365.932 202.193 365.774C202.292 365.734 202.398 365.695 202.498 365.655C203.135 365.932 203.819 365.952 204.443 365.668C209.322 363.479 214.898 364.567 219.77 362.385C220.096 362.306 220.401 362.187 220.687 362.016C221.656 361.251 222.618 360.486 223.587 359.728C224.703 358.957 225.632 357.988 226.608 357.065C226.82 356.854 227.019 356.629 227.185 356.372C228.168 354.869 229.548 353.689 230.478 352.146C231.819 350.676 231.639 348.461 233.027 347.011C234.534 343.866 237.109 341.552 239.38 339C239.559 338.757 239.711 338.499 239.824 338.222C240.528 336.133 241.656 334.273 243.03 332.553C244.146 331.162 245.36 329.902 247.113 329.309C247.505 329.072 247.863 328.788 248.182 328.452C249.038 327.331 250.299 326.679 251.315 325.736C252.344 324.266 252.729 322.769 252.702 321.259" />
                                    <path className='overlay ov_SE' onClick={() => handlePathClick('SE', '서구')} d="M253.001 321.319C253.393 320.244 253.97 319.281 255.192 318.668C256.161 317.778 256.552 316.519 257.249 315.458C258.033 314.271 258.916 313.394 260.296 314.785C260.807 315.451 260.807 316.269 260.953 317.04C261.292 318.22 262.009 319.163 262.746 320.125C265.277 323.439 268.236 323.894 271.621 321.49C274.615 319.328 276.719 321.22 278.837 323.046C279.959 324.707 281.167 325.472 283.105 323.969C285.083 322.433 287.825 322.393 289.849 320.857C292.02 319.4 293.925 317.627 295.903 315.946C296.726 315.352 297.138 314.462 297.603 313.618C298.286 312.366 299.249 311.746 300.769 311.911C302.847 312.135 304.838 311.634 306.737 310.79C307.985 309.88 308.363 308.311 309.439 307.276C310.574 306.762 311.47 305.905 312.412 305.114C314.948 304.883 316.787 303.835 318.274 301.58C320.026 298.93 323.77 299.141 326.094 297.123C328.629 296.774 331.338 297.268 333.628 295.66C336.084 295.106 338.534 294.381 341.016 295.501C341.481 295.554 341.926 295.673 342.364 295.818C344.09 295.488 346.386 295.943 346.147 293.003C345.543 291.163 346.393 290.392 348.159 290.234C349.659 290.102 351.206 290.458 352.66 289.818C353.317 289.429 353.901 288.922 354.598 288.586C356.37 287.353 358.64 289.027 360.38 287.61C361.11 286.548 361.568 285.335 362.199 284.221C363.154 283.133 363.101 282.085 362.165 280.984C360.439 278.947 361.057 277.193 362.842 275.539C364.13 274.345 365.391 273.099 366.288 271.563C367.383 270.363 368.644 269.809 370.237 270.581C371.552 271.392 372.912 272.124 374.373 272.658C376.975 273.613 379.371 274.998 381.847 276.204C384.669 276.738 386.634 274.372 389.276 274.042C390.703 273.864 389.461 271.906 389.999 270.864C390.397 267.186 390.696 263.52 389.78 259.868C388.14 256.044 387.032 252.161 388.313 247.987C389.647 245.647 389.349 243.689 387.643 241.434C385.917 239.147 385.571 235.942 383.142 233.984C384.257 231.321 386.355 229.396 388.32 227.398C389.156 226.548 390.318 226.007 389.714 224.524C389.262 223.423 388.479 222.533 387.822 221.55C386.53 219.296 386.957 217.094 389.103 214.945C389.501 214.668 389.939 214.483 390.417 214.397C392.787 213.329 395.077 212.083 397.686 211.589C399.007 211.338 399.956 210.349 400.826 209.36C402.877 207.02 405.771 206.651 408.573 206.044C412.449 205.669 413.206 208.866 414.647 211.272C416.817 214.371 419.877 214.45 423.17 213.738C423.94 213.58 424.531 212.973 425.327 212.868C425.659 212.835 425.958 212.861 426.237 212.934C425.619 212.499 424.936 212.143 424.385 211.622C422.121 209.479 421.524 208.352 422.685 206.915C421.378 207.31 420.063 206.934 418.742 205.563C417.083 204.548 415.894 202.886 414.036 202.135C411.6 201.106 410.053 199.227 409.011 196.887C407.703 194.474 404.736 195.186 402.924 193.722C401.835 192.991 400.693 192.371 399.419 192.022C398.522 191.903 397.62 191.956 396.717 191.962C395.914 191.995 395.144 192.338 394.321 192.173C391.3 191.982 390.597 189.609 389.627 187.387C388.97 185.884 388.419 184.361 387.941 182.805C387.782 177.583 384.861 174.208 380.467 171.815C376.019 171.399 371.552 171.122 367.177 170.173C362.524 168.742 357.705 168.571 352.905 168.222C345.643 169.052 339.204 165.763 332.42 164.174C328.371 162.75 324.222 161.649 320.106 160.416C318.666 159.968 317.212 159.546 315.904 158.774C315.632 158.609 315.366 158.431 315.081 158.293C313.302 157.41 312.472 157.001 312.333 156.295C311.775 157.627 311.304 159.005 310.554 160.244C309.717 161.306 310.102 162.427 310.381 163.554C310.448 164.18 310.375 164.793 310.136 165.38C308.403 167.18 309.863 170.206 307.64 171.815C305.449 173.226 302.774 172.428 300.484 173.357C298.532 174.63 296.262 175.282 294.29 176.509C291.449 179.093 288.13 181.407 288.781 185.989C289.305 187.637 290.52 188.877 291.369 190.334C292.378 192.285 292.126 194.217 291.296 196.135C289.537 199.227 289.04 202.22 291.755 205.141C293.022 206.499 293.414 208.497 294.921 209.73C295.332 210.264 295.605 210.85 295.671 211.523C295.405 213.323 295.127 215.123 295.91 216.876C296.242 218.854 295.684 220.911 296.441 222.856C297.045 224.761 297.185 226.732 297.118 228.704C297.065 230.332 296.255 232.013 294.947 232.593C289.969 234.802 287.26 239.859 282.381 242.107C280.808 242.838 279.952 244.058 279.872 245.799C279.188 247.387 279.932 248.686 280.715 249.978C283.098 252.754 285.077 255.655 283.802 259.591C283.112 261.358 281.89 262.821 280.377 263.823C276.752 266.21 276.865 269.598 277.403 273.205C277.662 274.352 277.363 275.288 276.321 275.928C274.641 276.56 272.896 276.244 271.176 276.27C269.391 276.125 267.439 274.372 265.906 276.785C265.262 278.222 264.843 279.712 264.777 281.301C264.412 283.601 262.772 284.142 260.754 284.287C259.573 284.373 258.451 284.966 257.223 284.795C254.826 284.043 253.804 284.979 254.335 287.346C254.707 289.014 254.8 290.867 256.373 292.06C258.046 293.741 257.256 295.976 257.734 297.921C257.774 298.026 257.8 298.132 257.847 298.231C259.845 302.773 259.214 303.769 254.183 304.032C252.35 304.243 251.487 305.555 250.757 307.026C250.452 309.867 248.865 312.748 251.096 315.484C251.448 315.833 251.713 316.236 251.932 316.677C252.53 318.207 252.961 319.736 252.981 321.246"/>
                                    <path className='overlay ov_DO' onClick={() => handlePathClick('DO', '동구')} d="M422.705 206.928C423.469 206.704 424.226 206.216 424.982 205.523C426.615 204.357 428.188 203.124 429.197 201.337C429.616 199.893 430.591 198.852 431.687 197.896C433.34 196.432 433.114 194.019 434.481 192.417C434.8 191.738 435.305 191.204 435.822 190.677C436.626 189.76 437.356 188.791 437.84 187.664C438.159 184.413 440.184 184.097 442.812 184.802C444.751 185.495 447.2 185.165 448.309 187.512C449.464 191.995 450.207 192.668 453.964 192.595C454.947 192.575 455.929 192.569 456.819 192.054C458.053 191.356 459.082 190.36 460.271 189.635C462.036 188.567 463.895 187.532 465.979 189.042C466.55 189.562 466.756 190.307 467.148 190.934C467.924 192.219 468.96 193.136 470.553 193.248C471.675 193.327 472.571 193.953 473.527 194.434C475.226 195.628 477.112 195.628 479.05 195.285C481.599 195.404 482.183 197.269 482.641 199.26C483.285 202.036 485.038 203.42 487.905 203.842C490.335 204.205 493.01 204.053 494.955 206.064C495.486 206.611 495.964 207.205 496.561 207.692C498.5 208.279 497.995 209.763 497.856 211.121C497.73 212.472 496.926 213.468 496.117 214.457C495.406 215.551 495.353 216.705 495.712 217.931C496.004 218.927 496.037 219.896 495.008 220.562C493.84 221.307 492.313 221.656 491.921 223.284C492.545 225.42 494.537 226.363 495.944 227.807C497.77 228.631 498.971 230.523 501.122 230.794C502.728 231.13 504.401 231.222 505.934 230.84C508.43 230.213 510.382 230.958 512.214 232.494C513.197 233.259 514.232 233.965 515.195 234.762C516.98 236.424 518.939 237.663 521.541 237.386C525.676 234.723 530.19 234.492 534.87 235.336C536.045 234.874 537.194 235.112 538.329 235.468C539.291 235.87 540.313 236.114 541.276 236.523C543.978 236.589 544.456 238.751 545.226 240.636C546.162 242.344 547.098 244.045 547.848 245.845C548.644 247.078 549.043 248.469 549.521 249.827C549.773 250.954 549.866 252.101 550.032 253.235C550.895 255.648 553.311 256.822 554.625 258.879C556.126 260.692 556.345 263.691 559.464 263.988C562.452 263.645 564.987 265.379 567.782 265.775C570.252 266.124 572.568 267.996 575.15 267.364C576.744 267.937 575.801 269.064 574.653 269.902C573.471 271.754 571.36 272.849 570.517 274.972C569.209 276.468 567.264 277.609 568.234 280.193C568.638 281.281 567.55 281.92 566.627 282.329C562.359 284.201 558.144 286.232 553.576 287.346C551.977 287.636 551.983 289.047 551.585 290.181C551.426 291.229 551.93 292.37 551.147 293.332C550.138 294.064 549.009 294.664 548.339 295.778C548.18 297.209 548.273 298.646 548.286 300.083C549.076 301.982 551.439 303.182 550.795 305.707C548.903 307.968 549.6 310.394 550.33 312.827C552.707 317.04 551.797 319.262 547.217 320.415C546.022 320.626 544.774 320.264 543.593 320.692C540.34 321.793 537.466 323.962 533.868 324.101C531.803 324.246 529.712 323.824 527.674 324.384C524.661 326.56 521.474 328.287 517.604 328.254C514.644 328.828 513.157 331.768 510.409 332.691C510.203 332.678 510.11 332.77 510.123 332.975C509.061 334.333 507.78 335.5 506.685 336.851C504.355 339.732 502.131 342.409 504.076 346.391C504.335 346.925 504.142 347.683 504.036 348.329C503.777 349.094 503.312 349.694 502.582 350.07C500.896 351.118 499.555 352.516 498.44 354.144C497.351 355.641 496.628 357.447 494.829 358.35C490.501 361.06 486.007 362.299 481.201 359.616C480.245 359.082 479.528 359.398 478.745 359.774C477.716 360.269 476.7 360.644 475.684 359.774C475.525 359.689 475.346 359.642 475.167 359.642C473.613 359.583 472.445 358.574 471.104 357.988C469.451 357.19 467.745 357.427 466.033 357.717C464.758 357.691 463.484 357.823 462.222 357.579C460.31 355.97 461.764 353.841 461.333 352.008C460.928 350.076 459.487 349.193 457.801 348.527C455.02 347.433 453.108 345.428 451.827 342.791C451.176 341.315 451.269 339.653 450.698 338.157C449.796 337.187 449.298 336.04 449.152 334.735C449.052 333.924 448.979 333.113 448.74 332.329C448.435 329.434 446.404 327.43 444.465 325.782C442.839 324.404 442.016 323.771 441.79 322.769C442.029 322.156 442.235 321.319 442.52 320.152C442.673 319.525 442.713 318.879 442.865 318.246C442.945 317.923 442.985 317.6 442.965 317.271C442.447 316.11 442.474 314.963 442.965 313.816C442.998 312.972 442.693 312.247 442.142 311.614C441.139 310.19 438.551 310.091 438.756 307.672C439.075 303.861 437.269 301.066 434.495 298.719C432.165 297.301 431.494 295.264 432.224 292.713C430.426 290.32 430.021 287.768 430.552 284.775C430.857 283.048 431.82 281.175 430.804 279.323C430.027 277.734 431.342 277.345 432.297 276.745C434.415 275.947 436.705 276.389 438.849 275.809C439.141 275.71 439.414 275.578 439.659 275.394C441.79 272.934 443.197 269.902 445.707 267.746C446.218 266.632 446.729 265.518 447.499 264.542C449.47 262.004 451.761 260.131 455.013 259.076C458.578 257.923 459.162 255.365 457.383 252.055C456.029 251.027 453.938 251.376 453.008 249.451C451.648 246.61 449.444 244.216 448.382 241.197C448.216 240.933 448.017 240.696 447.784 240.491C445.607 239.16 443.363 237.887 443.058 234.98C442.48 233.747 441.89 232.521 441.047 231.433C439.712 230.24 438.763 228.809 438.205 227.115C438 226.719 437.747 226.357 437.429 226.04C436.533 225.275 435.836 224.352 435.218 223.363C434.621 222.48 433.891 221.735 433.001 221.148C431.713 220.351 430.711 219.256 429.795 218.076C428.786 216.909 428.653 215.307 427.79 214.061C427.365 213.501 426.861 213.085 426.237 212.921C425.619 212.485 424.936 212.129 424.385 211.609C422.121 209.466 421.524 208.339 422.685 206.901" />
                                    <text  className='gu_label gu_GS' data-code='GSgu' x='150' y='200'>광산구</text>
                                    <text  className='gu_label gu_BK' data-code='BKgu' x='410' y='120'>북구</text>
                                    <text  className='gu_label gu_SE' data-code='SEgu' x='320' y='240'>서구</text>
                                    <text  className='gu_label gu_DO' data-code='DOgu' x='480' y='280'>동구</text>
                                    <text  className='gu_label gu_NM' data-code='NMgu' x='300' y='340'>남구</text>
                                </svg>
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
                                            <a className='txt_cut1' href='#'>광주광역시 탄소중립 시민실천 캠페인 안내</a>
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
            <div className='main_content' aria-label='메인 콘텐츠 영역'>
                <div className='main_content_inner'>
                    <div className='carbon_ft_wrap' aria-label='탄소발자국 계산기 영역'>
                        <div className='txt_wrap'>
                            <h3>탄소발자국 계산기</h3>
                            <button className='btn_more'>더보기</button>
                        </div>
                        <div className='carbon_ft_content'>
                            <div className='carbon_ft_tab'>
                                <ul>
                                    <li>
                                        <a href='#' data-tab='electricity' className='on'>전기</a>
                                    </li>
                                    <li>
                                        <a href='#' data-tab='gas'>가스</a>
                                    </li>
                                    <li>
                                        <a href='#' data-tab='water'>수도</a>
                                    </li>
                                </ul>
                            </div>
                            <div className='carbon_ft_panels'>
                                <div className='panel' data-tab='electricity'>
                                    <div className='panel_inner'>
                                        <div className='desc'>
                                            <h2>가정용 전기</h2>
                                            <p>전기 사용량을 입력해주세요<br/>&#40;전기사용량 * 0.478&#41;</p>
                                        </div>
                                        <div className='carbon_ft_input'>
                                            <form action="#" method="post" className='analysis_form'>
                                                <div className='input_group'>
                                                    <label htmlFor=''>월 사용량</label>
                                                    <input data-role='usageInput' type='number' inputMode='numeric' placeholder='예: 350' />
                                                    <span>&#40;Kwh&#41;</span>
                                                </div>
                                                <div className='input_group'>
                                                    <label htmlFor=''>CO₂ 발생량</label>
                                                    <div className='segmented_input' data-digits='7'>
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-1' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-2' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-3' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-4' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-5' readOnly />
                                                        <input className='decimal_box' type='text' value='.' readOnly tabIndex={-1} aria-hidden='true' />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-6' readOnly />
                                                    </div>
                                                    <span>kg/월</span>
                                                </div>
                                                <button type='button' className='btn_lime_bg bd_radius'>상세분석</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className='panel' data-tab='gas'>
                                    <div className='panel_inner'>
                                        <div className='desc'>
                                            <h2>가정용 가스</h2>
                                            <p>가스 사용량을 입력해주세요<br/>&#40;가스사용량 * 2.176&#41;</p>
                                        </div>
                                        <div className='carbon_ft_input'>
                                            <form action="#" method="post" className='analysis_form'>
                                                <div className='input_group'>
                                                    <label htmlFor=''>월 사용량</label>
                                                    <input data-role='usageInput' type='number' inputMode='numeric' placeholder='예: 350' />
                                                    <span>&#40;Kwh&#41;</span>
                                                </div>
                                                <div className='input_group'>
                                                    <label htmlFor=''>CO₂ 발생량</label>
                                                    <div className='segmented_input' data-digits='7'>
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-1' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-2' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-3' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-4' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-5' readOnly />
                                                        <input className='decimal_box' type='text' value='.' readOnly tabIndex={-1} aria-hidden='true' />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-6' readOnly />
                                                    </div>
                                                    <span>kg/월</span>
                                                </div>
                                                <button type='button' className='btn_lime_bg bd_radius'>상세분석</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className='panel' data-tab='water'>
                                    <div className='panel_inner'>
                                        <div className='desc'>
                                            <h2>가정용 수도</h2>
                                            <p>수도 사용량을 입력해주세요<br/>&#40;수도사용량 * 0.237&#41;</p>
                                        </div>
                                        <div className='carbon_ft_input'>
                                            <form action="#" method="post" className='analysis_form'>
                                                <div className='input_group'>
                                                    <label htmlFor=''>월 사용량</label>
                                                    <input data-role='usageInput' type='number' inputMode='numeric' placeholder='예: 350' />
                                                    <span>&#40;Kwh&#41;</span>
                                                </div>
                                                <div className='input_group'>
                                                    <label htmlFor=''>CO₂ 발생량</label>
                                                    <div className='segmented_input' data-digits='7'>
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-1' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-2' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-3' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-4' readOnly />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-5' readOnly />
                                                        <input className='decimal_box' type='text' value='.' readOnly tabIndex={-1} aria-hidden='true' />
                                                        <input data-role='digit' type='text' inputMode='numeric' maxLength={1} aria-label='co2-digit-6' readOnly />
                                                    </div>
                                                    <span>kg/월</span>
                                                </div>
                                                <button type='button' className='btn_lime_bg bd_radius'>상세분석</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='report_wrap'>
                        <div className='txt_wrap' aria-label='연구보고서 영역'>
                            <h3>연구보고서</h3>
                            <button className='btn_more'>더보기</button>
                        </div>
                    </div>
                    <div className='carbon_about_wrap'>
                        <div className='txt_wrap' aria-label='탄소중립 알아보기 영역'>
                            <h3>탄소중립 알아보기</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;