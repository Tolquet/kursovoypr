import type { Metadata } from "next";
import { Poppins, Comfortaa } from "next/font/google";
import "./styles/global.scss";

import Header from "../widgets/Header/header";
import Footer from "../widgets/Footer/footer";
import { Providers } from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Учебные За\ведения",
  description: "поиск заведений по всему миру",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${poppins.variable} ${comfortaa.variable} layout antialiased`}
      >
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
