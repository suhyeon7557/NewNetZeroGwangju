'use client';
import React from 'react';
import Link from 'next/link';

import "./ordinancepage.scss";

const OrdinancePage = () => {
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
                <img src='/subimage03.jpg' alt='관련 조례 및 계획 비주얼 이미지' className='nav_bg_img'></img>
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
            <div id='cont_wrap' className='ordinancepage_wrap reveal' aria-label='컨텐츠 영역'>
                <div className='cont_inner reveal'>
                    <h2 className='page_title'>관련 조례 및 계획</h2>
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
                </div>
                <div className='cont_content reveal' aria-label='관련 조례 및 계획 컨텐츠 내용 영역'>
                    <div className='doc_list reveal' aria-label='법 및 보고서 카드 목록'>
                        <div className='doc_card' aria-label='녹색성장 기본법 카드 영역'>
                            <div className='doc_header'>
                                <span className='doc_icon'></span>
                                <h3 className='doc_title '>기후위기 대응을 위한 탄소중립·녹색성장 기본법 (약칭:탄소중립기본법) 및 시행령</h3>
                            </div>
                            <div className='doc_body'>
                                <p>
                                    <span className='text_gray'>제 1조(목적)</span> 이 법은 기후위기의 심각한 영향을 예방하기 위하여 온실가스 감축 및 기후위기 적응대책을 강화하고
                                    탄소중립 사회로의 이행과정에서 발생할 수 있는 경제적·환경적·사회적 불평등을 해소하며 녹색기술과
                                    녹색산업의 육성·촉진·활성화를 통하여 경제와 환경의 조화로운 발전을 도모함으로써, 현제 새대와
                                    미래 세대의 삶의 질을 높이고 생태계와 기후체계를 보호하며 국제사회의 지속가능발전에 이바지하는 것을
                                    목적으로 한다.
                                </p>
                            </div>
                            <div className='doc_button'>
                                <a href="https://www.law.go.kr/법령/기후위기 대응을 위한 탄소중립ㆍ녹색성장 기본법 시행령" target='_blank'>
                                    <button type='button' className='btn_gray_line bd_radius arrow_btn'>바로가기</button>
                                </a>
                            </div>
                        </div>
                        <div className='doc_card' aria-label='기후위기 대응 기본 조례 카드 영역'>
                            <div className='doc_header'>
                                <span className='doc_icon'></span>
                                <h3 className='doc_title '>광주광역시 기후위기 대응 기본 조례</h3>
                            </div>
                            <div className='doc_body'>
                                <p>
                                   <span className='text_gray'>제1조(목적)</span> 이 조례는 기후위기의 심각한 영향을 예방하기 위하여 필요한 사항을 규정함으로써 현재 세대와
                                    미래 세대의 삶의 질 향상 및 지속가능발전에 이바지함을 목적으로 한다.
                                </p>
                            </div>
                            <div className='doc_button'>
                                <a href="https://www.law.go.kr/자치법규/광주광역시 기후위기 대응 기본 조례/(6347,20240223)" target='_blank'>
                                    <button type='button' className='btn_gray_line bd_radius arrow_btn'>바로가기</button>
                                </a>
                            </div>
                        </div>
                        <div className='doc_card' aria-label='국가 기본계획 카드 영역'>
                            <div className='doc_header'>
                                <span className='doc_icon'></span>
                                <h3 className='doc_title '>탄소중립 녹색성장 국가전략 및 제1차 국가 기본계획 </h3>
                            </div>
                            <div className='doc_body'>
                                <p>
                                    정부는 국가비전을 달성하기 위하여 국가 탄소중립 녹색성장 전략을 수립함<br/>
                                    국가비전 : 2050년까지 탄소중립을 목표로 하여 탄소중립 사회로 이행하고, 환경과 경제의 조화로운 발전을 도모 
                                    - 국가비전 등 정책목표에 관한 사항, 국가비전의 달성을 위한 부문별 전략 및 중점추진과제, 환경·에너지·국토·해양 등 관련 정책과의
                                    연계에 관한 사항, 그 밖에 재원조달, 조세·금융, 인력양성, 교육·홍보 등 탄소중립 사회로의 이행을 위하여 필요하다고 인정되는 사항
                                </p>
                            </div>
                            <div className='doc_button'>
                                <a href="#">
                                    {/* 다운로드 링크 추가 , 파일은 나스 퍼블리싱 파일에 있습니다. pdf파일 */}
                                    <button type='button' className='btn_gray_line bd_radius download_btn'>다운로드</button>
                                </a>
                            </div>
                        </div>
                        <div className='doc_card' aria-label='광주광역시 탄소중립 기본계획 카드 영역'>
                            <div className='doc_header'>
                                <span className='doc_icon'></span>
                                <h3 className='doc_title '>제1차 광주광역시 탄소중립·녹색성장 기본계획(2024-2033)</h3>
                            </div>
                            <div className='doc_body'>
                                <p>파리기후변화협약에 따라 국가는 온실가스 감축 목표를 설정하고 이행과 적응 요구를 증대시킴. 탄소중립 기본법 재정으로 지차체는
                                    국가 2050 탄소중립 전략 수립과 연계한 지역 맞춤형 온실가스 감축과 적응정책을 포괄하는 기본계획을 수립하도록 의무화됨.
                                    따라서, 부문별 온실가스 감축 및 기후위기 적응을 포괄하는 중장기 탄소중립 기본계획 수립립
                                </p>
                            </div>
                            <div className='doc_button'>
                                <a href="#">
                                    {/* 다운로드 링크 추가 , 파일은 나스 퍼블리싱 파일에 있습니다. pdf파일 */}
                                    <button type='button' className='btn_gray_line bd_radius download_btn'>다운로드</button>
                                </a>
                            </div>
                        </div>
                        <div className='doc_card' aria-label='제3차 국가 기후위기 적응 강화대책(2023-2025) 카드 영역'>
                            <div className='doc_header'>
                                <span className='doc_icon'></span>
                                <h3 className='doc_title '>제3차 국가 기후위기 적응 강화대책(2023-2025)</h3>
                            </div>
                            <div className='doc_body'>
                                <p>
                                    심화되는 기후위기로 전세계 피해 급증하고 있으며, 우리 국민이 직접 경험한 기후재난(폭우·태풍·가뭄·산불)의 발생빈도와 강도가 심화됨.
                                    기존 국가 기후위기 적응대책의 한계를 보완하여, 현장에 적용할 수 있는 액션플랜 보강, 사회전반 적응인프라 강화 등을 보완한 적응강화대책 수립
                                </p>
                            </div>
                            <div className='doc_button'>
                                <a href="#">
                                    {/* 다운로드 링크 추가 , 파일은 나스 퍼블리싱 파일에 있습니다. pdf파일 */}
                                    <button type='button' className='btn_gray_line bd_radius download_btn'>다운로드</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrdinancePage;