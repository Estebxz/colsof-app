import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
