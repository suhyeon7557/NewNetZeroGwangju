'use client';
import React from 'react';

import "../carbon/footprint.scss";

const Footprint = () => {
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

                    <p className='footprint_title'>내가 생활 속에서 배출하는 이산화탄소의 양은 얼마일까요?</p>

                    <div className='footprint_wrap'>
                        <div className='footprint_inner'>
                            <h3 className='inner_base'>기본정보</h3>
                            <div className='footprint_item'>
                                <label htmlFor='name'>이름 또는 별명</label>
                                <input type='text' id='name' placeholder='10자 이내' />
                            </div>
                            <div className='footprint_item'>
                                <label htmlFor='type'>주거형태</label>
                                <select id='type'>
                                    <option value=''>선택</option>
                                    <option value=''>주택</option>
                                    <option value=''>아파트</option>
                                    <option value=''>오피스텔</option>
                                    <option value=''>오피스</option>
                                </select>
                            </div>
                            <div className='footprint_item'>
                                <label htmlFor='area'>거주면적 &#40;㎡&#41;</label>
                                <input type='number' id='area' placeholder='예: 84'/>
                            </div>
                            <div className='footprint_item'>
                                <label htmlFor='personnel'>거주인원 &#40;명&#41;</label>
                                <input type='number' id='personnel' placeholder='예: 4'/>
                                <span className='error_msg'>10명 이하로 입력해주세요.</span>
                            </div>
                        </div>
                        <div className='footprint_inner'>
                            <h3 className='inner_usage'>월별 사용량</h3>
                            <div className='footprint_item'>
                                <label htmlFor='d'>전기 &#40;kWh&#41;</label>
                                <input type='number' id='d' placeholder='예: 100'/>
                            </div>
                            <div className='footprint_item'>
                                <label htmlFor='d'>가스 &#40;m³&#41;</label>
                                <input type='number' id='d' placeholder='예: 10'/>
                            </div>
                            <div className='footprint_item'>
                                <label htmlFor='d'>수도 &#40;m³&#41;</label>
                                <input type='number' id='d' placeholder='예: 10'/>  
                            </div>
                            <div className='footprint_item'>
                                <label htmlFor='d'>승용차 월 주행거리 &#40;km&#41;</label> 
                                <input type='number' id='d' placeholder='예: 100'/>
                            </div>
                            <div className='footprint_item'>
                                <label htmlFor='d'>폐기물 배출량 &#40;kg&#41;</label>
                                <input type='number' id='d' placeholder='예: 10'/>
                            </div>
                        </div>
                    </div>

                    <button className='footprint_btn btn_lime_bg'>탄소발자국 계산하기</button>

                </div> 
            </div>

        </div>
    );
}

export default Footprint;