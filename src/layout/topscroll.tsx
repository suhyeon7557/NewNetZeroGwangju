"use client";
import React, { useEffect, useState } from "react";

const TopScroll: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const scrollTargetsRef = React.useRef<HTMLElement[]>([]);

    useEffect(() => {
        const SHOW_AT = 240;
        const HIDE_AT = 120;

        let rafId: number | null = null;

        const readScrollY = () => {
            const se = (document.scrollingElement || document.documentElement) as HTMLElement;
            const mainEl = document.querySelector('main') as HTMLElement | null;
            const netzeroEl = document.querySelector('.Netzero') as HTMLElement | null;
            const vals: number[] = [];
            if (typeof window !== 'undefined') {
                if (typeof window.scrollY === 'number') vals.push(window.scrollY);
                if (typeof (window as any).pageYOffset === 'number') vals.push((window as any).pageYOffset);
            }
            if (se) vals.push(se.scrollTop || 0);
            if (document.body) vals.push(document.body.scrollTop || 0);
            if (mainEl) vals.push(mainEl.scrollTop || 0);
            if (netzeroEl) vals.push(netzeroEl.scrollTop || 0);
            return Math.max(...vals, 0);
        };

        const evaluate = () => {
            rafId = null;
            const y = readScrollY();
            setIsVisible(prev => (prev ? y > HIDE_AT : y > SHOW_AT));
        };

        const onScroll = () => {
            if (rafId != null) return;
            rafId = requestAnimationFrame(evaluate);
        };

        // 초기 상태 계산
        evaluate();

        // 주요 스크롤 소스에 리스너 연결 (window 중심)
        const containers: (EventTarget & { addEventListener?: any; removeEventListener?: any })[] = [];
        const attached = new Set<EventTarget>();
        const extraContainers: HTMLElement[] = [];

        const attach = (t: EventTarget | null | undefined) => {
            if (!t || attached.has(t)) return;
            attached.add(t);
            containers.push(t as any);
            (t as any).addEventListener?.('scroll', onScroll, { passive: true });
            if (t instanceof HTMLElement) {
                if (!scrollTargetsRef.current.includes(t)) {
                    scrollTargetsRef.current.push(t);
                }
            }
        };

        attach(window as any);
        attach(document as any);
        const seEl = (document.scrollingElement || document.documentElement) as HTMLElement;
        const mainEl = document.querySelector('main') as HTMLElement | null;
        const netzeroEl = document.querySelector('.Netzero') as HTMLElement | null;
        attach(seEl as any);
        attach(mainEl as any);
        attach(netzeroEl as any);

        // 동적 탐지: 실제로 스크롤 가능한 컨테이너에 리스너 부착
        const discoverScrollableContainers = () => {
            const all = Array.from(document.querySelectorAll<HTMLElement>('*'));
            let count = 0;
            for (const el of all) {
                if (count >= 12) break; // 과도한 부착 방지
                const style = getComputedStyle(el);
                const mayScrollY = style.overflowY === 'auto' || style.overflowY === 'scroll';
                if (!mayScrollY) continue;
                if (el.scrollHeight <= el.clientHeight + 1) continue;
                if (attached.has(el)) continue;
                attach(el);
                extraContainers.push(el);
                count += 1;
            }
        };

        // 초기 한 번 탐지
        discoverScrollableContainers();

        // DOM 변화에 따른 재탐지 (지연 실행)
        let moRaf: number | null = null;
        const scheduleDiscover = () => {
            if (moRaf != null) return;
            moRaf = requestAnimationFrame(() => {
                moRaf = null;
                discoverScrollableContainers();
                evaluate();
            });
        };
        const mo = new MutationObserver(scheduleDiscover);
        mo.observe(document.body, { childList: true, subtree: true, attributes: true });

        window.addEventListener('resize', onScroll, { passive: true } as any);

        return () => {
            containers.forEach(c => (c as any).removeEventListener?.('scroll', onScroll));
            window.removeEventListener('resize', onScroll as any);
            if (rafId != null) cancelAnimationFrame(rafId);
            if (moRaf != null) cancelAnimationFrame(moRaf);
            mo.disconnect();
            scrollTargetsRef.current = [];
        };
    }, []);

    const scrollToTop = () => {
        const se = (document.scrollingElement || document.documentElement) as HTMLElement;
        const mainEl = document.querySelector('main') as HTMLElement | null;
        const netzeroEl = document.querySelector('.Netzero') as HTMLElement | null;

        const unique: HTMLElement[] = [];
        const pushUnique = (el: HTMLElement | null | undefined) => {
            if (!el) return;
            if (!unique.includes(el)) unique.push(el);
        };

        // 동적으로 수집된 컨테이너 + 주요 컨테이너를 합치기
        for (const el of scrollTargetsRef.current) pushUnique(el);
        pushUnique(netzeroEl);
        pushUnique(mainEl);
        pushUnique(se);

        // 스크롤된 컨테이너를 모두 0으로 이동
        let acted = false;
        for (const el of unique) {
            if (el.scrollTop > 0) {
                try { el.scrollTo({ top: 0, behavior: 'smooth' }); } catch { el.scrollTop = 0; }
                acted = true;
            }
        }

        // 페이지 자체도 안전하게 올리기
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0, 0); }
        if (!acted && (typeof window !== 'undefined') && (window.scrollY || (window as any).pageYOffset)) {
            // 윈도우 스크롤만 있었던 경우도 처리됨
            return;
        }
    };

    return (
        <button
            type="button"
            className={`topscroll${isVisible ? " visible" : ""}`}
            aria-label="맨 위로"
            onClick={scrollToTop}
        >
            <img src="/ic_side_topscroll.svg" alt="맨 위로 아이콘" />
        </button>
    );
};

export default TopScroll;


