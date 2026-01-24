import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "QFin - Quản lý chi tiêu của bạn",
  description: "Nền tảng quản lý chi tiêu hiện đại để theo dõi, phân tích và tối ưu hóa chi tiêu của bạn",
  icons: {
    icon: '/logo-qfin.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
