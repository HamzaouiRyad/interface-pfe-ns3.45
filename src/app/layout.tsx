import type { Metadata } from "next";
// xterm.js must be loaded globally — it injects CSS for the canvas terminal
import "@xterm/xterm/css/xterm.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "NS3 Dashboard",
  description: "Real-time 4G/5G network simulation dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#020817] antialiased">{children}</body>
    </html>
  );
}
