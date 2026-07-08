import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "gdr-sys — WebApps for RPG, Sports & More",
  description:
    "Modern digital tools for players, Dungeon Masters, sports clubs, coaches, and everyone. Explore our collection of web applications.",
  icons: { icon: "/images/logo.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-950 text-white antialiased font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
