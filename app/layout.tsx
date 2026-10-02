import AppProvider from "@/providers/app-provider";
import type { Metadata } from "next";
import { Lexend, Raleway } from "next/font/google";
import "./globals.css";

const lexens = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    <html lang="en" suppressHydrationWarning className={`${lexens.className} ${lexens.variable} ${raleway.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
