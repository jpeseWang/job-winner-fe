import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import ThemeClientOnly from "@/components/themeClientOnly"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Winner - Find Your Dream Job Today",
  description: "A job marketplace with AI-powered CV analysis to help you land your dream job",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ThemeClientOnly>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">{children}</div>
                <Footer />
              </div>
            </ThemeProvider>
          </ThemeClientOnly>
        </Providers>
      </body>
    </html>
  );
}
