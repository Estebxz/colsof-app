import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://colsof-app.vercel.app"),
  title: "COLSOF - Sistema de gestión CSU",
  description:
    "Sistema de gestión de tickets orientado al desarrollo y seguimiento de solicitudes por roles. Integra autenticación de usuarios.",
  keywords: ["colsof", "sistema de gestion", "tickets", "csu", "colsof app"],
  applicationName: "COLSOF - Sistema de gestión CSU",
  authors: [{ name: "Joan Esteban Mendez", url: "https://joanmm.netlify.app/" }],
  creator: "Joan Esteban Mendez",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  category: "technology"
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
        <Toaster
          richColors
          toastOptions={{
            classNames: {
              toast: "app-toast",
              success: "app-toast-success",
              error: "app-toast-error",
              warning: "app-toast-warning",
              info: "app-toast-info",
            },
          }}
        />
      </body>
    </html>
  );
}
