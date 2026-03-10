import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'LazoStore – Premium Digital Products',
    template: '%s | LazoStore',
  },
  description: 'Premium digital products, delivered instantly via Discord. Fast, secure, and personal.',
  openGraph: {
    type: 'website',
    siteName: 'LazoStore',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0d0d14',
              color: '#f0f4f8',
              border: '1px solid rgba(0,181,232,0.15)',
              borderRadius: '12px',
              fontFamily: 'Syne, system-ui, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
