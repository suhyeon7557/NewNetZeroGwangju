'use client';
import React from 'react';
import Link from 'next/link';

import "./climatechangepage.scss";

const ClimateChangePage = () => {
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

    return (
        <div aria-label='연구보고서 페이지 영역' className='nav_page'>
            <div className='nav_wrap'>
                <img src='/subimage01.jpg' alt='관련 조례 및 계획 비주얼 이미지' className='nav_bg_img'></img>
                <div className='nav_inner'>
                    <div className='nav_content_wrap reveal'>
                        <p className='nav_text'>탄소중립, 함께 이야기하고 연결되는 공간</p>
                        <h3 className='nav_title'>탄소중립 소통하기</h3>
                    </div>
                </div>
            </div>
            <nav className='sub_nav reveal' aria-label='페이지 내비게이션 바 영역'>
                <div className='sub_nav_wrap'>
                    <div className='subhome'>
                        <a href='/' aria-label='홈'>
                            <img src='/ic_navhome.svg' alt='홈'></img>
                        </a>
                    </div>
                    <ul id='sub_nav_gnb'>
                        <li className='lnb_area'>
                            <a href='#' title='탄소중립 소통하기 메뉴로 이동하기'>
                                탄소중립 소통하기
                            </a>
                            <ul className='lnb_list'>
                                <li>
                                    <a href='#' title='기후변화 메뉴로 이동하기'>
                                        기후변화
                                    </a>
                                    <ul aria-label='기후변화 서브메뉴 영역'>
                                        <li>
                                            <a href='#' title='기후변화 메뉴로 이동하기'>
                                                기후변화
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='우리나라 기후변화 메뉴로 이동하기'>
                                                우리나라 기후변화
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='광주의 기후변화 메뉴로 이동하기'>
                                                광주의 기후변화
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href='#' title='탄소중립 메뉴로 이동하기'>
                                        탄소중립
                                    </a>
                                    <ul aria-label='탄소중립 서브메뉴 영역'>
                                        <li>
                                            <a href='#' title='탄소중립 메뉴로 이동하기'>
                                                탄소중립
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='국가기본계획 메뉴로  이동하기'>
                                                국가기본계획
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='국가정책 메뉴로 이동하기'>
                                                국가정책
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href='#' title='광주의 탄소중립 메뉴로 이동하기'>
                                        광주의 탄소중립
                                    </a>
                                    <ul aria-label='광주의 탄소중립 서브메뉴 영역'>
                                        <li>
                                            <a href='#' title='탄소중립 히스토리 메뉴로 이동하기'>
                                                탄소중립 히스토리
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='탄소중립 기본계획 메뉴로 이동하기'>
                                                탄소중립 기본계획
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='부문별 주요시책 메뉴로 이동하기'>
                                                부문별 주요시책
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='온실가스 감축인지 예산제 메뉴로 이동하기'>
                                                온실가스 감축인지 예산제
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='기업탄소액션 메뉴로 이동하기'>
                                                기업탄소액션
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='관련 조례 및 계획 메뉴로 이동하기'>
                                                관련 조례 및 계획
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href='#' title='탄소중립 정책지표 메뉴로 이동하기'>
                                        탄소중립 정책지표
                                    </a>
                                    <ul aria-label='탄소중립 정책지표 서브메뉴 영역'>
                                        <li>
                                            <a href='#' title='온실가스 배출량 메뉴로 이동하기'>
                                                온실가스 배출량
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='정책지표 신호등 메뉴로 이동하기'>
                                                정책지표 신호등
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='부문별 정책지표 메뉴로 이동하기'>
                                                부문별 정책지표
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href='#' title='탄소중립 시민실천 메뉴로 이동하기'>
                                        탄소중립 시민실천
                                    </a>
                                    <ul aria-label='탄소중립 시민실천 서브메뉴 영역'>
                                        <li>
                                            <a href='#' title='생활실천안내 메뉴로 이동하기'>
                                                생활실천안내
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='시민참여사업 메뉴로 이동하기'>
                                                시민참여사업
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='시민실천과제 메뉴로 이동하기'>
                                                시민실천과제    
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='탄소발자국 메뉴로 이동하기'>
                                                탄소발자국
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='약속하기 메뉴로 이동하기'>
                                                약속하기
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href='#' title='탄소중립 소통하기 메뉴로 이동하기'>
                                        탄소중립 소통하기
                                    </a>
                                    <ul aria-label='탄소중립 소통하기 서브메뉴 영역'>
                                        <li>
                                            <a href='#' title='공지사항 메뉴로 이동하기'>
                                                공지사항
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='연구보고서 메뉴로 이동하기'>
                                                연구보고서
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='탄소중립지원센터 메뉴로 이동하기'>
                                                탄소중립지원센터
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' title='문의하기 메뉴로 이동하기'>
                                                문의하기
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href='#' title='우리동네 탄소배출지도 메뉴로 이동하기'>
                                        우리동네 탄소배출지도
                                    </a>
                                    <ul aria-label='우리동네 탄소배출지도 서브메뉴 영역'>
                                        <li>
                                            <a href='#' title='행정동별 배출지도 메뉴로 이동하기'>
                                                행정동별 배출지도
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className='lnb_area b_r'>
                            <a href='#' title='공지사항 메뉴로 이동하기'>
                                연구보고서
                            </a>
                            <ul className='lnb_list'>
                                <li>
                                    <a href='#' title='공지사항 메뉴로 이동하기'>
                                        공지사항
                                    </a>
                                </li>
                                <li>
                                    <a href='#' title='연구보고서 메뉴로 이동하기'>
                                        연구보고서
                                    </a>
                                </li>
                                <li>
                                    <a href='#' title='탄소중립 지원센터 메뉴로 이동하기'>
                                        탄소중립 지원센터
                                    </a>
                                </li>
                                <li>
                                    <a href='#' title='문의하기 메뉴로 이동하기'>
                                        문의하기
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            <div id='cont_wrap' aria-label='컨텐츠 영역'>
                <div className='cont_inner '>
                    <h2 className='page_title'>기후변화</h2>
                    {/* <div className='tab_menu' aria-label='탭 메뉴 영역'>
                        <a href='#' className='tab_item active' aria-label='전체 탭 메뉴로 이동하기'>
                            전체
                        </a>
                        <a href='#' className='tab_item' aria-label='수탁과제 탭 메뉴로 이동하기'>
                            수탁과제
                        </a>
                        <a href='#' className='tab_item' aria-label='정책과제 탭 메뉴로 이동하기'>
                            정책과제
                        </a>
                    </div> */}
                    <div className='cmt_changepage_wrap' aria-label='기후변화 컨텐츠 내용 영역'>
                        <div className='cmt_changepage_inner '>
                            <div className='cmt_txt_wrap'>
                                <h3 className='Leaf_tit'>기후변화란?</h3>
                                <div className='cmt_txt'>
                                    <p className='Line_cont'>기후변화란 수십년 이상 장기간에 걸쳐 평균 기온, 강수, 바람 등 기후의 패턴이 변하는 현상으로 자연적인 변동뿐 아니라 인간 활동이 직접적 원인이 되는 변화까지 포함된다.</p>
                                    <span className='text_gray'>· IPCC : 수십 년 이상 지속되는 기후 평균 또는 변동의 변화, 자연적·인위적 요인 모두 포함</span>
                                    <span className='text_gray'>· UNFCCC : 인간 활동이 대기 조성에 변화를 일으켜 발생하는 장기적 기후 변화</span>
                                </div>
                            </div>
                            <div className='cmt_list_wrap'>
                                <h3 className='Leaf_tit'>기후변화의 주요 현상</h3>
                                <div className='cmt_list_box'>
                                    <div className='item_box'>
                                        <div className='item_img'>
                                            <span className='orange ellipse01'></span>
                                        </div>
                                        <div className='item_txt'>
                                            <h4 className='text_bold'>지구 평균 기온 상승(지구온난화)</h4>
                                            <div>
                                                <p>· 산업화 이후 전 세계 평균기온이 지속적으로 상승</p>
                                                <p>· 최근 수십년간 속도가 가속화됨</p>
                                            </div>
                                        </div>
                                    </div>  
                                    <div className='item_box'>
                                        <div className='item_img'>
                                            <span className='orange ellipse02'></span>
                                        </div>
                                        <div className='item_txt'>
                                            <h4 className='text_bold'>극단적 기상현상 빈도 증가</h4>
                                            <div>
                                                <p>· 폭염, 집중호우, 태풍, 가뭄이 더 자주, 더 강하게 발생</p>
                                                <p>· 지역별로 기온·강수의 불균형 심화</p>
                                            </div>
                                        </div>
                                    </div>  
                                    <div className='item_box'>
                                        <div className='item_img'>
                                            <span className='orange ellipse03'></span>
                                        </div>
                                        <div className='item_txt'>
                                            <h4 className='text_bold'>빙하·해빙 감소와 해수면 상승</h4>
                                            <div>
                                                <p>· 북극 해빙 및 빙하 감소로 인한 해수면 상승</p>
                                                <p>· 해안 저지대 국가와 도시가 홍수 위험에 직면</p>
                                            </div>
                                        </div>
                                    </div>  
                                    <div className='item_box'>
                                        <div className='item_img'>
                                            <span className='orange ellipse04'></span>
                                        </div>
                                        <div className='item_txt'>
                                            <h4 className='text_bold'>생태계 변화</h4>
                                            <div>
                                                <p>· 서식지 이동, 멸종위기종 증가</p>
                                                <p>· 농업 작물 수확 시기 변화, 병해충 확산</p>
                                            </div>
                                        </div>
                                    </div>  
                                    <div className='item_box'>
                                        <div className='item_img'>
                                            <span className='orange ellipse05'></span>
                                        </div>
                                        <div className='item_txt'>
                                            <h4 className='text_bold'>사회 경제적 변화</h4>
                                            <div>
                                                <p>· 농업, 어업, 산업구조의 변화 및 기후재난 대응 비용급증</p>
                                                <p>· 국제적 대응 강화, IPCC보고서와 UNFCCC 협약 등 국제공조 강화와 탄소중립 정책이 주요 전략으로 추진 </p>
                                                <p>· 급격한 기후온난화로 인한 온열질환자 증가 및 전염병 확산 가능성 증가</p>
                                            </div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    );
}

export default ClimateChangePage;