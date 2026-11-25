import type { Metadata } from "next";
import "./styles/global.scss";

import Header from "../widgets/Header/header";
import Footer from "../widgets/Footer/footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Учебные Заведения",
  description: "поиск заведений по всему миру",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="layout antialiased">
        <Providers>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
