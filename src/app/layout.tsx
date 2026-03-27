import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rapid Tie Payment Gateway',
  description: 'Secure, seamless payment processing for Malawi',
  icons: {
    // Use your custom icon or set to null to prevent default requests
    icon: '/vault.png',  // Use your logo as favicon
    // Or if you don't have a favicon, use a data URI
    // icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}