import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oráculo: Cyber Data Scanner",
  description: "Painel hacker de rastreio e consulta de dados confidenciais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22hsl(270 90% 65%)%22 stroke=%22hsl(270 90% 65%)%22 stroke-width=%221%22><path d=%22M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z%22/><circle cx=%2212%22 cy=%2212%22 r=%223%22/></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-code antialiased bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
