(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }
    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var panel = null;
    var handle = null;
    var isAnimating = false;
    var overlay = null;
    var mqTablet = null;

    function setPanelOpen(open) {
        if (!panel) return;
        if (open) {
            panel.classList.add('is-open');
            panel.setAttribute('aria-hidden', 'false');
            if (handle) handle.setAttribute('aria-expanded', 'true');
        } else {
            panel.classList.remove('is-open');
            panel.setAttribute('aria-hidden', 'true');
            if (handle) handle.setAttribute('aria-expanded', 'false');
        }
    }

    function togglePanel() {
        if (!panel) return;
        isAnimating = true;
        panel.classList.add('animating');
        var willOpen = !panel.classList.contains('is-open');
        setPanelOpen(willOpen);
        window.setTimeout(function () {
            isAnimating = false;
            panel.classList.remove('animating');
        }, 320);
    }

    function initInitialState() {
        mqTablet = window.matchMedia('(max-width: 1200px)');
        var mqMobile = window.matchMedia('(max-width: 768px)');

        if (mqMobile.matches) {
            setPanelOpen(true);
        } else {
            setPanelOpen(!mqTablet.matches);
        }

        function onTabletChange(e) {
            if (!e.matches) {
                setPanelOpen(true);
            }
            enforceOverlayByBreakpoint();
        }
        try {
            if (typeof mqTablet.addEventListener === 'function') mqTablet.addEventListener('change', onTabletChange);
            else if (typeof mqTablet.addListener === 'function') mqTablet.addListener(onTabletChange);
        } catch (err) {}
    }

    function openIntroOverlay(selector) {
        var target = selector ? qs(selector) : (overlay || qs('.intro_overlay'));
        if (!target) return;
        if (mqTablet && mqTablet.matches) return; // 1200px 이하는 표시 금지
        target.classList.add('is-visible');
    }
    function closeIntroOverlay(target) {
        if (target) {
            target.classList.remove('is-visible');
            return;
        }
        if (overlay) overlay.classList.remove('is-visible');
        qsa('.intro_overlay.is-visible').forEach(function (el) { el.classList.remove('is-visible'); });
    }

    function enforceOverlayByBreakpoint() {
        if (mqTablet && mqTablet.matches) {
            qsa('.intro_overlay.is-visible').forEach(function (el) { el.classList.remove('is-visible'); });
        }
    }

    function initializeOverlayVisibility() {
        if (!overlay) return;
        // 초기 진입: 1200px 초과에서는 표시, 이하는 숨김
        if (mqTablet && !mqTablet.matches) {
            overlay.classList.add('is-visible');
        } else {
            overlay.classList.remove('is-visible');
        }
    }

    function initOverlayHandlers() {
        overlay = qs('.intro_overlay');

        // 닫기 버튼: 가장 가까운 오버레이를 닫기
        qsa('.intro_close').forEach(function (btn) {
            btn.addEventListener('click', function (ev) {
                var current = (ev.currentTarget && ev.currentTarget.closest) ? ev.currentTarget.closest('.intro_overlay') : overlay;
                closeIntroOverlay(current);
            });
        });
        // ESC 키: 보이는 모든 오버레이 닫기
        document.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape') {
                closeIntroOverlay();
            }
        });

        // 위임 클릭 핸들러: 동적으로 생성/중복 바인딩 이슈와 무관하게 닫기 보장
        document.addEventListener('click', function (ev) {
            var target = ev.target;
            if (!target || !target.closest) return;
            var btn = target.closest('.intro_close');
            if (!btn) return;
            var current = btn.closest ? btn.closest('.intro_overlay') : overlay;
            closeIntroOverlay(current);
            ev.preventDefault();
            ev.stopPropagation();
        });

        initializeOverlayVisibility();
        enforceOverlayByBreakpoint();
    }

    function initOverlayOpenButton() {
        var openBtn = qs('.description_btn');
        if (!openBtn) return;
        openBtn.addEventListener('click', function () {
            openIntroOverlay();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        panel = qs('#DBRightPanel');
        handle = qs('.DB_right_handle', panel || undefined);
        initInitialState();
        initOverlayHandlers();
        initOverlayOpenButton();
        if (handle) {
            handle.addEventListener('click', togglePanel);
        }

        // JSP에서도 호출 가능하도록 공개 API 노출
        window.DashboardPage = window.DashboardPage || {};
        window.DashboardPage.openIntroOverlay = openIntroOverlay;
        window.DashboardPage.closeIntroOverlay = closeIntroOverlay;
        window.DashboardPage.toggleRightPanel = togglePanel;
        window.DashboardPage.setRightPanelOpen = setPanelOpen;
    });
})();
