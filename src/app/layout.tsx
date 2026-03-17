import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rapid Tie Payment Gateway - VaultString',
  description: 'Secure, seamless payment processing for Malawi - Powering e-commerce, events, and DSA disbursements',
  keywords: 'payment gateway, Malawi, fintech, e-commerce, event ticketing, DSA disbursement',
  authors: [{ name: 'VaultString' }],
  openGraph: {
    title: 'Rapid Tie Payment Gateway',
    description: 'Secure payments for Malawi businesses, events, and organizations',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}