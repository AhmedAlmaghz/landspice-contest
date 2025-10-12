import type { Metadata } from "next";
// import { Cairo } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/contexts/NotificationContext";

// const cairo = Cairo({
//   subsets: ["arabic", "latin"],
//   variable: "--font-cairo",
//   weight: ["300", "400", "600", "700"],
// });

export const metadata: Metadata = {
  title: "LandSpice - مسابقة المتابعة والمشاركة",
  description: "انضم إلى مسابقة LandSpice الرائعة واحصل على فرصة للفوز بجوائز قيمة!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning>
        <NotificationProvider position="top-right">
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
