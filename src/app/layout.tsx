import type { Metadata } from "next";
import "./globals.css";
import "../styles/header.scss";
import "../styles/footer.scss";

import Header from "../layout/header";
import Footer from "../layout/footer";

export const metadata: Metadata = {
	title: "광주넷제로",
	description: "광주 넷제로 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<body>
                <div className="Netzero" style={{background: 'url(/main_visual01.svg) no-repeat center center', width: '100%', height: '100%'}}>
                    <Header />
                    {children}
                    <Footer />  
                </div>
			</body>
		</html>
	);
}


