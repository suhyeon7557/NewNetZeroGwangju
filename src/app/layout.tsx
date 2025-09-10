import type { Metadata } from "next";
import "./globals.css";
import "../styles/header.scss";
import "../styles/footer.scss";
import "../styles/common.scss";
import "swiper/css";
import "swiper/css/navigation";

import Header from "../layout/header";
import Footer from "../layout/footer";
import TopScroll from "../layout/topscroll";
import Notice from "../layout/notice";
import TabMenuEnhancer from "../layout/tabmenu_enhancer";

export const metadata: Metadata = {
	title: "광주넷제로",
	description: "광주 넷제로 서비스",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<body>
                <div className="Netzero">
                    <Header />
                    <main>
                        <h2 className='notext' style={{display: 'none'}}>컨텐츠 영역</h2>
                        {children}
                    </main>
                    <Footer />  
                    <Notice />
                    <TopScroll />
                    <TabMenuEnhancer />
                </div>
			</body>
		</html>
	);
}


