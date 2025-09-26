(function () {
  "use strict";

  var DEFAULTS = {
    tabSelector: '[data-tab-trigger], .tab_item, [role="tab"]',
    panelSelector: '.content_item, [role="tabpanel"]',
    activePanelClass: 'active',
    delayMs: 80,
    offset: 0
  };

  var state = {
    initialized: false,
    options: DEFAULTS
  };

  function mergeOptions(base, overrides) {
    if (!overrides) return base;
    var merged = {};
    var key;
    for (key in base) { merged[key] = base[key]; }
    for (key in overrides) {
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        merged[key] = overrides[key];
      }
    }
    return merged;
  }

  function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function supportsSmoothScroll() {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } catch (e) {
      return false;
    }
  }

  function scrollToY(targetY, behavior) {
    var y = targetY | 0;
    var reduceMotion = false;
    try {
      reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}

    if (reduceMotion) {
      window.scrollTo(0, y);
      return;
    }

    if (supportsSmoothScroll()) {
      window.scrollTo({ top: y, behavior: behavior || 'smooth' });
    } else {
      window.scrollTo(0, y);
    }
  }

  function getPanelForTrigger(trigger, options) {
    if (!trigger) return null;
    var panel = null;

    var controls = trigger.getAttribute('aria-controls');
    if (controls) {
      panel = document.getElementById(controls);
      if (panel) return panel;
    }

    var dataTarget = trigger.getAttribute('data-target');
    if (dataTarget) {
      var sel = (dataTarget + '').trim();
      if (sel) {
        if (sel.charAt(0) !== '#' && sel.charAt(0) !== '.' && sel.indexOf('[') !== 0) {
          panel = document.getElementById(sel);
        } else {
          try { panel = document.querySelector(sel); } catch (e) { panel = null; }
        }
      }
      if (panel) return panel;
    }

    var href = trigger.getAttribute('href');
    if (href && href.indexOf('#') !== -1) {
      var id = href.split('#').pop();
      if (id) {
        panel = document.getElementById(id);
        if (panel) return panel;
      }
    }

    return null;
  }

  function activateTabAndPanel(trigger, panel, options) {
    if (!trigger || !panel) return;

    var menu = trigger.closest ? trigger.closest('.tab_menu') : null;
    if (menu && menu.querySelectorAll) {
      var triggers = menu.querySelectorAll(options.tabSelector);
      var i;
      for (i = 0; i < triggers.length; i++) {
        var t = triggers[i];
        if (t.classList) {
          t.classList.remove('active');
          t.classList.remove('is-active');
        }
        if (t.setAttribute) t.setAttribute('aria-selected', t === trigger ? 'true' : 'false');
      }
    }
    if (trigger.classList) trigger.classList.add('active');
    if (trigger.setAttribute) trigger.setAttribute('aria-selected', 'true');

    var root = panel.parentNode ? panel.parentNode : document;
    if (root && root.querySelectorAll) {
      var panels = root.querySelectorAll(options.panelSelector);
      var j;
      for (j = 0; j < panels.length; j++) {
        var p = panels[j];
        if (p.classList) {
          p.classList.remove(options.activePanelClass);
          p.classList.remove('is-active');
        }
        if (p.setAttribute) p.setAttribute('aria-hidden', p === panel ? 'false' : 'true');
      }
    }
    if (panel.classList) panel.classList.add(options.activePanelClass);
    if (panel.setAttribute) panel.setAttribute('aria-hidden', 'false');
  }

  function findActivePanelNear(trigger, options) {
    var panels = document.querySelectorAll(options.panelSelector);
    if (!panels || !panels.length) return null;

    var group = trigger && (trigger.getAttribute('data-tab-group') || (trigger.closest && trigger.closest('[data-tab-group]') && trigger.closest('[data-tab-group]').getAttribute('data-tab-group')));

    var i;
    for (i = 0; i < panels.length; i++) {
      var p = panels[i];
      var hasActive = p.classList && p.classList.contains(options.activePanelClass);
      if (!hasActive && p.getAttribute) {
        var ariaHidden = p.getAttribute('aria-hidden');
        hasActive = ariaHidden === 'false';
      }
      if (!hasActive) continue;

      if (group) {
        var pg = p.getAttribute('data-tab-group') || (p.closest && p.closest('[data-tab-group]') && p.closest('[data-tab-group]').getAttribute('data-tab-group'));
        if (pg && pg === group) return p;
      } else {
        return p;
      }
    }
    return null;
  }

  function scrollPanelCenter(panel, options) {
    if (!panel) return;
    var rect = panel.getBoundingClientRect();
    var doc = document.documentElement;
    var scrollTop = window.pageYOffset || doc.scrollTop || document.body.scrollTop || 0;
    var docHeight = Math.max(
      document.body.scrollHeight, doc.scrollHeight,
      document.body.offsetHeight, doc.offsetHeight,
      document.body.clientHeight, doc.clientHeight
    );
    // 상단 정렬: 패널의 top 위치에 offset만 적용
    var target = scrollTop + rect.top + (options.offset || 0);
    var maxY = Math.max(0, docHeight - window.innerHeight);
    var y = clamp(target, 0, maxY);
    scrollToY(y, 'smooth');
  }

  function isTriggerAlreadyActive(trigger) {
    if (!trigger) return false;
    var ariaSelected = trigger.getAttribute && trigger.getAttribute('aria-selected');
    if (ariaSelected === 'true') return true;
    if (trigger.classList && (trigger.classList.contains('is-active') || trigger.classList.contains('active'))) return true;
    return false;
  }

  function onTabClick(event) {
    var options = state.options;
    var target = event.target || event.srcElement;
    if (!target) return;
    var trigger = target.closest ? target.closest(options.tabSelector) : null;
    if (!trigger) return;

    if (trigger.tagName === 'A') {
      if (event.preventDefault) event.preventDefault();
      else event.returnValue = false;
    }

    if (isTriggerAlreadyActive(trigger)) {
      setTimeout(function () {
        var activePanel = getPanelForTrigger(trigger, options) || findActivePanelNear(trigger, options);
        if (activePanel) scrollPanelCenter(activePanel, options);
      }, options.delayMs | 0);
      return;
    }

    setTimeout(function () {
      var panel = getPanelForTrigger(trigger, options);
      if (panel) {
        activateTabAndPanel(trigger, panel, options);
        scrollPanelCenter(panel, options);
        return;
      }
      var fallbackPanel = findActivePanelNear(trigger, options);
      if (fallbackPanel) {
        scrollPanelCenter(fallbackPanel, options);
      }
    }, options.delayMs | 0);
  }

  function bind() {
    if (state.initialized) return;
    document.addEventListener('click', onTabClick, false);
    state.initialized = true;
  }

  function init(userOptions) {
    state.options = mergeOptions(DEFAULTS, userOptions);
    bind();
  }

  if (!window.NetzeroTabScroll) {
    window.NetzeroTabScroll = { init: init, scrollToPanelCenter: scrollPanelCenter };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }
})();
