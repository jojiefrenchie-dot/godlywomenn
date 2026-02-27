import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Godly Women",
  description: "A community platform for faith, inspiration, and spiritual growth",
  keywords: ["faith", "inspiration", "community", "spirituality", "women"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
