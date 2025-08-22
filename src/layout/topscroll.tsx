"use client";
import React, { useEffect, useState } from "react";

const TopScroll: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const SHOW_AT = 240; // 조금 더 내려왔을 때 보이기
        const HIDE_AT = 120; // 거의 최상단에서 숨기기
        const onScroll = () => {
            const y = window.scrollY;
            setIsVisible(prev => {
                if (prev) {
                    // 보이는 중에는 HIDE_AT보다 위로 올라가면 숨김
                    return y > HIDE_AT;
                }
                // 숨겨진 중에는 SHOW_AT보다 내려오면 표시
                return y > SHOW_AT;
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        try {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            window.scrollTo(0, 0);
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


