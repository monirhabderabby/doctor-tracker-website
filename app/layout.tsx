import AppProvider from "@/providers/app-provider";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexens = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Doctor Tracker",
    template: "%s | Doctor Tracker",
  },
  description:
    "Secure admin portal to manage doctors and patients with analytics and insights.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lexens.className}  h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
