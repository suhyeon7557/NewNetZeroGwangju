'use client';

import { useEffect } from "react";

export default function Header() {
  useEffect(() => {
    const gnb = document.getElementById('gnb1');
    if (!gnb) return;

    const items = Array.from(gnb.querySelectorAll<HTMLLIElement>('.lnb'));
    const hitarea = gnb.querySelector<HTMLDivElement>('.submenu-hitarea');
    const gnb2 = document.getElementById('gnb2');
    // ensure overlay layer exists
    let gnb2Layer = document.getElementById('gnb2-layer');
    if (!gnb2Layer) {
      gnb2Layer = document.createElement('div');
      gnb2Layer.id = 'gnb2-layer';
      document.body.appendChild(gnb2Layer);
    }
    const htmlEl = document.documentElement;

    let hideTimer: number | null = null;
    let active: HTMLLIElement | null = null;

    const setVar = (name: string, value?: string) => {
      if (value === undefined) {
        gnb.style.removeProperty(name);
      } else {
        gnb.style.setProperty(name, value);
      }
    };
    const getItemFrom = (el: Element | null): HTMLLIElement | null => {
      const li = el?.closest('li.lnb') as HTMLLIElement | null;
      return li && gnb.contains(li) ? li : null;
    };
    const cancelClose = () => {
      if (hideTimer !== null) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };
    const scheduleClose = () => {
      cancelClose();
      hideTimer = window.setTimeout(() => {
        items.forEach((li) => {
          li.classList.remove('is-open');
          const a = li.querySelector<HTMLAnchorElement>('a');
          if (a) a.setAttribute('aria-expanded', 'false');
        });
        gnb.classList.remove('is-open');
        active = null;
      }, 250);
    };
    const updateOverlayTop = () => {
      const rect = gnb.getBoundingClientRect();
      setVar('--submenu-top', `${Math.max(0, Math.round(rect.bottom))}px`);
    };
    const updateHeight = (li: HTMLLIElement | null) => {
      if (!li) return;
      const submenu = li.querySelector<HTMLDivElement>('.submenu');
      if (!submenu) return;
      const h = submenu.offsetHeight || submenu.scrollHeight || 0;
      setVar('--submenu-bg-height', `${h}px`);
    };
    const openItem = (li: HTMLLIElement) => {
      if (active === li) return;
      if (active) active.classList.remove('is-open');
      active = li;
      li.classList.add('is-open');
      const a = li.querySelector<HTMLAnchorElement>('a');
      if (a) a.setAttribute('aria-expanded', 'true');
      gnb.classList.add('is-open');
      updateOverlayTop();
      // 다음 프레임에서 높이 측정 (전환이 반영되도록)
      requestAnimationFrame(() => updateHeight(li));
    };

    const shouldHandleGnb1 = () => {
      const isMobileOrTablet = window.matchMedia('(max-width: 1200px)').matches;
      const g2Open = document.documentElement.classList.contains('gnb2-open');
      return !isMobileOrTablet && !g2Open;
    };

    const onEnter = (e: MouseEvent) => {
      if (!shouldHandleGnb1()) return;
      cancelClose();
      const li = getItemFrom(e.target as Element);
      if (li) openItem(li);
    };
    const onMove = (e: MouseEvent) => {
      if (!shouldHandleGnb1()) return;
      cancelClose();
      const li = getItemFrom(e.target as Element);
      if (li) openItem(li);
    };
    const onLeave = () => {
      scheduleClose();
    };
    const onClick = () => {
      // 내부 클릭 시 즉시 닫기
      scheduleClose();
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!shouldHandleGnb1()) return;
      cancelClose();
      const li = getItemFrom(e.target as Element);
      if (li) openItem(li);
    };
    const onFocusOut = () => {
      if (!gnb.contains(document.activeElement)) scheduleClose();
    };
    const onResize = () => {
      updateOverlayTop();
      if (active) updateHeight(active);
    };
    const onScroll = () => updateOverlayTop();

    gnb.addEventListener('mouseenter', onEnter);
    gnb.addEventListener('mousemove', onMove);
    gnb.addEventListener('mouseleave', onLeave);
    gnb.addEventListener('click', onClick);
    gnb.addEventListener('focusin', onFocusIn);
    gnb.addEventListener('focusout', onFocusOut);
    hitarea?.addEventListener('mouseenter', cancelClose);
    hitarea?.addEventListener('mouseleave', scheduleClose);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    // gnb2: 모바일 아코디언 토글 (<= 768px)
    const onClickGnb2 = (e: MouseEvent) => {
      if (!window.matchMedia('(max-width: 768px)').matches) return;
      const target = e.target as Element | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const li = anchor.closest('li');
      if (!li) return;
      const submenu = li.querySelector<HTMLElement>(':scope > .submenu2');
      if (!submenu) return;
      e.preventDefault();
      // close siblings
      const siblings = li.parentElement ? Array.from(li.parentElement.children) : [];
      siblings.forEach((sib) => {
        if (sib !== li) {
          const sibSub = sib.querySelector<HTMLElement>(':scope > .submenu2');
          if (sibSub) sibSub.classList.remove('open');
          const sibAnchor = sib.querySelector<HTMLAnchorElement>(':scope > a');
          if (sibAnchor) sibAnchor.setAttribute('aria-expanded', 'false');
        }
      });
      const willOpen = !submenu.classList.contains('open');
      submenu.classList.toggle('open', willOpen);
      anchor.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    };
    if (gnb2) gnb2.addEventListener('click', onClickGnb2);

    // hamburger toggle for gnb2
    const sideBtn = document.getElementById('side_btn');
    const btnHamburger = sideBtn?.querySelector<HTMLButtonElement>('.btn_hamburger') || null;
    const setGnb2Open = (open: boolean) => {
      if (!gnb2 || !gnb2Layer) return;
      gnb2.classList.toggle('active', open);
      gnb2Layer.classList.toggle('open', open);
      htmlEl.classList.toggle('gnb2-open', open);
      if (btnHamburger) {
        btnHamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        btnHamburger.setAttribute('aria-pressed', open ? 'true' : 'false');
      }
      if (open) {
        // Ensure top (gnb1) is fully closed to avoid flicker/ghost submenu
        cancelClose();
        items.forEach((li) => {
          li.classList.remove('is-open');
          const a = li.querySelector<HTMLAnchorElement>('a');
          if (a) a.setAttribute('aria-expanded', 'false');
        });
        gnb.classList.remove('is-open');
        active = null;
      } else {
        // Closing gnb2: reset all accordion states to avoid "ghost" duplicates on next open
        const openSubmenus = Array.from(gnb2.querySelectorAll<HTMLElement>(':scope .submenu2.open'));
        openSubmenus.forEach((el) => el.classList.remove('open'));
        const anchors = Array.from(gnb2.querySelectorAll<HTMLAnchorElement>(':scope > ul > li > a'));
        anchors.forEach((a) => a.setAttribute('aria-expanded', 'false'));
        // Optional: scroll to top to avoid perceived duplication during fade-out
        gnb2.scrollTop = 0;
      }
    };
    const onClickHamburger = (e: MouseEvent) => {
      e.preventDefault();
      // 1200px 이하에서만 동작
      if (!window.matchMedia('(max-width: 1200px)').matches) return;
      const isOpen = gnb2?.classList.contains('active') || false;
      setGnb2Open(!isOpen);
    };
    const onClickOverlay = (e: MouseEvent) => {
      if (!(e.target as Element).closest('#gnb2')) {
        setGnb2Open(false);
      }
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGnb2Open(false);
    };
    const onResizeClose = () => {
      if (!window.matchMedia('(max-width: 1200px)').matches) {
        setGnb2Open(false);
      }
    };
    if (btnHamburger) btnHamburger.addEventListener('click', onClickHamburger);
    gnb2Layer?.addEventListener('click', onClickOverlay);
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResizeClose);

    return () => {
      gnb.removeEventListener('mouseenter', onEnter);
      gnb.removeEventListener('mousemove', onMove);
      gnb.removeEventListener('mouseleave', onLeave);
      gnb.removeEventListener('click', onClick);
      gnb.removeEventListener('focusin', onFocusIn);
      gnb.removeEventListener('focusout', onFocusOut);
      hitarea?.removeEventListener('mouseenter', cancelClose);
      hitarea?.removeEventListener('mouseleave', scheduleClose);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      if (gnb2) gnb2.removeEventListener('click', onClickGnb2);
      if (btnHamburger) btnHamburger.removeEventListener('click', onClickHamburger);
      gnb2Layer?.removeEventListener('click', onClickOverlay);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', onResizeClose);
    };
  }, []);
  return (
    <header id="header" role="banner">
      <div className="header_wrap" aria-label="헤더영역">
        <h1 id="logo" aria-label="로고">
            <a href="/" aria-label="메인페이지 바로가기">
                <img src="/images/logo.svg" alt="NetZero Logo" />
            </a> 
        </h1>
        <div id="side_btn" aria-lagel="검색버튼" >
          <button className="btn_search" aria-label="검색열기"></button>
          <button className="btn_hamburger" aria-label="메뉴열기"></button>
        </div>
        <nav id="gnb1" aria-label="주요메뉴">
            <ul id="head_menu" className="topmenu">
                <li className="lnb">
                <a href="/" aria-expanded="false">기후변화</a>
                  <div className="submenu" aria-label="기후변화 서브메뉴">
                    <div className="lnb_title">
                        <p className="desc">기후변화</p>
                        <span className="lnb_title_desc">
                            기후변화의 원인과 현황을 이해하고,<br/>
                            국가와 지역별 변화를 시각적으로 제공합니다.
                        </span>
                    </div>
                    <ul className="sublist">
                      <li><a href="/">기후변화</a></li>
                      <li><a href="/">우리나라 기후변화</a></li>
                      <li><a href="/">광주의 기후변화</a></li>
                    </ul>
                  </div>
                </li>
                <li className="lnb">
                  <a href="/" aria-expanded="false">탄소중립</a>
                  <div className="submenu" aria-label="탄소중립 서브메뉴">
                    <div className="lnb_title">
                        <p className="desc">탄소중립</p>
                        <span className="lnb_title_desc">
                            지속가능한 탄소중립 사회를 향한,<br/>
                            국가의 계획과 정책 방향을 제시합니다.
                        </span>
                    </div>
                    <ul className="sublist">
                      <li><a href="/">탄소중립</a></li>
                      <li><a href="/">국가기본계획</a></li>
                      <li><a href="/">국가정책</a></li>
                    </ul>
                  </div>
                </li>
                <li className="lnb">
                  <a href="/" aria-expanded="false">광주의 탄소중립</a>
                  <div className="submenu" aria-label="광주의 탄소중립 서브메뉴">
                    <div className="lnb_title">
                        <p className="desc">광주의 탄소중립</p>
                        <span className="lnb_title_desc">
                            광주의 탄소중립 추진 현황과 주요 시책을 공유하며,<br/>
                            제도적 기반과 실천 성과를 제공합니다.<br/>
                        </span>
                    </div>
                    <ul className="sublist">
                      <li><a href="/">탄소중립 히스토리</a></li>
                      <li><a href="/">탄소중립 기본계획</a></li>
                      <li><a href="/">부문별 주요시책</a></li>
                      <li><a href="/">온실가스 감축인지 예산제</a></li>
                      <li><a href="/">기업탄소액션</a></li>
                      <li><a href="/">행정계획 사전검토제</a></li>
                      <li><a href="/">관련 조례 및 계획</a></li>
                      <li><a href="/">출자 출연기관 목표관리제</a></li>
                    </ul>
                  </div>
                </li>
                <li className="lnb">
                  <a href="/" aria-expanded="false">정책지표</a>
                  <div className="submenu" aria-label="정책지표 서브메뉴">
                    <div className="lnb_title">
                      <p className="desc">정책지표</p>
                      <span className="lnb_title_desc">
                        탄소중립 정책성과를 수치와 그래프로 분석하며,<br/>
                        추진 현황을 시각적으로 제공합니다.
                      </span>
                    </div>
                    <ul className="sublist">
                      <li><a href="/">온실가스 배출량</a></li>
                      <li><a href="/">정책지표 신호등</a></li>
                      <li><a href="/">부문별 정책지표</a></li>
                    </ul>
                  </div>
                </li>
                <li className="lnb">
                  <a href="/" aria-expanded="false">시민실천</a>
                  <div className="submenu" aria-label="시민실천 서브메뉴">
                    <div className="lnb_title">
                      <p className="desc">시민실천</p>
                      <span className="lnb_title_desc">
                        탄소중립 생활 실천 방법과 참여 정보를 제공하며,<br/>
                        시민이 함께할 수 있는 실천문화를 확산합니다.
                      </span>
                    </div>
                    <ul className="sublist">
                      <li><a href="/">생활실천안내</a></li>
                      <li><a href="/">시민참여사업</a></li>
                      <li><a href="/">시민실천과제</a></li>
                      <li><a href="/">탄소발자국</a></li>
                      <li><a href="/">약속하기</a></li>
                    </ul>
                  </div>
                </li>
                <li className="lnb">
                  <a href="/" aria-expanded="false">소통하기</a>
                  <div className="submenu" aria-label="소통하기 서브메뉴">
                    <div className="lnb_title">
                      <p className="desc">소통하기</p>
                      <span className="lnb_title_desc">
                        탄소중립 관련 소식과 자료를 공유하며,<br/>
                        시민과의 소통을 통해 지속가능한 변화를 이어갑니다.
                      </span>
                    </div>
                    <ul className="sublist">
                      <li><a href="/">공지사항</a></li>
                      <li><a href="/">연구보고서</a></li>
                      <li><a href="/">탄소중립지원센터</a></li>
                      <li><a href="/">문의하기</a></li>
                    </ul>
                  </div>
                </li>
                <li className="lnb">
                  <a href="/" aria-expanded="false">우리동네 탄소배출지도</a>
                  <div className="submenu" aria-label="우리동네 탄소배출지도 서브메뉴">
                    <div className="lnb_title">
                      <p className="desc">우리동네 탄소배출지도</p>
                      <span className="lnb_title_desc">
                        지역별 탄소배출 데이터를 지도 시각화로 제공하며,<br/>
                        광주 각 동의 배출 현황을 쉽게 확인합니다.
                      </span>
                    </div>
                    <ul className="sublist">
                      <li><a href="/">행정동별 배출지도</a></li>
                    </ul>
                  </div>
                </li>
            </ul>
            {/* Invisible full-width hit area to keep submenu open while hovering blank spaces */}
            <div className="submenu-hitarea" aria-hidden="true"></div>
        </nav>
        <nav id="gnb2" aria-lable="모바일메뉴">
          <ul className="topmenu_all">
            <li className="lnb2">
              <a href="/">기후변화</a>
              <div className="submenu2">
                <ul className="sublist2">
                  <li><a href="/">기후변화</a></li>
                  <li><a href="/">우리나라 기후변화</a></li>
                  <li><a href="/">광주의 기후변화</a></li>
                </ul>
              </div>
            </li>
            <li className="lnb2">
              <a href="/">탄소중립</a>
              <div className="submenu2">
                <ul className="sublist2">
                  <li><a href="/">탄소중립</a></li>
                  <li><a href="/">국가기본계획</a></li>
                  <li><a href="/">국가정책</a></li>
                </ul>
              </div>
            </li>
            <li className="lnb2">
              <a href="/">광주의 탄소중립</a>
              <div className="submenu2">
                <ul className="sublist2">
                  <li><a href="/">탄소중립 히스토리</a></li>
                  <li><a href="/">탄소중립 기본계획</a></li>
                  <li><a href="/">부문별 주요시책</a></li>
                </ul>
              </div>
            </li>
            <li className="lnb2">
              <a href="/">정책지표</a>
              <div className="submenu2">
                <ul className="sublist2">
                  <li><a href="/">온실가스 배출량</a></li>
                  <li><a href="/">정책지표 신호등</a></li>
                  <li><a href="/">부문별 정책지표</a></li>
                </ul>
              </div>
            </li>
            <li className="lnb2">
              <a href="/">시민실천</a>
              <div className="submenu2">
                <ul className="sublist2">
                  <li><a href="/">생활실천안내</a></li>
                  <li><a href="/">시민참여사업</a></li>
                  <li><a href="/">시민실천과제</a></li>
                  <li><a href="/">탄소발자국</a></li>
                  <li><a href="/">약속하기</a></li>
                </ul>
              </div>
            </li>
            <li className="lnb2">
              <a href="/">소통하기</a>
              <div className="submenu2">
                <ul className="sublist2">
                  <li><a href="/">공지사항</a></li>
                  <li><a href="/">연구보고서</a></li>
                  <li><a href="/">탄소중립지원센터</a></li>
                  <li><a href="/">문의하기</a></li>
                </ul>
              </div>
            </li>
            <li className="lnb2">
              <a href="/">우리동네 탄소배출지도</a>
              <div className="submenu2">
                <ul className="sublist2">
                  <li><a href="/">행정동별 배출지도</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      
    </header>
  );
}


