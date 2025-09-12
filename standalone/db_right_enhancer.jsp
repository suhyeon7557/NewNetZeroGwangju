<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!--
  대시보드 오른쪽 패널(사이드 내비게이션/바텀시트) 강화 스크립트 - JSP 순수 버전
  - 페이지에 .DB_right 요소만 있으면 자동으로 왼쪽 핸들(.DB_right_handle)과 오버레이(.DB_overlay)를 생성합니다.
  - 1200px 이하: 사이드 드로어, 768px 이하: 바텀시트로 전환
  - 1200px 초과: 항상 열림

  사용 방법
  1) 페이지 하단에 포함:
     <%@ include file="/standalone/db_right_enhancer.jsp" %>
  2) 마크업에 .DB_right 요소가 존재해야 동작합니다.
-->

<style>
/* 기본: 버튼은 숨김, 데스크탑은 항상 열림 */
.DB_overlay {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity .25s ease;
    z-index: 9000;
}
.DB_overlay.is-visible {
    opacity: 1;
    pointer-events: auto;
}
.DB_right .DB_right_close {
    position: absolute;
    right: 12px;
    top: 12px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12) url('/ic_close_white.svg') no-repeat center center;
    background-size: 14px 14px;
    color: transparent;
    text-indent: -9999px;
}

/* 1200px 이하: 사이드 드로어 모드 */
@media (max-width: 1200px) {
    .DB_right {
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        width: min(86vw, 420px);
        max-width: 420px;
        border-radius: 0;
        /* 닫혀도 핸들(36px)이 보이도록 살짝 남김 */
        transform: translateX(calc(100% - 36px));
        transition: transform .28s ease;
        z-index: 10000;
        overflow: auto;
    }
    .DB_right.is-open {
        transform: translateX(0);
    }

    /* 왼쪽 핸들 */
    .DB_right .DB_right_handle {
        position: absolute;
        left: -36px;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 72px;
        border-radius: 10px 0 0 10px;
        background: rgba(185,227,0,0.9) url('/ic_prev_white.svg') no-repeat center center;
        background-size: 12px 12px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    /* 열렸을 때 화살표 반전(닫힘 방향) */
    .DB_right.is-open .DB_right_handle {
        transform: translateY(-50%) rotate(180deg);
    }
}

/* 768px 이하: 바텀시트 모드 */
@media (max-width: 768px) {
    .DB_right {
        left: 0;
        right: 0;
        top: auto;
        bottom: 0;
        width: 100vw;
        max-width: 100vw;
        height: 65vh;
        max-height: 80vh;
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
        /* 닫혀도 핸들(36px) 보임 */
        transform: translateY(calc(100% - 36px));
        transition: transform .28s ease;
    }
    .DB_right.is-open {
        transform: translateY(0);
    }

    /* 바텀시트 핸들: 상단 중앙 */
    .DB_right .DB_right_handle {
        position: absolute;
        top: -36px;
        left: 50%;
        transform: translateX(-50%);
        width: 72px;
        height: 36px;
        border-radius: 10px 10px 0 0;
        background: rgba(185,227,0,0.9) url('/ic_prev_white.svg') no-repeat center center;
        background-size: 12px 12px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    /* 바텀시트에서는 아이콘을 위/아래 방향처럼 보이도록 회전 */
    .DB_right.is-open .DB_right_handle {
        transform: translateX(-50%) rotate(180deg);
    }
}
</style>

<script>
(function(){
  if (typeof document === 'undefined') return;

  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function(){
    var panel = document.querySelector('.DB_right');
    if (!panel) return;

    // id 보장
    if (!panel.id) panel.id = 'DBRightPanel';

    // 닫기 버튼 보장
    var closeBtn = panel.querySelector('.DB_right_close');
    if (!closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'DB_right_close';
      closeBtn.setAttribute('aria-label', '닫기');
      closeBtn.textContent = '닫기';
      panel.insertBefore(closeBtn, panel.firstChild);
    }

    // 핸들 생성 (패널 왼쪽에 부착)
    var handle = panel.querySelector('.DB_right_handle');
    if (!handle) {
      handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'DB_right_handle';
      handle.setAttribute('aria-label', '접기/펼치기');
      panel.appendChild(handle);
    }

    // 오버레이 생성
    var overlay = document.createElement('div');
    overlay.className = 'DB_overlay';
    document.body.appendChild(overlay);

    var mq1200 = window.matchMedia('(max-width: 1200px)');

    function setOpenState(isOpen){
      if (isOpen) {
        panel.classList.add('is-open');
        overlay.classList.add('is-visible');
        handle.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        handle.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
      }
    }

    function apply(){
      if (mq1200.matches) {
        setOpenState(false);
      } else {
        // 데스크탑에서는 항상 열림, 오버레이는 숨김
        panel.classList.add('is-open');
        overlay.classList.remove('is-visible');
        handle.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
      }
    }

    apply();

    function onMQ(){ apply(); }
    try {
      if (typeof mq1200.addEventListener === 'function') mq1200.addEventListener('change', onMQ);
      else if (typeof mq1200.addListener === 'function') mq1200.addListener(onMQ);
    } catch (e) {}

    // 이벤트
    function toggle(){
      var open = panel.classList.contains('is-open');
      setOpenState(!open);
    }
    handle.addEventListener('click', toggle);
    closeBtn.addEventListener('click', function(){ setOpenState(false); });
    overlay.addEventListener('click', function(){ setOpenState(false); });
  });
})();
</script>


