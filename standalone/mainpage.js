(function () {
	function qs(sel, root) { return (root || document).querySelector(sel); }
	function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
	function on(el, evt, fn) { if (el) el.addEventListener(evt, fn); }

	// 1) 플로팅 시트
	(function () {
		var btn = qs('.floating_bar_button');
		var sheet = qs('.floating_sheet');
		var inner = qs('.floating_sheet_inner');
		if (!sheet || !inner) return;
		function openSheet(e) {
			if (e && e.preventDefault) e.preventDefault();
			try {
				var y = sheet.getBoundingClientRect().top + window.pageYOffset - 20;
				window.scrollTo({ top: y, behavior: 'smooth' });
			} catch (_) {
				var y2 = sheet.getBoundingClientRect().top + window.pageYOffset - 20;
				window.scrollTo(0, y2);
			}
			sheet.setAttribute('aria-hidden', 'false');
			sheet.classList.add('on');
			var bar = qs('.floating_bar');
			if (bar) bar.classList.add('covered');
		}
		function closeSheet() {
			sheet.classList.remove('on');
			function onDone() {
				sheet.setAttribute('aria-hidden', 'true');
				var bar = qs('.floating_bar');
				if (bar) bar.classList.remove('covered');
				inner.removeEventListener('transitionend', onDone);
			}
			inner.addEventListener('transitionend', onDone, { once: true });
		}
		on(btn, 'click', openSheet);
		document.addEventListener('click', function (e) {
			var t = e.target;
			if (t && t.closest && t.closest('.floating_sheet_close')) { e.preventDefault(); closeSheet(); }
		}, true);
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
	})();

	// 2) 반응형 지도 (복제 + CSS 축소)
	(function () {
		var wrap = qs('.map_wrap');
		if (!wrap) return;
		function ensureMobileCanvas() {
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
			var ctx = ensureMobileCanvas(); var desktop = ctx.desktop, mobile = ctx.mobile;
			if (!desktop || !mobile) return;
			var svg = desktop.querySelector('svg'); if (!svg) return;
			var cloned = svg.cloneNode(true);
			cloned.setAttribute('viewBox', '0 0 600 405');
			cloned.style.width = '100%'; cloned.style.height = 'auto';
			mobile.innerHTML = ''; mobile.appendChild(cloned);
			var w = window.innerWidth;
			if (w <= 1024) {
				desktop.setAttribute('aria-hidden', 'true'); desktop.style.display = 'none';
				mobile.removeAttribute('aria-hidden'); mobile.style.display = '';
			} else {
				desktop.removeAttribute('aria-hidden'); desktop.style.display = '';
				mobile.setAttribute('aria-hidden', 'true'); mobile.style.display = 'none';
			}
		}
		cloneToMobile(); window.addEventListener('resize', cloneToMobile);
	})();

	// 3) 지도 오버레이 클릭 (path.overlay)
	(function () {
		var svgRoot = qs('.map_canvas svg'); if (!svgRoot) return;
		var codeToName = { GS: '광산구', BK: '북구', SE: '서구', DO: '동구', NM: '남구' };
		svgRoot.addEventListener('click', function (e) {
			var t = e.target; if (!t || !t.closest) return;
			var path = t.closest('.overlay'); if (!path || !svgRoot.contains(path)) return;
			e.preventDefault();
			qsa('.map_canvas .overlay').forEach(function (p) { p.classList.remove('on'); });
			path.classList.add('on');
			var classes = path.getAttribute('class') || '';
			var m = classes.match(/ov_([A-Z]{2})/); var code = m ? m[1] : '';
			var title = qs('#graphGuTitle'); if (title && code) title.textContent = (codeToName[code] || '') + ' 온실가스 배출량';
		});
	})();

	// 4) 그래프 탭 on/off
	(function () {
		var tabs = qsa('.graph_tabs a');
		function tabClick(e) {
			e && e.preventDefault && e.preventDefault();
			tabs.forEach(function (t) { t.classList.remove('on'); });
			var t = e.currentTarget; if (t) t.classList.add('on');
		}
		tabs.forEach(function (t) { on(t, 'click', tabClick); });
	})();

	// 5) 탄소발자국 탭 전환
	(function () {
		var tabs = qsa('.carbon_ft_tab a');
		var panels = qsa('.carbon_ft_panels .panel');
		var container = qs('.carbon_ft_panels');
		if (!tabs.length || !panels.length) return;
		function activate(key) {
			tabs.forEach(function (a) { a.classList.toggle('on', (a.getAttribute('data-tab') || '') === key); });
			panels.forEach(function (p) { p.classList.toggle('on', (p.getAttribute('data-tab') || '') === key); });
			if (container) container.setAttribute('data-active', key);
		}
		function onClick(e) { e.preventDefault(); var a = e.currentTarget; var key = (a && a.getAttribute('data-tab')) || ''; if (!key) return; activate(key); }
		tabs.forEach(function (a) { on(a, 'click', onClick); });
		var init = null; for (var i = 0; i < tabs.length; i++) { if (tabs[i].classList.contains('on')) { init = tabs[i]; break; } }
		var initKey = (init && init.getAttribute('data-tab')) || (tabs[0] && tabs[0].getAttribute('data-tab')) || '';
		if (initKey) activate(initKey);
	})();

	// 6) 탄소발자국 계산
	(function () {
		var panels = qsa('.carbon_ft_panels .panel'); if (!panels.length) return;
		function getFactor(key) { return key === 'electricity' ? 0.478 : key === 'gas' ? 2.176 : key === 'water' ? 0.237 : 0; }
		panels.forEach(function (panel) {
			var key = panel.getAttribute('data-tab') || '';
			var factor = getFactor(key);
			var form = panel.querySelector('.analysis_form'); if (!form) return;
			var usageInput = form.querySelector('input[data-role="usageInput"]');
			var segmented = form.querySelector('.segmented_input');
			var digitInputs = segmented ? qsa('input[data-role="digit"]', segmented) : [];
			if (!usageInput || !segmented || !digitInputs.length) return;
			function displayCO2ToDigits(co2) {
				var s = (isFinite(co2) ? co2 : 0).toFixed(1).replace(/\./g, '');
				for (var i = 0; i < digitInputs.length; i++) digitInputs[i].value = '';
				var j = s.length - 1; for (var k = digitInputs.length - 1; k >= 0; k--) { if (j >= 0) { digitInputs[k].value = s[j]; j--; } }
			}
			function onUsageInput() {
				var raw = (usageInput.value || '').replace(/,/g, ''); var val = parseFloat(raw);
				if (isNaN(val)) { digitInputs.forEach(function (inp) { inp.value = ''; }); } else { displayCO2ToDigits(val * factor); }
			}
			on(usageInput, 'input', onUsageInput); onUsageInput();
		});
	})();

	// 7) 공지 슬라이더(수직 티커)
	(function () {
		var container = qs('.notice_slider'); var wrapper = container && container.querySelector('.notice_list'); if (!container || !wrapper) return;
		var playing = true; var duration = 500; var delay = 5000; var timer = null;
		function resize() { var first = wrapper.querySelector(':scope > li'); if (!first) return; var h = Math.ceil(first.getBoundingClientRect().height); container.style.height = (h || 40) + 'px'; }
		function stepNext() {
			var first = wrapper.querySelector(':scope > li'); if (!first) return; var h = Math.ceil(first.getBoundingClientRect().height) || 0;
			wrapper.style.transition = 'transform ' + duration + 'ms ease'; wrapper.style.transform = 'translateY(-' + h + 'px)';
			var done = function () { wrapper.removeEventListener('transitionend', done); wrapper.style.transition = 'none'; wrapper.appendChild(first); wrapper.style.transform = 'translateY(0)'; void wrapper.offsetHeight; wrapper.style.transition = ''; };
			wrapper.addEventListener('transitionend', done);
		}
		function stepPrev() {
			var items = qsa(':scope > li', wrapper); var last = items[items.length - 1]; if (!last) return;
			wrapper.style.transition = 'none'; wrapper.insertBefore(last, wrapper.firstChild);
			var first = wrapper.querySelector(':scope > li'); var h = Math.ceil(first.getBoundingClientRect().height) || 0;
			wrapper.style.transform = 'translateY(-' + h + 'px)'; void wrapper.offsetHeight; wrapper.style.transition = 'transform ' + duration + 'ms ease'; wrapper.style.transform = 'translateY(0)';
		}
		function start() { if (timer) clearInterval(timer); timer = setInterval(function(){ if (playing) stepNext(); }, delay); }
		function stop() { if (timer) { clearInterval(timer); timer = null; } }
		start(); window.addEventListener('resize', resize); resize();
		var prevBtn = qs('.notice_prev'); var nextBtn = qs('.notice_next'); var playBtn = qs('.notice_play');
		function setPlayUI(flag) { if (!playBtn) return; playBtn.dataset.state = flag ? 'playing' : 'paused'; if (flag) { playBtn.classList.remove('on'); playBtn.setAttribute('aria-label','정지'); } else { playBtn.classList.add('on'); playBtn.setAttribute('aria-label','재생'); } }
		setPlayUI(true);
		on(prevBtn, 'click', function(e){ e.preventDefault(); stepPrev(); });
		on(nextBtn, 'click', function(e){ e.preventDefault(); stepNext(); });
		on(playBtn, 'click', function(e){ e.preventDefault(); playing = !playing; setPlayUI(playing); if (playing) start(); else stop(); });
	})();

	// 8) 연구보고서 탭 전환
	(function () {
		var tabs = qsa('.horizontal_tab a'); var panels = qsa('.report_panels .panel'); if (!tabs.length || !panels.length) return;
		function activate(key) { tabs.forEach(function (a) { a.classList.toggle('on', (a.getAttribute('data-tab') || '') === key); }); panels.forEach(function (p) { p.classList.toggle('on', (p.getAttribute('data-tab') || '') === key); }); }
		function onClick(e) { e.preventDefault(); var a = e.currentTarget; var key = (a && a.getAttribute('data-tab')) || ''; if (key) activate(key); }
		tabs.forEach(function (a) { on(a, 'click', onClick); });
		var init = null; for (var i = 0; i < tabs.length; i++) { if (tabs[i].classList.contains('on')) { init = tabs[i]; break; } }
		var initKey = (init && init.getAttribute('data-tab')) || (tabs[0] && tabs[0].getAttribute('data-tab')) || '';
		if (initKey) activate(initKey);
	})();

	// 9) 연구보고서 슬라이더
	(function () {
		var panels = qsa('.report_panels .panel'); if (!panels.length) return;
		panels.forEach(function (panel) {
			var nextBtn = panel.querySelector('.btn_next'); var prevBtn = panel.querySelector('.btn_prev');
			var bigImg = panel.querySelector('.big_report_box img'); var bigTitle = panel.querySelector('.big_report_txt h3'); var bigInfo = panel.querySelector('.big_report_txt .report_info'); var smallUl = panel.querySelector('.small_report_list > ul');
			if (!nextBtn || !prevBtn || !bigImg || !bigTitle || !bigInfo || !smallUl) return;
			function readBig(){ var items = qsa('ul > li', bigInfo); var chief = (items[0] && (items[0].querySelector('p')||{}).textContent || '').trim(); var team = (items[1] && (items[1].querySelector('p')||{}).textContent || '').trim(); var year = (items[2] && (items[2].querySelector('p')||{}).textContent || '').trim(); return { src: bigImg.getAttribute('src') || '', title: (bigTitle.textContent||'').trim(), chief: chief, team: team, year: year }; }
			function applyBig(d){ bigImg.setAttribute('src', d.src || '/noimg_list.svg'); bigTitle.textContent = d.title || ''; var items = qsa('ul > li', bigInfo); var map = [d.chief, d.team, d.year]; for (var i = 0; i < items.length; i++) { var p = items[i].querySelector('p'); if (p) p.textContent = map[i] || ''; } }
			function readSmallLi(li){ var a = li.querySelector('a'); var img = li.querySelector('img'); return { src: (img && img.getAttribute('src')) || '', title: (a && a.getAttribute('data-title') || '').trim(), chief: (a && a.getAttribute('data-chief') || '').trim(), team: (a && a.getAttribute('data-team') || '').trim(), year: (a && a.getAttribute('data-year') || '').trim() }; }
			function buildSmallLi(d){ var li = document.createElement('li'); var a = document.createElement('a'); a.setAttribute('href','#'); a.setAttribute('data-title', d.title||''); a.setAttribute('data-chief', d.chief||''); a.setAttribute('data-team', d.team||''); a.setAttribute('data-year', d.year||''); var img = document.createElement('img'); img.setAttribute('src', d.src||'/noimg_list.svg'); a.appendChild(img); li.appendChild(a); return li; }
			function getSlideDistance(){ var first = smallUl.querySelector(':scope > li'); if (!first) return 0; var rect = first.getBoundingClientRect(); var gap = 0; try { gap = parseFloat((getComputedStyle(smallUl)||{}).gap || '0'); } catch(_){} return Math.round(rect.width + (isNaN(gap)?0:gap)); }
			function isHidden(el){ if (!el) return true; var s = window.getComputedStyle(el); return s.display==='none' || s.visibility==='hidden' || el.offsetParent===null; }
			function onNext(e){ e && e.preventDefault && e.preventDefault(); var first = smallUl.querySelector(':scope > li'); if (!first) return; var incoming = readSmallLi(first); var current = readBig(); var big = panel.querySelector('.big_report'); if (big) big.classList.add('fading'); var dist = getSlideDistance(); if (isHidden(smallUl) || !dist || dist<=0){ applyBig(incoming); smallUl.removeChild(first); smallUl.appendChild(buildSmallLi(current)); if (big) big.classList.remove('fading'); return; } smallUl.style.transition='transform .3s ease'; smallUl.style.transform='translateX(-'+dist+'px)'; var handle=function(){ smallUl.removeEventListener('transitionend', handle); smallUl.style.transition='none'; smallUl.appendChild(first); smallUl.style.transform='translateX(0)'; applyBig(incoming); if (big) big.classList.remove('fading'); void smallUl.offsetHeight; smallUl.style.transition=''; }; smallUl.addEventListener('transitionend', handle); }
			function onPrev(e){ e && e.preventDefault && e.preventDefault(); var items = qsa(':scope > li', smallUl); var last = items[items.length-1]; if (!last) return; var incoming = readSmallLi(last); var current = readBig(); var big = panel.querySelector('.big_report'); if (big) big.classList.add('fading'); var dist = getSlideDistance(); if (isHidden(smallUl) || !dist || dist<=0){ applyBig(incoming); smallUl.removeChild(last); smallUl.insertBefore(buildSmallLi(current), smallUl.firstChild); if (big) big.classList.remove('fading'); return; } smallUl.style.transition='none'; smallUl.insertBefore(last, smallUl.firstChild); smallUl.style.transform='translateX(-'+dist+'px)'; void smallUl.offsetHeight; smallUl.style.transition='transform .3s ease'; smallUl.style.transform='translateX(0)'; var handle=function(){ smallUl.removeEventListener('transitionend', handle); applyBig(incoming); smallUl.style.transition=''; smallUl.style.transform=''; if (big) big.classList.remove('fading'); }; smallUl.addEventListener('transitionend', handle); }
			function onThumbClick(e){ var t=e.target; var a=t && t.closest('a'); if (!a || !smallUl.contains(a)) return; e.preventDefault(); var li=a.closest('li'); if(!li) return; var lis=qsa(':scope > li', smallUl); var idx = lis.indexOf ? lis.indexOf(li) : lis.findIndex(function(x){return x===li;}); if (idx<0) return; if (idx===0){ onNext(e); return; } var incoming=readSmallLi(li); var current=readBig(); var big=panel.querySelector('.big_report'); if (big) big.classList.add('fading'); var dist=getSlideDistance(); var move=Math.max(0, idx)*dist; if (isHidden(smallUl)||!dist||dist<=0){ for (var i=0;i<idx;i++){ var f=smallUl.querySelector(':scope > li'); if (f) smallUl.appendChild(f); } var firstAfter=smallUl.querySelector(':scope > li'); if (firstAfter) smallUl.removeChild(firstAfter); smallUl.appendChild(buildSmallLi(current)); applyBig(incoming); if (big) big.classList.remove('fading'); return; } smallUl.style.transition='transform .3s ease'; smallUl.style.transform='translateX(-'+move+'px)'; var handle=function(){ smallUl.removeEventListener('transitionend', handle); smallUl.style.transition='none'; for (var i2=0;i2<idx;i2++){ var f2=smallUl.querySelector(':scope > li'); if (f2) smallUl.appendChild(f2); } var firstAfter2=smallUl.querySelector(':scope > li'); if (firstAfter2) smallUl.removeChild(firstAfter2); smallUl.appendChild(buildSmallLi(current)); smallUl.style.transform='translateX(0)'; void smallUl.offsetHeight; smallUl.style.transition=''; applyBig(incoming); var big2=panel.querySelector('.big_report'); if (big2) big2.classList.remove('fading'); }; smallUl.addEventListener('transitionend', handle); }
			on(nextBtn,'click',onNext); on(prevBtn,'click',onPrev); on(smallUl,'click',onThumbClick);
		});
	})();

	// 10) 서브 내비 콤보
	(function () {
		var subNav = qs('.sub_nav'); var subNavGnb = document.getElementById('sub_nav_gnb'); if (!subNav || !subNavGnb) return;
		var lnbAreas = qsa(':scope > li.lnb_area', subNavGnb); if (lnbAreas.length < 2) return;
		var firstArea = lnbAreas[0]; var secondArea = lnbAreas[1];
		var firstAnchor = firstArea.querySelector(':scope > a'); var secondAnchor = secondArea.querySelector(':scope > a');
		var firstList = firstArea.querySelector(':scope > .lnb_list'); var secondList = secondArea.querySelector(':scope > .lnb_list');
		if (!firstAnchor || !secondAnchor || !firstList || !secondList) return;
		var openedList = null;
		function closeAll(){ firstList.classList.remove('open'); secondList.classList.remove('open'); openedList=null; }
		function toggleList(list){ var willOpen=!list.classList.contains('open'); closeAll(); if (willOpen){ list.classList.add('open'); openedList=list; } }
		function rebuildSecondFromSubUl(subUl){ secondList.innerHTML=''; if (subUl){ var subLis=qsa(':scope > li', subUl); subLis.forEach(function(li){ var link=li.querySelector('a'); var text=(link?link.textContent:li.textContent)||''; var newLi=document.createElement('li'); var newA=document.createElement('a'); newA.setAttribute('href','#'); newA.textContent=text.trim(); newLi.appendChild(newA); secondList.appendChild(newLi); }); var firstSubItem=secondList.querySelector('li > a'); secondAnchor.textContent=firstSubItem?(firstSubItem.textContent||'').trim():'메뉴 선택'; } else { secondAnchor.textContent='메뉴 선택'; } }
		function dedupeFirstCombo(){ var seen={}; var items=qsa(':scope > li', firstList); items.forEach(function(li){ var a=li.querySelector(':scope > a'); var txt=(a?a.textContent:li.textContent)||''; var key=txt.replace(/\s+/g,' ').trim(); if (seen[key]){ if (li.parentElement) li.parentElement.removeChild(li); } else { seen[key]=true; } }); }
		function onClickFirstAnchor(e){ e.preventDefault(); toggleList(firstList); }
		function onClickSecondAnchor(e){ e.preventDefault(); toggleList(secondList); }
		function onOutsideClick(e){ var t=e.target; if (!subNav.contains(t)) closeAll(); }
		function onKeydown(e){ if (e.key==='Escape') closeAll(); }
		function bindFirstListItemClicks(){ var firstItems=qsa(':scope > li > a', firstList); firstItems.forEach(function(a){ a.addEventListener('click', function(ev){ ev.preventDefault(); var selectedText=(a.textContent||'').trim(); if (selectedText) firstAnchor.textContent=selectedText; var parentLi=a.parentElement; var subUl=parentLi?parentLi.querySelector(':scope > ul'):null; rebuildSecondFromSubUl(subUl); firstList.classList.remove('open'); secondList.classList.remove('open'); openedList=null; }); }); }
		function bindSecondListClicks(){ secondList.addEventListener('click', function(ev){ var target=ev.target; var a=target && target.closest('a'); if (a && secondList.contains(a)){ ev.preventDefault(); var txt=(a.textContent||'').trim(); if (txt) secondAnchor.textContent=txt; closeAll(); } }); }
		dedupeFirstCombo(); on(firstAnchor,'click',onClickFirstAnchor); on(secondAnchor,'click',onClickSecondAnchor); document.addEventListener('click', onOutsideClick); document.addEventListener('keydown', onKeydown); bindFirstListItemClicks(); bindSecondListClicks();
		var currentMain=(firstAnchor.textContent||'').trim(); var matchAnchor=null; var cands=qsa(':scope > li > a', firstList); for (var i=0;i<cands.length;i++){ if (((cands[i].textContent||'').trim())===currentMain){ matchAnchor=cands[i]; break; } }
		if (!matchAnchor){ matchAnchor=firstList.querySelector(':scope > li > a'); if (matchAnchor){ var txt=(matchAnchor.textContent||'').trim(); if (txt) firstAnchor.textContent=txt; } }
		if (matchAnchor){ var li=matchAnchor.parentElement; var subUl=li?li.querySelector(':scope > ul'):null; rebuildSecondFromSubUl(subUl); firstList.classList.remove('open'); secondList.classList.remove('open'); openedList=null; }
	})();
})();


