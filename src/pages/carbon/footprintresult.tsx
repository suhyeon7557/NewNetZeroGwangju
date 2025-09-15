'use client';
import React, { useState } from 'react';

import './footprintresult.scss';

const FootprintResult = () => {
    // 탭 상태 관리
    const [activeTab, setActiveTab] = useState('electricity');

    // 탭 클릭 핸들러
    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };

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
                            <div className='footprint_result_item grade a'>
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
                                홍길동님은  다른 가정 평균&nbsp;
                                <span className='bold'>349kg</span> 보다 약&nbsp;
                                <span className='bold red'>77%</span> 더 적게 배출하고 있습니다.
                            </p>
                        </div>
                        <div className='footprint_result_content'>
                            <div className='footprint_result_graph left'>
                                <div className='result_graph_inner'>
                                    {/* 그래프를 넣어주세요 */}
                                </div>
                                <div className='result_graph_text'>
                                    <h4>총 배출량 구성비</h4>
                                    <p>전체 탄소배출량에서 각 분야가 차지하는 비율을 보여줍니다.</p>
                                </div>
                            </div>
                            <div className='footprint_result_graph right'>
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
                                <button 
                                    type='button' 
                                    className={`electricity ${activeTab === 'electricity' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('electricity')}
                                >
                                    전기
                                </button>
                                <button 
                                    type='button' 
                                    className={`gas ${activeTab === 'gas' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('gas')}
                                >
                                    가스
                                </button>
                                <button 
                                    type='button' 
                                    className={`water ${activeTab === 'water' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('water')}
                                >
                                    수도
                                </button>
                                <button 
                                    type='button' 
                                    className={`traffic ${activeTab === 'traffic' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('traffic')}
                                >
                                    교통
                                </button>
                                <button 
                                    type='button' 
                                    className={`waste ${activeTab === 'waste' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('waste')}
                                >
                                    폐기물
                                </button>
                            </div>
                            <div className={`footprint_result_tab_content electricity ${activeTab === 'electricity' ? 'active' : ''}`}>
                                <div className="electricity_practices_list">
                                    <div className="practice_card">
                                        <input type="checkbox" id="elec_01" name="electricityPractices" value="elec_01" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="elec_01" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_elec_01.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">사용하지 않는 전자기기의 플러그 뽑기</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="elec_02" name="electricityPractices" value="elec_02" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="elec_02" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_elec_02.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">여름 26도, 겨울 20도로 설정하여 에너지를 절약</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="elec_03" name="electricityPractices" value="elec_03" className="practice_checkbox" />
                                        <label htmlFor="elec_03" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_elec_03.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">가전제품 에너지 소비효율 등급 확인 후 구매</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="elec_04" name="electricityPractices" value="elec_04" className="practice_checkbox" />
                                        <label htmlFor="elec_04" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_elec_04.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">냉장실은 60%만 채우면 효율이 최고</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="elec_05" name="electricityPractices" value="elec_05" className="practice_checkbox" />
                                        <label htmlFor="elec_05" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_elec_05.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">LED 조명으로 교체하기</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={`footprint_result_tab_content gas ${activeTab === 'gas' ? 'active' : ''}`}>
                                <div className="electricity_practices_list">
                                    <div className="practice_card">
                                        <input type="checkbox" id="gas_01" name="electricityPractices" value="gas_01" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="gas_01" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_gas_01.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">보일러 온도를 1도 낮추기</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="gas_02" name="electricityPractices" value="gas_02" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="gas_02" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_gas_02.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">난방 시간구역설정&#40;부분난방&#41;</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="gas_03" name="electricityPractices" value="gas_03" className="practice_checkbox" />
                                        <label htmlFor="gas_03" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_gas_03.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">단열 커튼 문풍지 설치</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="gas_04" name="electricityPractices" value="gas_04" className="practice_checkbox" />
                                        <label htmlFor="gas_04" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_gas_04.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">샤워 시간 1분 단축</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="gas_05" name="electricityPractices" value="gas_05" className="practice_checkbox" />
                                        <label htmlFor="gas_05" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_gas_05.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">조리 시 뚜껑 덮고 가열</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={`footprint_result_tab_content water ${activeTab === 'water' ? 'active' : ''}`}>
                                <div className="electricity_practices_list">
                                    <div className="practice_card">
                                        <input type="checkbox" id="water_01" name="electricityPractices" value="water_01" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="water_01" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_water_01.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">양치 시 물컵 사용</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="water_02" name="electricityPractices" value="water_02" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="water_02" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_water_02.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">절수형 샤워기 사용</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="water_03" name="electricityPractices" value="water_03" className="practice_checkbox" />
                                        <label htmlFor="water_03" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_water_03.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">세탁 시 모아서 찬물 세탁</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="water_04" name="electricityPractices" value="water_04" className="practice_checkbox" />
                                        <label htmlFor="water_04" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_water_04.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">빗물 중수도 재활용&#40;화초,청소&#41;</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={`footprint_result_tab_content traffic ${activeTab === 'traffic' ? 'active' : ''}`}>
                                <div className="electricity_practices_list">
                                    <div className="practice_card">
                                        <input type="checkbox" id="traffic_01" name="electricityPractices" value="traffic_01" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="traffic_01" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_traf_01.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">가까운 거리는 도보자전거 이용</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="traffic_02" name="electricityPractices" value="traffic_02" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="traffic_02" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_traf_02.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">대중교통 주 2회 이상 사용</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="traffic_03" name="electricityPractices" value="traffic_03" className="practice_checkbox" />
                                        <label htmlFor="traffic_03" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_traf_03.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">승용차 운행시 에코드라이빙&#40;급가속.급정지 최소화&#41;</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="traffic_04" name="electricityPractices" value="traffic_04" className="practice_checkbox" />
                                        <label htmlFor="traffic_04" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_traf_04.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">카풀 또는 합승 활용</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="traffic_05" name="electricityPractices" value="traffic_05" className="practice_checkbox" />
                                        <label htmlFor="traffic_05" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_traf_05.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">카풀 또는 합승 활용</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={`footprint_result_tab_content waste ${activeTab === 'waste' ? 'active' : ''}`}>
                                <div className="electricity_practices_list">
                                    <div className="practice_card">
                                        <input type="checkbox" id="waste_01" name="electricityPractices" value="waste_01" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="waste_01" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_waste_01.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">일회용품 사용 줄이기&#40;텀블러,장바구니 사용&#41;</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="waste_02" name="electricityPractices" value="waste_02" defaultChecked className="practice_checkbox" />
                                        <label htmlFor="waste_02" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_waste_02.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">음식물 쓰레기 20% 줄이기</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="waste_03" name="electricityPractices" value="waste_03" className="practice_checkbox" />
                                        <label htmlFor="waste_03" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_waste_03.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">분리배출 철저히 하여 재활용률 향상</div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="practice_card">
                                        <input type="checkbox" id="waste_04" name="electricityPractices" value="waste_04" className="practice_checkbox" />
                                        <label htmlFor="waste_04" className="practice_label">
                                            <div className="practice_image">
                                                <img src="/ic_waste_04.svg" alt="" />
                                            </div>
                                            <div className="practice_content">
                                                <div className="practice_check">
                                                    <img src="/ic_check.svg" alt="체크됨" className="check_icon" />
                                                </div>
                                                <div className="practice_title">헌옷,가구 재사용기부</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='footprint_result_calc'>
                                <p>
                                    2045 광주광역시 목표 배출량은 1인 기준 약 <span className='bold orange'>290.3kg</span> 입니다
                                </p>
                                <p>
                                   <span>홍길동</span>님의 총 배출량은 <span className='bold orange'>490.3kg</span> 입니다
                                </p>
                                <p>
                                    목표 실천 시 저감되는 배출량은&nbsp;
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