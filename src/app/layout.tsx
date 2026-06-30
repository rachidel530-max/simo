import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";

import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "سيمو بروتين | مكملات غذائية رياضية فاخرة ومعدات جيم احترافية",
  description: "تسوق تشكيلة سيمو بروتين الفاخرة من مساحيق الواي بروتين، الأيزوليت، ماس جينر، كرياتين، فيتامينات، وأحزمة رفع الأثقال. جودة معملية خاضعة للفحص لضمان الأداء الفائق.",
  keywords: ["سيمو بروتين", "مكملات غذائية المغرب", "واي بروتين", "كرياتين نقي", "حزام رفع أثقال جلد", "أيزو 100", "أوميجا 3", "فيتامينات جيم", "simo protein"],
  openGraph: {
    title: "سيمو بروتين | مكملات غذائية رياضية فاخرة ومعدات جيم احترافية",
    description: "تسوق تشكيلة سيمو بروتين الفاخرة من مساحيق الواي بروتين، الأيزوليت، ماس جينر، كرياتين، فيتامينات، وأحزمة رفع الأثقال.",
    type: "website",
    locale: "ar_MA",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0B0B0B] text-[#f5f5f7] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
        <AuthProvider>
          <CartProvider>
              <Navbar />
              <main className="flex-grow pt-20">
                {children}
              </main>
              <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
