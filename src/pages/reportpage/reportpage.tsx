'use client';
import React from 'react';
import Link from 'next/link';

import "../reportpage/reportpage.scss";

const ReportPage = () => {
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
                <img src='/subimage01.svg' alt='탄소중립 소통하기 비주얼 이미지' className='nav_bg_img'></img>
                <div className='nav_inner'>
                    <div className='nav_content_wrap'>
                        <p className='nav_text'>탄소중립, 함께 이야기하고 연결되는 공간</p>
                        <h3 className='nav_title'>탄소중립 소통하기</h3>
                    </div>
                </div>
            </div>
            <nav className='sub_nav' aria-label='페이지 내비게이션 바 영역'>
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
                <div className='cont_inner'>
                    <h2 className='page_title'>연구보고서</h2>
                    <div className='tab_menu' aria-label='탭 메뉴 영역'>
                        <a href='#' className='tab_item active' aria-label='전체 탭 메뉴로 이동하기'>
                            전체
                        </a>
                        <a href='#' className='tab_item' aria-label='수탁과제 탭 메뉴로 이동하기'>
                            수탁과제
                        </a>
                        <a href='#' className='tab_item' aria-label='정책과제 탭 메뉴로 이동하기'>
                            정책과제
                        </a>
                    </div>
                    <div className='search_wrap' aria-label='검색 영역'>
                        <div className='info_wrap'>
                            <div className='info_text01'>
                                <span>전체</span>
                                <span className='count text_lime text_bold'>12</span>건
                            </div>
                            <div className='info_text02'>
                                <span>현재 페이지</span>
                                <span className='current_page_number text_lime text_bold'>1</span> /
                                <span className='total_page_number'>2</span>
                            </div>
                        </div>
                        <div className='search_area'>
                            <select className='search_criteria'>
                                <option value='title'>제목</option>
                                <option value='name'>작성자</option>
                                <option value='date'>발행연도</option>
                            </select>
                            <input type='text' className='search_input' placeholder='검색어를 입력해주세요.' />
                            <button className='search_btn btn_lime_bg bd_radius'>검색</button>
                        </div>
                    </div>
                    <div className='list_wrap' aria-label='연구보고서 목록 영역'>
                        <div className='report_list'>
                            <ul className='report_list_wrap'>
                                <li>
                                    <div className='e-bookimg'>
                                        <img src='/image_report01.svg' alt='연구보고서 이미지' />
                                    </div>
                                    <div className='info_wrap'>
                                        <div className='info_status'>
                                            <span className='status'>수탁</span>
                                            <p className='title'>
                                                <a href='#' aria-label='연구보고서 제목 링크로 이동하기'>
                                                    [2025]년 광주광역시 북구 제1차 탄소중립 녹색성장 기본계획(2025 ~ 2030)
                                                </a>
                                            </p>
                                        </div>
                                        <div className='info_text'>
                                            <ul>
                                                <li>
                                                    <span>연구책임</span>
                                                    <p>김태호 연구위원, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>연구진</span>
                                                    <p>김태호, 강상현, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>발행연도</span>
                                                    <p>2024</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='report_btn_wrap'>
                                            <button type='button' className='btn_view btn_gray_line no_bd_radius'>
                                                원본보기
                                            </button>
                                            <button type='button' className='btn_download btn_gray_line no_bd_radius'>
                                                다운로드
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className='e-bookimg'>
                                        <img src='/image_report02.svg' alt='연구보고서 이미지' />
                                    </div>
                                    <div className='info_wrap'>
                                        <div className='info_status'>
                                            <span className='status'>수탁</span>
                                            <p className='title'>
                                                <a href='#' aria-label='연구보고서 제목 링크로 이동하기'>
                                                    [2024년] 광주광역시 제2차 빛공해 환경영향평가 결과
                                                </a>
                                            </p>
                                        </div>
                                        <div className='info_text'>
                                            <ul>
                                                <li>
                                                    <span>연구책임</span>
                                                    <p>김태호 연구위원, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>연구진</span>
                                                    <p>김태호, 강상현, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>발행연도</span>
                                                    <p>2024</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='report_btn_wrap'>
                                            <button type='button' className='btn_view btn_gray_line no_bd_radius'>
                                                원본보기
                                            </button>
                                            <button type='button' className='btn_download btn_gray_line no_bd_radius'>
                                                다운로드
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className='e-bookimg'>
                                        <img src='/image_report03.svg' alt='연구보고서 이미지' />
                                    </div>
                                    <div className='info_wrap'>
                                        <div className='info_status'>
                                            <span className='status'>정책</span>
                                            <p className='title'>
                                                <a href='#' aria-label='연구보고서 제목 링크로 이동하기'>
                                                    [2024년] 광주광역시 제3차 빛공해 방지계획 (2025~2029) 수립
                                                </a>
                                            </p>
                                        </div>
                                        <div className='info_text'>
                                            <ul>
                                                <li>
                                                    <span>연구책임</span>
                                                    <p>김태호 연구위원, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>연구진</span>
                                                    <p>김태호, 강상현, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>발행연도</span>
                                                    <p>2024</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='report_btn_wrap'>
                                            <button type='button' className='btn_view btn_gray_line no_bd_radius'>
                                                원본보기
                                            </button>
                                            <button type='button' className='btn_download btn_gray_line no_bd_radius'>
                                                다운로드
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className='e-bookimg'>
                                        <img src='/image_report04.svg' alt='연구보고서 이미지' />
                                    </div>
                                    <div className='info_wrap'>
                                        <div className='info_status'>
                                            <span className='status'>정책</span>
                                            <p className='title'>
                                                <a href='#' aria-label='연구보고서 제목 링크로 이동하기'>
                                                     [2025년] 광주광역시 북구 제1차 탄소중립 녹색성장 기본계획(2025 ~ 2034)
                                                </a>
                                            </p>
                                        </div>
                                        <div className='info_text'>
                                            <ul>
                                                <li>
                                                    <span>연구책임</span>
                                                    <p>김태호 연구위원, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>연구진</span>
                                                    <p>김태호, 강상현, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>발행연도</span>
                                                    <p>2024</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='report_btn_wrap'>
                                            <button type='button' className='btn_view btn_gray_line no_bd_radius'>
                                                원본보기
                                            </button>
                                            <button type='button' className='btn_download btn_gray_line no_bd_radius'>
                                                다운로드
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className='e-bookimg'>
                                        <img src='/image_report05.svg' alt='연구보고서 이미지' />
                                    </div>
                                    <div className='info_wrap'>
                                        <div className='info_status'>
                                            <span className='status'>정책</span>
                                            <p className='title'>
                                                <a href='#' aria-label='연구보고서 제목 링크로 이동하기'>
                                                    [2025년] 광주광역시 광산구 제1차 탄소중립 녹색성장 기본계획(2025 ~ 2034)
                                                </a>
                                            </p>
                                        </div>
                                        <div className='info_text'>
                                            <ul>
                                                <li>
                                                    <span>연구책임</span>
                                                    <p>김태호 연구위원, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>연구진</span>
                                                    <p>김태호, 강상현, 광주기후에너지진흥원</p>
                                                </li>
                                                <li>
                                                    <span>발행연도</span>
                                                    <p>2024</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='report_btn_wrap'>
                                            <button type='button' className='btn_view btn_gray_line no_bd_radius'>
                                                원본보기
                                            </button>
                                            <button type='button' className='btn_download btn_gray_line no_bd_radius'>
                                                다운로드
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <nav className='pagination' aria-label='페이징 영역'>
                        <ul className='pagination_list'>
                            {/* 첫번째 페이지 버튼 */}
                            <li className='pagination_item first'>
                                <a href='#' className='pagination_btn' aria-disabled='true' tabIndex={-1} aria-label='첫번째 페이지로 이동하기'>&laquo;</a>
                            </li>
                            {/* 이전 페이지 버튼 */}
                            <li className='pagination_item prev'>
                                <a href='#' className='pagination_btn' aria-disabled='true' tabIndex={-1} aria-label='이전 페이지로 이동하기'>&lt;</a>
                            </li>
                            <li className='status_wrap'>
                                <span className='pagination_status'>
                                    <a href="#" className="active" title="현재 페이지">1
                                    </a>
                                    <a href="#">2</a>
                                </span>
                            </li>
                            {/* 페이지 번호 버튼 */}
                            <li className='pagination_item'>
                                <a href='#' className='pagination_btn' aria-current='page' aria-label='1번 페이지로 이동하기'>1</a>
                            </li>
                            <li className='pagination_item'>
                                <a href='#' className='pagination_btn' aria-label='2번 페이지로 이동하기'>2</a>
                            </li>
                            <li className='pagination_item'>
                                <a href='#' className='pagination_btn' aria-label='3번 페이지로 이동하기'>3</a>
                            </li>
                            <li className='pagination_item'>
                                <a href='#' className='pagination_btn' aria-label='4번 페이지로 이동하기'>4</a>
                            </li>
                            <li className='pagination_item'>
                                <a href='#' className='pagination_btn' aria-label='5번 페이지로 이동하기'>5</a>
                            </li>
                            {/* 다음 페이지 버튼 */}
                            <li className='pagination_item next'>
                                <a href='#' className='pagination_btn' aria-label='다음 페이지로 이동하기'>&gt;</a>
                            </li>
                            {/* 마지막 페이지 버튼 */}
                            <li className='pagination_item last'>
                                <a href='#' className='pagination_btn' aria-label='마지막 페이지로 이동하기'>&raquo;</a>
                            </li>
                        </ul>
                    </nav>
                </div> 
            </div>
        </div>
    );
}

export default ReportPage;