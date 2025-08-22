import type { Metadata } from "next";
import "./globals.css";
import "../styles/header.scss";
import "../styles/footer.scss";
import "swiper/css";
import "swiper/css/navigation";

import Header from "../layout/header";
import Footer from "../layout/footer";
import TopScroll from "../layout/topscroll";

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
                        {children}
                    </main>
                    <Footer />  
                    <TopScroll />
                </div>
			</body>
		</html>
	);
}


