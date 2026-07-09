import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnergyLink - FSP Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="flex h-screen w-screen max-w-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
