document.addEventListener('DOMContentLoaded', function () {
  (function () {
    var btn = document.querySelector('.floating_bar_button');
    var sheet = document.querySelector('.floating_sheet');
    var inner = document.querySelector('.floating_sheet_inner');
    if (!btn || !sheet || !inner) return;

    function openSheet(e) {
      if (e && e.preventDefault) e.preventDefault();
      try {
        var y = sheet.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } catch (err) {
        var y2 = sheet.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo(0, y2);
      }
      sheet.setAttribute('aria-hidden', 'false');
      sheet.classList.add('on');
      var bar = document.querySelector('.floating_bar');
      if (bar) bar.classList.add('covered');
    }

    function closeSheet() {
      sheet.classList.remove('on');
      function onDone() {
        sheet.setAttribute('aria-hidden', 'true');
        var bar = document.querySelector('.floating_bar');
        if (bar) bar.classList.remove('covered');
        inner.removeEventListener('transitionend', onDone);
      }
      inner.addEventListener('transitionend', onDone, { once: true });
    }

    btn.addEventListener('click', openSheet);
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.closest('.floating_sheet_close')) {
        e.preventDefault();
        closeSheet();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSheet();
    });
  })();

  (function () {
    var wrap = document.querySelector('.map_wrap');
    if (!wrap) return;

    function ensureMobile() {
      var desktop = wrap.querySelector('.map_canvas--desktop');
      var mobile = wrap.querySelector('.map_canvas--mobile');
      if (!desktop) {
        var first = wrap.querySelector('.map_canvas');
        if (first && !first.classList.contains('map_canvas--mobile')) {
          first.classList.add('map_canvas--desktop');
          desktop = first;
        }
      }
      if (!mobile) {
        mobile = document.createElement('div');
        mobile.className = 'map_canvas map_canvas--mobile';
        mobile.setAttribute('aria-hidden', 'true');
        wrap.appendChild(mobile);
      }
      return { desktop: desktop, mobile: mobile };
    }

    function cloneToMobile() {
      var pair = ensureMobile();
      var desktop = pair.desktop;
      var mobile = pair.mobile;
      if (!desktop || !mobile) return;
      var svg = desktop.querySelector('svg');
      if (!svg) return;

      var cloned = svg.cloneNode(true);
      cloned.setAttribute('viewBox', '0 0 600 405');
      cloned.style.width = '100%';
      cloned.style.height = 'auto';
      mobile.innerHTML = '';
      mobile.appendChild(cloned);

      var w = window.innerWidth;
      if (w <= 1024) {
        desktop.setAttribute('aria-hidden', 'true');
        desktop.style.display = 'none';
        mobile.removeAttribute('aria-hidden');
        mobile.style.display = '';
      } else {
        desktop.removeAttribute('aria-hidden');
        desktop.style.display = '';
        mobile.setAttribute('aria-hidden', 'true');
        mobile.style.display = 'none';
      }
    }

    cloneToMobile();
    window.addEventListener('resize', cloneToMobile);
  })();
});


