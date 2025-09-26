<script>
(() => {
  "use strict";
  const SELECTOR = '[data-tab-trigger], .tab_item, [role="tab"]';
  const targetOf = (el) => {
    if (!el) return null;
    const id = el.getAttribute('aria-controls');
    if (id) { const byId = document.getElementById(id); if (byId) return byId; }
    const dt = el.getAttribute('data-target');
    if (dt) { const s = String(dt).trim(); if (s) { if (!s.startsWith('#') && !s.startsWith('.') && !s.startsWith('[')) { const by = document.getElementById(s); if (by) return by; }
      try { const q = document.querySelector(s); if (q) return q; } catch (e) {} } }
    const href = el.getAttribute('href');
    if (href && href.indexOf('#') !== -1) { const hash = href.split('#').pop(); if (hash) { const h = document.getElementById(hash); if (h) return h; } }
    return null;
  };
  document.addEventListener('click', (e) => {
    const t = e.target && e.target.closest ? e.target.closest(SELECTOR) : null;
    if (!t) return;
    const to = targetOf(t);
    if (!to) return;

    const anchor = t.closest ? t.closest('a') : null;
    if (anchor) { if (e.preventDefault) e.preventDefault(); else e.returnValue = false; }

    const offAttr = t.getAttribute('data-scroll-offset');
    const parsedOff = parseInt(offAttr, 10);
    const OFFSET = Number.isNaN(parsedOff) ? 100 : parsedOff;
    const getHeaderOffset = () => {
      try {
        let sum = 0;
        const selectors = ['#header', '.sub_nav'];
        selectors.forEach((sel) => {
          const el = document.querySelector(sel);
          if (!el) return;
          const cs = window.getComputedStyle(el);
          const pos = cs.position;
          const rect = el.getBoundingClientRect();
          if ((pos === 'fixed' || pos === 'sticky') && rect.top <= 0) {
            sum += el.offsetHeight || 0;
          }
        });
        return sum;
      } catch (_) { return 0; }
    };
    const HEADER_OFFSET = getHeaderOffset();

    if (typeof to.scrollIntoView === 'function') {
      to.scrollIntoView({ behavior: 'smooth', block: 'start' });
      requestAnimationFrame(() => { requestAnimationFrame(() => { window.scrollBy(0, -(HEADER_OFFSET + OFFSET)); }); });
      return;
    }

    try {
      const start = window.pageYOffset || document.documentElement.scrollTop || 0;
      const r = to.getBoundingClientRect();
      const target = Math.max(0, start + r.top - (HEADER_OFFSET + OFFSET));
      const DURATION = 600;
      const startTime = performance.now();
      const ease = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      const step = (now) => {
        const tNorm = Math.min(1, (now - startTime) / DURATION);
        const y = start + (target - start) * ease(tNorm);
        window.scrollTo(0, y);
        if (tNorm < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } catch (err) {
      try { to.scrollIntoView({ behavior: 'auto', block: 'start' }); window.scrollBy(0, -OFFSET); }
      catch (e2) { window.scrollTo(0, 0); }
    }
  }, false);
})();
</script>

