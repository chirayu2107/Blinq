import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Blinq - Financial Wellness Dashboard",
  description: "Modern financial wellness app for managing your money with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
