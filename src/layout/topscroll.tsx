"use client";
import React, { useEffect, useState } from "react";

const TopScroll: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const SHOW_AT = 240;
        const HIDE_AT = 120;

        const readScrollY = () => {
            const se = (document.scrollingElement || document.documentElement) as HTMLElement;
            const mainEl = document.querySelector('main') as HTMLElement | null;
            const netzeroEl = document.querySelector('.Netzero') as HTMLElement | null;
            const vals: number[] = [];
            if (typeof window !== 'undefined' && typeof window.scrollY === 'number') vals.push(window.scrollY);
            if (se) vals.push(se.scrollTop || 0);
            if (document.body) vals.push(document.body.scrollTop || 0);
            if (mainEl) vals.push(mainEl.scrollTop || 0);
            if (netzeroEl) vals.push(netzeroEl.scrollTop || 0);
            return Math.max(...vals, 0);
        };

        const onScroll = () => {
            const y = readScrollY();
            setIsVisible(prev => {
                if (prev) return y > HIDE_AT;
                return y > SHOW_AT;
            });
        };

        onScroll();

        const containers: (EventTarget & { addEventListener?: any; removeEventListener?: any })[] = [];
        containers.push(window as any);
        containers.push(document as any);
        const se = (document.scrollingElement || document.documentElement) as HTMLElement;
        const mainEl = document.querySelector('main') as HTMLElement | null;
        const netzeroEl = document.querySelector('.Netzero') as HTMLElement | null;
        if (se) containers.push(se as any);
        if (mainEl) containers.push(mainEl as any);
        if (netzeroEl) containers.push(netzeroEl as any);

        containers.forEach(c => c.addEventListener?.('scroll', onScroll, { passive: true }));
        return () => containers.forEach(c => c.removeEventListener?.('scroll', onScroll));
    }, []);

    const scrollToTop = () => {
        const se = (document.scrollingElement || document.documentElement) as HTMLElement;
        const mainEl = document.querySelector('main') as HTMLElement | null;
        const netzeroEl = document.querySelector('.Netzero') as HTMLElement | null;
        // 우선순위: 컨테이너 스크롤이 존재하면 해당 컨테이너를 올림, 아니면 window 사용
        const candidates: HTMLElement[] = [];
        if (netzeroEl && netzeroEl.scrollTop > 0) candidates.push(netzeroEl);
        if (mainEl && mainEl.scrollTop > 0) candidates.push(mainEl);
        if (se && se.scrollTop > 0) candidates.push(se);

        if (candidates.length > 0) {
            const target = candidates[0];
            try { target.scrollTo({ top: 0, behavior: 'smooth' }); } catch { target.scrollTop = 0; }
            return;
        }
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0, 0); }
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


