import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clean & Fresh Laundry - Professional Laundry Services",
  description: "High-quality laundry and pressing services. Order online for pickup and delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
