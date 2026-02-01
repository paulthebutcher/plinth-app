import type { Metadata } from "next";
import { Roboto_Mono, Work_Sans } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--display-family",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--text-family",
});

export const metadata: Metadata = {
  title: "Plinth - Strategic Decision Intelligence",
  description: "AI-powered strategic decision quality for product leaders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${robotoMono.variable} ${workSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
