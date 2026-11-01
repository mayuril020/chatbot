import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verdant & Co. Support",
  description: "AI Customer Support Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-gray-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}