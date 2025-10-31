import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthDebugger } from "@/components/AuthDebugger";
import AppContent from "@/components/AppContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GITAM Achievement Portal",
  description: "Student & Faculty Achievement Portal for Gandhi Institute of Technology and Management",
  keywords: "GITAM, achievements, students, faculty, portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`} suppressHydrationWarning>
        <AuthProvider>
          <AuthDebugger />
          <AppContent>
            {children}
          </AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
