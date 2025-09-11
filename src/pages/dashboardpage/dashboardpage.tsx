'use client';
import React from 'react';
import Link from 'next/link';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

import "./dashboardpage.scss";

const Dashboardpage = () => {
    return (
        <div className="Dashboardpage">
            <h1 className="Dashboardpage_title" style={{display: 'none'}}>Dashboardpage</h1>
            <div className="Dashboardpage_wrap">
                <div className='Dashboardpage_inner'>
                    <div className='Dashboardpage_header' aria-label='헤더 영역'>
                        <img src="/logo_white.svg" alt="logo" />
                        <button type='button' className='mainpage_btn'>홈페이지 바로가기</button>
                    </div>
                    <div className='Dashboardpage_content' aria-label='컨텐츠 영역'>
                        <div className='DB_left'>
                            <div className='legend_wrap' aria-label='왼쪽 범례 영역'>
                                <ul>
                                    <li className='legend_box green'>
                                        <p className='legend'></p>
                                        <span>올바른 방향</span>
                                    </li>
                                    <li className='legend_box yellow'>
                                        <p className='legend'></p>
                                        <span>궤도 벗어남</span>
                                    </li>
                                    <li className='legend_box orange'>
                                        <p className='legend'></p>
                                        <span>잘못된 길</span>
                                    </li>
                                    <li className='legend_box white'>
                                        <p className='legend'></p>
                                        <span>목표 없음</span>
                                    </li>
                                    <li className='legend_box led'>
                                        <p className='legend'></p>
                                        <span>잘못된 방향</span>
                                    </li>
                                    <li className='legend_box purple'>
                                        <p className='legend'></p>
                                        <span>데이터 부족</span>
                                    </li>
                                </ul>
                            </div>
                            <div className='description_wrap' aria-label='페이지 설명 보기 영역'>
                                <button type='button' className='description_btn'> 페이지 설명 보기</button>
                            </div>
                            <div className='emissions_wrap' aria-label='배출량 영역'>
                                <h3>배출량</h3>
                                <div className='map_select_wrap'>
                                    <div className='select_navy'>
                                        <select name="map" id="mapSelect">
                                            <option value="all">광주 전체</option>
                                            <option value="gwangsan">광산구</option>
                                            <option value="seo">서구</option>
                                            <option value="dong">동구</option>
                                            <option value="nam">남구</option>
                                            <option value="buk">북구</option>
                                        </select>
                                    </div>
                                    <div className='select_navy'>
                                        <select name="year" id="yearSelect">
                                            <option value="2023">2023년</option>
                                            <option value="2022">2022년</option>
                                            <option value="2021">2021년</option>
                                            <option value="2020">2020년</option>
                                            <option value="2019">2019년</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='emissions_graph_wrap' aria-label='배출량 그래프 영역'>
                                    <div className='graph_txt'>
                                        <h3>연간 (MtCO₂eq) </h3>
                                        <div className='data_txt'>
                                            <p className='text_bold'>2,478</p>
                                            <span className='text_skyblue'>4%</span>
                                            <span className='triangle_down skyblue'></span>
                                        </div>
                                    </div>
                                    <div className='graph_box'>
                                        {/*가로 막대바 차트가 들어갈 공간입니다 */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='DB_center' aria-label='센터 선버스트 차트 영역'>
                            <div className='sunburst_chart'>
                            {/*선버스트 차트가 들어갈 공간입니다 */}
                            </div>
                        </div>
                        <div className='DB_right' aria-label='오른쪽 추세 그래프 영역'>
                            <div className='trend_txt'>
                                <h3 className='text_bold'>전환</h3>
                                <p>에너지를 공급하고 소비하는 방식을 화석 연료에서 재생 에너지로 바꾸는 것을 의미</p>
                            </div>
                            <div className='trend_graph_wrap'>
                                <ul>
                                    <li>
                                        <h2>재생(태양광)에너지 비중</h2>
                                        <div className='txt_graph_wrap'>
                                            <div className='legend_box green'>
                                                <p className='legend'></p>
                                                <span>올바른 방향</span>
                                            </div>
                                            <div className='trend_graph_box'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2>태양광 자가발전 비율</h2>
                                        <div className='txt_graph_wrap'>
                                            <div className='legend_box yellow'>
                                                <p className='legend'></p>
                                                <span>궤도 벗어남</span>
                                            </div>
                                            <div className='trend_graph_box'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2>1차 에너지공급량 중 신·재생에너지 비중</h2>
                                        <div className='txt_graph_wrap'>
                                            <div className='legend_box yellow'>
                                                <p className='legend'></p>
                                                <span>궤도 벗어남</span>
                                            </div>
                                            <div className='trend_graph_box'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2>전력 자립도</h2>
                                        <div className='txt_graph_wrap'>
                                            <div className='legend_box orange'>
                                                <p className='legend'></p>
                                                <span>잘못된 길</span>
                                            </div>
                                            <div className='trend_graph_box'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2>에너지 집약도(GRDP당 최종에너지소비량)</h2>
                                        <div>
                                            <div className='legend_box white'>
                                                <p className='legend'></p>
                                                <span>목표 없음</span>
                                            </div>
                                            <div className='trend_graph_box'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2>전력 소비량 증가율</h2>
                                        <div className='txt_graph_wrap'>
                                            <div className='legend_box led'>
                                                <p className='legend'></p>
                                                <span>잘못된 방향</span>
                                            </div>
                                            <div className='trend_graph_box'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2>전력 탄소집약도</h2>
                                        <div className='txt_graph_wrap'>
                                            <div className='legend_box led'>
                                                <p className='legend'></p>
                                                <span>잘못된 방향</span>
                                            </div>
                                            <div className='trend_graph_box'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2>에너지 효율 개선율</h2>
                                        <div className='txt_graph_wrap'>
                                            <div className='legend_box purple'>
                                                <p className='legend'></p>
                                                <span>데이터 부족</span>
                                            </div>
                                            <div className='trend_graph_box data_none'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                                <p>공개적으로 이용가능한 데이터 소스가<br/> 확인되지 않았습니다.</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2>에너지 집약도(GRDP당 최종에너지소비량)</h2>
                                        <div className='txt_graph_wrap'>
                                            <div className='legend_box purple'>
                                                <p className='legend'></p>
                                                <span>데이터 부족</span>
                                            </div>
                                            <div className='trend_graph_box data_none'>
                                                {/* 추세 그래프가 들어갈 공간입니다. */}
                                                <p>공개적으로 이용가능한 데이터 소스가<br/> 확인되지 않았습니다.</p>
                                            </div>
                                         </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dashboardpage_footer' aria-label='푸터 영역'>
                    <h2>© 2025 탄소중립 넷제로 포털 | 지속가능한 미래를 함께 만들어갑니다</h2>
                    <img src="/logo_gcea.svg" alt="logo" />
                </div>
            </div>
        </div>
    );
};

export default Dashboardpage;