"use client";
import React from 'react';

const Common = () => {
    React.useEffect(() => {
        // 간단한 초기 로드 순차 등장: .reveal 요소를 수집해 순서대로 is-visible 부여
        try {
            if (typeof window === 'undefined' || typeof document === 'undefined') return;
            const container = document.querySelector('main');
            if (!container) return;

            // 자동 대상 잡기: 주요 컨테이너의 직계 자식들에 reveal 부여 (이미 클래스 있으면 유지)
            const autoTargets: HTMLElement[] = [];
            const parents = Array.from(container.querySelectorAll(
                '#cont_wrap, .cont_inner, .cont_content, .main_top_wrap, .main_content_inner'
            )) as HTMLElement[];
            parents.forEach((p) => {
                const children = Array.from(p.children) as HTMLElement[];
                children.forEach((el) => {
                    if (el.hasAttribute('data-reveal') && el.getAttribute('data-reveal') === 'off') return;
                    if (!el.classList.contains('reveal')) el.classList.add('reveal');
                    autoTargets.push(el);
                });
            });

            // 최종 대상: 수동/자동 모두 포함한 .reveal
            const items = Array.from(container.querySelectorAll('.reveal')) as HTMLElement[];
            if (items.length === 0) return;

            items.forEach((el) => {
                el.classList.remove('is-visible');
            });

            let delayMs = 0;
            const stepMs = 90; // 항목 간 지연
            items.forEach((el) => {
                window.setTimeout(() => {
                    try { el.classList.add('is-visible'); } catch {}
                }, delayMs);
                delayMs += stepMs;
            });
        } catch {}
    }, []);

    return null;
}

export default Common;