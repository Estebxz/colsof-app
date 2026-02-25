import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "COLSOF - Sistema de gestión CSU",
  description: "Sistema de gestión CSU - COLSOF S.A.S",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh grid grid-rows-[auto_1fr_auto]">
        <Header />
        <main className="grid place-items-center">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
