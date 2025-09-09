'use client';
import React from 'react';

import './footprintresult.scss';

const FootprintResult = () => {
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

                    <h2 className='page_title'>탄소발자국</h2>

                    <p className='footprint_title'>탄소발자국 분석 결과 입니다.</p>

                    <div className='footprint_result_wrap item_wrap'>
                        <div className='footprint_result_header'>
                            <h3>
                                <span className='bold'>홍길동</span>
                                님의 탄소배출량
                            </h3>
                            <p>493.3</p>
                            <span className='gray'>월간 탄소배출량&#40;kg&#41;</span>
                        </div>
                        <div className='footprint_result_content'>
                            {/* 탄소등급 a, b, c, d */}
                            <div className='footprint_result_item grade'>
                                <h3>탄소등급</h3>
                                <p></p>
                                <span className='gray'></span>
                            </div>
                            <div className='footprint_result_item'>
                                <h3>1인 평균 대비</h3>
                                <p>23</p>
                                <span className='gray'>광주 평균과 비교&#40;%&#41;</span>
                            </div>
                            <div className='footprint_result_item'>
                                <h3>2045 감축목표</h3>
                                <p>290.3</p>
                                <span className='gray'>목표 배출량&#40;kg&#41;</span>
                            </div>
                            <div className='footprint_result_item'>
                                <h3>상쇄 필요 소나무</h3>
                                <p>41</p>
                                <span className='gray'>연간 심어야 할 나무&#40;그루&#41;</span>
                            </div>
                        </div>
                    </div>

                    <div className='footprint_result_wrap graph_wrap'>
                        <div className='footprint_result_header'>
                            <h3>결과 안내</h3>
                            <p>
                                홍길동님은  다른 가정 평균
                                <span className='bold'>349kg</span>보다 약
                                <span className='bold red'>77%</span> 더 적게 배출하고 있습니다.
                            </p>
                        </div>
                        <div className='footprint_result_content'>
                            <div className='footprint_result_graph'>
                                <div className='result_graph_inner'>
                                    {/* 그래프를 넣어주세요 */}
                                </div>
                                <div className='result_graph_text'>
                                    <h4>총 배출량 구성비</h4>
                                    <p>전체 탄소배출량에서 각 분야가 차지하는 비율을 보여줍니다.</p>
                                </div>
                            </div>
                            <div className='footprint_result_graph'>
                                <div className='result_graph_inner'>
                                    {/* 그래프를 넣어주세요 */}
                                </div>
                                <div className='result_graph_text'>
                                    <h4>우리집 VS 다른집 VS 2045 광주목표</h4>
                                    <p>각 분야별로 평균 가정과 2045 광주목표 배출량을 비교하여 보여줍니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='footprint_result_wrap tab_wrap'>
                        <div className='footprint_result_header'>
                            <h3>2045 목표 도달을 위한 실천방안</h3>
                        </div>
                        <div className='footprint_result_content'>
                            <div className='footprint_result_tab'>
                                <button type='button' className='electricity active'>전기</button>
                                <button type='button' className='gas'>가스</button>
                                <button type='button' className='water'>수도</button>
                                <button type='button' className='traffic'>교통</button>
                                <button type='button' className='waste'>폐기물</button>
                            </div>
                            <div className='footprint_result_tab_content electricity'>

                            </div>
                            <div className='footprint_result_tab_content gas'>
        
                            </div>
                            <div className='footprint_result_tab_content water'>
        
                            </div>
                            <div className='footprint_result_tab_content traffic'>
        
                            </div>
                            <div className='footprint_result_tab_content waste'>
        
                            </div>
                            <div className='footprint_result_calc'>
                                <p>
                                    2045 광주광역시 목표 배출량은 1인 기준 약 <span className='bold orange'>290.3kg</span> 입니다
                                </p>
                                <p>
                                   <span>홍길동</span>님의 총 배출량은 <span className='bold orange'>490.3kg</span> 입니다
                                </p>
                                <p>
                                    목표 실천 시 저감되는 배출량은
                                    <span className='bold greenBox'>110.6kg</span> 입니다
                                </p>
                            </div>
                        </div>
                    </div>

                    <button className='footprint_btn btn_lime_bg'>다시 계산하기</button>

                </div> 
            </div>

        </div>
    );
}

export default FootprintResult;