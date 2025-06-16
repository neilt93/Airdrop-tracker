import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WagmiRootProvider } from '@/components/WagmiRootProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Airdrop Tracker',
  description: 'AI-powered tool for tracking and claiming crypto airdrops',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text min-h-screen`}>
        <WagmiRootProvider>
          {children}
        </WagmiRootProvider>
      </body>
    </html>
  )
} 