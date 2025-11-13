import type { Metadata } from "next";
import "../../styles/font.scss";
import "./globals.scss";
import "../layout/header.scss";
import "../layout/footer.scss";
import "../layout/common.scss";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "NetZero",
  description: "NetZero 홈페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-white text-gray-900 antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}


