import { Geist, Geist_Mono, Mitr } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ฟอนต์หัวข้อ: หนา มน เล่นสไตล์เกม รองรับภาษาไทย
const mitr = Mitr({
  weight: ["500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-mitr",
});

export const metadata = {
  title: "RobuxRate TH | เปรียบเทียบเรทเติม Robux",
  description: "เปรียบเทียบเรทราคาเติม Robux จากร้านค้าไทย พร้อมเครื่องคำนวณ THB เป็น Robux",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${mitr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
