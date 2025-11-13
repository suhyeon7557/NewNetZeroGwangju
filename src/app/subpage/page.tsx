export default function SubpagePage() {
  return (
    <main role="main" aria-label="서브페이지 콘텐츠">
    <div id="Content" className="Subpage">
        <div id="nav_wrap" aria-label="내비게이션 영역">
            <div id="nav_inner">
                <div className="visual" aria-label="서브 비주얼 영역">
                    <div className="visual_inner">
                        <nav className="breadcrumb" aria-label="경로">
                            <ol>
                                <li><a href="/"><img src="/images/ic_home_white.svg" alt="홈" /></a></li>
                                <li aria-hidden="true">›</li>
                                <li>광주의 탄소중립</li>
                            </ol>
                        </nav>
                        <div className="sub_title_wrap">
                            <h1 className="sub_title">탄소중립 히스토리</h1>
                        </div>
                        <ul className="sub_tabs" role="tablist" aria-label="서브 탭 메뉴 영역">
                            <li className="is-active"><a href="#" role="tab" aria-selected="true">국제사회</a></li>
                            <li><a href="#" role="tab">우리나라</a></li>
                            <li><a href="#" role="tab">광주광역시</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div id="content_wrap" aria-label="콘텐츠 영역">
             <div id="cont_inner">
               {/* 내부 탭 (컨텐츠 영역용) */}
               <div className="inner_tabs" aria-label="탭 영역">
                 <ul>
                   <li className="is-active"><a href="#">재생에너지 비중</a></li>
                   <li><a href="#">태양광·자가발전 비율</a></li>
                   <li><a href="#">1차 에너지 공급량 중 신재생에너지 비중</a></li>
                   <li><a href="#">전력자립도</a></li>
                   <li><a href="#">에너지 집약도(GRDP당 최종에너지소비량)</a></li>
                   <li><a href="#">전력소비량 증가율</a></li>
                   <li><a href="#">전력 탄소집약도</a></li>
                   <li><a href="#">에너지효율 개선율</a></li>
                   <li><a href="#">탄소중립 생활 실천도(에너지)</a></li>
                 </ul>
               </div>
               <div className="tab_content"></div>
            </div>
        </div>
    </div>
    </main>
  );
}

