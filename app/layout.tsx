import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'   // 👈 yahan import karo

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'moj._.world',
  description: 'Art that Flows, Stories that Speak. Through the Oil Paintings',
  keywords: 'art, paintings, sketches, portraits, digital art, custom commissions',
  authors: [{ name: 'moj._.world' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          async
        ></script>
      </head>
      <body className={inter.className}>
        {children}

        {/* 👇 WhatsApp floating button yahan render hoga */}
        <WhatsAppButton phone="923167922418" />
      </body>
    </html>
  )
}
