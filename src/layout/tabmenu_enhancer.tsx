'use client';
import React from 'react';

/**
 * 간결 버전: .tab_menu → 480px 이하에서 select 드롭다운으로 전환
 * - 가로 스크롤 미사용
 * - 기존 탭 클릭 동작 재사용 (select 변경 시 해당 a 클릭 이벤트 발생)
 */
export default function TabMenuEnhancer() {
    React.useEffect(() => {
        const menus = Array.from(document.querySelectorAll('.tab_menu')) as HTMLElement[];
        if (!menus.length) return;

        const cleanups: Array<() => void> = [];

        menus.forEach((menu) => {
            const anchors = Array.from(menu.querySelectorAll('a.tab_item, a')) as HTMLAnchorElement[];
            if (!anchors.length || menu.getAttribute('data-enhanced') === 'true') return;

            const wrap = document.createElement('div');
            wrap.className = 'tab_menu_enhanced';
            const select = document.createElement('select');
            select.className = 'tab_select';
            select.setAttribute('aria-label', '탭 선택');

            anchors.forEach((a, i) => {
                const opt = document.createElement('option');
                opt.value = String(i);
                opt.text = (a.textContent || '').trim();
                if (a.classList.contains('active') || a.classList.contains('on')) opt.selected = true;
                select.appendChild(opt);
            });

            const onChange = () => {
                const i = Number(select.value);
                const target = anchors[i];
                if (target) {
                    anchors.forEach((a) => { a.classList.remove('active'); a.classList.remove('on'); });
                    target.classList.add('active');
                    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                }
            };
            select.addEventListener('change', onChange);

            wrap.appendChild(select);
            menu.parentElement?.insertBefore(wrap, menu);

            const mq = window.matchMedia('(max-width: 768px)');
            const apply = () => {
                const useSelect = mq.matches;
                wrap.style.display = useSelect ? '' : 'none';
                menu.style.display = useSelect ? 'none' : '';
            };
            const onMQ = () => apply();
            if (typeof (mq as any).addEventListener === 'function') (mq as any).addEventListener('change', onMQ);
            else if (typeof (mq as any).addListener === 'function') (mq as any).addListener(onMQ);

            apply();
            menu.setAttribute('data-enhanced', 'true');

            cleanups.push(() => {
                select.removeEventListener('change', onChange);
                try {
                    if (typeof (mq as any).removeEventListener === 'function') (mq as any).removeEventListener('change', onMQ);
                    else if (typeof (mq as any).removeListener === 'function') (mq as any).removeListener(onMQ);
                } catch {}
                if (wrap.parentElement) wrap.parentElement.removeChild(wrap);
                menu.removeAttribute('data-enhanced');
            });
        });

        return () => { cleanups.forEach((fn) => fn()); };
    }, []);

    return null;
}


